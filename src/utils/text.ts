/** Normaliza texto para busca: sem acentos, minúsculo e sem espaços nas pontas. "Ômega " → "omega" */
export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}
