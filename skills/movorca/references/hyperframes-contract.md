# HyperFrames Contract

## Project Structure

```
my-video/
├── meta.json           # {"id": "...", "name": "...", "fps": 30}
├── index.html          # Root composition
├── compositions/       # Sub-compositions (optional)
└── assets/             # Media files (optional)
```

## Root Composition (index.html)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; background: #0a0a0a; }
  </style>
</head>
<body>
  <div id="root" data-composition-id="my-video" data-width="1920" data-height="1080">
    <!-- clips go here -->
  </div>

  <script>
    const tl = gsap.timeline({ paused: true });

    // GSAP animations here

    window.__timelines = window.__timelines || {};
    window.__timelines['my-video'] = tl;
  </script>
</body>
</html>
```

## Clip Elements

Every visible element must have:

```html
<div class="clip"
     data-start="0"
     data-duration="5"
     data-track-index="0">
  Content
</div>
```

| Attribute | Type | Description |
|-----------|------|-------------|
| `class="clip"` | required | Marks element as a timed clip |
| `data-start` | seconds | Absolute start time in the video |
| `data-duration` | seconds | How long the clip is visible |
| `data-track-index` | integer | Layer order (0 = bottom) |

## GSAP Timeline Rules

```javascript
// Timeline is created ONCE at root level
const tl = gsap.timeline({ paused: true });

// Use absolute positions (seconds from video start)
tl.from("#title", { opacity: 0, y: 40, duration: 0.6, ease: "power3.out" }, 0.5);
tl.from("#subtitle", { opacity: 0, duration: 0.4 }, 1.2);
tl.to("#box", { scale: 1.2, duration: 0.3, ease: "back.out(1.7)" }, 2.0);

// Register timeline
window.__timelines = window.__timelines || {};
window.__timelines['my-video'] = tl;
```

### Position Parameter (3rd argument)

The number after the animation config is the ABSOLUTE time in seconds:
- `tl.from("#el", { ... }, 0.5)` — starts at 0.5s
- `tl.to("#el", { ... }, 3.0)` — starts at 3.0s

### Allowed GSAP Methods

- `tl.from()` — animate FROM values
- `tl.to()` — animate TO values
- `tl.fromTo()` — animate FROM → TO
- `tl.set()` — instant property set (duration: 0)
- `tl.staggerFrom()` / `tl.staggerTo()` — staggered animations

### Allowed Eases

`power1-4.in/out/inOut`, `back.out(n)`, `elastic.out(n,n)`, `bounce.out`, `expo.out`, `circ.out`, `none`

## Forbidden Patterns

These break deterministic rendering:

| Pattern | Why |
|---------|-----|
| `setTimeout` | Non-deterministic timing |
| `setInterval` | Non-deterministic timing |
| `requestAnimationFrame` | Frame-dependent |
| `Math.random()` | Non-reproducible |
| `Date.now()` | Time-dependent |
| `fetch()` / `XMLHttpRequest` | External dependency |
| CSS `transition` / `animation` | Not timeline-controlled |

## Minimal Working Example

A 10-second video with a title that fades in and a subtitle that slides up:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; background: #0f172a; font-family: system-ui, sans-serif; }
    #root { width: 1920px; height: 1080px; position: relative; }
    .centered { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
    #title { color: #f8fafc; font-size: 72px; font-weight: 700; }
    #subtitle { color: #94a3b8; font-size: 36px; margin-top: 24px; }
  </style>
</head>
<body>
  <div id="root" data-composition-id="example" data-width="1920" data-height="1080">
    <div class="centered clip" data-start="0" data-duration="10" data-track-index="0">
      <div id="title" class="clip" data-start="0" data-duration="10" data-track-index="1">
        How DNS Works
      </div>
      <div id="subtitle" class="clip" data-start="1" data-duration="9" data-track-index="1">
        Domain Name System explained in 10 seconds
      </div>
    </div>
  </div>

  <script>
    const tl = gsap.timeline({ paused: true });

    tl.from("#title", { opacity: 0, y: -30, duration: 0.8, ease: "power3.out" }, 0.3);
    tl.from("#subtitle", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, 1.2);
    tl.to("#title", { scale: 1.05, duration: 0.3, ease: "power1.inOut", yoyo: true, repeat: 1 }, 4.0);

    window.__timelines = window.__timelines || {};
    window.__timelines['example'] = tl;
  </script>
</body>
</html>
```
