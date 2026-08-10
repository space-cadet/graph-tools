# Changelog

All notable changes to this project will be documented in this file.

## [0.1.3] - 2026-08-10

### Fixed
- **graph-core**: Added `getOutgoingEdges()` and `getIncomingEdges()` to `IGraph` interface so they're properly exported in dist
- **graph-core**: Added `toJSON()` / `fromJSON()` to `IGraph` interface
- Removed stale `.js` files in `src/` that shadowed `.ts` sources during Vite build

## [0.1.2] - 2026-08-10

### Added
- **graph-core**: `getOutgoingEdges(nodeId)` — get edges where node is the source
- **graph-core**: `getIncomingEdges(nodeId)` — get edges where node is the target
- **graph-core**: `toJSON()` / `fromJSON()` — full graph serialization/deserialization
- **graph-ui**: `D3Renderer.update(graph)` — incremental updates without destroying SVG
- **graph-ui**: `setFlowAnimationEnabled(boolean)` — toggle flow animation

### Changed
- **graph-ui**: Updated `@space-cadet/graph-core` dependency from `workspace:*` to `^0.1.0` for npm compatibility

## [0.1.1] - 2026-08-10

### Added
- README.md for `@space-cadet/graph-core`
- README.md for `@space-cadet/graph-ui`
- Demo screenshot saved to `memory-bank/assets/screenshots/demo-working.jpg`

### Fixed
- **examples**: Added `define: { 'process.env.NODE_ENV': '"production"' }` to vite.config.ts to fix browser `process is not defined` error
- Bumped cache-busting query param on demo.js (`?v=2`)

## [0.1.0] - 2026-08-10

### Added
- **graph-core**: Core graph data structure (`GraphologyAdapter`) with typed interfaces
- **graph-core**: Graph generators — `regularGrid()`, `random()`, `path()`, `complete()`, `empty()`, `tree()`, `cycle()`, `star()`, `bipartite()`
- **graph-core**: Matrix operations — `toAdjacencyMatrix()`, `toLaplacianMatrix()`
- **graph-core**: Spectral methods — `spectralRadius()` via power iteration
- **graph-core**: Traversal — `findPath()`, `getAdjacentNodes()`, `getConnectedEdges()`
- **graph-ui**: D3.js renderer with force-directed layout, drag-and-drop, flow animations
- **graph-ui**: Sigma.js renderer for WebGL-accelerated 2D
- **graph-ui**: Three.js renderer for 3D visualization
- **graph-ui**: React components — `GraphCanvas`, `D3GraphCanvas`
- Demo app deployed to https://quantumofgravity.com/projects/graph-tools/
- 10 tests for graph-core (all passing)
