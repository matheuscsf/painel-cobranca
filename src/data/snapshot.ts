// "Espelho" da base de dados, no mesmo modelo do Power BI:
// o painel mostra a cópia da última atualização até o usuário clicar em "Atualizar".
// A cópia fica guardada no navegador de cada pessoa (IndexedDB).

import { DATA_FILES, type DataFileKey, type RawDataFiles } from "@/data/database";

export type DataSnapshot = {
  files: RawDataFiles;
  /** Data e hora (ISO) em que os dados foram baixados */
  updatedAt: string;
};

const STORAGE_NAME = "painel-cobranca";
const STORE_NAME = "espelho";
const SNAPSHOT_KEY = "ultima-atualizacao";

/** Baixa a versão mais recente dos CSVs publicados em public/data. */
export async function fetchLatestSnapshot(): Promise<DataSnapshot> {
  const keys = Object.keys(DATA_FILES) as DataFileKey[];

  const contents = await Promise.all(
    keys.map(async (key) => {
      const fileName = DATA_FILES[key];
      const response = await fetch(`${import.meta.env.BASE_URL}data/${fileName}`, { cache: "no-store" });
      const text = await response.text();
      // Arquivo inexistente: o servidor devolve a página HTML do site no lugar do CSV
      if (!response.ok || /^\s*<!doctype html/i.test(text)) {
        throw new Error(`Arquivo de dados não encontrado: ${fileName}`);
      }
      return [key, text] as const;
    }),
  );

  return {
    files: Object.fromEntries(contents) as RawDataFiles,
    updatedAt: new Date().toISOString(),
  };
}

/** Lê a cópia salva da última atualização. Retorna null se não houver ou se o navegador bloquear. */
export async function loadSavedSnapshot(): Promise<DataSnapshot | null> {
  try {
    const snapshot = await runInStore<DataSnapshot | undefined>("readonly", (store) => store.get(SNAPSHOT_KEY));
    return snapshot ?? null;
  } catch {
    return null;
  }
}

/** Salva a cópia da atualização. Se o navegador bloquear (ex.: modo anônimo), o painel segue funcionando sem cópia. */
export async function saveSnapshot(snapshot: DataSnapshot): Promise<void> {
  try {
    await runInStore("readwrite", (store) => store.put(snapshot, SNAPSHOT_KEY));
  } catch {
    // Sem armazenamento disponível: os dados serão baixados novamente na próxima visita
  }
}

// ── IndexedDB ─────────────────────────────────────────────────────────────────

function openStorage(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(STORAGE_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runInStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest): Promise<T> {
  const storage = await openStorage();
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = action(storage.transaction(STORE_NAME, mode).objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  } finally {
    storage.close();
  }
}
