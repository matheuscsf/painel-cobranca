// Linhas "fantasma" exibidas enquanto a fila está carregando.
export default function QueueSkeletonRows() {
  return (
    <tbody aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-slate-100">
          {/* Cliente — duas linhas */}
          <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4 mb-2" />
            <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
          </td>
          <td className="px-6 py-4">
            <div className="h-5 bg-slate-200 rounded-full animate-pulse w-20" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-1/3" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3 ml-auto" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
