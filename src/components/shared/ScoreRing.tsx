'use client';

import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts';

interface ScoreRingProps {
  score: number;
  size?: number;
  label?: string;
}

export function ScoreRing({ score, size = 140, label }: ScoreRingProps) {
  const data = [{ value: Math.max(0, Math.min(100, score)) }];

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${score} out of 100${label ? ` ${label}` : ''}`}
    >
      <RadialBarChart
        width={size}
        height={size}
        cx="50%"
        cy="50%"
        innerRadius="72%"
        outerRadius="100%"
        barSize={10}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar
          dataKey="value"
          cornerRadius={999}
          fill="var(--primary)"
          background={{ fill: 'var(--muted)' }}
        />
      </RadialBarChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tracking-tight">{score}</span>
        {label ? (
          <span className="text-xs text-muted-foreground">{label}</span>
        ) : null}
      </div>
    </div>
  );
}
