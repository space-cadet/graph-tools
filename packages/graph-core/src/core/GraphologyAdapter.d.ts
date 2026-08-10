import { Matrix } from 'mathjs';
import Graphology from 'graphology';
import { IGraph, IGraphNode, IGraphEdge, IGraphElement, EdgeWeightFunction, ITraversalOptions, IGraphMetadata } from './types';
export declare class GraphologyAdapter implements IGraph {
    private graph;
    private metadata?;
    readonly id: string;
    constructor(id?: string);
    getGraphologyInstance(): Graphology;
    setGraph(graph: Graphology): IGraph;
    get isDirected(): boolean;
    get nodeCount(): number;
    get edgeCount(): number;
    addNode(node: IGraphNode): IGraph;
    removeNode(nodeId: string): IGraph;
    addEdge(edge: IGraphEdge): IGraph;
    removeEdge(edgeId: string): IGraph;
    getNode(nodeId: string): IGraphNode | undefined;
    getEdge(edgeId: string): IGraphEdge | undefined;
    getNodes(): readonly IGraphNode[];
    getEdges(): readonly IGraphEdge[];
    getAdjacentNodes(nodeId: string, _options?: ITraversalOptions): readonly IGraphNode[];
    getConnectedEdges(nodeId: string, _options?: ITraversalOptions): readonly IGraphEdge[];
    findPath(fromId: string, toId: string, _options?: ITraversalOptions): readonly IGraphElement[];
    toAdjacencyMatrix(weightFn?: EdgeWeightFunction): Matrix;
    toLaplacianMatrix(weightFn?: EdgeWeightFunction): Matrix;
    hasNode(nodeId: string): boolean;
    hasEdge(edgeId: string): boolean;
    areNodesAdjacent(sourceId: string, targetId: string, _options?: ITraversalOptions): boolean;
    getNodeDegree(nodeId: string, _options?: ITraversalOptions): number;
    clone(): IGraph;
    clear(): IGraph;
    setMetadata(metadata: IGraphMetadata): IGraph;
    getMetadata(): IGraphMetadata | undefined;
    /**
     * Compute the spectral radius (largest eigenvalue magnitude) of the adjacency matrix
     * using the power iteration method. Useful for stability analysis.
     */
    spectralRadius(weightFn?: EdgeWeightFunction): number;
    private extractProperties;
}
//# sourceMappingURL=GraphologyAdapter.d.ts.map