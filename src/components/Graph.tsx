import { useGraph } from '../hooks/useGraph';
import type { GraphData, GraphNode, SimulationLink } from '../types/graph';

interface Props {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  selectedNodeId?: string | null;
  onEdgeClick?: (link: SimulationLink) => void;
  selectedEdge?: { sourceId: string; targetId: string } | null;
}

export const Graph = ({ data, onNodeClick, selectedNodeId, onEdgeClick, selectedEdge }: Props) => {
  const svgRef = useGraph(data, onNodeClick, selectedNodeId, onEdgeClick, selectedEdge);

  return (
    <div className="graph-container">
      <svg ref={svgRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};
