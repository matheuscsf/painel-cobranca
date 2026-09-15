import FilterDropdown from "./FilterDropdown";
import type { FilterDef, FilterId, FilterValues } from "@/types/dashboard";

type DesktopFilterBarProps = {
  filters: FilterDef[];
  values: FilterValues;
  onChange: (id: FilterId, value: string) => void;
};

export default function DesktopFilterBar({ filters, values, onChange }: DesktopFilterBarProps) {
  return (
    <div className="hidden md:flex flex-wrap items-center gap-3 mt-6 w-full relative">
      {filters.map((f) => (
        <FilterDropdown
          key={f.id}
          filter={f}
          value={values[f.id]}
          menuWidthClass={f.id === "ano" ? "w-48" : "w-56"}
          onChange={(value) => onChange(f.id, value)}
        />
      ))}
    </div>
  );
}
