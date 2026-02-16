import { useState, useMemo } from 'react';
import { Graph } from './components/Graph';
import { NodePanel } from './components/NodePanel';
import { GraphFilters, CATEGORIES } from './components/GraphFilters';
import { SearchBar } from './components/SearchBar';
import graphData from './data/graph-data.json';
import type { GraphNode, GraphData, CategoryId } from './types/graph';
import './App.css';

// Type assertion for imported JSON
const typedGraphData = graphData as GraphData;

function App() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<CategoryId>>(
    new Set(CATEGORIES.map(c => c.id))
  );

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
      />
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
