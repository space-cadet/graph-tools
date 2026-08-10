import { GraphologyAdapter, lattice2D } from '@space-cadet/graph-core';
import { D3Renderer } from '@space-cadet/graph-ui';

// Demo 1: Interactive D3 Graph
let graph1: GraphologyAdapter;
let renderer1: D3Renderer;

function initGraph1() {
  graph1 = new GraphologyAdapter('demo1');
  for (let i = 0; i < 5; i++) {
    graph1.addNode({
      id: `n${i}`,
      type: i < 2 ? 'producer' : 'household',
      properties: { label: i < 2 ? `P${i}` : `H${i-2}` }
    });
  }
  for (let i = 1; i < 5; i++) {
    graph1.addEdge({
      id: `e0-${i}`,
      sourceId: 'n0',
      targetId: `n${i}`,
      type: 'default',
      directed: false,
      properties: {}
    });
  }
  renderer1.render(graph1);
  updateInfo1();
}

function updateInfo1() {
  const nc = document.getElementById('node-count');
  const ec = document.getElementById('edge-count');
  if (nc) nc.textContent = String(graph1.nodeCount);
  if (ec) ec.textContent = String(graph1.edgeCount);
}

(window as any).addRandomNode = () => {
  const id = `n${graph1.nodeCount}`;
  graph1.addNode({
    id,
    type: 'household',
    properties: { label: `H${graph1.nodeCount - 2}` }
  });
  const existing = graph1.getNodes();
  const target = existing[Math.floor(Math.random() * existing.length)];
  if (target.id !== id) {
    graph1.addEdge({
      id: `e-${id}-${target.id}`,
      sourceId: id,
      targetId: target.id,
      type: 'default',
      directed: false,
      properties: {}
    });
  }
  renderer1.render(graph1);
  updateInfo1();
};

(window as any).randomizeLayout = () => {
  renderer1.render(graph1);
};

let flowInterval: ReturnType<typeof setInterval> | null = null;
(window as any).toggleFlow = () => {
  if (flowInterval) {
    clearInterval(flowInterval);
    flowInterval = null;
    renderer1.setFlowAnimationEnabled(false);
  } else {
    renderer1.setFlowAnimationEnabled(true);
    let t = 0;
    flowInterval = setInterval(() => {
      const flows = graph1.getEdges().map(e => ({
        source: e.sourceId,
        target: e.targetId,
        value: Math.random() * 2
      }));
      renderer1.updateFlows(flows, t++);
    }, 600);
  }
};

// Demo 2: Lattice Graph
let graph2: GraphologyAdapter;
let renderer2: D3Renderer;

function initGraph2() {
  graph2 = lattice2D(5, 5);
  renderer2.render(graph2);
  const rho = graph2.spectralRadius();
  const el = document.getElementById('spectral');
  if (el) el.textContent = rho.toFixed(3);
}

(window as any).createLattice = () => {
  initGraph2();
};

(window as any).highlightRandom = () => {
  const nodes = graph2.getNodes();
  const random = nodes[Math.floor(Math.random() * nodes.length)];
  renderer2.selectNode(random.id);
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderer1 = new D3Renderer('#d3-graph', {
    width: 500,
    height: 350,
    colors: {
      node: (n: any) => n.properties?.type === 'producer' ? '#f87171' : '#2dd4bf',
      edge: '#475569',
      text: '#e2e8f0',
      highlight: '#fbbf24',
      flow: '#fbbf24',
      stroke: '#1e293b'
    },
    enableDrag: true,
    enableFlowAnimation: false
  });

  renderer1.onNodeClick = (id: string) => {
    const el = document.getElementById('selected-node');
    if (el) el.textContent = id;
  };

  renderer2 = new D3Renderer('#lattice-graph', {
    width: 500,
    height: 350,
    colors: {
      node: '#60a5fa',
      edge: '#475569',
      text: '#e2e8f0',
      highlight: '#fbbf24',
      stroke: '#1e293b'
    },
    forces: {
      linkDistance: 60,
      chargeStrength: -200
    }
  });

  initGraph1();
  initGraph2();
});
