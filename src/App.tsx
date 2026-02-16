import { useState } from 'react';
import { Graph } from './components/Graph';
import { NodePanel } from './components/NodePanel';
import graphData from './data/graph-data.json';
import type { GraphNode, GraphData } from './types/graph';
import './App.css';

// Type assertion for imported JSON
const typedGraphData = graphData as GraphData;

function App() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const handleClosePanel = () => {
    setSelectedNode(null);
  };

  const getRelatedNodes = (nodeId: string): GraphNode[] => {
    const linkIds = typedGraphData.links
      .filter(l => l.source === nodeId || l.target === nodeId)
      .map(l => (l.source === nodeId ? l.target : l.source));

    return typedGraphData.nodes.filter(n => linkIds.includes(n.id));
  };

  const getCategoryInfo = (categoryId: string) => {
    const category = typedGraphData.categories.find(c => c.id === categoryId);
    return {
      label: category?.label || categoryId,
      color: category?.color || '#999',
    };
  };

  const categoryInfo = selectedNode
    ? getCategoryInfo(selectedNode.category)
    : { label: '', color: '' };

  return (
    <div className="app">
      <Graph data={typedGraphData} onNodeClick={handleNodeClick} />
      <NodePanel
        node={selectedNode}
        onClose={handleClosePanel}
        relatedNodes={selectedNode ? getRelatedNodes(selectedNode.id) : []}
        onNodeClick={handleNodeClick}
        categoryLabel={categoryInfo.label}
        categoryColor={categoryInfo.color}
      />
    </div>
  );
}

export default App;
