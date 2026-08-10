# @space-cadet/graph-ui

Multi-renderer graph visualization for `@space-cadet/graph-core`. Supports **D3.js** (force-directed), **Sigma.js** (2D WebGL), and **Three.js** (3D).

## Install

```bash
npm install @space-cadet/graph-ui
```

Peer dependencies (your app should install these):
```bash
npm install @space-cadet/graph-core react react-dom
```

## Quick Start

### D3 Renderer (Vanilla JS)

```typescript
import { D3Renderer } from '@space-cadet/graph-ui';
import { GraphologyAdapter } from '@space-cadet/graph-core';

const graph = new GraphologyAdapter('demo');
// ... add nodes and edges ...

const renderer = new D3Renderer('#container', {
  width: 800,
  height: 600,
  enableDrag: true,
  enableFlowAnimation: true,
});

renderer.render(graph);
```

### React Component

```tsx
import { D3GraphCanvas } from '@space-cadet/graph-ui';

function MyGraph() {
  return (
    <D3GraphCanvas
      graph={graph}
      width={800}
      height={600}
      enableDrag
      enableFlowAnimation
    />
  );
}
```

## Features

- **D3.js** — Force-directed layouts, drag-and-drop, flow animations
- **Sigma.js** — WebGL-accelerated 2D rendering for large graphs
- **Three.js** — 3D graph visualization
- **Flow animation** — Animated particles traveling along edges
- **Type-safe** — Full TypeScript support

## Renderers

| Renderer | Use Case | Performance |
|----------|----------|-------------|
| `D3Renderer` | Small-medium graphs, interactivity | SVG/Canvas |
| `SigmaRenderer` | Large graphs, 2D | WebGL |
| `ThreeRenderer` | 3D visualization | WebGL |

## Demo

Live demo: https://quantumofgravity.com/projects/graph-tools/

## License

MIT
