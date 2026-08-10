/**
 * D3Renderer - Vanilla JS D3.js graph renderer
 * Non-React version for direct DOM usage
 */

import * as d3 from 'd3';
import { IGraph, IGraphNode, IGraphEdge } from '@space-cadet/graph-core';

interface D3SimNode extends d3.SimulationNodeDatum {
  id: string;
  data: IGraphNode;
  [key: string]: any;
}

interface D3SimLink extends d3.SimulationLinkDatum<D3SimNode> {
  id: string;
  data: IGraphEdge;
}

export interface D3RendererOptions {
  width?: number;
  height?: number;
  colors?: {
    node?: string | ((node: IGraphNode) => string);
    edge?: string;
    text?: string;
    highlight?: string;
    flow?: string;
    stroke?: string;
  };
  forces?: {
    linkDistance?: number;
    chargeStrength?: number;
    collisionRadius?: number;
  };
  nodeRadius?: number;
  enableDrag?: boolean;
  enableFlowAnimation?: boolean;
}

export class D3Renderer {
  private container: d3.Selection<HTMLElement, unknown, null, undefined>;
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
  private simulation: d3.Simulation<D3SimNode, D3SimLink> | null = null;
  private nodes: D3SimNode[] = [];
  private links: D3SimLink[] = [];
  private options: Required<D3RendererOptions>;
  private selectedNodeId: string | null = null;
  private edgeSourceId: string | null = null;
  private ghostLine: d3.Selection<SVGLineElement, unknown, null, undefined> | null = null;
  private flowAnimationEnabled: boolean;

  // Callbacks
  onNodeClick: ((nodeId: string) => void) | null = null;
  onEdgeClick: ((edgeId: string) => void) | null = null;
  onBackgroundClick: (() => void) | null = null;

  constructor(containerId: string, options: D3RendererOptions = {}) {
    const el = document.getElementById(containerId) || document.querySelector(containerId);
    if (!el) throw new Error(`Container not found: ${containerId}`);
    
    this.container = d3.select(el as HTMLElement);
    this.flowAnimationEnabled = options.enableFlowAnimation ?? false;
    
    this.options = {
      width: options.width || 800,
      height: options.height || 600,
      colors: {
        node: options.colors?.node || '#6366f1',
        edge: options.colors?.edge || '#94a3b8',
        text: options.colors?.text || '#e2e8f0',
        highlight: options.colors?.highlight || '#fbbf24',
        flow: options.colors?.flow || '#fbbf24',
        stroke: options.colors?.stroke || '#1e293b',
        ...options.colors
      },
      forces: {
        linkDistance: options.forces?.linkDistance || 120,
        chargeStrength: options.forces?.chargeStrength || -400,
        collisionRadius: options.forces?.collisionRadius || 35,
        ...options.forces
      },
      nodeRadius: options.nodeRadius || 22,
      enableDrag: options.enableDrag ?? true,
      enableFlowAnimation: options.enableFlowAnimation ?? false
    };
  }

  private getNodeColor(node: IGraphNode): string {
    const { colors } = this.options;
    if (typeof colors.node === 'function') {
      return colors.node(node);
    }
    return colors.node as string;
  }

  render(graph: IGraph) {
    this.destroy();

    const { width, height, colors, forces, nodeRadius, enableDrag } = this.options;

    // Create SVG
    this.svg = this.container
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height]);

    // Groups for layering
    const linkGroup = this.svg.append('g').attr('class', 'links');
    const flowGroup = this.svg.append('g').attr('class', 'flows');
    const nodeGroup = this.svg.append('g').attr('class', 'nodes');

    // Prepare data
    const graphNodes = graph.getNodes();
    const graphEdges = graph.getEdges();

    this.nodes = graphNodes.map(n => ({
      id: n.id,
      data: n,
      x: Math.random() * width * 0.8 + width * 0.1,
      y: Math.random() * height * 0.8 + height * 0.1
    }));

    this.links = graphEdges.map(e => ({
      id: e.id,
      source: e.sourceId,
      target: e.targetId,
      data: e
    }));

    // Create simulation
    this.simulation = d3.forceSimulation<D3SimNode>(this.nodes)
      .force('link', d3.forceLink<D3SimNode, D3SimLink>(this.links)
        .id(d => d.id)
        .distance(forces.linkDistance))
      .force('charge', d3.forceManyBody().strength(forces.chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(forces.collisionRadius));

    // Arrow marker
    const defs = this.svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', colors.edge);

    // Render links
    const link = linkGroup.selectAll('line')
      .data(this.links, (d: any) => d.id)
      .join('line')
      .attr('stroke', colors.edge)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)')
      .attr('cursor', 'pointer')
      .on('click', (e, d) => {
        e.stopPropagation();
        if (this.onEdgeClick) this.onEdgeClick(d.id);
      });

    // Render nodes
    const node = nodeGroup.selectAll('g.node')
      .data(this.nodes, (d: any) => d.id)
      .join('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer');

    // Node circle
    node.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', d => this.getNodeColor(d.data))
      .attr('stroke', colors.stroke)
      .attr('stroke-width', 2);

    // Selection ring
    node.append('circle')
      .attr('class', 'selection-ring')
      .attr('r', nodeRadius + 4)
      .attr('fill', 'none')
      .attr('stroke', colors.highlight)
      .attr('stroke-width', 3)
      .attr('opacity', 0);

    // Label
    node.append('text')
      .attr('dy', nodeRadius + 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', colors.text)
      .text(d => d.data.properties?.label || d.id);

    // Value label (for dynamic updates)
    node.append('text')
      .attr('class', 'value-label')
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', colors.text);

    // Drag behavior
    if (enableDrag) {
      node.call(d3.drag<SVGGElement, D3SimNode>()
        .on('start', (e, d) => {
          if (!e.active) this.simulation!.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (e, d) => {
          d.fx = e.x;
          d.fy = e.y;
        })
        .on('end', (e, d) => {
          if (!e.active) this.simulation!.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));
    }

    // Click handlers
    node.on('click', (e, d) => {
      e.stopPropagation();
      this.selectNode(d.id);
      if (this.onNodeClick) this.onNodeClick(d.id);
    });

    // Background click
    this.svg.on('click', () => {
      this.clearSelection();
      if (this.onBackgroundClick) this.onBackgroundClick();
    });

    // Tick handler
    this.simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => (d.source as D3SimNode).x!)
        .attr('y1', (d: any) => (d.source as D3SimNode).y!)
        .attr('x2', (d: any) => (d.target as D3SimNode).x!)
        .attr('y2', (d: any) => (d.target as D3SimNode).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  }

  selectNode(nodeId: string) {
    this.selectedNodeId = nodeId;
    if (!this.svg) return;
    
    this.svg.selectAll('g.node')
      .select('circle.selection-ring')
      .attr('opacity', (d: any) => d.id === nodeId ? 1 : 0);
  }

  clearSelection() {
    this.selectedNodeId = null;
    if (!this.svg) return;
    
    this.svg.selectAll('g.node')
      .select('circle.selection-ring')
      .attr('opacity', 0);
  }

  updateNodeValues(values: Map<string, string | number>) {
    if (!this.svg) return;
    
    this.svg.selectAll('g.node')
      .select('text.value-label')
      .text((d: any) => {
        const val = values.get(d.id);
        return val !== undefined ? String(val) : '';
      });
  }

  updateFlows(flowData: Array<{ source: string; target: string; value: number }>, timeStep: number) {
    if (!this.flowAnimationEnabled || !this.svg) return;

    const flowGroup = this.svg.select('g.flows');
    const nodes = this.nodes;
    const { colors } = this.options;

    const activeFlows = flowData.filter(d => d.value > 0.01);

    const flows = flowGroup.selectAll('circle.flow-particle')
      .data(activeFlows, (d: any) => `${d.source}-${d.target}-${timeStep}`);

    flows.exit().remove();

    flows.enter()
      .append('circle')
      .attr('class', 'flow-particle')
      .attr('r', d => Math.max(3, Math.min(8, Math.sqrt(d.value) * 4)))
      .attr('fill', colors.flow)
      .attr('opacity', 0.9)
      .attr('cx', d => {
        const n = nodes.find(n => n.id === d.source);
        return n ? n.x || 0 : 0;
      })
      .attr('cy', d => {
        const n = nodes.find(n => n.id === d.source);
        return n ? n.y || 0 : 0;
      })
      .transition()
      .duration(800)
      .ease(d3.easeLinear)
      .attr('cx', d => {
        const n = nodes.find(n => n.id === d.target);
        return n ? n.x || 0 : 0;
      })
      .attr('cy', d => {
        const n = nodes.find(n => n.id === d.target);
        return n ? n.y || 0 : 0;
      })
      .remove();
  }

  resize(width: number, height: number) {
    this.options.width = width;
    this.options.height = height;
    
    if (this.svg) {
      this.svg.attr('viewBox', [0, 0, width, height]);
    }
    
    if (this.simulation) {
      this.simulation.force('center', d3.forceCenter(width / 2, height / 2));
      this.simulation.alpha(0.3).restart();
    }
  }

  destroy() {
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = null;
    }
    if (this.svg) {
      this.svg.remove();
      this.svg = null;
    }
    this.nodes = [];
    this.links = [];
  }

  /**
   * Incremental update: add/remove nodes and edges without destroying the SVG.
   * Preserves current simulation state and positions.
   */
  update(graph: IGraph) {
    if (!this.svg || !this.simulation) {
      this.render(graph);
      return;
    }

    const { colors, nodeRadius, enableDrag } = this.options;

    // Get current graph state
    const graphNodes = graph.getNodes();
    const graphEdges = graph.getEdges();

    // Create ID sets for diffing
    const currentNodeIds = new Set(this.nodes.map(n => n.id));
    const newNodeIds = new Set(graphNodes.map(n => n.id));
    const currentLinkIds = new Set(this.links.map(l => l.id));
    const newLinkIds = new Set(graphEdges.map(e => e.id));

    // Remove nodes that no longer exist
    this.nodes = this.nodes.filter(n => newNodeIds.has(n.id));

    // Add new nodes
    for (const node of graphNodes) {
      if (!currentNodeIds.has(node.id)) {
        this.nodes.push({
          id: node.id,
          data: node,
          x: this.options.width / 2 + (Math.random() - 0.5) * 100,
          y: this.options.height / 2 + (Math.random() - 0.5) * 100
        });
      }
    }

    // Remove links that no longer exist
    this.links = this.links.filter(l => newLinkIds.has(l.id));

    // Add new links
    for (const edge of graphEdges) {
      if (!currentLinkIds.has(edge.id)) {
        this.links.push({
          id: edge.id,
          source: edge.sourceId,
          target: edge.targetId,
          data: edge
        });
      }
    }

    // Update simulation data
    this.simulation.nodes(this.nodes);
    (this.simulation.force('link') as d3.ForceLink<D3SimNode, D3SimLink>).links(this.links);

    // Get groups
    const linkGroup = this.svg.select('g.links');
    const nodeGroup = this.svg.select('g.nodes');

    // Update links with D3 join
    const link = linkGroup.selectAll<SVGLineElement, D3SimLink>('line')
      .data(this.links, (d: any) => d.id);

    link.exit().remove();

    link.enter()
      .append('line')
      .attr('stroke', colors.edge)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)')
      .attr('cursor', 'pointer')
      .on('click', (e, d) => {
        e.stopPropagation();
        if (this.onEdgeClick) this.onEdgeClick(d.id);
      });

    // Update nodes with D3 join
    const node = nodeGroup.selectAll<SVGGElement, D3SimNode>('g.node')
      .data(this.nodes, (d: any) => d.id);

    const exiting = node.exit();
    exiting.remove();

    const entering = node.enter()
      .append('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer');

    entering.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', d => this.getNodeColor(d.data))
      .attr('stroke', colors.stroke)
      .attr('stroke-width', 2);

    entering.append('circle')
      .attr('class', 'selection-ring')
      .attr('r', nodeRadius + 4)
      .attr('fill', 'none')
      .attr('stroke', colors.highlight)
      .attr('stroke-width', 3)
      .attr('opacity', 0);

    entering.append('text')
      .attr('dy', nodeRadius + 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', colors.text)
      .text(d => d.data.properties?.label || d.id);

    entering.append('text')
      .attr('class', 'value-label')
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', colors.text);

    if (enableDrag) {
      entering.call(d3.drag<SVGGElement, D3SimNode>()
        .on('start', (e, d) => {
          if (!e.active) this.simulation!.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (e, d) => {
          d.fx = e.x;
          d.fy = e.y;
        })
        .on('end', (e, d) => {
          if (!e.active) this.simulation!.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));
    }

    entering.on('click', (e, d) => {
      e.stopPropagation();
      this.selectNode(d.id);
      if (this.onNodeClick) this.onNodeClick(d.id);
    });

    // Reheat simulation if structure changed
    if (entering.size() > 0 || exiting.size() > 0) {
      this.simulation.alpha(0.3).restart();
    }
  }

  getSelectedNodeId(): string | null {
    return this.selectedNodeId;
  }

  setFlowAnimationEnabled(enabled: boolean) {
    this.flowAnimationEnabled = enabled;
  }
}
