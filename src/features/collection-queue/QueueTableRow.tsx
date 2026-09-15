import { AGING_STYLE } from "./agingStyles";
import type { QueueRow } from "@/types/dashboard";

type QueueTableRowProps = {
  row: QueueRow;
  onSelect: (row: QueueRow) => void;
};

export default function QueueTableRow({ row, onSelect }: QueueTableRowProps) {
  return (
    <tr
      onClick={() => onSelect(row)}
      className="border-b border-slate-100 hover:bg-purple-50/40 transition-colors cursor-pointer group"
    >
      {/* Cliente */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 text-sm flex items-center gap-2">
            {row.name}
            {row.worsenedReasons.length > 0 && (
              <span
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700 leading-none cursor-help"
                title={row.worsenedReasons.join("\n")}
                aria-label={`Piorou: ${row.worsenedReasons.join("; ")}`}
              >
                piorou
              </span>
            )}
          </span>
          <span className="text-xs text-slate-400 mt-0.5">{row.enterprise}</span>
        </div>
      </td>
      {/* Atraso */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${AGING_STYLE[row.aging]}`}
        >
          {row.aging} dias
        </span>
      </td>
      {/* Documentos */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {row.docs} docs
      </td>
      {/* Saldo */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900">
        {row.balance}
      </td>
      {/* Seta */}
      <td className="pr-5 py-4 w-8">
        <div className="flex justify-end text-slate-200 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </td>
    </tr>
  );
}
