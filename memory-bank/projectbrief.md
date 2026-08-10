# Project Brief
*Last Updated: 2026-08-10 20:15:00 UTC*

## Project Overview
**Project Name**: graph-tools
**Description**: Monorepo for reusable graph theory and visualization packages. Extracted from spin-network-app and enhanced with features from econ-sim.

## Objectives
1. Create publishable npm packages for graph data structures and visualization
2. Support multiple renderers (Sigma.js, Three.js, D3.js)
3. Provide clean separation between logical graph and visual rendering
4. Enable reuse across projects (econ-sim, spin-network-app, future projects)

## Key Features
- Typed graph interfaces (IGraph, ITypedGraph, IOrderedGraph, ISimplicialGraph)
- Graph generators (lattice, random, complete, path, etc.)
- Matrix operations (adjacency, Laplacian, spectral radius)
- Multi-renderer visualization layer
- Flow animation and interactive edge creation

## Tech Stack
- **Language**: TypeScript
- **Build**: Vite + Turborepo
- **Package Manager**: pnpm workspaces
- **Graph Library**: Graphology
- **Renderers**: Sigma.js, Three.js, D3.js

## Constraints & Requirements
- Zero UI dependencies in graph-core
- React peer dependency only in graph-ui
- Support both CommonJS and ESM
- Publish under @space-cadet scope

## Success Metrics
- Both packages build cleanly
- All existing spin-network-app tests pass
- Econ-sim can import and use packages
- Published to npm

## Repository
**URL**: https://github.com/space-cadet/graph-tools

## Team/Contributors
- Deepak Vaid (space-cadet)
