# Painel de Cobrança — instruções para assistentes de IA

Painel de monitoramento de inadimplência feito com **React 19 + TypeScript + Vite 8 + Tailwind CSS 4**. Não tem backend: os dados são CSVs em `public/data/`, e todos os cálculos rodam no navegador.

Documentação para pessoas: `README.md` e a pasta `docs/`. **Consulte `docs/REGRAS_DE_NEGOCIO.md` antes de alterar qualquer cálculo.**

## Comandos

- `pnpm install`: instala as dependências
- `pnpm dev`: servidor de desenvolvimento em `http://localhost:8443`
- `pnpm typecheck`: verifica os tipos (rode depois de qualquer alteração)
- `pnpm build`: verifica os tipos e gera a versão de produção em `dist/`

## Estrutura

- `public/data/`: base de dados (CSVs). Não altere nomes de arquivo ou colunas sem atualizar `src/data/database.ts`
- `src/main.tsx`: ponto de entrada, importa `src/styles/index.css` e monta o `App`
- `src/App.tsx`: usa `useDatabase` e mostra carregando, erro ou `DashboardPage`
- `src/pages/DashboardPage.tsx`: estado de filtros e busca e composição das seções
- `src/features/<area>/`: seções do painel (`aging`, `kpis`, `monthly-income`, `concentration`, `collection-queue`, `filters`). Só exibem dados recebidos via props
- `src/components/`: peças genéricas (`feedback/`, `icons/`, `layout/`, `ui/`)
- `src/services/`: regras de negócio em funções puras, uma por seção, que devolvem dados já formatados (tipos em `src/types/dashboard.ts`)
- `src/hooks/`: `useDatabase` (espelho dos dados e `refresh`), `useDashboardData` (recalcula as seções), `useIsVisible`
- `src/data/`: `database.ts` (validação e conversão dos CSVs) e `snapshot.ts` (download e cópia em IndexedDB)
- `src/config/businessRules.ts`: todos os parâmetros de negócio (data-base, multa, juros, limites)
- `src/types/`: `database.ts` (tabelas) e `dashboard.ts` (dados exibidos)
- `src/utils/`: auxiliares genéricos (csv, datas, formatação, texto)

## Convenções

- Componentes em `PascalCase.tsx` com `export default function`. Hooks em `useAlgo.ts`. Services e utils em `camelCase.ts`. Pastas de feature em `kebab-case`.
- Termos do negócio em português (`Recebimento`, `saldo`, `dataVencimento`). Termos técnicos em inglês. Comentários e textos da interface em português do Brasil.
- Importe a partir de `src/` com `@/`. Dentro da mesma feature, use caminho relativo.
- Números de regra de negócio vão em `src/config/businessRules.ts`, nunca fixos em componentes ou services.
- Componentes não importam a base de dados nem fazem cálculos: a lógica vai em `src/services/` e entra na tela por `useDashboardData`.
- Não manipule o DOM diretamente (`document.querySelector`, `classList`). Use estado e props do React.

## Estilos

- Tailwind CSS v4 via `@tailwindcss/vite`. Não há `tailwind.config` nem PostCSS. Estilos globais e tema em `src/styles/index.css`.
- Fontes pelas classes do tema: `font-sans` (padrão, Plus Jakarta Sans), `font-display` (títulos, Inter), `font-urbanist` (subtítulos).
- Efeito de atualização: textos com valores recebem a classe `data-text` e gráficos `data-viz`. A página aplica `.is-refreshing` durante a atualização.

## Qualidade do código

- Use aspas duplas em textos com apóstrofo. Um apóstrofo sem escape em aspas simples quebra o build.
- O TypeScript está em modo estrito, com `noUnusedLocals` e `noUnusedParameters`: não deixe imports ou variáveis sem uso.
- Feche as tags JSX e confira o balanceamento de chaves.
