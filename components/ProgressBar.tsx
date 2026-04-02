interface Props {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ value, max = 100, color = "bg-emerald-400", className = "", showLabel = false }: Props) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 bg-ink-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-mono text-ink-400 w-8 text-right">{pct}%</span>
      )}
    </div>
  );
}
