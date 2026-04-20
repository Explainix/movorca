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

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function getSceneFilename(index) {
  return `scene-${String(index + 1).padStart(2, '0')}.html`;
}

function getAudioFilename(index) {
  return `scene-${String(index + 1).padStart(2, '0')}.mp3`;
}

function buildTransitionComment(scene, transition) {
  if (!transition) {
    return '';
  }

  return `\n    <!-- Suggested transition after ${scene.id || scene.title || 'scene'}: ${transition} -->`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectDir = path.resolve(args.project || '.');
  const scriptPath = args.input;

  if (!scriptPath) {
    console.error('Usage: node scripts/assemble.mjs --input script.json [--project ./video] [--scenes ./video/compositions] [--audio ./video/audio] [--subs ./video/subtitles]');
    process.exit(1);
  }

  const script = JSON.parse(await fs.readFile(scriptPath, 'utf-8'));
  const scenesDir = path.resolve(args.scenes || path.join(projectDir, 'compositions'));
  const audioDir = path.resolve(args.audio || path.join(projectDir, 'audio'));
  const subsDir = path.resolve(args.subs || path.join(projectDir, 'subtitles'));
  const timingPath = args.timing ? path.resolve(args.timing) : path.join(audioDir, 'timing.json');
  const timingEntries = (await exists(timingPath))
    ? JSON.parse(await fs.readFile(timingPath, 'utf-8'))
    : [];

  if (!Array.isArray(script.scenes) || script.scenes.length === 0) {
    throw new Error('Input script must include a non-empty scenes array.');
  }

  let currentTime = 0;
  const sceneClips = [];
  const audioClips = [];
  const subtitleBlocks = [];

  for (let index = 0; index < script.scenes.length; index += 1) {
    const scene = script.scenes[index];
    const sceneFile = getSceneFilename(index);
    const scenePath = path.join(scenesDir, sceneFile);
    const sceneId = scene.id || path.basename(sceneFile, '.html');
    const duration = timingEntries[index]?.duration ?? scene.duration ?? 12;

    if (!(await exists(scenePath))) {
      throw new Error(`Missing scene composition: ${scenePath}`);
    }

    sceneClips.push(
      `    <div class="clip" data-start="${Number(currentTime.toFixed(3))}" data-duration="${Number(duration.toFixed(3))}" data-track-index="0" data-composition-id="${sceneId}" data-composition-src="${path.posix.join('compositions', sceneFile)}"></div>${buildTransitionComment(scene, scene.transition)}`,
    );

    const audioFile = getAudioFilename(index);
    const audioPath = path.join(audioDir, audioFile);
    if (await exists(audioPath)) {
      audioClips.push(
        `    <audio class="clip" data-start="${Number(currentTime.toFixed(3))}" data-duration="${Number(duration.toFixed(3))}" data-track-index="5" data-volume="1.0" src="${path.posix.join('audio', audioFile)}"></audio>`,
      );
    }

    const subtitlePath = path.join(subsDir, getSceneFilename(index));
    if (await exists(subtitlePath)) {
      const subtitleContent = await fs.readFile(subtitlePath, 'utf-8');
      subtitleBlocks.push(`    <!-- Subtitles for ${sceneId} -->\n${subtitleContent.trimEnd()}`);
    }

    currentTime += duration;
  }

  const compositionId = script.id || 'movorca-video';
  const totalDuration = Number(currentTime.toFixed(3));
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html,
      body {
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        background: #000;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      }
      #root {
        position: relative;
        width: 1920px;
        height: 1080px;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="${compositionId}" data-start="0" data-duration="${totalDuration}" data-width="1920" data-height="1080">
${sceneClips.join('\n')}
${audioClips.length ? `\n${audioClips.join('\n')}` : ''}
${subtitleBlocks.length ? `\n${subtitleBlocks.join('\n')}` : ''}
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      window.__timelines["${compositionId}"] = tl;
    </script>
  </body>
</html>
`;

  await fs.mkdir(projectDir, { recursive: true });
  const outputPath = path.join(projectDir, 'index.html');
  await fs.writeFile(outputPath, indexHtml);

  console.log(`Assembled composition: ${outputPath}`);
  console.log(`Scenes: ${script.scenes.length}`);
  console.log(`Total duration: ${totalDuration}s`);
  console.log(`Audio clips: ${audioClips.length}`);
  console.log(`Subtitle overlays: ${subtitleBlocks.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
