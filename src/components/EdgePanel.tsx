import type { ResolvedEdge, GraphNode } from '../types/graph';

interface Props {
  edge: ResolvedEdge | null;
  onClose: () => void;
  onNodeClick: (node: GraphNode) => void;
}

const LINK_TYPE_COLORS: Record<string, string> = {
  depends_on: '#ef4444',
  optimizes: '#10b981',
  trades_off: '#f59e0b',
  impacts: '#6366f1',
  related_to: '#64748b',
};

const LINK_TYPE_LABELS: Record<string, string> = {
  depends_on: 'Depends On',
  optimizes: 'Optimizes',
  trades_off: 'Trades Off With',
  impacts: 'Impacts',
  related_to: 'Related To',
};

export const EdgePanel = ({ edge, onClose, onNodeClick }: Props) => {
  if (!edge) return null;

  const color = LINK_TYPE_COLORS[edge.type] || '#64748b';
  const label = LINK_TYPE_LABELS[edge.type] || edge.type;

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <aside className="panel">
        <button className="close-btn" onClick={onClose} aria-label="Close panel">
          ✕
        </button>

        <div className="panel-content">
          <div className="panel-header">
            <span
              className="link-type-badge"
              style={{ backgroundColor: color }}
            >
              {label}
            </span>
            <h2 className="edge-title">
              <span>{edge.sourceNode.name}</span>
              <span className="edge-arrow">&rarr;</span>
              <span>{edge.targetNode.name}</span>
            </h2>
          </div>

          <div className="description-section">
            <p className="description">
              {edge.description || `${edge.sourceNode.name} ${label.toLowerCase()} ${edge.targetNode.name}.`}
            </p>
          </div>

          <div className="content-section">
            <h3 className="section-title">Navigate To</h3>
            <div className="edge-nav-grid">
              <button
                className="edge-nav-btn"
                onClick={() => onNodeClick(edge.sourceNode)}
              >
                {edge.sourceNode.name}
              </button>
              <button
                className="edge-nav-btn"
                onClick={() => onNodeClick(edge.targetNode)}
              >
                {edge.targetNode.name}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
