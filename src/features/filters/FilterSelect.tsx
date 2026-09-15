import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import type { FilterDef } from "@/types/dashboard";

type FilterSelectProps = {
  filter: FilterDef;
  value: string;
  onChange: (value: string) => void;
};

export default function FilterSelect({ filter, value, onChange }: FilterSelectProps) {
  const selectId = `filter-select-${filter.id}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        {filter.label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-purple-400 focus:bg-white transition-all duration-150 pr-9"
        >
          {filter.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <ChevronDownIcon className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}
