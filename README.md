# Movorca

Generate concept-animation knowledge videos from natural language using Claude Code.

Describe a topic, refine the script with the agent, then generate an animated MP4 with narration and subtitles. Powered by [HyperFrames](https://hyperframes.heygen.com).

## Install

```bash
claude plugin add Explainix/movorca
```

Or manually clone to `~/.claude/plugins/`:

```bash
git clone https://github.com/Explainix/movorca.git ~/.claude/plugins/movorca
```

Then install the helper scripts:

```bash
cd ~/.claude/plugins/movorca
npm install
```

## Usage

In Claude Code, describe the topic and your output preferences:

```text
做一个解释 HTTPS 加密过程的视频，中文旁白，中英双语字幕
```

The agent will:

1. Check the environment and initialize a HyperFrames project
2. Draft a detailed scene script for your review
3. Generate concept-animation scene compositions
4. Generate TTS narration with MiniMax
5. Build subtitle overlays from the narration
6. Assemble and render the final MP4

## Requirements

- Node.js 22+
- FFmpeg for video rendering
- Claude Code
- MiniMax TTS credentials in `MINIMAX_API_KEY`

## What Makes It Different

- Script-first workflow: revise the video beat-by-beat before generation
- Concept animation patterns: scenes explain through motion, not slideshow text
- Narration pipeline: one TTS track per scene
- Bilingual subtitle overlays: optimized for explainers and tutorials
- Agent-native iteration: modify scenes through chat instead of using a rigid SaaS editor

## License

MIT
