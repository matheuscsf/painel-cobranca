type FilterFabProps = {
  /** Mostra o botão (quando a barra de filtros do topo saiu da tela e o painel de filtros está fechado) */
  visible: boolean;
  onClick: () => void;
};

// Botão flutuante que abre o painel de filtros.
export default function FilterFab({ visible, onClick }: FilterFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      aria-label="Abrir filtros"
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-purple-600 text-white font-display text-sm font-medium tracking-wide shadow-lg transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-purple-700 hover:shadow-xl active:scale-95 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 pointer-events-none"
      }`}
      style={{
        boxShadow: "0 8px 24px -4px rgba(124, 58, 237, 0.40)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
      </svg>
      Filtros
    </button>
  );
}
