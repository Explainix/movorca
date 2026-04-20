import fs from 'fs/promises';
import path from 'path';

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

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function splitIntoSentences(text) {
  const matches = text.match(/[^。！？.!?]+[。！？.!?]?/g);
  const segments = matches?.map((sentence) => sentence.trim()).filter(Boolean);
  return segments?.length ? segments : [text.trim()].filter(Boolean);
}

function allocateDurations(sentences, totalDuration) {
  const weights = sentences.map((sentence) => Math.max(sentence.replace(/\s+/g, '').length, 1));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0) || sentences.length || 1;
  const timings = [];
  let current = 0;

  for (let index = 0; index < sentences.length; index += 1) {
    const rawDuration = totalDuration * (weights[index] / totalWeight);
    const duration = index === sentences.length - 1
      ? Math.max(Number((totalDuration - current).toFixed(3)), 0.6)
      : Math.max(Number(rawDuration.toFixed(3)), 0.6);

    timings.push({
      text: sentences[index],
      start: Number(current.toFixed(3)),
      duration,
    });

    current += duration;
  }

  return timings;
}

function resolveSceneDuration(scene, timingEntry) {
  return timingEntry?.duration ?? scene.duration ?? 12;
}

function resolveSceneStart(scenes, timingEntries, index) {
  if (timingEntries.length > 0) {
    let start = 0;

    for (let cursor = 0; cursor < index; cursor += 1) {
      start += resolveSceneDuration(scenes[cursor], timingEntries[cursor]);
    }

    return Number(start.toFixed(3));
  }

  return scenes[index].start ?? 0;
}

function buildSecondarySegments(text, totalDuration) {
  if (!text) {
    return [];
  }

  return allocateDurations(splitIntoSentences(text), totalDuration);
}

function findSecondaryText(secondarySegments, target, index) {
  return (
    secondarySegments[index]?.text ??
    secondarySegments.find((segment) => Math.abs(segment.start - target.start) < 0.75)?.text ??
    null
  );
}

function generateSubtitleHTML(segment, sceneStart, secondaryText, trackIndex) {
  const absoluteStart = Number((sceneStart + segment.start).toFixed(3));
  const duration = Number(segment.duration.toFixed(3));
  const primary = escapeHtml(segment.text);
  const secondary = secondaryText ? escapeHtml(secondaryText) : null;

  let inner = `      <span style="display:inline-block;color:#f8fafc;font-size:28px;font-family:system-ui,sans-serif;font-weight:600;line-height:1.3;text-shadow:0 2px 8px rgba(0,0,0,0.8);">${primary}</span>`;

  if (secondary) {
    inner += `\n      <br />\n      <span style="display:inline-block;margin-top:10px;color:#94a3b8;font-size:22px;font-family:system-ui,sans-serif;line-height:1.35;text-shadow:0 1px 4px rgba(0,0,0,0.6);">${secondary}</span>`;
  }

  return `    <div class="clip subtitle" data-start="${absoluteStart}" data-duration="${duration}" data-track-index="${trackIndex}" style="position:absolute;left:0;bottom:80px;width:100%;padding:0 120px;text-align:center;">\n${inner}\n    </div>`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = args.input;

  if (!inputPath) {
    console.error('Usage: node scripts/subtitles.mjs --input script.json [--timing audio/timing.json] [--lang zh,en] [--output subtitles]');
    process.exit(1);
  }

  const outputDir = args.output || 'subtitles';
  const script = JSON.parse(await fs.readFile(inputPath, 'utf-8'));
  const timingEntries = args.timing ? JSON.parse(await fs.readFile(args.timing, 'utf-8')) : [];
  const requestedLangs = (args.lang || script.subtitle_langs?.join(',') || script.lang || 'zh')
    .split(',')
    .map((lang) => lang.trim())
    .filter(Boolean);

  const hasSecondary = requestedLangs.length > 1;

  if (!Array.isArray(script.scenes) || script.scenes.length === 0) {
    throw new Error('Input script must include a non-empty scenes array.');
  }

  await fs.mkdir(outputDir, { recursive: true });

  for (let index = 0; index < script.scenes.length; index += 1) {
    const scene = script.scenes[index];
    const timingEntry = timingEntries[index];
    const sceneStart = resolveSceneStart(script.scenes, timingEntries, index);
    const sceneDuration = resolveSceneDuration(scene, timingEntry);
    const primarySegments = allocateDurations(splitIntoSentences(scene.narration || ''), sceneDuration);
    const secondarySegments = hasSecondary
      ? buildSecondarySegments(scene.narration_secondary || '', sceneDuration)
      : [];

    if (primarySegments.length === 0) {
      throw new Error(`Scene ${scene.id || index + 1} is missing narration text for subtitles.`);
    }

    const fragments = primarySegments.map((segment, segmentIndex) =>
      generateSubtitleHTML(
        segment,
        sceneStart,
        findSecondaryText(secondarySegments, segment, segmentIndex),
        10,
      ));

    const filename = `scene-${String(index + 1).padStart(2, '0')}.html`;
    const outputPath = path.join(outputDir, filename);
    await fs.writeFile(outputPath, `${fragments.join('\n')}\n`);
    console.log(`Generated subtitles for ${filename} (${primarySegments.length} segments).`);
  }

  console.log(`\nSubtitle fragments written to ${outputDir}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
