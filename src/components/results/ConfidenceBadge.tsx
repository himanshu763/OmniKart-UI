import type { JSX } from 'react';

interface ConfidenceBadgeProps {
  score: number;
}

export function ConfidenceBadge({ score }: ConfidenceBadgeProps): JSX.Element {
  const percentage = Math.round(score * 100);

  if (score >= 0.7)
    return (
      <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-200">
        {percentage}% Match
      </span>
    );

  if (score >= 0.5)
    return (
      <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-bold border border-amber-200">
        {percentage}% Match
      </span>
    );

  return (
    <span className="bg-rose-100 text-rose-700 text-xs px-2.5 py-1 rounded-full font-bold border border-rose-200">
      {percentage}% Match
    </span>
  );
}
