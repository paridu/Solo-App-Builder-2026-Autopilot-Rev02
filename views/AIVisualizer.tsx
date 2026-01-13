
import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

const AIVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTaskInfo, setActiveTaskInfo] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let nodes: Node[] = [];
      let agents: Agent[] = [];
      const nodeCount = 10;
      const agentCount = 15;
      let activeNodeId: number | null = null;

      class Node {
        x: number;
        y: number;
        label: string;
        id: number;
        size: number;
        connections: number[];
        isWorking: boolean;
        isCompleted: boolean;

        constructor(id: number, x: number, y: number, label: string) {
          this.id = id;
          this.x = x;
          this.y = y;
          this.label = label;
          this.size = p.random(60, 90);
          this.connections = [];
          this.isWorking = false;
          this.isCompleted = false;
        }

        display() {
          const isPulse = this.isWorking || (activeNodeId === this.id);
          const baseColor = this.isCompleted ? p.color(16, 185, 129) : p.color(15, 23, 42);
          
          p.noStroke();
          p.fill(p.red(baseColor), p.green(baseColor), p.blue(baseColor), 200);
          p.push();
          p.translate(this.x, this.y);
          p.rotate(p.frameCount * 0.005);
          this.drawHex(0, 0, this.size / 2);
          p.pop();
          
          if (isPulse) {
            p.stroke(59, 130, 246, 255);
            p.strokeWeight(3);
            p.noFill();
            p.ellipse(this.x, this.y, this.size + p.sin(p.frameCount * 0.1) * 20);
            
            p.stroke(59, 130, 246, 50);
            p.line(this.x - this.size/2, this.y + p.sin(p.frameCount*0.2)*this.size/2, this.x + this.size/2, this.y + p.sin(p.frameCount*0.2)*this.size/2);
          }

          p.fill(255);
          p.noStroke();
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(10);
          p.textStyle(p.BOLD);
          p.text(this.label, this.x, this.y);
          
          if (this.isWorking) {
            p.textSize(8);
            p.fill(59, 130, 246);
            p.text("SYNCING...", this.x, this.y + 30);
          }
        }

        drawHex(x: number, y: number, r: number) {
          p.beginShape();
          for (let a = 0; a < p.TWO_PI; a += p.PI / 3) {
            let hx = x + p.cos(a) * r;
            let hy = y + p.sin(a) * r;
            p.vertex(hx, hy);
          }
          p.endShape(p.CLOSE);
        }
      }

      class Agent {
        currNodeIdx: number;
        targetNodeIdx: number;
        progress: number;
        speed: number;
        color: any;

        constructor() {
          this.currNodeIdx = Math.floor(p.random(nodeCount));
          this.targetNodeIdx = this.getNextTarget(this.currNodeIdx);
          this.progress = 0;
          this.speed = p.random(0.01, 0.025);
          this.color = p.color(p.random([ '#3b82f6', '#10b981', '#f59e0b', '#ef4444' ]));
        }

        getNextTarget(curr: number) {
          if (activeNodeId !== null && p.random(1) > 0.4) {
             return activeNodeId;
          }
          const node = nodes[curr];
          if (node.connections.length > 0) {
            return p.random(node.connections);
          }
          return Math.floor(p.random(nodeCount));
        }

        update() {
          this.progress += this.speed;
          if (this.progress >= 1) {
            this.currNodeIdx = this.targetNodeIdx;
            this.targetNodeIdx = this.getNextTarget(this.currNodeIdx);
            this.progress = 0;
          }
        }

        display() {
          const n1 = nodes[this.currNodeIdx];
          const n2 = nodes[this.targetNodeIdx];
          const x = p.lerp(n1.x, n2.x, this.progress);
          const y = p.lerp(n1.y, n2.y, this.progress);

          p.noStroke();
          p.fill(this.color);
          p.rect(x-3, y-3, 6, 6);
          
          p.stroke(this.color);
          p.strokeWeight(1);
          p.line(x, y, x - (n2.x - n1.x) * 0.05, y - (n2.y - n1.y) * 0.05);
        }
      }

      p.setup = () => {
        const container = containerRef.current!;
        const canvas = p.createCanvas(container.offsetWidth, 450);
        canvas.parent(container);

        const labels = [
          "Edge PLC Gateway", "OEE Processor", "Vision Server", "Maintenance RL", 
          "Safety Agent", "Energy Optimizer", "Waste Monitor", "Logistics Fleet",
          "ERP Link", "Reporting Engine"
        ];

        for (let i = 0; i < nodeCount; i++) {
          const angle = p.map(i, 0, nodeCount, 0, p.TWO_PI);
          const r = p.min(p.width, p.height) * 0.35;
          nodes.push(new Node(
            i, 
            p.width/2 + p.cos(angle) * r, 
            p.height/2 + p.sin(angle) * r, 
            labels[i]
          ));
        }

        for (let i = 0; i < nodeCount; i++) {
           nodes[i].connections.push((i + 1) % nodeCount);
           nodes[i].connections.push((i + 3) % nodeCount);
        }

        for (let i = 0; i < agentCount; i++) {
          agents.push(new Agent());
        }

        const handleActivity = (e: any) => {
           const { phase, status } = e.detail;
           let targetId = 0;
           if (phase === 1) targetId = p.floor(p.random(0, 2));
           if (phase === 2) targetId = p.floor(p.random(2, 5));
           if (phase === 3) targetId = p.floor(p.random(5, 8));
           if (phase === 4) targetId = p.floor(p.random(8, 10));

           activeNodeId = (status === 'running') ? targetId : null;
           if (status === 'completed') nodes[targetId].isCompleted = true;
           nodes.forEach((n, idx) => n.isWorking = (idx === activeNodeId));
           setActiveTaskInfo(e.detail);
        };
        window.addEventListener('ai-task-activity', handleActivity);
      };

      p.draw = () => {
        p.background(5, 8, 15);

        p.stroke(30, 41, 59, 50);
        p.strokeWeight(1);
        for(let i=0; i<p.width; i+=40) p.line(i, 0, i, p.height);
        for(let j=0; j<p.height; j+=40) p.line(0, j, p.width, j);

        p.strokeWeight(1);
        for (let i = 0; i < nodeCount; i++) {
          const n1 = nodes[i];
          for (const targetIdx of n1.connections) {
            const n2 = nodes[targetIdx];
            const isActiveEdge = (activeNodeId === i || activeNodeId === targetIdx);
            p.stroke(isActiveEdge ? p.color(59, 130, 246, 180) : p.color(30, 41, 59, 120));
            p.line(n1.x, n1.y, n2.x, n2.y);
          }
        }

        for (const agent of agents) {
          agent.update();
          agent.display();
        }

        for (const node of nodes) {
          node.display();
        }
      };

      p.windowResized = () => {
        const container = containerRef.current;
        if (container) p.resizeCanvas(container.offsetWidth, 450);
      };
    };

    const myP5 = new p5(sketch);
    return () => myP5.remove();
  }, []);

  return (
    <div className="relative w-full h-[450px]">
      <div ref={containerRef} className="w-full h-full"></div>
      
      <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-none">
          <div className={`bg-slate-950/90 backdrop-blur-md border px-5 py-3 rounded-2xl transition-all ${activeTaskInfo?.status === 'running' ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-800'}`}>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Autonomous Sync</p>
              <p className="text-xl font-black text-white">
                {activeTaskInfo?.status === 'running' ? '🚀 OPTIMIZING FACTORY...' : '🟢 SYSTEM STABLE'}
              </p>
          </div>
          {activeTaskInfo?.status === 'running' && (
             <div className="bg-slate-950/90 backdrop-blur border border-emerald-500/30 px-5 py-3 rounded-2xl animate-pulse">
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Active Industrial Agent</p>
                <p className="text-xs font-bold text-white max-w-[220px]">{activeTaskInfo.task}</p>
             </div>
          )}
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest pointer-events-none">
          <p>Industrial Control Graph: Embedded Mode</p>
          <p>Sync: Real-time Autopilot Link Active</p>
      </div>
    </div>
  );
};

export default AIVisualizer;
