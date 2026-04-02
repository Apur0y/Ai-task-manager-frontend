"use client";
import { useState, useEffect, useCallback } from "react";
import type { Task, Roadmap } from "@/lib/types";
import rawData from "@/data/roadmap.json";

const STORAGE_KEY = "devtracker_status";

function loadStatuses(): Record<string, Task["status"]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveStatuses(statuses: Record<string, Task["status"]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
}

export function useRoadmap() {
  const [statuses, setStatuses] = useState<Record<string, Task["status"]>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStatuses(loadStatuses());
    setHydrated(true);
  }, []);

  const roadmap: Roadmap = {
    ...(rawData as Roadmap),
    weeks: (rawData as Roadmap).weeks.map((week) => ({
      ...week,
      days: week.days.map((day) => ({
        ...day,
        tasks: day.tasks.map((task) => ({
          ...task,
          status: statuses[task.id] ?? task.status,
        })),
      })),
    })),
  };

  const updateStatus = useCallback((id: string, status: Task["status"]) => {
    setStatuses((prev) => {
      const next = { ...prev, [id]: status };
      saveStatuses(next);
      return next;
    });
  }, []);

  return { roadmap, updateStatus, hydrated };
}
