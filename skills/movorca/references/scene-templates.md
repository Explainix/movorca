# Scene Templates — Concept Animation Patterns

These are NOT slideshow templates. Every template demonstrates how to ANIMATE A CONCEPT — objects move, interact, transform, and tell a story through motion.

## Core Principle

**Show the concept happening, don't describe it with text.**

- DNS resolution? Show a packet flying between servers.
- Sorting algorithm? Show bars swapping positions.
- Photosynthesis? Show light particles entering a leaf, water molecules splitting.
- Encryption? Show a message transforming into ciphertext character by character.

Text is minimal — only labels and annotations. The animation IS the explanation.

## 1. Particle Flow — Objects Moving Between Entities

Use for: network requests, data flow, message passing, signal transmission.

A packet (small circle) travels from source to destination along a path, with entities reacting on arrival.

```html
<div id="scene" class="clip" data-start="0" data-duration="12" data-track-index="0"
     style="position:absolute;inset:0;background:#0f172a;">
  <svg viewBox="0 0 1920 1080" style="width:100%;height:100%;">
    <!-- Entities -->
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

    <!-- Traveling packet -->
    <circle id="packet" cx="240" cy="520" r="12" fill="#3b82f6" opacity="0"/>

    <!-- Request label (appears mid-flight) -->
    <text id="request-label" x="560" y="480" text-anchor="middle" fill="#64748b" font-size="18" font-family="system-ui" opacity="0">
      "Where is example.com?"
    </text>

    <!-- Response label -->
    <text id="response-label" x="560" y="480" text-anchor="middle" fill="#10b981" font-size="18" font-family="system-ui" opacity="0">
      "93.184.216.34"
    </text>

    <!-- Connection paths (dashed, drawn progressively) -->
    <line id="path-1" x1="320" y1="520" x2="880" y2="520" stroke="#334155" stroke-width="2" stroke-dasharray="8,6" opacity="0"/>
    <line id="path-2" x1="1040" y1="520" x2="1600" y2="520" stroke="#334155" stroke-width="2" stroke-dasharray="8,6" opacity="0"/>
  </svg>
</div>
```

```javascript
// Entities fade in
tl.from("#browser rect", { scale: 0, transformOrigin: "center", duration: 0.5, ease: "back.out(1.4)" }, 0.5);
tl.from("#browser text", { opacity: 0, duration: 0.3 }, 0.8);
tl.from("#dns-server rect", { scale: 0, transformOrigin: "center", duration: 0.5, ease: "back.out(1.4)" }, 1.2);
tl.from("#dns-server text", { opacity: 0, duration: 0.3 }, 1.5);
tl.from("#web-server rect", { scale: 0, transformOrigin: "center", duration: 0.5, ease: "back.out(1.4)" }, 1.8);
tl.from("#web-server text", { opacity: 0, duration: 0.3 }, 2.1);

// Paths appear
tl.to("#path-1", { opacity: 1, duration: 0.3 }, 2.5);
tl.to("#path-2", { opacity: 1, duration: 0.3 }, 2.7);

// Packet appears and flies to DNS
tl.to("#packet", { opacity: 1, duration: 0.2 }, 3.0);
tl.to("#packet", { cx: 960, duration: 1.2, ease: "power2.inOut" }, 3.2);
tl.to("#request-label", { opacity: 1, duration: 0.3 }, 3.5);
tl.to("#request-label", { opacity: 0, duration: 0.3 }, 4.2);

// DNS server pulses on receive
tl.to("#dns-server rect", { stroke: "#34d399", strokeWidth: 5, duration: 0.2, yoyo: true, repeat: 1 }, 4.4);

// Packet changes color (got response) and flies to server
tl.to("#packet", { fill: "#10b981", duration: 0.3 }, 5.0);
tl.to("#response-label", { opacity: 1, duration: 0.3 }, 5.0);
tl.to("#packet", { cx: 1680, duration: 1.2, ease: "power2.inOut" }, 5.5);
tl.to("#response-label", { opacity: 0, duration: 0.3 }, 6.0);

// Web server pulses
tl.to("#web-server rect", { stroke: "#fbbf24", strokeWidth: 5, duration: 0.2, yoyo: true, repeat: 1 }, 6.7);
```

## 2. Transformation — Object Morphing to Show Change

Use for: encryption, compression, compilation, chemical reactions, state changes.

An object visually transforms to show a process happening.

```html
<div id="scene" class="clip" data-start="0" data-duration="10" data-track-index="0"
     style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#0f172a;">
  <svg viewBox="0 0 1920 1080" style="width:100%;height:100%;">
    <!-- Original message -->
    <g id="plaintext-group">
      <rect id="msg-box" x="260" y="420" width="400" height="200" rx="16" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
      <text id="msg-text" x="460" y="530" text-anchor="middle" fill="#e2e8f0" font-size="28" font-family="monospace">Hello World</text>
      <text x="460" y="660" text-anchor="middle" fill="#64748b" font-size="18" font-family="system-ui">Plaintext</text>
    </g>

    <!-- Lock / encryption icon -->
    <g id="lock" opacity="0">
      <rect x="910" y="460" width="100" height="80" rx="12" fill="none" stroke="#f59e0b" stroke-width="3"/>
      <path d="M930,460 V430 A30,30 0 0,1 990,430 V460" fill="none" stroke="#f59e0b" stroke-width="3"/>
    </g>

    <!-- Encrypted result -->
    <g id="ciphertext-group" opacity="0">
      <rect id="cipher-box" x="1260" y="420" width="400" height="200" rx="16" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
      <text id="cipher-text" x="1460" y="530" text-anchor="middle" fill="#10b981" font-size="28" font-family="monospace">7g$kL!9x...</text>
      <text x="1460" y="660" text-anchor="middle" fill="#64748b" font-size="18" font-family="system-ui">Ciphertext</text>
    </g>

    <!-- Arrow showing transformation -->
    <line id="transform-arrow" x1="680" y1="520" x2="1240" y2="520" stroke="#334155" stroke-width="2" opacity="0"/>
  </svg>
</div>
```

```javascript
// Plaintext appears
tl.from("#msg-box", { scaleX: 0, transformOrigin: "left center", duration: 0.6, ease: "power3.out" }, 0.5);
tl.from("#msg-text", { opacity: 0, duration: 0.4 }, 1.0);

// Lock appears with bounce
tl.to("#lock", { opacity: 1, scale: 1.2, duration: 0.3, ease: "back.out(2)" }, 2.0);
tl.to("#lock", { scale: 1, duration: 0.2 }, 2.3);

// Arrow draws
tl.to("#transform-arrow", { opacity: 1, duration: 0.4 }, 2.5);

// Message box shakes (encryption happening)
tl.to("#msg-box", { x: -5, duration: 0.05, yoyo: true, repeat: 11 }, 3.0);
tl.to("#msg-text", { opacity: 0, duration: 0.3 }, 3.5);

// Ciphertext appears
tl.to("#ciphertext-group", { opacity: 1, duration: 0.5, ease: "power2.out" }, 4.0);

// Lock moves to ciphertext (it's now locked)
tl.to("#lock", { x: 350, duration: 0.8, ease: "power2.inOut" }, 4.5);
```

## 3. Sorting / Reordering — Elements Swapping Positions

Use for: algorithms, ranking, prioritization, any ordering concept.

Bars or objects physically swap positions to demonstrate the process.

```html
<div id="scene" class="clip" data-start="0" data-duration="15" data-track-index="0"
     style="position:absolute;inset:0;background:#0f172a;">
  <svg viewBox="0 0 1920 1080" style="width:100%;height:100%;">
    <!-- Bars representing values -->
    <rect id="bar-1" x="460" y="580" width="80" height="120" rx="8" fill="#ef4444"/>
    <rect id="bar-2" x="600" y="480" width="80" height="220" rx="8" fill="#f59e0b"/>
    <rect id="bar-3" x="740" y="380" width="80" height="320" rx="8" fill="#3b82f6"/>
    <rect id="bar-4" x="880" y="530" width="80" height="170" rx="8" fill="#10b981"/>
    <rect id="bar-5" x="1020" y="630" width="80" height="70" rx="8" fill="#8b5cf6"/>

    <!-- Value labels -->
    <text id="val-1" x="500" y="570" text-anchor="middle" fill="#f8fafc" font-size="24" font-family="monospace">3</text>
    <text id="val-2" x="640" y="470" text-anchor="middle" fill="#f8fafc" font-size="24" font-family="monospace">5</text>
    <text id="val-3" x="780" y="370" text-anchor="middle" fill="#f8fafc" font-size="24" font-family="monospace">8</text>
    <text id="val-4" x="920" y="520" text-anchor="middle" fill="#f8fafc" font-size="24" font-family="monospace">4</text>
    <text id="val-5" x="1060" y="620" text-anchor="middle" fill="#f8fafc" font-size="24" font-family="monospace">1</text>

    <!-- Comparison highlight -->
    <rect id="compare-highlight" x="0" y="0" width="220" height="400" rx="12" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="8,4" opacity="0"/>
  </svg>
</div>
```

```javascript
// Bars slide in from bottom
tl.from("#bar-1", { y: 300, opacity: 0, duration: 0.4, ease: "power3.out" }, 0.3);
tl.from("#bar-2", { y: 300, opacity: 0, duration: 0.4, ease: "power3.out" }, 0.5);
tl.from("#bar-3", { y: 300, opacity: 0, duration: 0.4, ease: "power3.out" }, 0.7);
tl.from("#bar-4", { y: 300, opacity: 0, duration: 0.4, ease: "power3.out" }, 0.9);
tl.from("#bar-5", { y: 300, opacity: 0, duration: 0.4, ease: "power3.out" }, 1.1);

// Labels appear
tl.from("#val-1, #val-2, #val-3, #val-4, #val-5", { opacity: 0, duration: 0.3 }, 1.5);

// Compare bar-4 and bar-5: highlight pair
tl.to("#compare-highlight", { opacity: 1, x: 870, y: 350, duration: 0.3 }, 2.5);

// Swap bar-4 and bar-5 (bar-5 is smaller, moves left)
tl.to("#bar-4", { x: 140, duration: 0.6, ease: "power2.inOut" }, 3.2);
tl.to("#val-4", { x: 140, duration: 0.6, ease: "power2.inOut" }, 3.2);
tl.to("#bar-5", { x: -140, duration: 0.6, ease: "power2.inOut" }, 3.2);
tl.to("#val-5", { x: -140, duration: 0.6, ease: "power2.inOut" }, 3.2);

// Highlight moves to next pair
tl.to("#compare-highlight", { x: 730, duration: 0.4 }, 4.2);
```

## 4. Zoom & Pan — Camera Movement Through a System

Use for: exploring architecture, drilling into detail, showing scale.

Simulate camera movement by scaling and translating a large SVG canvas.

```html
<div id="scene" class="clip" data-start="0" data-duration="12" data-track-index="0"
     style="position:absolute;inset:0;overflow:hidden;background:#0f172a;">
  <svg id="world" viewBox="0 0 3840 2160" style="width:200%;height:200%;position:absolute;top:-50%;left:-25%;">
    <!-- Large world with multiple areas -->
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
    <!-- Detail inside API (visible when zoomed) -->
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
// Start zoomed out — see everything
tl.from("#world", { scale: 0.5, transformOrigin: "center center", duration: 1, ease: "power2.out" }, 0.5);

// Pan to API area
tl.to("#world", { x: -600, duration: 1.5, ease: "power2.inOut" }, 3.0);

// Zoom into API
tl.to("#world", { scale: 1.5, transformOrigin: "1500px 400px", duration: 1.2, ease: "power2.inOut" }, 4.5);

// Reveal detail
tl.to("#api-detail", { opacity: 1, duration: 0.5 }, 5.7);
tl.from("#api-detail rect", { scaleY: 0, transformOrigin: "top", stagger: 0.3, duration: 0.4, ease: "power2.out" }, 5.7);
```

## 5. Accumulation — Building Up a Structure Piece by Piece

Use for: assembly, construction, layered concepts, stack/queue, composition.

Elements stack, connect, or assemble to form a complete structure.

```html
<div id="scene" class="clip" data-start="0" data-duration="10" data-track-index="0"
     style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#0f172a;">
  <svg viewBox="0 0 1920 1080" style="width:100%;height:100%;">
    <!-- TCP/IP layers stacking from bottom -->
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

    <!-- Data packet dropping through layers -->
    <circle id="data-packet" cx="960" cy="200" r="20" fill="#ef4444" opacity="0"/>
    <text id="data-label" x="960" y="170" text-anchor="middle" fill="#fca5a5" font-size="16" font-family="system-ui" opacity="0">Data</text>
  </svg>
</div>
```

```javascript
// Layers stack up from bottom with bounce
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

// Data packet appears and drops through each layer
tl.to("#data-packet", { opacity: 1, duration: 0.2 }, 5.0);
tl.to("#data-label", { opacity: 1, duration: 0.2 }, 5.0);
tl.to("#data-packet, #data-label", { y: 280, duration: 0.4, ease: "power2.in" }, 5.5);
tl.to("#layer-app rect", { fill: "#b45309", duration: 0.15, yoyo: true, repeat: 1 }, 5.9);
tl.to("#data-packet, #data-label", { y: 400, duration: 0.4, ease: "power2.in" }, 6.3);
tl.to("#layer-transport rect", { fill: "#047857", duration: 0.15, yoyo: true, repeat: 1 }, 6.7);
tl.to("#data-packet, #data-label", { y: 520, duration: 0.4, ease: "power2.in" }, 7.1);
tl.to("#layer-network rect", { fill: "#1d4ed8", duration: 0.15, yoyo: true, repeat: 1 }, 7.5);
```

## Animation Principles

**DO:**
- Objects MOVE to show relationships (packets fly, bars swap, layers stack)
- Objects TRANSFORM to show processes (encrypt, compress, compile)
- Camera MOVES to show scale and detail (zoom in, pan across)
- Entities REACT when interacted with (pulse, glow, shake)
- Use SVG for all visuals — infinitely scalable, precise positioning
- Minimal text — only labels and short annotations

**DON'T:**
- Don't make text the primary content (that's a slideshow)
- Don't fade in bullet points (that's PowerPoint)
- Don't use static layouts with sequential reveals (that's a presentation)
- Don't put paragraphs on screen (that's a document)
- Don't rely on text to explain — the MOTION explains

## Color & Style

- Background: dark (#0f172a)
- Entity fills: dark card (#1e293b) with colored strokes
- Accent palette: blue (#3b82f6), green (#10b981), amber (#f59e0b), purple (#8b5cf6), red (#ef4444)
- Text: labels only (#94a3b8 secondary, #f8fafc for emphasis)
- All visuals in SVG for crisp rendering at any resolution
