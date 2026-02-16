# LLM Knowledge Graph

An interactive, mobile-first web application for exploring Large Language Model (LLM) concepts through a dynamic knowledge graph. Built with React, TypeScript, and D3.js.

## 🎯 Purpose

- **Deep learning preparation**: Structured learning path for LLM/deep learning interviews
- **Non-linear exploration**: Multiple paths to understanding complex concepts
- **Technical showcase**: Demonstrates full-stack TypeScript, D3 visualization, and graph data modeling
- **Mobile-first**: Optimized for reviewing concepts on-the-go

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173/`

## 📊 Current Graph Stats

- **38 nodes** across 6 categories
- **53 relationships** (depends_on, optimizes, trades_off, impacts, related_to)
- **Categories**:
  - Architecture (Multi-head attention, Layer norm, GELU, etc.)
  - Inference (KV caching, Flash attention, Batching)
  - Memory (O(n²) complexity, OOM, Activation memory)
  - Training (Mixed precision, RLHF, Quantization)
  - Parallelism (TP, PP, DP)
  - Observability (Latency, Throughput, Memorization)

## 🏗️ Architecture

```
src/
├── components/
│   ├── Graph.tsx           # D3 force-directed graph visualization
│   └── NodePanel.tsx       # Side panel with concept details
├── hooks/
│   └── useGraph.ts         # D3 simulation React hook
├── types/
│   └── graph.ts            # TypeScript interfaces
├── data/
│   └── graph-data.json     # Knowledge graph source (edit here!)
├── App.tsx                 # Main application
└── main.tsx                # Entry point
```

## 🎨 Features

### Graph Visualization
- Force-directed layout with D3.js
- Color-coded by category
- Drag nodes to reposition
- Pan and zoom (mouse/touch)
- Hover effects
- Directed edges with relationship types

### Node Panel
- High-level description
- Collapsible technical details
- Orders of magnitude
- Trade-offs
- References (papers, blog posts)
- Related concepts (click to navigate)

### Responsive Design
- Mobile-first (100% width panel)
- Desktop (420px fixed panel)
- Touch targets ≥48x48px
- Readable text (16-17px body)
- Smooth animations

## ✏️ Adding New Concepts

Edit `src/data/graph-data.json`:

```json
{
  "nodes": [
    {
      "id": "new_concept",
      "name": "New Concept",
      "category": "architecture",
      "description": "High-level explanation for quick understanding",
      "technical": "Deep technical details (optional)",
      "magnitudes": "O(n²), 10GB memory, etc. (optional)",
      "tradeoffs": "What are the trade-offs? (optional)",
      "references": ["Paper name", "https://..."],
      "sourceLines": [42]
    }
  ],
  "links": [
    {
      "source": "new_concept",
      "target": "existing_concept",
      "type": "depends_on"
    }
  ]
}
```

**Relationship types**:
- `depends_on`: Required prerequisite
- `optimizes`: Improves performance/efficiency
- `trades_off`: Conflicting goals
- `impacts`: Affects another concept
- `related_to`: General connection

Vite will hot-reload automatically. TypeScript will validate your changes.

## 🔍 Example Exploration Paths

### Path 1: Understanding Attention
```
Multi-head Attention → Scaled Dot-Product → O(n²) Complexity → OOM → Flash Attention
```

### Path 2: Optimizing Inference
```
Context Window → KV Caching → Memory Trade-offs → Batching Strategy → Latency vs Throughput
```

### Path 3: Scaling Training
```
Mixed Precision → Loss Scaling → Tensor Parallelism → Communication Overhead → FLOPs
```

## 🎓 Learning Workflow

1. **Random exploration**: Click any node, read description
2. **Follow relationships**: Navigate via "Related Concepts"
3. **Category browsing**: Explore by color (architecture, inference, etc.)
4. **Deep dive**: Expand technical details when ready
5. **Interview prep**: Pick random node → explain concept in 2 min

## 🛠️ Tech Stack

- **React 18** + **TypeScript**: Type-safe component architecture
- **Vite**: Fast development and optimized builds
- **D3.js v7**: Force simulation, drag/zoom interactions
- **CSS**: Mobile-first responsive design (no frameworks)

## 📱 Mobile Optimization

- Full-width panel on mobile (<768px)
- Touch-friendly interactions (drag, zoom, tap)
- 48x48px minimum touch targets
- Smooth slide-in panel animation
- No horizontal scroll
- Works offline after first load

## 🔮 Future Enhancements

- [ ] Search/filter nodes by name or category
- [ ] Export graph as PNG/SVG
- [ ] Persistent node positions (localStorage)
- [ ] Historical view (Git-based versioning)
- [ ] Quiz mode (test yourself on random concepts)
- [ ] Dark mode
- [ ] Backend integration (Neo4j graph database)
- [ ] Multi-language support
- [ ] Concept difficulty levels

## 📚 Data Source

Concepts extracted from `add_to_graph.md` - personal notes on:
- Vaswani et al. 2017 (Transformers)
- Flash Attention (Dao et al. 2022)
- Mixed Precision Training
- RLHF (Christiano et al. 2017, Ouyang et al. 2022)
- Model parallelism techniques
- Production serving best practices

## 🤝 Contributing

This is a personal learning project, but ideas welcome! To suggest a concept:

1. Identify where it fits (category, relationships)
2. Write clear high-level description
3. Add technical details if available
4. Submit as issue or PR

## 📄 License

MIT License - use for your own learning!

## 🎯 Success Criteria

- ✅ Mobile-friendly revision on-the-go
- ✅ Answer system-level LLM interview questions
- ✅ Intuitive concept relationships
- ✅ Big picture + deep details coexist
- ✅ Demonstrates understanding of LLM internals

---

**Built to learn, designed to showcase, optimized for interviews.**
