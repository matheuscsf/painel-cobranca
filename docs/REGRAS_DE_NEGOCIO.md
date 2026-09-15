# Regras de negócio

Este documento explica **como cada número do painel é calculado**. Os parâmetros citados aqui (datas, percentuais, limites) ficam em [`src/config/businessRules.ts`](../src/config/businessRules.ts) e podem ser ajustados sem mexer no resto do código.

---

## Sumário

- [Conceitos básicos](#conceitos-básicos)
- [Filtros e busca](#filtros-e-busca)
- [Distribuição de atraso](#distribuição-de-atraso)
- [Indicadores (KPIs)](#indicadores-kpis)
- [Entrada mensal](#entrada-mensal)
- [Concentração](#concentração)
- [Fila de cobrança](#fila-de-cobrança)
- [Selo "piorou"](#selo-piorou)
- [Atualização dos dados](#atualização-dos-dados)
- [Parâmetros configuráveis](#parâmetros-configuráveis)

---

## Conceitos básicos

### Data-base

É a data em que a carteira é "fotografada". **Todos os atrasos e saldos são calculados nessa data**, e não na data de hoje. Assim, os números ficam estáveis enquanto a base não muda.

> Parâmetro: `REFERENCE_DATE`. Aparece no topo do painel como "Posição da carteira em ...".

### Parcela

Cada linha da tabela `fRecebimento` é uma parcela a receber, com vencimento, valor, quanto já foi pago e quanto falta.

### Saldo vencido (em aberto)

É o valor que **já venceu e ainda não foi pago** na data-base: a coluna `SALDO` das parcelas com vencimento **anterior** à data-base.

> Parcelas que vencem na própria data-base ou depois dela ainda **não** estão atrasadas e não entram no saldo vencido.

### Dias de atraso

```
dias de atraso = data-base − data de vencimento
```

Uma parcela vencida em 01/09/2026, com data-base em 13/09/2026, tem **12 dias** de atraso.

### Faixas de atraso

| Faixa | Dias de atraso |
|---|---|
| 01 a 29 dias | 1 a 29 |
| 30 a 60 dias | 30 a 60 |
| 61 a 90 dias | 61 a 90 |
| 91+ dias | 91 ou mais |

### Valor atualizado

É quanto a parcela **vale hoje**, considerando os encargos de atraso:

```
valor atualizado = saldo + correção monetária + multa + juros

multa = saldo × 2%
juros = saldo × 1% × (dias de atraso ÷ 30)
```

**Exemplo:** saldo de R$ 1.000,00, correção monetária (coluna `CM`) de R$ 20,00 e 45 dias de atraso.

| Componente | Cálculo | Valor |
|---|---|---|
| Saldo | — | R$ 1.000,00 |
| Correção monetária | coluna `CM` | R$ 20,00 |
| Multa | 1.000 × 2% | R$ 20,00 |
| Juros | 1.000 × 1% × (45 ÷ 30) | R$ 15,00 |
| **Valor atualizado** | | **R$ 1.055,00** |

> Parâmetros: `LATE_FEE_RATE` (multa), `MONTHLY_INTEREST_RATE` (juros ao mês), `DAYS_PER_MONTH` (dias por mês).

### "Fotografia" de 30 dias atrás

Várias comparações olham como a carteira estava **30 dias antes da data-base**. Para reconstruir esse passado a partir dos dados atuais:

- parcela que **ainda não tinha vencido** naquela data → não estava em atraso;
- parcela **paga até aquela data** → considera o saldo atual;
- parcela **paga depois daquela data** ou **ainda não paga** → estava com o valor líquido inteiro em aberto.

> Simplificação: considera-se que o pagamento, total ou parcial, aconteceu de uma vez na data de baixa (`DATABAIXA`).
>
> Parâmetro: `COMPARISON_WINDOW_DAYS`.

---

## Filtros e busca

| Filtro | Como funciona |
|---|---|
| **Ano** | Considera as parcelas com **vencimento** no ano escolhido. As opções são os anos existentes na base, e o padrão é o ano da data-base. |
| **Coligada** | Considera só as parcelas da coligada escolhida, ou todas. |
| **Cobrança** | Considera só as parcelas do tipo de cobrança escolhido, ou todos. |
| **Busca** | Encontra clientes pelo **nome** ou por **número de documento**, ignorando acentos e maiúsculas. Quando encontra, o painel inteiro passa a mostrar **a carteira completa** desses clientes. |

Filtros e busca valem para **todas as seções ao mesmo tempo**.

---

## Distribuição de atraso

- **Total em aberto:** soma do saldo vencido.
- **Cada faixa:** soma do saldo vencido das parcelas daquela faixa.
- **Clientes por faixa:** quantidade de clientes com pelo menos uma parcela na faixa. Um mesmo cliente pode aparecer em mais de uma faixa.
- **Barra colorida:** o tamanho de cada cor é a participação da faixa no total.

---

## Indicadores (KPIs)

| Indicador | Cálculo | Comparado com |
|---|---|---|
| **Recuperado no ano** | Soma do valor pago (`VALORBAIXA`) ÷ soma do valor líquido (`VALOR_LIQUIDO`) das parcelas do ano | Mesmo cálculo no **ano anterior**, em pontos percentuais (pp) |
| **Atraso médio** | Média dos dias de atraso das parcelas vencidas e não pagas | Fotografia de **30 dias atrás** |
| **Clientes em aberto** | Quantidade de clientes com saldo vencido | Fotografia de **30 dias atrás** |
| **Ticket médio** | Saldo vencido ÷ clientes em aberto | Fotografia de **30 dias atrás** |

**Cor do selo de comparação:**

- 🟢 **Verde (melhora):** recuperação **subiu**, ou atraso médio, clientes em aberto ou ticket médio **caíram** ou ficaram iguais.
- 🔴 **Vermelho (piora):** o contrário.

Quando não há dados do período anterior (por exemplo, o primeiro ano da base), aparece **"Sem comparativo"**.

---

## Entrada mensal

Para cada mês do ano filtrado, considerando o **mês de vencimento** das parcelas:

- **Barra roxa (recuperado):** soma do valor pago.
- **Barra cinza (em aberto):** soma do saldo que falta pagar.
- **Linha (taxa de recuperação):** recuperado ÷ (recuperado + em aberto).

**Frase de destaque:** compara a taxa do **último mês com dados** com a **média dos meses anteriores**. Exemplo: _"Em setembro, a taxa de recuperação foi de 23,9%, 34,4pp abaixo da média dos 8 meses anteriores (58,3%)."_

> É natural que os meses mais recentes tenham taxa menor: as parcelas acabaram de vencer e tiveram menos tempo para serem pagas.

---

## Concentração

- **Ranking:** os **10 clientes** (ou **10 empreendimentos**) com maior saldo vencido.
- **Barra de cada item:** proporcional ao **1º colocado**, que ocupa a barra inteira.
- **Risco de concentração:** fatia do saldo vencido que está com os **3 maiores**:

| Fatia dos 3 maiores | Risco |
|---|---|
| até 30% | baixo |
| de 30% a 50% | moderado |
| acima de 50% | alto |

> Parâmetros: `RANKING_SIZE`, `CONCENTRATION_TOP_N` e `CONCENTRATION_RISK_LIMITS`.

---

## Fila de cobrança

Lista **todos os clientes com saldo vencido**, do **maior para o menor saldo**.

| Coluna / campo | Cálculo |
|---|---|
| **Cliente** | Nome do cliente |
| **Empreendimento** | O empreendimento com maior saldo vencido do cliente. Se houver outros, aparece "+N" |
| **Atraso** | Faixa da parcela **mais atrasada** do cliente |
| **Documentos** | Quantidade de parcelas vencidas e não pagas |
| **Saldo em aberto** | Soma do saldo vencido do cliente |

**Na gaveta de detalhes (ao clicar na linha):**

| Campo | Cálculo |
|---|---|
| Valor atualizado | Soma do [valor atualizado](#valor-atualizado) das parcelas vencidas |
| Maior atraso | Dias de atraso da parcela mais antiga |
| Total pago | Soma de tudo o que o cliente já pagou |
| Último pagamento | Data de baixa mais recente |
| Documentos em aberto | Cada parcela vencida, com vencimento, saldo e valor atualizado |
| Histórico de pagamentos | Os 5 pagamentos mais recentes (`PAYMENT_HISTORY_SIZE`) |

---

## Selo "piorou"

Destaca clientes cuja situação **se agravou nos últimos 30 dias**. O cliente recebe o selo se **pelo menos uma** destas condições acontecer:

1. **Piorou no prazo:** a parcela mais atrasada **passou para uma faixa pior**. Exemplo: estava em "30 a 60 dias" e agora está em "61 a 90 dias".
2. **Piorou no valor:** venceram, e não foram pagas, parcelas somando **R$ 5.000 ou mais** nos últimos 30 dias.

Ao passar o mouse sobre o selo, aparece o **motivo**, por exemplo:

- _"Passou de 30 a 60 dias para 61 a 90 dias de atraso"_
- _"R$ 7.240 vencidos e não pagos nos últimos 30 dias"_

**Por que duas condições?** A primeira não enxerga quem já está na pior faixa (91+), e a segunda não enxerga quem não teve parcela nova, mas está envelhecendo a dívida. Juntas, cobrem os dois jeitos de uma dívida piorar.

> Parâmetros: `WORSENED_NEW_OVERDUE_MIN` (valor mínimo) e `COMPARISON_WINDOW_DAYS` (janela).
>
> Com filtro de anos antigos, é normal nenhum cliente receber o selo: todas as parcelas daquele ano já estavam na faixa 91+ e nada mudou no último mês.

---

## Atualização dos dados

O painel funciona como um **espelho da última atualização**, igual ao Power BI:

| Situação | O que acontece |
|---|---|
| **Primeira visita** | Baixa os CSVs, guarda uma cópia no navegador e mostra "Atualizado em (data e hora)" |
| **Próximas visitas** | Abre direto com a cópia salva, mesmo que existam dados mais novos publicados |
| **Clique em "Atualizar"** | Baixa os CSVs mais recentes, substitui a cópia e registra o novo horário |
| **Falha ao atualizar** | Mantém os dados atuais na tela e mostra uma mensagem de erro |
| **Cópia salva incompatível** (ex.: colunas mudaram) | Descarta a cópia e baixa os dados novamente |

> A cópia fica no navegador de **cada pessoa**. Cada visitante tem seu próprio "Atualizado em".

---

## Parâmetros configuráveis

Todos em [`src/config/businessRules.ts`](../src/config/businessRules.ts):

| Parâmetro | Valor atual | Usado em |
|---|---|---|
| `REFERENCE_DATE` | `2026-09-13` | Data-base de todos os cálculos |
| `COMPARISON_WINDOW_DAYS` | `30` | Comparações dos KPIs e selo "piorou" |
| `WORSENED_NEW_OVERDUE_MIN` | `5000` | Valor mínimo de novo atraso para o selo "piorou" |
| `LATE_FEE_RATE` | `0.02` (2%) | Multa do valor atualizado |
| `MONTHLY_INTEREST_RATE` | `0.01` (1% ao mês) | Juros do valor atualizado |
| `DAYS_PER_MONTH` | `30` | Proporção dos juros por dia |
| `RANKING_SIZE` | `10` | Itens no ranking de concentração |
| `CONCENTRATION_TOP_N` | `3` | Maiores devedores considerados no risco |
| `CONCENTRATION_RISK_LIMITS` | `{ low: 30, moderate: 50 }` | Limites do risco de concentração (%) |
| `PAYMENT_HISTORY_SIZE` | `5` | Pagamentos exibidos no histórico do cliente |
