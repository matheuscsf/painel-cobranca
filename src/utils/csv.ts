const BYTE_ORDER_MARK = 0xfeff;

/**
 * Converte o texto de um CSV (separado por vírgula, primeira linha = cabeçalho) em objetos.
 * Suporta valores entre aspas, como "Silva, João".
 */
export function parseCsv(text: string): Record<string, string>[] {
  const content = text.charCodeAt(0) === BYTE_ORDER_MARK ? text.slice(1) : text;
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) return [];

  const headers = splitCsvLine(lines[0]);

  return lines.slice(1).map((line, index) => {
    const values = splitCsvLine(line);
    if (values.length !== headers.length) {
      throw new Error(`CSV inválido na linha ${index + 2}: esperadas ${headers.length} colunas, encontradas ${values.length}`);
    }
    return Object.fromEntries(headers.map((header, i) => [header, values[i]]));
  });
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values.map((value) => value.trim());
}
