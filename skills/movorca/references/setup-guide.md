# Environment Setup

## Prerequisites Check

Run these commands to verify the environment:

```bash
node --version    # Need 22+
ffmpeg -version   # Need FFmpeg installed
```

## Install Node.js (if missing or < 22)

```bash
# macOS
brew install node@22

# Linux (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 22
nvm use 22

# Windows
winget install OpenJS.NodeJS.LTS
```

## Install FFmpeg (if missing)

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# Windows
winget install Gyan.FFmpeg
```

## Initialize HyperFrames Project

```bash
npx hyperframes init my-video --non-interactive --example blank
cd my-video
```

This creates the project scaffold. The agent will write `index.html` with the composition.

## Render to MP4

```bash
npx hyperframes render --output output.mp4
```

Options:
- `--fps 30` (default 30)
- `--quality standard` (draft/standard/high)
- `--docker` (deterministic rendering, requires Docker)

## Preview (optional)

```bash
npx hyperframes preview
```

Opens browser with hot-reload for iterating on the composition.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `command not found: ffmpeg` | Install FFmpeg (see above) |
| `Node version too old` | Upgrade to Node 22+ |
| Render hangs | Check for forbidden patterns (setTimeout, etc.) |
| Black frames | Ensure clips have correct `data-start`/`data-duration` |
| No animation | Verify `window.__timelines` registration |
