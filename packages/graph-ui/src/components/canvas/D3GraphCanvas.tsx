/**
 * D3GraphCanvas - React component for D3.js force-directed graph rendering
 * Ports features from econ-sim's NetworkVisualization
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { IGraph, IGraphNode, IGraphEdge } from '@space-cadet/graph-core';
import { IRenderGraph, IRenderNode } from '../../types/rendering';
import { D3LayoutEngine, ID3LayoutOptions } from '../../layout/engines/d3/D3LayoutEngine';

interface FlowData {
  source: string;
  target: string;
  value: number;
}

interface D3GraphCanvasProps {
  graph: IGraph;
  width?: number;
  height?: number;
  options?: ID3LayoutOptions;
  colors?: {
    node?: string | ((node: IGraphNode) => string);
    edge?: string;
    text?: string;
    highlight?: string;
    flow?: string;
  };
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
  enableFlowAnimation?: boolean;
  enableEdgeCreation?: boolean;
  enableDrag?: boolean;
  className?: string;
}

interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  data: IGraphNode;
  renderData?: IRenderNode;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  id: string;
  data: IGraphEdge;
}

export const D3GraphCanvas: React.FC<D3GraphCanvasProps> = ({
  graph,
  width = 800,
  height = 600,
  options = {},
  colors = {},
  onNodeClick,
  onEdgeClick,
  enableFlowAnimation = false,
  enableEdgeCreation = false,
  enableDrag = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null);
  const simulationRef = useRef<d3.Simulation<D3Node, D3Link> | null>(null);
  const nodesRef = useRef<D3Node[]>([]);
  const linksRef = useRef<D3Link[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [edgeSourceId, setEdgeSourceId] = useState<string | null>(null);
  const ghostLineRef = useRef<d3.Selection<SVGLineElement, unknown, null, undefined> | null>(null);

  // Initialize layout engine
  const layoutEngine = new D3LayoutEngine();

  // Get color functions
  const getNodeColor = useCallback((node: IGraphNode) => {
    if (typeof colors.node === 'function') {
      return colors.node(node);
    }
    return colors.node || '#6366f1';
  }, [colors.node]);

  const getEdgeColor = useCallback(() => colors.edge || '#94a3b8', [colors.edge]);
  const getTextColor = useCallback(() => colors.text || '#e2e8f0', [colors.text]);
  const getHighlightColor = useCallback(() => colors.highlight || '#fbbf24', [colors.highlight]);
  const getFlowColor = useCallback(() => colors.flow || '#fbbf24', [colors.flow]);

  // Initialize or update visualization
  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous
    d3.select(containerRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height]);

    svgRef.current = svg;

    // Create groups for layering
    const linkGroup = svg.append('g').attr('class', 'links');
    const flowGroup = svg.append('g').attr('class', 'flows');
    const nodeGroup = svg.append('g').attr('class', 'nodes');

    // Prepare data
    const graphNodes = graph.getNodes();
    const graphEdges = graph.getEdges();

    nodesRef.current = graphNodes.map(n => ({
      id: n.id,
      data: n,
      x: Math.random() * width * 0.8 + width * 0.1,
      y: Math.random() * height * 0.8 + height * 0.1
    }));

    linksRef.current = graphEdges.map(e => ({
      id: e.id,
      source: e.sourceId,
      target: e.targetId,
      data: e
    }));

    // Create simulation
    const simulation = d3.forceSimulation<D3Node>(nodesRef.current)
      .force('link', d3.forceLink<D3Node, D3Link>(linksRef.current)
        .id(d => d.id)
        .distance(options.linkDistance || 120))
      .force('charge', d3.forceManyBody().strength(options.chargeStrength || -400))
      .force('center', d3.forceCenter(options.centerX || width / 2, options.centerY || height / 2))
      .force('collision', d3.forceCollide().radius(options.collisionRadius || 35));

    simulationRef.current = simulation;

    // Create arrow marker
    const defs = svg.append('defs');
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
      .attr('fill', getEdgeColor());

    // Render links
    const link = linkGroup.selectAll('line')
      .data(linksRef.current, (d: any) => d.id)
      .join('line')
      .attr('stroke', getEdgeColor())
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)')
      .attr('cursor', 'pointer')
      .on('click', (e, d) => {
        e.stopPropagation();
        if (onEdgeClick) onEdgeClick(d.id);
      });

    // Render nodes
    const node = nodeGroup.selectAll('g.node')
      .data(nodesRef.current, (d: any) => d.id)
      .join('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, D3Node>()
        .on('start', (e, d) => {
          if (!enableDrag) return;
          if (!e.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (e, d) => {
          if (!enableDrag) return;
          d.fx = e.x;
          d.fy = e.y;
        })
        .on('end', (e, d) => {
          if (!enableDrag) return;
          if (!e.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Node circles
    node.append('circle')
      .attr('r', 22)
      .attr('fill', d => getNodeColor(d.data))
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 2);

    // Selection ring
    node.append('circle')
      .attr('class', 'selection-ring')
      .attr('r', 26)
      .attr('fill', 'none')
      .attr('stroke', getHighlightColor())
      .attr('stroke-width', 3)
      .attr('opacity', 0);

    // Node labels
    node.append('text')
      .attr('dy', 38)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', getTextColor())
      .text(d => d.data.properties?.label || d.id);

    // Stock/value indicator
    node.append('text')
      .attr('class', 'value-label')
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', getTextColor());

    // Node click handler
    node.on('click', (e, d) => {
      e.stopPropagation();
      
      if (enableEdgeCreation && edgeSourceId === null) {
        setEdgeSourceId(d.id);
        // Highlight source node
        node.select('circle:first-child')
          .attr('stroke', (n: any) => n.id === d.id ? getHighlightColor() : '#1e293b')
          .attr('stroke-width', (n: any) => n.id === d.id ? 4 : 2);
      } else if (enableEdgeCreation && edgeSourceId !== null) {
        if (edgeSourceId !== d.id) {
          // Create edge logic would go here
          // For now, just notify
          if (onEdgeClick) onEdgeClick(`${edgeSourceId}-${d.id}`);
        }
        setEdgeSourceId(null);
        // Reset strokes
        node.select('circle:first-child')
          .attr('stroke', '#1e293b')
          .attr('stroke-width', 2);
      } else {
        setSelectedNodeId(d.id);
        if (onNodeClick) onNodeClick(d.id);
      }
    });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => (d.source as D3Node).x!)
        .attr('y1', (d: any) => (d.source as D3Node).y!)
        .attr('x2', (d: any) => (d.target as D3Node).x!)
        .attr('y2', (d: any) => (d.target as D3Node).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
      svg.remove();
    };
  }, [graph, width, height, options, enableDrag, enableEdgeCreation, getNodeColor, getEdgeColor, getTextColor, getHighlightColor, onNodeClick, onEdgeClick]);

  // Update selection ring
  useEffect(() => {
    if (!svgRef.current) return;
    svgRef.current.selectAll('g.node')
      .select('circle.selection-ring')
      .attr('opacity', (d: any) => d.id === selectedNodeId ? 1 : 0);
  }, [selectedNodeId]);

  // Update flow animation
  const updateFlows = useCallback((flowData: FlowData[], timeStep: number) => {
    if (!enableFlowAnimation || !svgRef.current) return;

    const flowGroup = svgRef.current.select('g.flows');
    const nodes = nodesRef.current;

    const activeFlows = flowData.filter(d => d.value > 0.01);

    const flows = flowGroup.selectAll('circle.flow-particle')
      .data(activeFlows, (d: any) => `${d.source}-${d.target}-${timeStep}`);

    flows.exit().remove();

    flows.enter()
      .append('circle')
      .attr('class', 'flow-particle')
      .attr('r', d => Math.max(3, Math.min(8, Math.sqrt(d.value) * 4)))
      .attr('fill', getFlowColor())
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
  }, [enableFlowAnimation, getFlowColor]);

  // Update node values
  const updateNodeValues = useCallback((values: Map<string, number | string>) => {
    if (!svgRef.current) return;
    
    svgRef.current.selectAll('g.node')
      .select('text.value-label')
      .text((d: any) => {
        const val = values.get(d.id);
        return val !== undefined ? String(val) : '';
      });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full bg-gray-50 rounded-lg shadow-inner ${className}`}
      style={{ minHeight: '400px', width, height }}
    />
  );
};

export type { FlowData, D3GraphCanvasProps };
