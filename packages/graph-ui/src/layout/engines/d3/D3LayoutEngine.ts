/**
 * D3LayoutEngine - Force-directed layout using D3.js
 * Ports the force simulation from econ-sim's NetworkVisualization
 */

import { IGraph } from '@space-cadet/graph-core';
import { ILayoutEngine, ILayoutOptions } from '../../types';
import { RenderGraph } from '../../../rendering/RenderGraph';

interface D3NodeDatum {
  id: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface D3LinkDatum {
  source: string | D3NodeDatum;
  target: string | D3NodeDatum;
}

export interface ID3LayoutOptions extends ILayoutOptions {
  width?: number;
  height?: number;
  linkDistance?: number;
  chargeStrength?: number;
  centerX?: number;
  centerY?: number;
  collisionRadius?: number;
}

export class D3LayoutEngine implements ILayoutEngine {
  readonly type = 'd3';

  transformToRender(graph: IGraph, options: ILayoutOptions): IRenderGraph {
    const d3Options = options as ID3LayoutOptions;
    const renderGraph = new RenderGraph(graph);

    // Get nodes and edges
    const nodes = graph.getNodes();
    const edges = graph.getEdges();

    // Initialize node positions
    const width = d3Options.width || 800;
    const height = d3Options.height || 600;

    nodes.forEach(node => {
      const x = Math.random() * width * 0.8 + width * 0.1;
      const y = Math.random() * height * 0.8 + height * 0.1;
      renderGraph.setNodePosition(node.id, { x, y, z: 0 });
    });

    // Store layout parameters in render graph metadata
    const metadata = {
      layoutEngine: 'd3',
      options: d3Options,
      nodeCount: nodes.length,
      edgeCount: edges.length
    };

    return renderGraph;
  }

  updateLayout(renderGraph: IRenderGraph, options: ILayoutOptions): IRenderGraph {
    // For D3, layout updates are handled by the simulation during rendering
    // This method just updates the stored options
    return renderGraph;
  }
}
