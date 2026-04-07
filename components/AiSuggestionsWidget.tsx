"use client";

import { Task, taskService } from "@/lib/taskService";
import { Lightbulb } from "lucide-react";

interface AiSuggestion extends Task {
  reason?: string;
}

interface AiSuggestionsWidgetProps {
  onAddSuggestion?: (suggestion: AiSuggestion) => void;
}

export default function AiSuggestionsWidget({
  onAddSuggestion,
}: AiSuggestionsWidgetProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold">AI Suggestions</h3>
      </div>

      <div className="text-center py-6 text-slate-400">
        <p className="mb-2">AI suggestions feature coming soon!</p>
        <p className="text-xs">Backend support needed for generating suggestions</p>
      </div>
    </div>
  );
}
