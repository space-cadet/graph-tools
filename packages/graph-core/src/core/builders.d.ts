import { GraphologyAdapter } from './GraphologyAdapter';
export declare function empty(nodeCount: number): GraphologyAdapter;
export declare function complete(nodeCount: number): GraphologyAdapter;
export declare function path(nodeCount: number): GraphologyAdapter;
export declare function random(nodeCount: number, probability: number): GraphologyAdapter;
export declare function randomSparse(nodeCount: number, probability: number): GraphologyAdapter;
export declare function lattice1D(length: number): GraphologyAdapter;
export declare function lattice2D(width: number, height: number): GraphologyAdapter;
export declare function lattice1DPeriodic(length: number): GraphologyAdapter;
export declare function lattice2DPeriodic(width: number, height: number): GraphologyAdapter;
export declare function triangularLattice(width: number, height: number): GraphologyAdapter;
//# sourceMappingURL=builders.d.ts.map