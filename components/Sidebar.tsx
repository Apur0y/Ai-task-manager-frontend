"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const nav = [
  { href: "/",           label: "Today",     icon: "◉" },
  { href: "/plan",       label: "Plan",      icon: "≡" },
  { href: "/resources",  label: "Resources", icon: "◈" },
  { href: "/dashboard",  label: "Dashboard", icon: "⬡" },
];

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const path = usePathname();

  return (
    <aside className={`fixed md:static left-0 top-0 h-screen w-[220px] bg-ink-900 border-r border-ink-700/50 flex flex-col z-40 transition-transform duration-300 md:translate-x-0
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="px-6 pt-8 pb-6 border-b border-ink-700/40">
        <div className="font-display text-xs tracking-[0.2em] uppercase text-ink-400 mb-1">Dev</div>
        <div className="font-display text-lg font-semibold text-ink-50">Tracker</div>
        <div className="mt-2 text-[11px] text-ink-400 font-mono">3-month roadmap</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group
                ${active
                  ? "bg-ink-700/80 text-ink-50"
                  : "text-ink-300 hover:bg-ink-800 hover:text-ink-100"
                }`}
            >
              <span className={`text-base ${active ? "text-emerald-400" : "text-ink-500 group-hover:text-ink-300"}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {active && <span className="ml-auto w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-5 border-t border-ink-700/40">
        <div className="text-[11px] text-ink-500 font-mono leading-relaxed">
          Apr 2026 → Jul 2026
        </div>
        <div className="text-[11px] text-ink-400 mt-1">12 weeks · 5 days/week</div>
      </div>
    </aside>
  );
}
