import { useGraph } from '../hooks/useGraph';
import type { GraphData, GraphNode } from '../types/graph';

interface Props {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
}

export const Graph = ({ data, onNodeClick }: Props) => {
  const svgRef = useGraph(data, onNodeClick);

  return (
    <div className="graph-container">
      <svg ref={svgRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};
