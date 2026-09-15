// Busca de nomes a partir dos códigos das tabelas de cadastro.

import type { Database } from "@/types/database";

export type Lookups = {
  empreendimentoName: (codigo: number) => string;
  clienteName: (chave: string) => string;
};

export function createLookups(database: Database): Lookups {
  const empreendimentos = new Map(database.empreendimentos.map((e) => [e.codigo, e.nome]));
  const clientes = new Map(database.clientes.map((c) => [c.chave, c.nome]));

  return {
    empreendimentoName: (codigo) => empreendimentos.get(codigo) ?? `Empreendimento ${codigo}`,
    clienteName: (chave) => clientes.get(chave) ?? `Cliente ${chave}`,
  };
}
