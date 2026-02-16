import { useState, useEffect } from 'react';
import type { GraphLink, CategoryId } from '../types/graph';

interface Props {
  activeCategories: Set<CategoryId>;
  activeLinks: Set<GraphLink['type']>;
  onCategoryChange: (categories: Set<CategoryId>) => void;
  onLinkChange: (links: Set<GraphLink['type']>) => void;
}

const CATEGORIES = [
  { id: 'architecture' as const, label: 'Architecture', color: '#6366f1', icon: '🏗️' },
  { id: 'inference' as const, label: 'Inference', color: '#8b5cf6', icon: '⚡' },
  { id: 'memory' as const, label: 'Memory', color: '#ec4899', icon: '💾' },
  { id: 'training' as const, label: 'Training', color: '#10b981', icon: '🎓' },
  { id: 'parallelism' as const, label: 'Parallelism', color: '#f59e0b', icon: '🔀' },
  { id: 'observability' as const, label: 'Observability', color: '#06b6d4', icon: '📊' },
] as const;

const LINK_TYPES = [
  {
    type: 'depends_on' as const,
    label: 'Depends On',
    color: '#3b82f6',
    description: 'Prerequisites'
  },
  {
    type: 'optimizes' as const,
    label: 'Optimizes',
    color: '#10b981',
    description: 'Improvements'
  },
  {
    type: 'trades_off' as const,
    label: 'Trades Off',
    color: '#f59e0b',
    description: 'Compromises'
  },
  {
    type: 'impacts' as const,
    label: 'Impacts',
    color: '#ec4899',
    description: 'Side effects'
  },
  {
    type: 'related_to' as const,
    label: 'Related To',
    color: '#6b7280',
    description: 'Connections'
  },
] as const;

export const GraphFilters = ({
  activeCategories,
  activeLinks,
  onCategoryChange,
  onLinkChange,
}: Props) => {
  // Collapsed state - default to collapsed on mobile
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return window.innerWidth < 768;
  });

  // Update collapsed state on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isCollapsed) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed]);

  // Category filters
  const toggleCategory = (categoryId: CategoryId) => {
    const newCategories = new Set(activeCategories);
    if (newCategories.has(categoryId)) {
      newCategories.delete(categoryId);
    } else {
      newCategories.add(categoryId);
    }
    onCategoryChange(newCategories);
  };

  const selectAllCategories = () => {
    onCategoryChange(new Set(CATEGORIES.map(c => c.id)));
  };

  const selectNoneCategories = () => {
    onCategoryChange(new Set());
  };

  // Link filters
  const toggleLink = (type: GraphLink['type']) => {
    const newLinks = new Set(activeLinks);
    if (newLinks.has(type)) {
      newLinks.delete(type);
    } else {
      newLinks.add(type);
    }
    onLinkChange(newLinks);
  };

  const selectAllLinks = () => {
    onLinkChange(new Set(LINK_TYPES.map(lt => lt.type)));
  };

  const selectHierarchical = () => {
    onLinkChange(new Set(['depends_on']));
  };

  const selectNoneLinks = () => {
    onLinkChange(new Set());
  };

  return (
    <div className={`graph-filters ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Toggle Button */}
      <button
        className="filters-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
      >
        <span className="toggle-icon">{isCollapsed ? '⚙️' : '✕'}</span>
        {isCollapsed && (
          <span className="toggle-label">
            Filters ({activeCategories.size + activeLinks.size}/{CATEGORIES.length + LINK_TYPES.length})
          </span>
        )}
      </button>

      {!isCollapsed && (
        <>
          {/* Node Categories Section */}
          <div className="filter-section">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">🎯</span>
                Node Categories
              </h3>
              <span className="active-count">
                {activeCategories.size}/{CATEGORIES.length}
              </span>
            </div>

                <div className="preset-buttons">
              <button
                className="preset-btn"
                onClick={selectAllCategories}
                title="Show all categories"
              >
                All
              </button>
              <button
                className="preset-btn"
                onClick={selectNoneCategories}
                title="Hide all categories"
              >
                None
              </button>
            </div>

            <div className="category-grid">
              {CATEGORIES.map(({ id, label, color, icon }) => (
                <button
                  key={id}
                  className={`category-item ${activeCategories.has(id) ? 'active' : ''}`}
                  onClick={() => toggleCategory(id)}
                  style={{
                    borderColor: activeCategories.has(id) ? color : '#e2e8f0',
                  }}
                >
                  <span className="category-icon">{icon}</span>
                  <span className="category-label">{label}</span>
                  <div
                    className="category-indicator"
                    style={{ backgroundColor: activeCategories.has(id) ? color : '#d1d5db' }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="section-divider" />

          {/* Link Types Section */}
          <div className="filter-section">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">🔗</span>
                Link Types
              </h3>
              <span className="active-count">
                {activeLinks.size}/{LINK_TYPES.length}
              </span>
            </div>

                <div className="preset-buttons">
              <button
                className="preset-btn"
                onClick={selectAllLinks}
                title="Show all links"
              >
                All
              </button>
              <button
                className="preset-btn"
                onClick={selectHierarchical}
                title="Hierarchical view"
              >
                Hier.
              </button>
              <button
                className="preset-btn"
                onClick={selectNoneLinks}
                title="Hide all links"
              >
                None
              </button>
            </div>

            <div className="filter-list">
              {LINK_TYPES.map(({ type, label, color, description }) => (
                <button
                  key={type}
                  className={`filter-item ${activeLinks.has(type) ? 'active' : ''}`}
                  onClick={() => toggleLink(type)}
                >
                  <div className="filter-indicator">
                    <div
                      className="link-preview"
                      style={{
                        background: activeLinks.has(type) ? color : '#d1d5db',
                      }}
                    />
                    <svg
                      className="arrow-icon"
                      width="12"
                      height="12"
                      viewBox="0 0 10 10"
                      style={{ fill: activeLinks.has(type) ? color : '#d1d5db' }}
                    >
                      <path d="M0,-5L10,0L0,5" transform="translate(0,5)" />
                    </svg>
                  </div>
                  <div className="filter-info">
                    <span className="filter-label">{label}</span>
                    <span className="filter-desc">{description}</span>
                  </div>
                  <div className="checkbox">
                    {activeLinks.has(type) && (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { LINK_TYPES, CATEGORIES };
