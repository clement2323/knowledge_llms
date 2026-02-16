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
          ×
        </button>

        <div className="panel-content">
          <h2 className="node-title">{node.name}</h2>
          <span
            className="category-badge"
            style={{ backgroundColor: categoryColor }}
          >
            {categoryLabel}
          </span>

          <section className="section">
            <p className="description">{node.description}</p>
          </section>

          {node.technical && (
            <details className="details-section">
              <summary>Technical Details</summary>
              <p>{node.technical}</p>
            </details>
          )}

          {node.magnitudes && (
            <details className="details-section">
              <summary>Orders of Magnitude</summary>
              <p>{node.magnitudes}</p>
            </details>
          )}

          {node.tradeoffs && (
            <details className="details-section">
              <summary>Trade-offs</summary>
              <p>{node.tradeoffs}</p>
            </details>
          )}

          {node.references && node.references.length > 0 && (
            <details className="details-section">
              <summary>References</summary>
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
            </details>
          )}

          {relatedNodes.length > 0 && (
            <section className="related-section">
              <h3>Related Concepts</h3>
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
            </section>
          )}
        </div>
      </aside>
    </>
  );
};
