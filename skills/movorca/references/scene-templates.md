# Scene Templates

Proven patterns for knowledge explanation videos. Each template shows the HTML structure and GSAP animation pattern.

## 1. Title Card

Full-screen topic introduction with animated title and tagline.

```html
<div id="title-card" class="clip" data-start="0" data-duration="5" data-track-index="0"
     style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0f172a;">
  <h1 id="title-main" style="color:#f8fafc;font-size:80px;font-weight:800;font-family:system-ui;">
    Topic Title
  </h1>
  <p id="title-tagline" style="color:#64748b;font-size:32px;margin-top:16px;font-family:system-ui;">
    A brief one-line description
  </p>
</div>
```

```javascript
tl.from("#title-main", { opacity: 0, scale: 0.8, duration: 0.8, ease: "back.out(1.4)" }, 0.5);
tl.from("#title-tagline", { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" }, 1.5);
```

## 2. Diagram / Visual Explanation

Shapes and labels appearing sequentially to build a concept.

```html
<div id="diagram" class="clip" data-start="5" data-duration="12" data-track-index="0"
     style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#0f172a;">
  <svg id="diagram-svg" width="1200" height="600" viewBox="0 0 1200 600" style="overflow:visible;">
    <!-- Node A -->
    <circle id="node-a" cx="200" cy="300" r="60" fill="#3b82f6" opacity="0"/>
    <text id="label-a" x="200" y="310" text-anchor="middle" fill="#f8fafc" font-size="24" opacity="0">Client</text>
    <!-- Node B -->
    <circle id="node-b" cx="1000" cy="300" r="60" fill="#10b981" opacity="0"/>
    <text id="label-b" x="1000" y="310" text-anchor="middle" fill="#f8fafc" font-size="24" opacity="0">Server</text>
    <!-- Arrow -->
    <line id="arrow-ab" x1="270" y1="300" x2="930" y2="300" stroke="#f59e0b" stroke-width="3" opacity="0"/>
  </svg>
</div>
```

```javascript
// Nodes appear
tl.to("#node-a", { opacity: 1, duration: 0.4, ease: "power2.out" }, 5.5);
tl.to("#label-a", { opacity: 1, duration: 0.3 }, 5.8);
tl.to("#node-b", { opacity: 1, duration: 0.4, ease: "power2.out" }, 6.5);
tl.to("#label-b", { opacity: 1, duration: 0.3 }, 6.8);
// Connection draws
tl.to("#arrow-ab", { opacity: 1, duration: 0.5, ease: "power1.inOut" }, 7.5);
```

## 3. Step-by-Step (Numbered Points)

Sequential reveal of key points with staggered animation.

```html
<div id="steps" class="clip" data-start="17" data-duration="10" data-track-index="0"
     style="position:absolute;inset:0;padding:120px 200px;background:#0f172a;">
  <h2 id="steps-title" style="color:#f8fafc;font-size:48px;font-weight:700;margin-bottom:48px;font-family:system-ui;">
    How It Works
  </h2>
  <div id="step-1" class="step-item" style="display:flex;align-items:center;gap:24px;margin-bottom:32px;opacity:0;">
    <span style="background:#3b82f6;color:#fff;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;">1</span>
    <span style="color:#e2e8f0;font-size:32px;font-family:system-ui;">First step description</span>
  </div>
  <div id="step-2" class="step-item" style="display:flex;align-items:center;gap:24px;margin-bottom:32px;opacity:0;">
    <span style="background:#8b5cf6;color:#fff;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;">2</span>
    <span style="color:#e2e8f0;font-size:32px;font-family:system-ui;">Second step description</span>
  </div>
  <div id="step-3" class="step-item" style="display:flex;align-items:center;gap:24px;margin-bottom:32px;opacity:0;">
    <span style="background:#10b981;color:#fff;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;">3</span>
    <span style="color:#e2e8f0;font-size:32px;font-family:system-ui;">Third step description</span>
  </div>
</div>
```

```javascript
tl.from("#steps-title", { opacity: 0, x: -30, duration: 0.5, ease: "power2.out" }, 17.3);
tl.to("#step-1", { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, 18.0);
tl.from("#step-1", { x: -20 }, 18.0);
tl.to("#step-2", { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, 19.5);
tl.from("#step-2", { x: -20 }, 19.5);
tl.to("#step-3", { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, 21.0);
tl.from("#step-3", { x: -20 }, 21.0);
```

## 4. Summary Card

Key takeaways with a clean layout.

```html
<div id="summary" class="clip" data-start="27" data-duration="5" data-track-index="0"
     style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#1e1b4b,#0f172a);">
  <h2 id="summary-title" style="color:#f8fafc;font-size:56px;font-weight:700;margin-bottom:40px;font-family:system-ui;">
    Key Takeaways
  </h2>
  <div id="summary-points" style="display:flex;flex-direction:column;gap:20px;">
    <p id="point-1" style="color:#cbd5e1;font-size:28px;opacity:0;font-family:system-ui;">Point one summary</p>
    <p id="point-2" style="color:#cbd5e1;font-size:28px;opacity:0;font-family:system-ui;">Point two summary</p>
    <p id="point-3" style="color:#cbd5e1;font-size:28px;opacity:0;font-family:system-ui;">Point three summary</p>
  </div>
</div>
```

```javascript
tl.from("#summary-title", { opacity: 0, scale: 0.9, duration: 0.6, ease: "power3.out" }, 27.3);
tl.to("#point-1", { opacity: 1, duration: 0.4 }, 28.0);
tl.to("#point-2", { opacity: 1, duration: 0.4 }, 28.6);
tl.to("#point-3", { opacity: 1, duration: 0.4 }, 29.2);
```

## Design Principles

- Dark background (#0f172a or similar) for readability
- High contrast text (#f8fafc on dark)
- Accent colors for emphasis: blue (#3b82f6), green (#10b981), purple (#8b5cf6), amber (#f59e0b)
- System font stack for clean rendering
- Generous spacing (no cramped layouts)
- Animations: 0.3-0.8s duration, power2/power3 easing
- Stagger delay: 0.3-0.5s between sequential elements
