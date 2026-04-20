import fs from 'fs/promises';
import path from 'path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { homedir } from 'node:os';

const execFileAsync = promisify(execFile);

const CONFIG_DIR = path.join(homedir(), '.config', 'movorca');
const ENV_FILE = path.join(CONFIG_DIR, '.env');

async function loadEnvFile() {
  try {
    const content = await fs.readFile(ENV_FILE, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // no config file yet, that's fine
  }
}

await loadEnvFile();

const API_BASE = 'https://api.minimaxi.com/v1';
const API_KEY = process.env.MINIMAX_API_KEY;
const GROUP_ID = process.env.MINIMAX_GROUP_ID;
const RETRYABLE_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

function parseArgs(args) {
  const parsed = {};

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];

    if (!token.startsWith('--')) {
      continue;
    }

    const key = token.slice(2);
    const next = args[index + 1];

    if (!next || next.startsWith('--')) {
      parsed[key] = true;
      continue;
    }

    parsed[key] = next;
    index += 1;
  }

  return parsed;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildApiPath(endpoint) {
  if (!GROUP_ID) {
    return endpoint;
  }

  const separator = endpoint.includes('?') ? '&' : '?';
  return `${endpoint}${separator}GroupId=${encodeURIComponent(GROUP_ID)}`;
}

function buildLanguageBoost(lang) {
  if (lang === 'zh') {
    return 'Chinese';
  }

  if (lang === 'en') {
    return 'English';
  }

  return 'auto';
}

function pickDefaultVoice(lang) {
  if (lang === 'zh') {
    return 'female-qn-qingse';
  }

  if (lang === 'en') {
    return 'English_female_storyteller';
  }

  return 'Wise_Woman';
}

async function apiRequest(endpoint, body, { method = 'POST', retries = 3 } = {}) {
  const url = `${API_BASE}${buildApiPath(endpoint)}`;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.ok) {
      return response.json();
    }

    const message = await response.text();

    if (response.status === 401 || response.status === 403) {
      throw new Error(`MiniMax authentication failed (${response.status}). Check MINIMAX_API_KEY and MINIMAX_GROUP_ID.`);
    }

    if (attempt < retries && RETRYABLE_STATUS.has(response.status)) {
      await sleep(attempt * 1500);
      continue;
    }

    throw new Error(`MiniMax API error (${response.status}): ${message}`);
  }

  throw new Error('MiniMax API request failed after retries.');
}

async function pollTask(taskId, { maxWaitMs = 180_000, intervalMs = 2_000 } = {}) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < maxWaitMs) {
    const result = await apiRequest(`/query/t2a_async_query_v2?task_id=${encodeURIComponent(taskId)}`, null, {
      method: 'GET',
      retries: 2,
    });

    const status = result.base_resp?.status ?? result.status;

    if (status === 'Success') {
      return result;
    }

    if (status === 'Failed') {
      throw new Error(`TTS task failed: ${JSON.stringify(result)}`);
    }

    await sleep(intervalMs);
  }

  throw new Error(`TTS task timed out after ${Math.round(maxWaitMs / 1000)} seconds.`);
}

function extractFileId(payload) {
  return (
    payload.file_id ??
    payload?.data?.file_id ??
    payload?.data?.audio_file?.file_id ??
    payload?.audio_file?.file_id ??
    payload?.audio_file?.id ??
    payload?.extra_info?.file_id ??
    null
  );
}

function extractTaskId(payload) {
  return payload.task_id ?? payload?.data?.task_id ?? null;
}

async function downloadFile(fileId, outputPath) {
  const url = `${API_BASE}${buildApiPath(`/files/retrieve_content?file_id=${encodeURIComponent(fileId)}`)}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Audio download failed (${response.status}).`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outputPath, buffer);
}

async function getAudioDurationSeconds(filePath) {
  try {
    const { stdout } = await execFileAsync('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      filePath,
    ]);

    const duration = Number.parseFloat(stdout.trim());
    return Number.isFinite(duration) ? Number(duration.toFixed(3)) : null;
  } catch {
    return null;
  }
}

async function generateTTS(text, lang, voiceId) {
  const payload = {
    model: 'speech-2.8-hd',
    text,
    stream: false,
    language_boost: buildLanguageBoost(lang),
    voice_setting: {
      voice_id: voiceId,
      speed: 1,
      vol: 1,
      pitch: 0,
    },
    audio_setting: {
      sample_rate: 44_100,
      bitrate: 128_000,
      format: 'mp3',
      channel: 1,
    },
    subtitle_enable: false,
  };

  const createResult = await apiRequest('/t2a_async_v2', payload);
  const taskId = extractTaskId(createResult);

  if (!taskId) {
    throw new Error(`MiniMax response did not include a task id: ${JSON.stringify(createResult)}`);
  }

  const completed = await pollTask(taskId);
  const fileId = extractFileId(completed);

  if (!fileId) {
    throw new Error(`MiniMax result did not include a downloadable file id: ${JSON.stringify(completed)}`);
  }

  return { fileId, taskId };
}

async function main() {
  if (!API_KEY) {
    console.error(`Error: MINIMAX_API_KEY is not set.\n\nSave your credentials to ${ENV_FILE}:\n\n  mkdir -p ${CONFIG_DIR}\n  echo 'MINIMAX_API_KEY=your-key' >> ${ENV_FILE}\n  echo 'MINIMAX_GROUP_ID=your-group-id' >> ${ENV_FILE}\n`);
    process.exit(1);
  }

  const args = parseArgs(process.argv.slice(2));
  const inputPath = args.input;

  if (!inputPath) {
    console.error('Usage: node scripts/tts.mjs --input script.json [--output audio] [--lang zh] [--voice voice-id]');
    process.exit(1);
  }

  const outputDir = args.output || 'audio';
  const script = JSON.parse(await fs.readFile(inputPath, 'utf-8'));
  const lang = args.lang || script.lang || 'zh';
  const voiceId = args.voice || script.voice_id || pickDefaultVoice(lang);

  if (!Array.isArray(script.scenes) || script.scenes.length === 0) {
    throw new Error('Input script must include a non-empty scenes array.');
  }

  await fs.mkdir(outputDir, { recursive: true });

  const timing = [];

  for (let index = 0; index < script.scenes.length; index += 1) {
    const scene = script.scenes[index];
    const filename = `scene-${String(index + 1).padStart(2, '0')}.mp3`;
    const outputPath = path.join(outputDir, filename);
    const sceneLabel = scene.title || scene.id || `scene-${index + 1}`;

    if (!scene.narration || !scene.narration.trim()) {
      throw new Error(`Scene ${sceneLabel} is missing narration text.`);
    }

    console.log(`Generating narration for ${sceneLabel}...`);

    const { fileId, taskId } = await generateTTS(scene.narration, lang, voiceId);
    await downloadFile(fileId, outputPath);

    const stat = await fs.stat(outputPath);
    const duration = await getAudioDurationSeconds(outputPath);

    timing.push({
      scene: index + 1,
      id: scene.id ?? null,
      title: scene.title ?? null,
      file: filename,
      narration: scene.narration,
      task_id: taskId,
      file_id: fileId,
      bytes: stat.size,
      duration,
    });

    const durationLabel = duration ? `${duration.toFixed(2)}s` : 'duration unavailable';
    console.log(`  Saved ${filename} (${(stat.size / 1024).toFixed(1)} KB, ${durationLabel})`);
  }

  const timingPath = path.join(outputDir, 'timing.json');
  await fs.writeFile(timingPath, `${JSON.stringify(timing, null, 2)}\n`);

  console.log(`\nGenerated ${timing.length} narration tracks.`);
  console.log(`Timing metadata: ${timingPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
