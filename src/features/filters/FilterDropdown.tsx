import { useEffect, useRef, useState } from "react";
import type { FilterDef } from "@/types/dashboard";

type FilterDropdownProps = {
  filter: FilterDef;
  value: string;
  menuWidthClass: string;
  onChange: (value: string) => void;
};

export default function FilterDropdown({ filter, value, menuWidthClass, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = filter.options.find((option) => option.value === value);

  // Fecha o menu ao clicar fora dele ou apertar Esc
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm shadow-sm hover:bg-purple-50 transition-colors"
      >
        <span className="text-slate-500">{filter.label}</span>
        <span className="font-semibold text-slate-800">{selected?.label ?? value}</span>
        <svg className="w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div
        role="listbox"
        aria-label={filter.label}
        className={`${open ? "flex" : "hidden"} absolute top-full left-0 mt-2 ${menuWidthClass} bg-white border border-slate-100 rounded-xl shadow-lg z-50 py-1 flex-col`}
      >
        {filter.options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={option.value === value}
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-purple-50 hover:text-purple-700 transition-colors ${option.value === value ? "font-semibold text-purple-700" : "text-slate-700"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
