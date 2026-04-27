# Education Animation Patterns

Concept-to-animation mapping for knowledge videos. Each pattern describes WHAT to animate and WHY it explains the concept. For HOW to implement (GSAP syntax, easing, timing), refer to `.agents/skills/hyperframes/SKILL.md` and `.agents/skills/hyperframes/references/motion-principles.md`.

## Pattern Selection

Choose by what the concept DOES, not by topic name.

## Particle Flow

Something travels between entities. The path itself is the explanation.

Use when: data moves through a pipeline, signals propagate, resources flow between systems.

Key elements:
- Source and destination nodes (visible, labeled)
- Particles that travel the path (colored dots, icons, or small shapes)
- Path visualization (line, curve, or channel)
- Particles change appearance when processed (color shift, shape morph)

Examples: network packets between client/server, blood cells through organs, money through a transaction chain, electricity through a circuit.

Anti-pattern: Don't just show an arrow. Show individual particles moving, queuing, splitting at forks, merging at joins.

## Transformation

One state becomes another. The viewer watches the change happen.

Use when: encoding/decoding, compilation, chemical reactions, format conversion, state machines.

Key elements:
- Clear "before" state (fully visible)
- Visible transformation process (morph, dissolve, rearrange)
- Clear "after" state
- Optional: intermediate steps shown as the transformation progresses

Examples: plaintext → ciphertext (letters scramble and recolor), source code → bytecode (blocks rearrange), caterpillar → butterfly (shape morphs).

Anti-pattern: Don't just crossfade between two static images. Show the actual structural change — elements moving, splitting, recombining.

## Reordering

Items swap positions, re-rank, or sort. Position encodes meaning.

Use when: sorting algorithms, priority queues, ranking changes, scheduling.

Key elements:
- Items with visible values or labels
- Smooth position swaps (not teleportation)
- Comparison indicators (highlight the two being compared)
- Optional: sorted/unsorted region markers

Examples: bubble sort (adjacent swaps), leaderboard changes, task priority reordering.

Anti-pattern: Don't animate all swaps simultaneously. Show them sequentially so the viewer can follow the logic.

## Zoom & Pan

Navigate through scale levels of a system. Context shifts from macro to micro or vice versa.

Use when: exploring hierarchies, drilling into detail, showing scale relationships.

Key elements:
- Smooth camera movement (scale + translate)
- Context preservation (zoomed-out view stays partially visible or fades)
- Labels that appear/disappear at appropriate zoom levels
- Clear visual hierarchy at each level

Examples: solar system → planet → continent → city, cell → nucleus → DNA → gene, company org chart drill-down.

Anti-pattern: Don't just show two separate views. Animate the continuous zoom so the viewer understands spatial relationships.

## Accumulation

Build a structure layer by layer. Each addition is meaningful.

Use when: stack growth, neural network construction, building up complexity, progressive enhancement.

Key elements:
- Base layer appears first
- Each new layer animates in from a consistent direction
- Labels appear with their layer
- Optional: connections between layers animate after both endpoints exist

Examples: TCP/IP stack layers, neural network adding layers, building a house floor by floor, composing a music track.

Anti-pattern: Don't show the complete structure and then label it. Build it piece by piece so the viewer understands the order and dependencies.

## Split & Merge

Break apart into components or combine components into a whole.

Use when: parsing, decomposition, protein folding, compilation stages, team formation.

Key elements:
- Whole entity visible first (for split) or components visible first (for merge)
- Smooth separation/combination animation
- Components maintain identity (color, label) through the process
- Spatial arrangement after split reveals internal structure

Examples: HTTP request splitting into headers/body/method, atoms combining into molecules, code splitting into AST nodes.

Anti-pattern: Don't just fade between whole and parts. Animate the physical separation — pieces sliding apart, rotating into position.

## Chain Reaction

Visible cause leads to visible effect. Causality is the lesson.

Use when: event propagation, domino effects, error cascading, trigger chains, if-then logic.

Key elements:
- Clear trigger event (highlighted, animated)
- Visible propagation (wave, pulse, or sequential activation)
- Each step in the chain is distinct and labeled
- Speed of propagation conveys urgency or delay

Examples: DOM event bubbling, neural signal propagation, supply chain disruption cascade, compiler error propagation.

Anti-pattern: Don't show all effects simultaneously. The sequential timing IS the explanation — each cause must visibly precede its effect.

## Side-by-Side

Compare two things directly. Differences become obvious through juxtaposition.

Use when: before/after, good/bad practice, two competing approaches, version comparison.

Key elements:
- Two panels or regions, clearly separated
- Synchronized animation (both sides animate at the same time)
- Differences highlighted (color, size, or annotation)
- Optional: shared elements in the middle to show what's common

Examples: HTTP vs HTTPS (one intercepted, one encrypted), O(n) vs O(n^2) (bar growth comparison), responsive vs fixed layout.

Anti-pattern: Don't show one side, then the other. Show both simultaneously so the viewer can compare in real time.

## Loop

Show a repeating process. The cycle itself is the concept.

Use when: CPU cycles, heartbeat, feedback loops, iterative algorithms, request-response patterns.

Key elements:
- Clear cycle path (circular or back-and-forth)
- Distinct phases within each cycle (labeled or color-coded)
- At least 2 full cycles shown so the viewer recognizes the pattern
- Optional: counter or iteration number

Examples: fetch-decode-execute cycle, request → process → response → request, inhale → exhale, compile → test → fix → compile.

Anti-pattern: Don't use `repeat: -1` (breaks HyperFrames). Calculate exact repeat count from scene duration. Don't show just one iteration — the repetition is the point.

## Combining Patterns

Some concepts need two patterns. Rules:

1. One pattern is dominant (drives the scene structure), one is supporting
2. Dominant pattern controls the main timeline, supporting pattern is a detail within it
3. Never combine more than two patterns in one scene — split into multiple scenes instead

Common combinations:
- **Particle Flow + Transformation**: data flows between nodes AND changes form at each node
- **Accumulation + Chain Reaction**: build a structure, then trigger a cascade through it
- **Zoom & Pan + Split & Merge**: zoom into a component, then show its internal decomposition
