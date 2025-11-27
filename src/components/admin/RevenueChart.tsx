'use client';

import { useEffect, useRef } from 'react';

interface ChartData {
  month: string;
  revenue: number;
}

const chartData: ChartData[] = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 16000 },
  { month: 'May', revenue: 22000 },
  { month: 'Jun', revenue: 25000 },
  { month: 'Jul', revenue: 21000 },
  { month: 'Aug', revenue: 28000 },
];

export default function RevenueChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Find max revenue for scaling
    const maxRevenue = Math.max(...chartData.map(d => d.revenue));
    const scale = chartHeight / maxRevenue;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw bars
    const barWidth = chartWidth / chartData.length * 0.6;
    const barSpacing = chartWidth / chartData.length;

    chartData.forEach((data, index) => {
      const barHeight = data.revenue * scale;
      const x = padding + barSpacing * index + (barSpacing - barWidth) / 2;
      const y = canvas.height - padding - barHeight;

      // Draw bar
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw month label
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.month, x + barWidth / 2, canvas.height - 20);
    });

    // Draw trend line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    chartData.forEach((data, index) => {
      const x = padding + barSpacing * index + barSpacing / 2;
      const y = canvas.height - padding - (data.revenue * scale);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw point
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.stroke();

  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
      <canvas 
        ref={canvasRef} 
        className="w-full"
        style={{ height: '300px' }}
      />
    </div>
  );
}
