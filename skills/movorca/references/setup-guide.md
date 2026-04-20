# Environment Setup

## Prerequisites Check

Run these commands before starting a video job:

```bash
node --version
ffmpeg -version
npx hyperframes --version
```

Movorca expects Node.js 22+ and a working FFmpeg install.

## Install Node.js

```bash
# macOS
brew install node@22

# Linux (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 22
nvm use 22

# Windows
winget install OpenJS.NodeJS.LTS
```

## Install FFmpeg

```bash
# macOS
brew install ffmpeg

# Ubuntu / Debian
sudo apt update && sudo apt install ffmpeg

# Windows
winget install Gyan.FFmpeg
```

## Install Movorca Script Dependencies

Movorca includes helper scripts for narration, subtitles, and assembly. Install them inside the plugin directory:

```bash
cd ~/.claude/plugins/movorca
npm install
```

If the plugin is checked out elsewhere, run `npm install` from that directory instead.

## TTS Credentials

The TTS script reads credentials from `~/.config/movorca/.env`. Create the file once:

```bash
mkdir -p ~/.config/movorca
cat > ~/.config/movorca/.env << 'EOF'
MINIMAX_API_KEY=your-api-key
MINIMAX_GROUP_ID=your-group-id
EOF
```

`MINIMAX_GROUP_ID` is optional but many MiniMax accounts require it.

Environment variables (`export MINIMAX_API_KEY=...`) also work and take precedence over the config file.

## Initialize a HyperFrames Project

```bash
mkdir -p movorca-output
cd movorca-output
npx hyperframes init video --non-interactive --example blank
cd video
mkdir -p compositions audio subtitles
```

This creates the project skeleton where the agent writes scene files and assembled output.

## Render the Final Video

```bash
npx hyperframes lint
npx hyperframes render --output output.mp4
```

Optional flags:

- `--fps 30`
- `--quality standard`
- `--docker`

## Preview During Iteration

```bash
npx hyperframes preview
```

Use preview while tuning scene timing or checking subtitle placement.

## Troubleshooting

| Issue | Fix |
|---|---|
| `command not found: ffmpeg` | Install FFmpeg and confirm it is on `PATH` |
| Node version too old | Upgrade to Node 22+ |
| `npm install` fails | Check network access or registry auth, then retry |
| TTS auth errors | Re-check `MINIMAX_API_KEY` and `MINIMAX_GROUP_ID` |
| Render hangs | Remove forbidden patterns like `setTimeout` or network requests |
| No animation | Verify `window.__timelines` registration in each scene |
