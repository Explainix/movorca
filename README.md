# Movorca

Generate knowledge explanation videos from natural language using Claude Code.

Describe a topic → get an animated MP4. Powered by [HyperFrames](https://hyperframes.heygen.com).

## Install

```bash
claude plugin add Explainix/movorca
```

Or manually clone to `~/.claude/skills/`:

```bash
git clone https://github.com/Explainix/movorca.git ~/.claude/skills/movorca
```

## Usage

In Claude Code, just describe what you want to explain:

```
Make a 30-second video explaining how DNS resolution works
```

The agent will:
1. Check your environment (Node 22+, FFmpeg)
2. Plan visual beats for the topic
3. Generate animated HTML scenes
4. Render to MP4

## Requirements

- Node.js 22+
- FFmpeg (for video rendering)
- Claude Code

## License

MIT
