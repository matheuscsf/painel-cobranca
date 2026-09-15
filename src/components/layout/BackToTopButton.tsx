export default function BackToTopButton() {
  return (
    <div className="flex justify-center w-full mt-12 mb-8">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
        className="flex items-center gap-2 text-sm font-medium tracking-wide text-slate-400 hover:text-slate-800 transition-colors duration-300"
        aria-label="Voltar ao topo"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        Voltar ao topo
      </button>
    </div>
  );
}
