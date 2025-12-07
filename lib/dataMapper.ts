// Use a pipe '|' as a delimiter between object keys to avoid ambiguity when keys contain dots.
export function flattenPaths(obj: any, prefix = ''): { path: string; value: any }[] {
  if (obj === null || typeof obj !== 'object') {
    return [{ path: prefix.replace(/^\./, ''), value: obj }];
  }
  if (Array.isArray(obj)) {
    return [{ path: prefix.replace(/^\./, ''), value: obj }].concat(
      obj.slice(0, 3).flatMap((v, i) => flattenPaths(v, `${prefix}[${i}]`))
    );
  }
  return Object.entries(obj).flatMap(([k, v]) => flattenPaths(v, prefix ? `${prefix}|${k}` : k));
}

export function getByPath(obj: any, path: string | undefined) {
  if (!path) return undefined;
  // Support new '|' delimiter but fall back to legacy '.' delimiter for compatibility.
  const usePipe = path.includes('|');
  const parts = (usePipe ? path.split('|') : path.split('.')).flatMap(p => p.split(/(?=\[)/));
  let cur: any = obj;
  try {
    let i = 0;
    while (i < parts.length) {
      let part = parts[i];
      if (!part) { i++; continue; }

      // handle array index token like key[0]
      if (part.includes('[')) {
        const m = part.match(/^([^\[]+)\[(\d+)\]$/);
        if (m) {
          const key = m[1];
          const idx = parseInt(m[2], 10);
          if (key) {
            if (cur == null || typeof cur !== 'object' || !(key in cur)) return undefined;
            cur = cur[key];
          }
          if (!Array.isArray(cur)) return undefined;
          cur = cur[idx];
          if (cur === undefined || cur === null) return cur;
          i++;
          continue;
        } else return undefined;
      }

      // Try direct key match first
      if (cur != null && typeof cur === 'object') {
        if (part in cur) {
          cur = cur[part];
          if (cur === undefined || cur === null) return cur;
          i++;
          continue;
        }

        // Legacy: some keys may contain dots (e.g. '01. symbol') which were flattened
        // using '.' previously. Attempt to progressively join subsequent parts
        // to find a matching key in the current object.
        let combined = part;
        let found = false;
        for (let j = i + 1; j < parts.length; j++) {
          combined = combined + '.' + parts[j];
          if (combined in cur) {
            cur = cur[combined];
            if (cur === undefined || cur === null) return cur;
            i = j + 1;
            found = true;
            break;
          }
        }
        if (found) continue;
        return undefined;
      }
      return undefined;
    }
    return cur;
  } catch {
    return undefined;
  }
}
