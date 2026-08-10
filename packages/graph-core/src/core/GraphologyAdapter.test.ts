import { describe, it, expect } from 'vitest';
import { GraphologyAdapter } from './GraphologyAdapter';
import { lattice2D, complete, empty } from './builders';

describe('GraphologyAdapter', () => {
  it('should create a graph with an id', () => {
    const graph = new GraphologyAdapter('test-graph');
    expect(graph.id).toBe('test-graph');
  });

  it('should auto-generate id if not provided', () => {
    const graph = new GraphologyAdapter();
    expect(graph.id).toMatch(/^graph-/);
  });

  it('should add and retrieve nodes', () => {
    const graph = new GraphologyAdapter();
    graph.addNode({ id: 'n1', type: 'test', properties: {} });
    
    const node = graph.getNode('n1');
    expect(node).toBeDefined();
    expect(node?.id).toBe('n1');
    expect(node?.type).toBe('test');
  });

  it('should add and retrieve edges', () => {
    const graph = new GraphologyAdapter();
    graph.addNode({ id: 'n1', type: 'test', properties: {} });
    graph.addNode({ id: 'n2', type: 'test', properties: {} });
    graph.addEdge({ id: 'e1', sourceId: 'n1', targetId: 'n2', type: 'test', directed: false, properties: {} });
    
    const edge = graph.getEdge('e1');
    expect(edge).toBeDefined();
    expect(edge?.sourceId).toBe('n1');
    expect(edge?.targetId).toBe('n2');
  });

  it('should compute adjacency matrix', () => {
    const graph = complete(3);
    const adj = graph.toAdjacencyMatrix();
    const size = adj.size();
    
    expect(size[0]).toBe(3);
    expect(size[1]).toBe(3);
    
    // Complete graph has 1s everywhere except diagonal
    expect(adj.get([0, 1])).toBe(1);
    expect(adj.get([1, 0])).toBe(1);
    expect(adj.get([0, 0])).toBe(0);
  });

  it('should compute spectral radius', () => {
    const graph = complete(3);
    const rho = graph.spectralRadius();
    
    // Spectral radius of K_3 should be 2
    expect(rho).toBeCloseTo(2, 1);
  });

  it('should clone a graph', () => {
    const graph = new GraphologyAdapter('original');
    graph.addNode({ id: 'n1', type: 'test', properties: {} });
    
    const cloned = graph.clone() as GraphologyAdapter;
    expect(cloned.id).toBe('original-clone');
    expect(cloned.getNode('n1')).toBeDefined();
    expect(cloned.nodeCount).toBe(1);
  });
});

describe('Builders', () => {
  it('should create empty graph', () => {
    const graph = empty(5);
    expect(graph.nodeCount).toBe(5);
    expect(graph.edgeCount).toBe(0);
  });

  it('should create complete graph', () => {
    const graph = complete(4);
    expect(graph.nodeCount).toBe(4);
    expect(graph.edgeCount).toBe(6); // C(4,2) = 6
  });

  it('should create 2D lattice', () => {
    const graph = lattice2D(3, 3);
    expect(graph.nodeCount).toBe(9);
    // 3x3 grid has 12 edges (3*2 horizontal + 3*2 vertical)
    expect(graph.edgeCount).toBe(12);
  });
});
