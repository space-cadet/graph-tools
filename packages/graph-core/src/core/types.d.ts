/**
 * Core type definitions for the graph-core package
 */
import { Matrix } from 'mathjs';
/**
 * Generic type for graph property values
 */
export type PropertyValue = string | number | boolean | object | null;
/**
 * Interface for property maps on graph elements
 */
export interface IPropertyMap {
    readonly [key: string]: PropertyValue;
}
/**
 * Abstract lattice position identifiers (NOT pixel coordinates)
 */
export interface ILatticePosition {
    readonly i: number;
    readonly j: number;
    readonly k?: number;
}
/**
 * Hierarchical position in tree-like structures
 */
export interface IHierarchyPosition {
    readonly level: number;
    readonly index: number;
}
/**
 * Logical identifiers for abstract positioning (NO visual coordinates)
 */
export interface ILogicalIdentifiers {
    readonly latticePosition?: ILatticePosition;
    readonly hierarchyPosition?: IHierarchyPosition;
    readonly networkId?: string;
}
/**
 * Mathematical topology types
 */
export type GraphTopology = 'planar' | 'torus' | 'sphere' | 'hyperbolic' | 'tree';
/**
 * Graph metadata describing mathematical properties (NO visual properties)
 */
export interface IGraphMetadata {
    readonly type: string;
    readonly topology: GraphTopology;
    readonly dimensions: number;
    readonly parameters: IPropertyMap;
    readonly isFinite: boolean;
    readonly isPeriodic?: boolean;
}
/**
 * Base interface for all graph elements (nodes, edges, faces)
 */
export interface IGraphElement {
    readonly id: string;
    readonly properties: IPropertyMap;
}
/**
 * Interface for a node in the graph
 */
export interface IGraphNode extends IGraphElement {
    readonly type: string;
}
/**
 * Interface for an edge in the graph
 */
export interface IGraphEdge extends IGraphElement {
    readonly sourceId: string;
    readonly targetId: string;
    readonly directed: boolean;
    readonly type: string;
}
/**
 * Type-safe node interface with constrained type parameter
 */
export interface ITypedNode<T extends string> extends IGraphNode {
    readonly type: T;
}
/**
 * Type-safe edge interface with constrained type parameter
 */
export interface ITypedEdge<T extends string> extends IGraphEdge {
    readonly type: T;
}
/**
 * Interface for 2D faces in the graph
 */
export interface IFace extends IGraphElement {
    readonly edgeIds: readonly string[];
    readonly nodeIds: readonly string[];
}
/**
 * Interface for n-dimensional simplices
 */
export interface ISimplex extends IGraphElement {
    readonly dimension: number;
    readonly boundaryIds: readonly string[];
    readonly coFaceIds: readonly string[];
}
/**
 * Interface for subgraphs with ordered elements
 */
export interface IOrderedSubgraph extends IGraphElement {
    readonly nodeIds: readonly string[];
    readonly edgeIds: readonly string[];
    readonly order: ReadonlyMap<string, number>;
}
/**
 * Represents a match of a pattern in the graph
 */
export interface IMatch {
    readonly nodeMapping: ReadonlyMap<string, string>;
    readonly edgeMapping: ReadonlyMap<string, string>;
    readonly faceMapping?: ReadonlyMap<string, string>;
    readonly context: IPropertyMap;
}
/**
 * Defines a graph rewrite rule
 */
export interface IRewritePattern {
    readonly name: string;
    readonly fromGraph: IGraph;
    readonly toGraph: IGraph;
    readonly constraints?: (match: IMatch) => boolean;
    readonly invariants?: (before: IGraph, after: IGraph, match: IMatch) => boolean;
}
/**
 * Options for graph traversal operations
 */
export interface ITraversalOptions {
    /** Maximum depth to traverse (undefined for no limit) */
    maxDepth?: number;
    /** Whether to follow directed edges only in their direction */
    respectEdgeDirection?: boolean;
    /** Custom filter function for nodes */
    nodeFilter?: (node: IGraphNode) => boolean;
    /** Custom filter function for edges */
    edgeFilter?: (edge: IGraphEdge) => boolean;
}
/**
 * Function type for calculating edge weights
 */
export type EdgeWeightFunction = (edge: IGraphEdge) => number;
/**
 * Strategy for applying multiple rewrite rules
 */
export interface IRewriteStrategy {
    maxSteps?: number;
    priority?: (pattern: IRewritePattern) => number;
    termination?: (graph: IGraph) => boolean;
}
/**
 * Core interface for basic graph operations
 */
export interface IGraph {
    /**
     * Unique identifier for this graph instance
     */
    readonly id: string;
    /**
     * Whether the graph is directed
     */
    readonly isDirected: boolean;
    /**
     * The number of nodes in the graph
     */
    readonly nodeCount: number;
    /**
     * The number of edges in the graph
     */
    readonly edgeCount: number;
    addNode(node: IGraphNode): IGraph;
    removeNode(nodeId: string): IGraph;
    addEdge(edge: IGraphEdge): IGraph;
    removeEdge(edgeId: string): IGraph;
    getNode(nodeId: string): IGraphNode | undefined;
    getEdge(edgeId: string): IGraphEdge | undefined;
    getNodes(): readonly IGraphNode[];
    getEdges(): readonly IGraphEdge[];
    getAdjacentNodes(nodeId: string, options?: ITraversalOptions): readonly IGraphNode[];
    getConnectedEdges(nodeId: string, options?: ITraversalOptions): readonly IGraphEdge[];
    findPath(fromId: string, toId: string, options?: ITraversalOptions): readonly IGraphElement[];
    toAdjacencyMatrix(weightFn?: EdgeWeightFunction): Matrix;
    toLaplacianMatrix(weightFn?: EdgeWeightFunction): Matrix;
    setMetadata(metadata: IGraphMetadata): IGraph;
    getMetadata(): IGraphMetadata | undefined;
    hasNode(nodeId: string): boolean;
    hasEdge(edgeId: string): boolean;
    areNodesAdjacent(sourceId: string, targetId: string, options?: ITraversalOptions): boolean;
    getNodeDegree(nodeId: string, options?: ITraversalOptions): number;
    clone(): IGraph;
    clear(): IGraph;
}
/**
 * Interface for type-safe graph operations
 */
export interface ITypedGraph<NodeType extends string, EdgeType extends string> extends IGraph {
    addTypedNode(node: ITypedNode<NodeType>): ITypedGraph<NodeType, EdgeType>;
    addTypedEdge(edge: ITypedEdge<EdgeType>): ITypedGraph<NodeType, EdgeType>;
    getTypedNode(nodeId: string): ITypedNode<NodeType> | undefined;
    getTypedEdge(edgeId: string): ITypedEdge<EdgeType> | undefined;
    getNodesOfType(type: NodeType): readonly ITypedNode<NodeType>[];
    getEdgesOfType(type: EdgeType): readonly ITypedEdge<EdgeType>[];
}
/**
 * Interface for graphs supporting ordered substructures
 */
export interface IOrderedGraph extends IGraph {
    createOrderedSubgraph(elements: IGraphElement[]): IOrderedSubgraph;
    getElementOrder(subgraphId: string, elementId: string): number | undefined;
    reorderElements(subgraphId: string, newOrder: string[]): IOrderedGraph;
    getOrderedSubgraphs(): readonly IOrderedSubgraph[];
    getElementsByOrder(subgraphId: string): readonly IGraphElement[];
}
/**
 * Interface for graphs with higher-dimensional structures
 */
export interface ISimplicialGraph extends IGraph {
    readonly faceCount: number;
    readonly simplexCount: number;
    addFace(face: IFace): ISimplicialGraph;
    removeFace(faceId: string): ISimplicialGraph;
    getFace(faceId: string): IFace | undefined;
    getFaces(): readonly IFace[];
    addSimplex(simplex: ISimplex): ISimplicialGraph;
    removeSimplex(simplexId: string): ISimplicialGraph;
    getSimplex(simplexId: string): ISimplex | undefined;
    getSimplices(dimension?: number): readonly ISimplex[];
    getFacesByVertex(vertexId: string): readonly IFace[];
    getFacesByEdge(edgeId: string): readonly IFace[];
    getSimplicesByBoundary(boundaryId: string): readonly ISimplex[];
    getSimplexBoundary(simplexId: string): readonly ISimplex[];
}
/**
 * Interface for graphs supporting rewrite rules
 */
export interface IRewriteableGraph extends IGraph {
    findMatches(pattern: IRewritePattern): readonly IMatch[];
    applyRewrite(pattern: IRewritePattern, match: IMatch): IRewriteableGraph;
    applyRewrites(patterns: IRewritePattern[], strategy?: IRewriteStrategy): IRewriteableGraph;
    validateRewrite(pattern: IRewritePattern, match: IMatch): boolean;
}
/**
 * Combined interface supporting all graph features
 */
export interface IExtendedGraph<NodeType extends string, EdgeType extends string> extends ITypedGraph<NodeType, EdgeType>, IOrderedGraph, ISimplicialGraph, IRewriteableGraph {
}
//# sourceMappingURL=types.d.ts.map