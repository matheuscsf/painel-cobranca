// Tipos que representam as tabelas originais (CSVs em public/data).
// Descrição completa das colunas: docs/BASE_DE_DADOS.md

export type Coligada = { codigo: number; nome: string };

export type Empreendimento = { codigo: number; nome: string };

export type TipoCobranca = { codigo: number; nome: string };

export type Cliente = {
  /** Identificador único do cliente (ChaveCliente = COD_COLCFO-COD_CLIENTE) */
  chave: string;
  codigo: number;
  codigoColCfo: number;
  nome: string;
};

export type StatusPagamento = "Baixado" | "Baixado parcialmente" | "Em Aberto";

/** Uma parcela a receber (linha de fRecebimento). */
export type Recebimento = {
  idLancamento: number;
  numeroVenda: number;
  numeroDocumento: string;
  codigoColigada: number;
  codigoEmpreendimento: number;
  codigoTipoCobranca: number;
  chaveCliente: string;
  /** AAAA-MM-DD */
  dataVencimento: string;
  /** AAAA-MM-DD, ou null quando ainda não houve pagamento */
  dataBaixa: string | null;
  valorLiquido: number;
  valorBaixa: number;
  saldo: number;
  correcaoMonetaria: number;
  status: StatusPagamento;
};

export type Database = {
  coligadas: Coligada[];
  empreendimentos: Empreendimento[];
  tiposCobranca: TipoCobranca[];
  clientes: Cliente[];
  recebimentos: Recebimento[];
};
