type MobileFilterButtonProps = {
  count: number;
  onClick: () => void;
};

export default function MobileFilterButton({ count, onClick }: MobileFilterButtonProps) {
  return (
    <div className="flex md:hidden mt-5">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 12h10M11 18h2" />
        </svg>
        Filtros
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
          {count}
        </span>
      </button>
    </div>
  );
}
