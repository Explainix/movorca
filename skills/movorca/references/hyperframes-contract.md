# HyperFrames Contract

Movorca scenes are individual HyperFrames compositions, then assembled into one root composition with narration and subtitle overlays.

## Project Structure

```text
video/
├── meta.json
├── index.html
├── compositions/
│   ├── scene-01.html
│   └── scene-02.html
├── audio/
│   ├── scene-01.mp3
│   └── timing.json
└── subtitles/
    ├── scene-01.html
    └── scene-02.html
```

## Root Composition

The assembled `index.html` references scene sub-compositions instead of duplicating their DOM.

```html
<div id="root" data-composition-id="https-explained" data-start="0" data-duration="75" data-width="1920" data-height="1080">
  <div class="clip" data-start="0" data-duration="15" data-track-index="0"
       data-composition-id="scene-01" data-composition-src="compositions/scene-01.html"></div>
  <div class="clip" data-start="15" data-duration="18" data-track-index="0"
       data-composition-id="scene-02" data-composition-src="compositions/scene-02.html"></div>
</div>
```

- use `data-composition-src` for every scene
- root `data-duration` is the sum of all scene durations
- scene timing in the root composition is always absolute from video start

## Scene Composition Rules

Each scene file is a complete standalone HTML document with:

- a `#root` container sized to `1920x1080`
- one GSAP timeline registered in `window.__timelines`
- deterministic animation only
- inline styles and self-contained markup

```html
<div id="root" data-composition-id="scene-02" data-width="1920" data-height="1080">
  <div class="clip" data-start="0" data-duration="15" data-track-index="0" style="position:absolute;inset:0;">
    <!-- scene markup -->
  </div>
</div>
```

## Clip Elements

Every timed layer uses the `clip` class.

```html
<div class="clip" data-start="0" data-duration="5" data-track-index="0">
  Content
</div>
```

| Attribute | Meaning |
|---|---|
| `class="clip"` | Required marker for timed elements |
| `data-start` | Absolute time in seconds inside the current composition |
| `data-duration` | Visibility length in seconds |
| `data-track-index` | Layer order, lower renders underneath |

## Audio Elements

Embed narration as clip-timed audio elements in the root composition:

```html
<audio class="clip" data-start="0" data-duration="15" data-track-index="5"
       data-volume="1.0" src="audio/scene-01.mp3"></audio>
```

- `data-volume` ranges from `0.0` to `1.0`
- narration files live in `audio/`
- keep audio separate from scene HTML
- if scenes use video assets, mute the embedded media and layer narration separately

## Subtitle Elements

Subtitles are regular clip elements positioned at the bottom of the root composition:

```html
<div class="clip subtitle" data-start="0" data-duration="3" data-track-index="10"
     style="position:absolute;bottom:80px;left:0;width:100%;text-align:center;padding:0 120px;">
  <span style="color:#f8fafc;font-size:28px;text-shadow:0 2px 8px rgba(0,0,0,0.8);">
    Primary language text
  </span>
  <br />
  <span style="color:#94a3b8;font-size:22px;text-shadow:0 1px 4px rgba(0,0,0,0.6);">
    Secondary language text
  </span>
</div>
```

- use `data-track-index="10"` or higher so subtitles stay on top
- keep subtitles centered with wide horizontal padding
- always include shadow or backdrop support for readability

## GSAP Timeline Rules

```javascript
const tl = gsap.timeline({ paused: true });

tl.from("#title", { opacity: 0, y: 40, duration: 0.6, ease: "power3.out" }, 0.5);
tl.to("#packet", { x: 420, duration: 1.0, ease: "power2.inOut" }, 2.0);

window.__timelines = window.__timelines || {};
window.__timelines["scene-01"] = tl;
```

- create exactly one timeline per composition file
- use absolute positions in seconds
- register the timeline under that composition id

Allowed methods: `from`, `to`, `fromTo`, `set`, stagger variants

Allowed eases: `power1-4`, `back.out(n)`, `elastic.out`, `bounce.out`, `expo.out`, `circ.out`, `none`

## Shader Transitions

Movorca can suggest HyperFrames registry transitions between scenes.

```bash
npx hyperframes add dissolve-transition
```

Suggested transition families: `3d`, `blur`, `cover`, `dissolve`, `distortion`, `grid`, `light`, `push`, `radial`, `scale`.

Use transitions to bridge adjacent scenes, not to hide weak scene design.

## Forbidden Patterns

These break deterministic rendering or make scenes flaky:

| Pattern | Why |
|---|---|
| `setTimeout` / `setInterval` | timing becomes non-deterministic |
| `requestAnimationFrame` | render depends on frame scheduling |
| `Math.random()` / `Date.now()` | output is not reproducible |
| `fetch()` / `XMLHttpRequest` | render depends on network |
| CSS `transition` / `animation` | motion escapes GSAP timing control |

## Minimal Assembled Example

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  </head>
  <body>
    <div id="root" data-composition-id="example-video" data-start="0" data-duration="12" data-width="1920" data-height="1080">
      <div class="clip" data-start="0" data-duration="12" data-track-index="0"
           data-composition-id="scene-01" data-composition-src="compositions/scene-01.html"></div>
      <audio class="clip" data-start="0" data-duration="12" data-track-index="5" data-volume="1.0"
             src="audio/scene-01.mp3"></audio>
      <div class="clip subtitle" data-start="1" data-duration="3" data-track-index="10"
           style="position:absolute;left:0;bottom:80px;width:100%;text-align:center;">
        <span style="color:#f8fafc;font-size:28px;">Every request needs a destination.</span>
      </div>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["example-video"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
```
