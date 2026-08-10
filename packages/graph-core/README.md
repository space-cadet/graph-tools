# @space-cadet/graph-core

Pure graph theory library built on [Graphology](https://graphology.github.io/). Provides typed interfaces, graph generators, matrix operations, and spectral methods.

## Install

```bash
npm install @space-cadet/graph-core
```

## Quick Start

```typescript
import { GraphologyAdapter, regularGrid } from '@space-cadet/graph-core';

// Create a graph
const graph = new GraphologyAdapter('my-graph');

// Or use a generator
const lattice = regularGrid(5, 5); // 5×5 lattice

// Access spectral properties
console.log(lattice.spectralRadius());
```

## Features

- **Typed graph interfaces** (`IGraph`, `IGraphNode`, `IGraphEdge`)
- **Graphology adapter** — battle-tested graph data structure
- **Graph generators** — lattices, trees, random graphs
- **Matrix operations** — adjacency, Laplacian via mathjs
- **Spectral methods** — power iteration for largest eigenvalue

## API

### GraphologyAdapter

Core graph implementation using Graphology.

```typescript
const graph = new GraphologyAdapter('id');
graph.addNode({ id: 'a', type: 'node', properties: {} });
graph.addEdge({ id: 'e1', sourceId: 'a', targetId: 'b', directed: false, type: 'default', properties: {} });
```

### Graph Generators

```typescript
import { regularGrid, createTree, createRandomGraph } from '@space-cadet/graph-core';

const grid = regularGrid(10, 10);     // 2D lattice
const tree = createTree(5, 2);         // 5-level binary tree
const random = createRandomGraph(20, 0.1); // 20 nodes, 10% edge probability
```

### Spectral Methods

```typescript
const radius = graph.spectralRadius(); // Power iteration
const adj = graph.toAdjacencyMatrix(); // mathjs Matrix
const lap = graph.toLaplacianMatrix(); // mathjs Matrix
```

## License

MIT
