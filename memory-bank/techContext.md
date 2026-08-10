# Tech Context
*Last Updated: 2026-08-10 20:15:00 UTC*

## Stack

### Monorepo
- **Package Manager**: pnpm 9.x with workspaces
- **Build Orchestration**: Turborepo
- **CI/CD**: GitHub Actions (to be configured)

### graph-core
- **Language**: TypeScript 5.3+
- **Build**: Vite (lib mode)
- **Output**: ESM (.mjs) + CJS (.js) + types (.d.ts)
- **Dependencies**:
  - graphology ^0.26.0
  - graphology-generators ^0.11.2
  - graphology-types ^0.24.8
  - mathjs ^12.1.0
- **Dev Dependencies**:
  - typescript ^5.3.0
  - vite ^5.0.0
  - vitest ^1.0.0

### graph-ui
- **Language**: TypeScript 5.3+ with JSX
- **Build**: tsc + vite (to be configured)
- **Peer Dependencies**:
  - @space-cadet/graph-core
  - react ^18.0.0
  - react-dom ^18.0.0
- **Dependencies**:
  - graphology ^0.26.0
  - graphology-layout ^0.6.1
  - graphology-layout-force ^0.2.4
  - graphology-layout-forceatlas2 ^0.10.1
  - graphology-layout-noverlap ^0.4.2
  - sigma ^3.0.1
- **Dev Dependencies**:
  - @types/react ^18.2.0
  - @types/react-dom ^18.2.0
  - typescript ^5.3.0
  - vite ^5.0.0
  - vitest ^1.0.0

## Build Pipeline
```
Root (turbo.json)
├── packages/graph-core (vite build)
│   └── dist/ (index.js, index.mjs, index.d.ts)
└── packages/graph-ui (vite build)
    └── dist/ (index.js, index.mjs, index.d.ts)
```

## Package Exports

### @space-cadet/graph-core
```ts
// Core types
export { IGraph, IGraphNode, IGraphEdge, ... } from './core/types';

// Graphology adapter
export { GraphologyAdapter } from './core/GraphologyAdapter';

// Builders/generators
export { lattice2D, random, complete, ... } from './core/builders';
```

### @space-cadet/graph-ui
```ts
// React components
export { GraphCanvas } from './components/canvas/GraphCanvas';

// Layout
export { LayoutManager } from './layout/LayoutManager';

// Rendering
export { RenderGraph } from './rendering/RenderGraph';
```

## Current Issues
- graph-ui build config needs vite setup (currently only tsconfig)
- D3.js renderer not yet implemented
- No tests migrated
- No CI/CD configured
- Not yet published to npm
