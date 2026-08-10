# Active Context

*Last Updated: 2026-08-10 21:38:00 UTC*

## Current Focus

**T1, T2, and Demo COMPLETED.**

Both packages are scaffolded, migrated, and building successfully. D3 renderer with flow animation has been ported from econ-sim. Demo app is live and working at https://quantumofgravity.com/projects/graph-tools/

**Next Session:** Refactor econ-sim to use published packages.

---

## System Status

- **Project**: graph-tools at `code/graph-tools/`
- **Repository**: https://github.com/space-cadet/graph-tools
- **Packages**: @space-cadet/graph-core, @space-cadet/graph-ui
- **Build**: ✅ Both packages build cleanly
- **Tests**: ✅ 10 passing in graph-core
- **Demo**: ✅ Live at https://quantumofgravity.com/projects/graph-tools/
- **Publish**: ✅ v0.1.0 published to npm (2026-08-10)

## Completed Work Summary

### T1: Scaffold Monorepo
- GitHub repo created and initial commit pushed
- pnpm workspace + Turborepo configured
- graph-core cleaned (removed UI deps, added id, spectralRadius)
- graph-ui imports fixed, ready for D3 renderer port
- Root tsconfig + per-package tsconfigs

### T2: Port D3 Renderer
- D3LayoutEngine for force-directed layouts
- D3GraphCanvas React component with drag-and-drop
- D3Renderer vanilla JS class for non-React usage
- Flow animation system (particles traveling along edges)
- 10 tests for graph-core (all passing)

### Demo App
- Interactive D3 force-directed graph with producer/household nodes
- 2D lattice (5×5) with spectral radius display
- Buttons: Add Node, Shuffle, Toggle Flow, Regenerate, Highlight
- Deployed to https://quantumofgravity.com/projects/graph-tools/
- Screenshot saved to `memory-bank/assets/screenshots/demo-working.jpg`
- Fixed `process.env.NODE_ENV` issue in Vite IIFE build (React bundled)

## Architecture Decisions

1. **Monorepo** over separate repos (tightly coupled packages)
2. **@space-cadet namespace** (user owns npm scope)
3. **Migration-first, cleanup-after** (leave spin-network-app untouched)
4. **graph-core** is pure graph theory (no UI deps)
5. **graph-ui** is renderer-agnostic (Sigma, Three.js, D3.js)

## Next Steps

1. Publish v0.1.0 to npm
