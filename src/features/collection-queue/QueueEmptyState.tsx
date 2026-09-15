// Exibido quando nenhum cliente corresponde aos filtros ou à busca.
export default function QueueEmptyState({ columns }: { columns: number }) {
  return (
    <tbody>
      <tr>
        <td colSpan={columns} className="px-6 py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <p className="text-base font-semibold text-slate-900 mb-1 font-display">
              Nenhum cliente encontrado
            </p>
            <p className="text-sm text-slate-500">
              Tente ajustar a busca ou os filtros acima.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );
}
