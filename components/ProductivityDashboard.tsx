"use client";

import { TrendingUp } from "lucide-react";

export default function ProductivityDashboard() {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-semibold">Productivity Analytics</h3>
      </div>

      <div className="text-center py-8 text-slate-400">
        <p className="mb-2">Productivity analytics coming soon!</p>
        <p className="text-xs">Backend support needed for detailed analytics</p>
      </div>
    </div>
  );
}
