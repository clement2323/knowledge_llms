import { useState, useMemo, useCallback } from 'react';
import { Graph } from './components/Graph';
import { NodePanel } from './components/NodePanel';
import { EdgePanel } from './components/EdgePanel';
import { GraphFilters, CATEGORIES } from './components/GraphFilters';
import { SearchBar } from './components/SearchBar';
import graphData from './data/graph-data.json';
import type { GraphNode, GraphData, CategoryId, SimulationLink, SimulationNode, ResolvedEdge } from './types/graph';
import './App.css';

// Type assertion for imported JSON
const typedGraphData = graphData as GraphData;

function App() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<ResolvedEdge | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<CategoryId>>(
    new Set(CATEGORIES.map(c => c.id))
  );

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const handleEdgeClick = useCallback((link: SimulationLink) => {
    const sourceNode = typeof link.source === 'string'
      ? typedGraphData.nodes.find(n => n.id === link.source)
      : typedGraphData.nodes.find(n => n.id === (link.source as SimulationNode).id);
    const targetNode = typeof link.target === 'string'
      ? typedGraphData.nodes.find(n => n.id === link.target)
      : typedGraphData.nodes.find(n => n.id === (link.target as SimulationNode).id);

    if (sourceNode && targetNode) {
      setSelectedEdge({
        sourceNode,
        targetNode,
        type: link.type,
        description: link.description,
      });
      setSelectedNode(null);
    }
  }, []);

  const handleClosePanel = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
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

  // Derive selectedEdge info for Graph component
  const selectedEdgeIds = useMemo(() => {
    if (!selectedEdge) return null;
    return {
      sourceId: selectedEdge.sourceNode.id,
      targetId: selectedEdge.targetNode.id,
    };
  }, [selectedEdge]);

  // Filter graph data based on search and categories
  const filteredGraphData = useMemo(() => {
    let filteredNodes = typedGraphData.nodes.filter(node =>
      activeCategories.has(node.category)
    );

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredNodes = filteredNodes.filter(node =>
        node.name.toLowerCase().includes(query) ||
        node.description.toLowerCase().includes(query) ||
        node.technical?.toLowerCase().includes(query) ||
        node.magnitudes?.toLowerCase().includes(query) ||
        node.tradeoffs?.toLowerCase().includes(query)
      );
    }

    const nodeIds = new Set(filteredNodes.map(n => n.id));

    const filteredLinks = typedGraphData.links.filter(link =>
      nodeIds.has(link.source) &&
      nodeIds.has(link.target)
    );

    return {
      ...typedGraphData,
      nodes: filteredNodes,
      links: filteredLinks,
    };
  }, [activeCategories, searchQuery]);

  // Get search results for dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return typedGraphData.nodes
      .filter(node =>
        node.name.toLowerCase().includes(query) ||
        node.description.toLowerCase().includes(query)
      )
      .slice(0, 8); // Limit to 8 results
  }, [searchQuery]);

  return (
    <div className="app">
      <SearchBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        results={searchResults}
        onResultClick={handleNodeClick}
      />
      <GraphFilters
        activeCategories={activeCategories}
        onCategoryChange={setActiveCategories}
      />
      <Graph
        data={filteredGraphData}
        onNodeClick={handleNodeClick}
        selectedNodeId={selectedNode?.id}
        onEdgeClick={handleEdgeClick}
        selectedEdge={selectedEdgeIds}
      />
      <NodePanel
        node={selectedNode}
        onClose={handleClosePanel}
        relatedNodes={selectedNode ? getRelatedNodes(selectedNode.id) : []}
        onNodeClick={handleNodeClick}
        categoryLabel={categoryInfo.label}
        categoryColor={categoryInfo.color}
      />
      <EdgePanel
        edge={selectedEdge}
        onClose={handleClosePanel}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}

export default App;
