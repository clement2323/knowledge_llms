import type { GraphNode } from '../types/graph';

interface Props {
  node: GraphNode | null;
  onClose: () => void;
  relatedNodes: GraphNode[];
  onNodeClick: (node: GraphNode) => void;
  categoryLabel: string;
  categoryColor: string;
}

export const NodePanel = ({
  node,
  onClose,
  relatedNodes,
  onNodeClick,
  categoryLabel,
  categoryColor,
}: Props) => {
  if (!node) return null;

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
              className="category-badge"
              style={{ backgroundColor: categoryColor }}
            >
              {categoryLabel}
            </span>
            <h2 className="node-title">{node.name}</h2>
          </div>

          <div className="description-section">
            <p className="description">{node.description}</p>
          </div>

          {node.technical && (
            <div className="content-section">
              <h3 className="section-title">Technical Details</h3>
              <p className="section-text">{node.technical}</p>
            </div>
          )}

          {node.magnitudes && (
            <div className="content-section">
              <h3 className="section-title">Orders of Magnitude</h3>
              <p className="section-text">{node.magnitudes}</p>
            </div>
          )}

          {node.tradeoffs && (
            <div className="content-section">
              <h3 className="section-title">Trade-offs</h3>
              <p className="section-text">{node.tradeoffs}</p>
            </div>
          )}

          {node.references && node.references.length > 0 && (
            <div className="content-section">
              <h3 className="section-title">References</h3>
              <ul className="references-list">
                {node.references.map((ref, idx) => (
                  <li key={idx}>
                    {ref.startsWith('http') ? (
                      <a href={ref} target="_blank" rel="noopener noreferrer">
                        {ref}
                      </a>
                    ) : (
                      ref
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relatedNodes.length > 0 && (
            <div className="related-section">
              <h3 className="section-title">Related Concepts</h3>
              <div className="related-grid">
                {relatedNodes.map(n => (
                  <button
                    key={n.id}
                    className="related-btn"
                    onClick={() => onNodeClick(n)}
                  >
                    {n.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
