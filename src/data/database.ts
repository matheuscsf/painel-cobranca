// Converte o conteúdo dos CSVs da base de dados em objetos tipados.
// Os arquivos ficam em public/data e são baixados pelo navegador (ver src/data/snapshot.ts).

import type { Database, StatusPagamento } from "@/types/database";
import { parseCsv } from "@/utils/csv";

/** Arquivos da base de dados (em public/data) e a tabela que cada um alimenta. */
export const DATA_FILES = {
  coligadas: "dColigada.csv",
  empreendimentos: "dEmpreendimento.csv",
  tiposCobranca: "dTipoCobranca.csv",
  clientes: "dCliente.csv",
  recebimentos: "fRecebimento.csv",
} as const;

export type DataFileKey = keyof typeof DATA_FILES;

/** Conteúdo em texto de cada CSV. */
export type RawDataFiles = Record<DataFileKey, string>;

const VALID_STATUS: StatusPagamento[] = ["Baixado", "Baixado parcialmente", "Em Aberto"];

function readCsv(content: string, fileName: string, requiredColumns: string[]) {
  const rows = parseCsv(content);
  const header = rows.length > 0 ? Object.keys(rows[0]) : requiredColumns;
  const missing = requiredColumns.filter((column) => !header.includes(column));
  if (missing.length > 0) {
    throw new Error(`${fileName}: coluna(s) ausente(s): ${missing.join(", ")}`);
  }
  return rows;
}

function toNumber(value: string, column: string): number {
  const number = Number(value);
  if (value === "" || Number.isNaN(number)) {
    throw new Error(`Valor numérico inválido na coluna ${column}: "${value}"`);
  }
  return number;
}

function toStatus(value: string): StatusPagamento {
  if (!VALID_STATUS.includes(value as StatusPagamento)) {
    throw new Error(`STATUS_PAGAMENTO desconhecido: "${value}"`);
  }
  return value as StatusPagamento;
}

/**
 * Valida e converte o conteúdo dos CSVs.
 * Lança um erro com mensagem clara se faltar alguma coluna ou houver valor inválido.
 */
export function parseDatabase(files: RawDataFiles): Database {
  return {
    coligadas: readCsv(files.coligadas, DATA_FILES.coligadas, ["COD_COLIGADA", "COLIGADA"]).map((row) => ({
      codigo: toNumber(row.COD_COLIGADA, "COD_COLIGADA"),
      nome: row.COLIGADA,
    })),

    empreendimentos: readCsv(files.empreendimentos, DATA_FILES.empreendimentos, ["COD_EMPREENDIMENTO", "NOME_EMPREENDIMENTO"]).map((row) => ({
      codigo: toNumber(row.COD_EMPREENDIMENTO, "COD_EMPREENDIMENTO"),
      nome: row.NOME_EMPREENDIMENTO,
    })),

    tiposCobranca: readCsv(files.tiposCobranca, DATA_FILES.tiposCobranca, ["CODTDO", "TIPO_COBRANCA"]).map((row) => ({
      codigo: toNumber(row.CODTDO, "CODTDO"),
      nome: row.TIPO_COBRANCA,
    })),

    clientes: readCsv(files.clientes, DATA_FILES.clientes, ["COD_CLIENTE", "COD_COLCFO", "ChaveCliente", "CLIENTE"]).map((row) => ({
      chave: row.ChaveCliente,
      codigo: toNumber(row.COD_CLIENTE, "COD_CLIENTE"),
      codigoColCfo: toNumber(row.COD_COLCFO, "COD_COLCFO"),
      nome: row.CLIENTE,
    })),

    recebimentos: readCsv(files.recebimentos, DATA_FILES.recebimentos, [
      "NUM_VENDA", "ID_LAN", "NUM_DOCUMENTO", "COD_COLIGADA", "COD_EMPREENDIMENTO", "CODTDO", "ChaveCliente",
      "DATAVENCIMENTO", "DATABAIXA", "VALOR_LIQUIDO", "VALORBAIXA", "SALDO", "CM", "STATUS_PAGAMENTO",
    ]).map((row) => ({
      idLancamento: toNumber(row.ID_LAN, "ID_LAN"),
      numeroVenda: toNumber(row.NUM_VENDA, "NUM_VENDA"),
      numeroDocumento: row.NUM_DOCUMENTO,
      codigoColigada: toNumber(row.COD_COLIGADA, "COD_COLIGADA"),
      codigoEmpreendimento: toNumber(row.COD_EMPREENDIMENTO, "COD_EMPREENDIMENTO"),
      codigoTipoCobranca: toNumber(row.CODTDO, "CODTDO"),
      chaveCliente: row.ChaveCliente,
      dataVencimento: row.DATAVENCIMENTO,
      dataBaixa: row.DATABAIXA === "" ? null : row.DATABAIXA,
      valorLiquido: toNumber(row.VALOR_LIQUIDO, "VALOR_LIQUIDO"),
      valorBaixa: toNumber(row.VALORBAIXA, "VALORBAIXA"),
      saldo: toNumber(row.SALDO, "SALDO"),
      correcaoMonetaria: toNumber(row.CM, "CM"),
      status: toStatus(row.STATUS_PAGAMENTO),
    })),
  };
}
