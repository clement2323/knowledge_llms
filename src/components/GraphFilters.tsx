import { useState, useEffect } from 'react';
import type { CategoryId } from '../types/graph';

interface Props {
  activeCategories: Set<CategoryId>;
  onCategoryChange: (categories: Set<CategoryId>) => void;
}

const CATEGORIES = [
  { id: 'architecture' as const, label: 'Architecture', color: '#6366f1', icon: '🏗️' },
  { id: 'inference' as const, label: 'Inference', color: '#8b5cf6', icon: '⚡' },
  { id: 'memory' as const, label: 'Memory', color: '#ec4899', icon: '💾' },
  { id: 'training' as const, label: 'Training', color: '#10b981', icon: '🎓' },
  { id: 'parallelism' as const, label: 'Parallelism', color: '#f59e0b', icon: '🔀' },
  { id: 'observability' as const, label: 'Observability', color: '#06b6d4', icon: '📊' },
] as const;


export const GraphFilters = ({
  activeCategories,
  onCategoryChange,
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
            Categories ({activeCategories.size}/{CATEGORIES.length})
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

        </>
      )}
    </div>
  );
};

export { CATEGORIES };
