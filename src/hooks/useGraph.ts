import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { GraphData, GraphNode, SimulationNode, SimulationLink } from '../types/graph';

export const useGraph = (
  data: GraphData,
  onNodeClick: (node: GraphNode) => void
) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create main group for zoom/pan
    const g = svg.append('g');

    // Clone data to avoid mutating original
    const nodes: SimulationNode[] = data.nodes.map(d => ({ ...d }));
    const links: SimulationLink[] = data.links.map(d => ({ ...d }));

    // Create color scale
    const colorMap = new Map(data.categories.map(c => [c.id, c.color]));

    // Force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-400))
      .force(
        'link',
        d3
          .forceLink<SimulationNode, SimulationLink>(links)
          .id(d => d.id)
          .distance(120)
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(35));

    // Link type colors
    const linkColors: Record<string, string> = {
      depends_on: '#3b82f6',
      optimizes: '#10b981',
      trades_off: '#f59e0b',
      impacts: '#ec4899',
      related_to: '#6b7280',
    };

    // Create arrow markers for directed edges
    svg
      .append('defs')
      .selectAll('marker')
      .data(['depends_on', 'optimizes', 'trades_off', 'impacts', 'related_to'])
      .join('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', d => linkColors[d] || '#6b7280');

    // Draw links
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => linkColors[d.type] || '#6b7280')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => d.type === 'related_to' ? 1.5 : 2)
      .attr('stroke-dasharray', d => d.type === 'related_to' ? '5,5' : '0')
      .attr('marker-end', d => `url(#arrow-${d.type})`);

    // Draw nodes
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer');

    // Add drag behavior
    const drag = d3
      .drag<SVGGElement, SimulationNode>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);

    node.call(drag as any);

    // Add circles with gradient effect
    node
      .append('circle')
      .attr('r', 14)
      .attr('fill', d => colorMap.get(d.category) || '#999')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 2.5)
      .style('filter', 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))');

    // Add labels
    node
      .append('text')
      .text(d => d.name)
      .attr('x', 20)
      .attr('y', 5)
      .attr('font-size', '13px')
      .attr('font-family', 'Inter, system-ui, -apple-system, sans-serif')
      .attr('font-weight', '600')
      .attr('fill', '#f1f5f9')
      .attr('pointer-events', 'none')
      .style('text-shadow', '0px 1px 2px rgba(0, 0, 0, 0.8)');

    // Click handler
    node.on('click', (event, d) => {
      event.stopPropagation();
      onNodeClick(d);
    });

    // Hover effects
    node
      .on('mouseenter', function () {
        d3.select(this).select('circle')
          .attr('r', 16)
          .attr('stroke-width', 3)
          .style('filter', 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.5))');
        d3.select(this).select('text')
          .attr('font-size', '14px');
      })
      .on('mouseleave', function () {
        d3.select(this).select('circle')
          .attr('r', 14)
          .attr('stroke-width', 2.5)
          .style('filter', 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))');
        d3.select(this).select('text')
          .attr('font-size', '13px');
      });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as SimulationNode).x || 0)
        .attr('y1', d => (d.source as SimulationNode).y || 0)
        .attr('x2', d => (d.target as SimulationNode).x || 0)
        .attr('y2', d => (d.target as SimulationNode).y || 0);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Zoom and pan
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, SimulationNode, SimulationNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, SimulationNode, SimulationNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, SimulationNode, SimulationNode>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, onNodeClick]);

  return svgRef;
};
