import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  type: 'user' | 'bank';
  value: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface TransactionFlowProps {
  transactions: any[];
  onNodeClick: (userId: string) => void;
}

export function TransactionFlow({ transactions, onNodeClick }: TransactionFlowProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !transactions.length) return;

    // Process data
    const nodes: Node[] = [];
    const links: Link[] = [];
    const nodeMap = new Map<string, number>();

    transactions.forEach(tx => {
      // Add nodes
      if (!nodeMap.has(tx.fromUserId)) {
        nodes.push({
          id: tx.fromUserId,
          name: tx.fromUserName,
          type: 'user',
          value: 0
        });
        nodeMap.set(tx.fromUserId, nodes.length - 1);
      }

      if (!nodeMap.has(tx.toUserId)) {
        nodes.push({
          id: tx.toUserId,
          name: tx.toUserName,
          type: tx.toUserId.startsWith('bank_') ? 'bank' : 'user',
          value: 0
        });
        nodeMap.set(tx.toUserId, nodes.length - 1);
      }

      // Add links
      links.push({
        source: tx.fromUserId,
        target: tx.toUserId,
        value: tx.amount
      });

      // Update node values
      nodes[nodeMap.get(tx.fromUserId)!].value -= tx.amount;
      nodes[nodeMap.get(tx.toUserId)!].value += tx.amount;
    });

    // Set up SVG
    const width = svgRef.current.clientWidth;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value) / 10);

    // Draw nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any)
      .on('click', (event, d) => onNodeClick(d.id));

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => Math.abs(d.value) / 1000 + 5)
      .attr('fill', d => {
        if (d.type === 'bank') return '#9CA3AF';
        return d.value >= 0 ? '#10B981' : '#EF4444';
      });

    // Add labels to nodes
    node.append('text')
      .text(d => d.name)
      .attr('x', 8)
      .attr('y', 4)
      .style('font-size', '10px');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [transactions, onNodeClick]);

  return (
    <div className="w-full h-[600px] bg-white rounded-lg overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}