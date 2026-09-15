import { useCallback, useEffect, useState } from "react";

import { parseDatabase } from "@/data/database";
import { fetchLatestSnapshot, loadSavedSnapshot, saveSnapshot } from "@/data/snapshot";
import type { Database } from "@/types/database";

/** Tempo mínimo da animação de "Atualizando..." para o usuário perceber a atualização. */
const MIN_REFRESH_FEEDBACK_MS = 600;

type LoadedData = { database: Database; updatedAt: string };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : "Erro desconhecido.");

/** Baixa os CSVs mais recentes, valida e substitui a cópia salva no navegador. */
async function downloadLatest(): Promise<LoadedData> {
  const snapshot = await fetchLatestSnapshot();
  const database = parseDatabase(snapshot.files); // valida antes de substituir a cópia salva
  await saveSnapshot(snapshot);
  return { database, updatedAt: snapshot.updatedAt };
}

/** Abre a cópia da última atualização; se não existir (ou for incompatível), baixa os dados. */
async function loadInitial(): Promise<LoadedData> {
  const saved = await loadSavedSnapshot();
  if (saved) {
    try {
      return { database: parseDatabase(saved.files), updatedAt: saved.updatedAt };
    } catch {
      // Cópia salva incompatível (ex.: CSVs antigos com outras colunas): baixa novamente
    }
  }
  return downloadLatest();
}

/**
 * Dados do painel no modelo "espelho da última atualização" (como no Power BI):
 * - 1ª visita: baixa os CSVs e guarda uma cópia no navegador;
 * - próximas visitas: abre direto a cópia salva;
 * - `refresh()`: baixa a versão mais recente e substitui a cópia.
 */
export default function useDatabase() {
  const [data, setData] = useState<LoadedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadInitial()
      .then((loaded) => {
        if (!cancelled) setData(loaded);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(errorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [loaded] = await Promise.all([downloadLatest(), wait(MIN_REFRESH_FEEDBACK_MS)]);
      setData(loaded);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setRefreshing(false);
    }
  }, []);

  return {
    database: data?.database ?? null,
    updatedAt: data?.updatedAt ?? null,
    loading,
    refreshing,
    error,
    refresh,
  };
}
