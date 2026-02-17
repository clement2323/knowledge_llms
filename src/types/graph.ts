export interface GraphNode {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  technical?: string;
  magnitudes?: string;
  tradeoffs?: string;
  references?: string[];
  sourceLines?: number[];
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'depends_on' | 'optimizes' | 'trades_off' | 'impacts' | 'related_to';
  description?: string;
}

export interface ResolvedEdge {
  sourceNode: GraphNode;
  targetNode: GraphNode;
  type: GraphLink['type'];
  description?: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
}

export type CategoryId =
  | 'architecture'
  | 'inference'
  | 'memory'
  | 'training'
  | 'parallelism'
  | 'observability'
  | 'retrieval';

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  categories: Category[];
}

// D3-specific types for simulation
export interface SimulationNode extends GraphNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface SimulationLink {
  source: string | SimulationNode;
  target: string | SimulationNode;
  type: GraphLink['type'];
  description?: string;
}
