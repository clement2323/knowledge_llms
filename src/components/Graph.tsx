import { useGraph } from '../hooks/useGraph';
import type { GraphData, GraphNode } from '../types/graph';

interface Props {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  selectedNodeId?: string | null;
}

export const Graph = ({ data, onNodeClick, selectedNodeId }: Props) => {
  const svgRef = useGraph(data, onNodeClick, selectedNodeId);

  return (
    <div className="graph-container">
      <svg ref={svgRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};
