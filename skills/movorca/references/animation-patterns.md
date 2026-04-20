# Animation Patterns — Concept Animation Reference

Choose patterns by the kind of thinking the viewer needs to see. The explanation should still make sense with the sound muted and the labels removed.

## Core Principle

Show the concept happening. Motion carries the idea; text only supports it.

- Use object movement to show relationships and flow.
- Use transformation to show state changes.
- Use reaction and sequencing to show causality.
- Keep on-screen text short: labels, values, tiny annotations.

## 1. Particle Flow — Objects Moving Between Entities

Use for: network requests, data flow, message passing, signal transmission.

A packet travels from source to destination along a path while endpoints react on send and receive.

```html
<div id="scene" class="clip" data-start="0" data-duration="12" data-track-index="0"
     style="position:absolute;inset:0;background:#0f172a;">
  <svg viewBox="0 0 1920 1080" style="width:100%;height:100%;">
    <g id="browser">
      <rect x="160" y="440" width="160" height="160" rx="24" fill="#1e293b" stroke="#3b82f6" stroke-width="3"/>
      <text x="240" y="540" text-anchor="middle" fill="#94a3b8" font-size="22" font-family="system-ui">Browser</text>
    </g>
    <g id="dns-server">
      <rect x="880" y="440" width="160" height="160" rx="24" fill="#1e293b" stroke="#10b981" stroke-width="3"/>
      <text x="960" y="540" text-anchor="middle" fill="#94a3b8" font-size="22" font-family="system-ui">DNS</text>
    </g>
    <g id="web-server">
      <rect x="1600" y="440" width="160" height="160" rx="24" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/>
      <text x="1680" y="540" text-anchor="middle" fill="#94a3b8" font-size="22" font-family="system-ui">Server</text>
    </g>
    <circle id="packet" cx="240" cy="520" r="12" fill="#3b82f6" opacity="0"/>
    <text id="request-label" x="560" y="480" text-anchor="middle" fill="#64748b" font-size="18" font-family="system-ui" opacity="0">
      "Where is example.com?"
    </text>
    <text id="response-label" x="560" y="480" text-anchor="middle" fill="#10b981" font-size="18" font-family="system-ui" opacity="0">
      "93.184.216.34"
    </text>
    <line id="path-1" x1="320" y1="520" x2="880" y2="520" stroke="#334155" stroke-width="2" stroke-dasharray="8,6" opacity="0"/>
    <line id="path-2" x1="1040" y1="520" x2="1600" y2="520" stroke="#334155" stroke-width="2" stroke-dasharray="8,6" opacity="0"/>
  </svg>
</div>
```

```javascript
tl.from("#browser rect", { scale: 0, transformOrigin: "center", duration: 0.5, ease: "back.out(1.4)" }, 0.5);
tl.from("#browser text", { opacity: 0, duration: 0.3 }, 0.8);
tl.from("#dns-server rect", { scale: 0, transformOrigin: "center", duration: 0.5, ease: "back.out(1.4)" }, 1.2);
tl.from("#dns-server text", { opacity: 0, duration: 0.3 }, 1.5);
tl.from("#web-server rect", { scale: 0, transformOrigin: "center", duration: 0.5, ease: "back.out(1.4)" }, 1.8);
tl.from("#web-server text", { opacity: 0, duration: 0.3 }, 2.1);
tl.to("#path-1", { opacity: 1, duration: 0.3 }, 2.5);
tl.to("#path-2", { opacity: 1, duration: 0.3 }, 2.7);
tl.to("#packet", { opacity: 1, duration: 0.2 }, 3.0);
tl.to("#packet", { cx: 960, duration: 1.2, ease: "power2.inOut" }, 3.2);
tl.to("#request-label", { opacity: 1, duration: 0.3 }, 3.5);
tl.to("#request-label", { opacity: 0, duration: 0.3 }, 4.2);
tl.to("#dns-server rect", { stroke: "#34d399", strokeWidth: 5, duration: 0.2, yoyo: true, repeat: 1 }, 4.4);
tl.to("#packet", { fill: "#10b981", duration: 0.3 }, 5.0);
tl.to("#response-label", { opacity: 1, duration: 0.3 }, 5.0);
tl.to("#packet", { cx: 1680, duration: 1.2, ease: "power2.inOut" }, 5.5);
tl.to("#response-label", { opacity: 0, duration: 0.3 }, 6.0);
tl.to("#web-server rect", { stroke: "#fbbf24", strokeWidth: 5, duration: 0.2, yoyo: true, repeat: 1 }, 6.7);
```

Applicable scenarios: DNS, API calls, payment events, supply chains, sensor signals.

## 2. Transformation — Object Morphing to Show Change

Use for: encryption, compression, compilation, chemical reactions, state changes.

An object visibly changes form so the viewer can feel the process, not just read about it.

```html
<div id="scene" class="clip" data-start="0" data-duration="10" data-track-index="0"
     style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#0f172a;">
  <svg viewBox="0 0 1920 1080" style="width:100%;height:100%;">
    <g id="plaintext-group">
      <rect id="msg-box" x="260" y="420" width="400" height="200" rx="16" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
      <text id="msg-text" x="460" y="530" text-anchor="middle" fill="#e2e8f0" font-size="28" font-family="monospace">Hello World</text>
      <text x="460" y="660" text-anchor="middle" fill="#64748b" font-size="18" font-family="system-ui">Plaintext</text>
    </g>
    <g id="lock" opacity="0">
      <rect x="910" y="460" width="100" height="80" rx="12" fill="none" stroke="#f59e0b" stroke-width="3"/>
      <path d="M930,460 V430 A30,30 0 0,1 990,430 V460" fill="none" stroke="#f59e0b" stroke-width="3"/>
    </g>
    <g id="ciphertext-group" opacity="0">
      <rect id="cipher-box" x="1260" y="420" width="400" height="200" rx="16" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
      <text id="cipher-text" x="1460" y="530" text-anchor="middle" fill="#10b981" font-size="28" font-family="monospace">7g$kL!9x...</text>
      <text x="1460" y="660" text-anchor="middle" fill="#64748b" font-size="18" font-family="system-ui">Ciphertext</text>
    </g>
    <line id="transform-arrow" x1="680" y1="520" x2="1240" y2="520" stroke="#334155" stroke-width="2" opacity="0"/>
  </svg>
</div>
```

```javascript
tl.from("#msg-box", { scaleX: 0, transformOrigin: "left center", duration: 0.6, ease: "power3.out" }, 0.5);
tl.from("#msg-text", { opacity: 0, duration: 0.4 }, 1.0);
tl.to("#lock", { opacity: 1, scale: 1.2, duration: 0.3, ease: "back.out(2)" }, 2.0);
tl.to("#lock", { scale: 1, duration: 0.2 }, 2.3);
tl.to("#transform-arrow", { opacity: 1, duration: 0.4 }, 2.5);
tl.to("#msg-box", { x: -5, duration: 0.05, yoyo: true, repeat: 11 }, 3.0);
tl.to("#msg-text", { opacity: 0, duration: 0.3 }, 3.5);
tl.to("#ciphertext-group", { opacity: 1, duration: 0.5, ease: "power2.out" }, 4.0);
tl.to("#lock", { x: 350, duration: 0.8, ease: "power2.inOut" }, 4.5);
```

Applicable scenarios: TLS encryption, code compilation, image compression, serialization.

## 3. Reordering — Elements Swapping Positions

Use for: algorithms, ranking, prioritization, queue changes.

The user should see order change physically, not infer it from labels.

```html
<div id="scene" class="clip" data-start="0" data-duration="15" data-track-index="0"
     style="position:absolute;inset:0;background:#0f172a;">
  <svg viewBox="0 0 1920 1080" style="width:100%;height:100%;">
    <rect id="bar-1" x="460" y="580" width="80" height="120" rx="8" fill="#ef4444"/>
    <rect id="bar-2" x="600" y="480" width="80" height="220" rx="8" fill="#f59e0b"/>
    <rect id="bar-3" x="740" y="380" width="80" height="320" rx="8" fill="#3b82f6"/>
    <rect id="bar-4" x="880" y="530" width="80" height="170" rx="8" fill="#10b981"/>
    <rect id="bar-5" x="1020" y="630" width="80" height="70" rx="8" fill="#8b5cf6"/>
    <text id="val-1" x="500" y="570" text-anchor="middle" fill="#f8fafc" font-size="24" font-family="monospace">3</text>
    <text id="val-2" x="640" y="470" text-anchor="middle" fill="#f8fafc" font-size="24" font-family="monospace">5</text>
    <text id="val-3" x="780" y="370" text-anchor="middle" fill="#f8fafc" font-size="24" font-family="monospace">8</text>
    <text id="val-4" x="920" y="520" text-anchor="middle" fill="#f8fafc" font-size="24" font-family="monospace">4</text>
    <text id="val-5" x="1060" y="620" text-anchor="middle" fill="#f8fafc" font-size="24" font-family="monospace">1</text>
    <rect id="compare-highlight" x="0" y="0" width="220" height="400" rx="12" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="8,4" opacity="0"/>
  </svg>
</div>
```

```javascript
tl.from("#bar-1", { y: 300, opacity: 0, duration: 0.4, ease: "power3.out" }, 0.3);
tl.from("#bar-2", { y: 300, opacity: 0, duration: 0.4, ease: "power3.out" }, 0.5);
tl.from("#bar-3", { y: 300, opacity: 0, duration: 0.4, ease: "power3.out" }, 0.7);
tl.from("#bar-4", { y: 300, opacity: 0, duration: 0.4, ease: "power3.out" }, 0.9);
tl.from("#bar-5", { y: 300, opacity: 0, duration: 0.4, ease: "power3.out" }, 1.1);
tl.from("#val-1, #val-2, #val-3, #val-4, #val-5", { opacity: 0, duration: 0.3 }, 1.5);
tl.to("#compare-highlight", { opacity: 1, x: 870, y: 350, duration: 0.3 }, 2.5);
tl.to("#bar-4", { x: 140, duration: 0.6, ease: "power2.inOut" }, 3.2);
tl.to("#val-4", { x: 140, duration: 0.6, ease: "power2.inOut" }, 3.2);
tl.to("#bar-5", { x: -140, duration: 0.6, ease: "power2.inOut" }, 3.2);
tl.to("#val-5", { x: -140, duration: 0.6, ease: "power2.inOut" }, 3.2);
tl.to("#compare-highlight", { x: 730, duration: 0.4 }, 4.2);
```

Applicable scenarios: bubble sort, task priorities, route selection, leaderboard changes.

## 4. Zoom & Pan — Camera Movement Through a System

Use for: system overviews, architecture walkthroughs, macro-to-micro explanations.

Fake the camera by moving one oversized world instead of animating each part independently.

```html
<div id="scene" class="clip" data-start="0" data-duration="12" data-track-index="0"
     style="position:absolute;inset:0;overflow:hidden;background:#0f172a;">
  <svg id="world" viewBox="0 0 3840 2160" style="width:200%;height:200%;position:absolute;top:-50%;left:-25%;">
    <g id="area-overview">
      <rect x="200" y="200" width="600" height="400" rx="20" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
      <text x="500" y="420" text-anchor="middle" fill="#e2e8f0" font-size="36" font-family="system-ui">Frontend</text>
    </g>
    <g id="area-api">
      <rect x="1200" y="200" width="600" height="400" rx="20" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
      <text x="1500" y="420" text-anchor="middle" fill="#e2e8f0" font-size="36" font-family="system-ui">API Layer</text>
    </g>
    <g id="area-db">
      <rect x="2200" y="200" width="600" height="400" rx="20" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
      <text x="2500" y="420" text-anchor="middle" fill="#e2e8f0" font-size="36" font-family="system-ui">Database</text>
    </g>
    <g id="api-detail" opacity="0">
      <rect x="1250" y="250" width="200" height="120" rx="8" fill="#0f4c3a" stroke="#10b981" stroke-width="1"/>
      <text x="1350" y="320" text-anchor="middle" fill="#a7f3d0" font-size="18" font-family="monospace">/auth</text>
      <rect x="1250" y="400" width="200" height="120" rx="8" fill="#0f4c3a" stroke="#10b981" stroke-width="1"/>
      <text x="1350" y="470" text-anchor="middle" fill="#a7f3d0" font-size="18" font-family="monospace">/users</text>
    </g>
  </svg>
</div>
```

```javascript
tl.from("#world", { scale: 0.5, transformOrigin: "center center", duration: 1, ease: "power2.out" }, 0.5);
tl.to("#world", { x: -600, duration: 1.5, ease: "power2.inOut" }, 3.0);
tl.to("#world", { scale: 1.5, transformOrigin: "1500px 400px", duration: 1.2, ease: "power2.inOut" }, 4.5);
tl.to("#api-detail", { opacity: 1, duration: 0.5 }, 5.7);
tl.from("#api-detail rect", { scaleY: 0, transformOrigin: "top", stagger: 0.3, duration: 0.4, ease: "power2.out" }, 5.7);
```

Applicable scenarios: cloud systems, CPU pipelines, company org charts, maps.

## 5. Accumulation — Building Structure Piece by Piece

Use for: layers, stacks, composition, assembly, certificate chains.

Each new piece adds meaning and makes the whole structure feel inevitable.

```html
<div id="scene" class="clip" data-start="0" data-duration="10" data-track-index="0"
     style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#0f172a;">
  <svg viewBox="0 0 1920 1080" style="width:100%;height:100%;">
    <g id="layer-physical">
      <rect x="560" y="780" width="800" height="100" rx="12" fill="#7c3aed" opacity="0"/>
      <text x="960" y="840" text-anchor="middle" fill="#f8fafc" font-size="26" font-family="system-ui" opacity="0">Physical Layer</text>
    </g>
    <g id="layer-network">
      <rect x="560" y="660" width="800" height="100" rx="12" fill="#3b82f6" opacity="0"/>
      <text x="960" y="720" text-anchor="middle" fill="#f8fafc" font-size="26" font-family="system-ui" opacity="0">Network Layer</text>
    </g>
    <g id="layer-transport">
      <rect x="560" y="540" width="800" height="100" rx="12" fill="#10b981" opacity="0"/>
      <text x="960" y="600" text-anchor="middle" fill="#f8fafc" font-size="26" font-family="system-ui" opacity="0">Transport Layer</text>
    </g>
    <g id="layer-app">
      <rect x="560" y="420" width="800" height="100" rx="12" fill="#f59e0b" opacity="0"/>
      <text x="960" y="480" text-anchor="middle" fill="#f8fafc" font-size="26" font-family="system-ui" opacity="0">Application Layer</text>
    </g>
    <circle id="data-packet" cx="960" cy="200" r="20" fill="#ef4444" opacity="0"/>
    <text id="data-label" x="960" y="170" text-anchor="middle" fill="#fca5a5" font-size="16" font-family="system-ui" opacity="0">Data</text>
  </svg>
</div>
```

```javascript
tl.to("#layer-physical rect", { opacity: 1, duration: 0.3 }, 0.5);
tl.from("#layer-physical rect", { y: 100, ease: "bounce.out", duration: 0.6 }, 0.5);
tl.to("#layer-physical text", { opacity: 1, duration: 0.2 }, 0.9);
tl.to("#layer-network rect", { opacity: 1, duration: 0.3 }, 1.5);
tl.from("#layer-network rect", { y: 100, ease: "bounce.out", duration: 0.6 }, 1.5);
tl.to("#layer-network text", { opacity: 1, duration: 0.2 }, 1.9);
tl.to("#layer-transport rect", { opacity: 1, duration: 0.3 }, 2.5);
tl.from("#layer-transport rect", { y: 100, ease: "bounce.out", duration: 0.6 }, 2.5);
tl.to("#layer-transport text", { opacity: 1, duration: 0.2 }, 2.9);
tl.to("#layer-app rect", { opacity: 1, duration: 0.3 }, 3.5);
tl.from("#layer-app rect", { y: 100, ease: "bounce.out", duration: 0.6 }, 3.5);
tl.to("#layer-app text", { opacity: 1, duration: 0.2 }, 3.9);
tl.to("#data-packet", { opacity: 1, duration: 0.2 }, 5.0);
tl.to("#data-label", { opacity: 1, duration: 0.2 }, 5.0);
tl.to("#data-packet, #data-label", { y: 280, duration: 0.4, ease: "power2.in" }, 5.5);
tl.to("#layer-app rect", { fill: "#b45309", duration: 0.15, yoyo: true, repeat: 1 }, 5.9);
tl.to("#data-packet, #data-label", { y: 400, duration: 0.4, ease: "power2.in" }, 6.3);
tl.to("#layer-transport rect", { fill: "#047857", duration: 0.15, yoyo: true, repeat: 1 }, 6.7);
tl.to("#data-packet, #data-label", { y: 520, duration: 0.4, ease: "power2.in" }, 7.1);
tl.to("#layer-network rect", { fill: "#1d4ed8", duration: 0.15, yoyo: true, repeat: 1 }, 7.5);
```

Applicable scenarios: OSI layers, build pipelines, certificate chains, molecule assembly.

## 6. Split & Merge — Decomposition and Composition

Use for: divide and conquer, modular architecture, decomposition, combination.

One whole breaks into understandable pieces or many pieces unite into one insight.

```html
<div id="scene" class="clip" data-start="0" data-duration="10" data-track-index="0"
     style="position:absolute;inset:0;background:#0f172a;">
  <svg viewBox="0 0 1920 1080" style="width:100%;height:100%;">
    <rect id="whole" x="810" y="440" width="300" height="200" rx="20" fill="#3b82f6"/>
    <text id="whole-label" x="960" y="550" text-anchor="middle" fill="#f8fafc" font-size="28" font-family="system-ui">Problem</text>
    <rect id="part-a" x="810" y="440" width="140" height="200" rx="16" fill="#8b5cf6" opacity="0"/>
    <text id="part-a-label" x="880" y="550" text-anchor="middle" fill="#f8fafc" font-size="20" font-family="system-ui" opacity="0">Sub A</text>
    <rect id="part-b" x="970" y="440" width="140" height="200" rx="16" fill="#10b981" opacity="0"/>
    <text id="part-b-label" x="1040" y="550" text-anchor="middle" fill="#f8fafc" font-size="20" font-family="system-ui" opacity="0">Sub B</text>
  </svg>
</div>
```

```javascript
tl.to("#whole", { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" }, 1.0);
tl.to("#whole, #whole-label", { opacity: 0, duration: 0.3 }, 2.0);
tl.to("#part-a, #part-a-label", { opacity: 1, duration: 0.3 }, 2.3);
tl.to("#part-b, #part-b-label", { opacity: 1, duration: 0.3 }, 2.3);
tl.to("#part-a, #part-a-label", { x: -200, duration: 0.8, ease: "power2.out" }, 2.6);
tl.to("#part-b, #part-b-label", { x: 200, duration: 0.8, ease: "power2.out" }, 2.6);
```

Applicable scenarios: merge sort, monolith-to-services, molecule bonds, feature factoring.

## 7. Chain Reaction — Cause and Effect

Use for: event propagation, pipelines, neural activation, domino effects.

One activation should visibly trigger the next so the audience reads a sequence, not a static diagram.

```html
<div id="scene" class="clip" data-start="0" data-duration="12" data-track-index="0"
     style="position:absolute;inset:0;background:#0f172a;">
  <svg viewBox="0 0 1920 1080" style="width:100%;height:100%;">
    <circle id="node-1" cx="280" cy="540" r="50" fill="#1e293b" stroke="#3b82f6" stroke-width="3"/>
    <text x="280" y="548" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="system-ui">Event</text>
    <line id="link-12" x1="340" y1="540" x2="560" y2="540" stroke="#334155" stroke-width="2" stroke-dasharray="8,4"/>
    <circle id="node-2" cx="620" cy="540" r="50" fill="#1e293b" stroke="#8b5cf6" stroke-width="3"/>
    <text x="620" y="548" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="system-ui">Handler</text>
    <line id="link-23" x1="680" y1="540" x2="900" y2="540" stroke="#334155" stroke-width="2" stroke-dasharray="8,4"/>
    <circle id="node-3" cx="960" cy="540" r="50" fill="#1e293b" stroke="#10b981" stroke-width="3"/>
    <text x="960" y="548" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="system-ui">Effect</text>
    <circle id="pulse" cx="280" cy="540" r="50" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0"/>
  </svg>
</div>
```

```javascript
tl.to("#node-1", { fill: "#3b82f6", duration: 0.3 }, 1.0);
tl.to("#pulse", { opacity: 1, scale: 2, duration: 0.5, ease: "power2.out" }, 1.0);
tl.to("#pulse", { opacity: 0, duration: 0.3 }, 1.3);
tl.to("#link-12", { stroke: "#3b82f6", strokeDashoffset: -100, duration: 0.6, ease: "none" }, 1.5);
tl.to("#node-2", { fill: "#8b5cf6", duration: 0.3 }, 2.2);
tl.to("#link-23", { stroke: "#8b5cf6", strokeDashoffset: -100, duration: 0.6, ease: "none" }, 2.5);
tl.to("#node-3", { fill: "#10b981", duration: 0.3 }, 3.2);
```

Applicable scenarios: event loops, ETL pipelines, reactivity, distributed workflows.

## 8. Side-by-Side — Comparison

Use for: before/after, A vs B, secure vs insecure, cache hit vs miss.

Animate both sides in parallel so the contrast lands instantly.

```html
<div id="scene" class="clip" data-start="0" data-duration="12" data-track-index="0"
     style="position:absolute;inset:0;display:flex;background:#0f172a;">
  <div id="panel-left" style="flex:1;position:relative;border-right:2px solid #334155;padding:60px;opacity:0;">
    <h3 style="color:#ef4444;font-size:36px;font-family:system-ui;margin-bottom:24px;">HTTP</h3>
    <div id="left-content" style="position:relative;height:400px;">
      <div id="left-msg" style="background:#1e293b;border:2px solid #475569;border-radius:12px;padding:20px;color:#e2e8f0;font-size:24px;font-family:monospace;width:fit-content;">
        password: 1234
      </div>
      <div id="left-spy" style="position:absolute;right:40px;top:120px;opacity:0;">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="28" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
          <text x="30" y="38" text-anchor="middle" fill="#fca5a5" font-size="28">!</text>
        </svg>
      </div>
    </div>
  </div>
  <div id="panel-right" style="flex:1;position:relative;padding:60px;opacity:0;">
    <h3 style="color:#10b981;font-size:36px;font-family:system-ui;margin-bottom:24px;">HTTPS</h3>
    <div id="right-content" style="position:relative;height:400px;">
      <div id="right-msg" style="background:#1e293b;border:2px solid #475569;border-radius:12px;padding:20px;color:#10b981;font-size:24px;font-family:monospace;width:fit-content;">
        7g$kL!9x...
      </div>
      <div id="right-lock" style="position:absolute;right:40px;top:120px;opacity:0;">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="28" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
          <text x="30" y="38" text-anchor="middle" fill="#a7f3d0" font-size="24">OK</text>
        </svg>
      </div>
    </div>
  </div>
</div>
```

```javascript
tl.to("#panel-left", { opacity: 1, duration: 0.4 }, 0.5);
tl.from("#panel-left", { x: -60, duration: 0.6, ease: "power2.out" }, 0.5);
tl.to("#panel-right", { opacity: 1, duration: 0.4 }, 0.8);
tl.from("#panel-right", { x: 60, duration: 0.6, ease: "power2.out" }, 0.8);
tl.to("#left-spy", { opacity: 1, scale: 1.2, duration: 0.3, ease: "back.out(2)" }, 2.5);
tl.to("#left-msg", { borderColor: "#ef4444", duration: 0.3 }, 2.8);
tl.to("#right-lock", { opacity: 1, scale: 1.2, duration: 0.3, ease: "back.out(2)" }, 3.5);
tl.to("#right-msg", { borderColor: "#10b981", duration: 0.3 }, 3.8);
```

Applicable scenarios: HTTP vs HTTPS, sync vs async, old architecture vs new, latency comparisons.

## 9. Loop — Cyclic Process

Use for: event loops, feedback systems, periodic jobs, retry cycles.

The token should clearly return to where it started so the audience feels the cycle.

```html
<div id="scene" class="clip" data-start="0" data-duration="12" data-track-index="0"
     style="position:absolute;inset:0;background:#0f172a;">
  <svg viewBox="0 0 1920 1080" style="width:100%;height:100%;">
    <circle cx="960" cy="540" r="250" fill="none" stroke="#1e293b" stroke-width="3" stroke-dasharray="12,8"/>
    <g id="stage-1">
      <circle cx="960" cy="290" r="50" fill="#1e293b" stroke="#3b82f6" stroke-width="3"/>
      <text x="960" y="298" text-anchor="middle" fill="#94a3b8" font-size="16" font-family="system-ui">Check Queue</text>
    </g>
    <g id="stage-2">
      <circle cx="1210" cy="540" r="50" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/>
      <text x="1210" y="548" text-anchor="middle" fill="#94a3b8" font-size="16" font-family="system-ui">Execute</text>
    </g>
    <g id="stage-3">
      <circle cx="960" cy="790" r="50" fill="#1e293b" stroke="#10b981" stroke-width="3"/>
      <text x="960" y="798" text-anchor="middle" fill="#94a3b8" font-size="16" font-family="system-ui">Callback</text>
    </g>
    <g id="stage-4">
      <circle cx="710" cy="540" r="50" fill="#1e293b" stroke="#8b5cf6" stroke-width="3"/>
      <text x="710" y="548" text-anchor="middle" fill="#94a3b8" font-size="16" font-family="system-ui">Wait</text>
    </g>
    <circle id="token" cx="960" cy="290" r="16" fill="#3b82f6" opacity="0"/>
  </svg>
</div>
```

```javascript
tl.from("#stage-1 circle", { scale: 0, transformOrigin: "center", duration: 0.3, ease: "back.out(1.4)" }, 0.5);
tl.from("#stage-2 circle", { scale: 0, transformOrigin: "center", duration: 0.3, ease: "back.out(1.4)" }, 0.8);
tl.from("#stage-3 circle", { scale: 0, transformOrigin: "center", duration: 0.3, ease: "back.out(1.4)" }, 1.1);
tl.from("#stage-4 circle", { scale: 0, transformOrigin: "center", duration: 0.3, ease: "back.out(1.4)" }, 1.4);
tl.to("#token", { opacity: 1, duration: 0.2 }, 2.0);
tl.to("#stage-1 circle", { fill: "#3b82f6", duration: 0.2 }, 2.2);
tl.to("#token", { cx: 1210, cy: 540, duration: 0.6, ease: "power1.inOut" }, 2.5);
tl.to("#stage-1 circle", { fill: "#1e293b", duration: 0.2 }, 2.8);
tl.to("#stage-2 circle", { fill: "#f59e0b", duration: 0.2 }, 3.1);
tl.to("#token", { cx: 960, cy: 790, duration: 0.6, ease: "power1.inOut" }, 3.4);
tl.to("#stage-2 circle", { fill: "#1e293b", duration: 0.2 }, 3.7);
tl.to("#stage-3 circle", { fill: "#10b981", duration: 0.2 }, 4.0);
tl.to("#token", { cx: 710, cy: 540, duration: 0.6, ease: "power1.inOut" }, 4.3);
tl.to("#stage-3 circle", { fill: "#1e293b", duration: 0.2 }, 4.6);
tl.to("#stage-4 circle", { fill: "#8b5cf6", duration: 0.2 }, 4.9);
tl.to("#token", { cx: 960, cy: 290, duration: 0.6, ease: "power1.inOut" }, 5.2);
tl.to("#stage-4 circle", { fill: "#1e293b", duration: 0.2 }, 5.5);
```

Applicable scenarios: JavaScript event loop, heartbeat retries, manufacturing loops, water cycle.

## Pattern Selection Notes

- start with one dominant pattern per scene
- combine a maximum of two patterns when the second one clarifies a transition
- prefer SVG for precise diagrams, HTML/CSS for panels and cards, and mixed compositions when comparison or UI metaphors matter
- if a scene reads like a slide, remove text and add a physical action

## Common Pattern Combinations

| Primary | Secondary | Use Case |
|---------|-----------|----------|
| Particle Flow | Chain Reaction | Multi-hop network requests (DNS → resolver → root → TLD) |
| Transformation | Side-by-Side | Encryption: show plaintext on left transforming, ciphertext appearing on right |
| Accumulation | Zoom & Pan | Build a stack, then zoom into one layer to show detail |
| Chain Reaction | Loop | Event loop: chain processes a task, then loops back to check the queue |
| Split & Merge | Reordering | Merge sort: split array, sort halves, merge back together |
