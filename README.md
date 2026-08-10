# graph-tools

Monorepo for reusable graph packages: `@space-cadet/graph-core` and `@space-cadet/graph-ui`.

## Packages

### @space-cadet/graph-core
Pure graph theory library built on Graphology. Provides typed interfaces, graph generators, matrix operations, and spectral methods.

### @space-cadet/graph-ui
Multi-renderer graph visualization. Supports Sigma.js (2D), Three.js (3D), and D3.js (force-directed with flow animation).

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Test all packages
pnpm test
```

## License
MIT
