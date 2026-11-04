// Validaciones estrictas reutilizables para todos los formularios.

export const patterns = {
  name: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]{2,60}$/,
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  phone: /^\+?[0-9\s-]{8,20}$/,
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/i,
};

const strip = (v) => (typeof v === 'string' ? v.trim() : v);

// Cada regla devuelve un mensaje de error o null.
export const rules = {
  required: (msg = 'Este campo es obligatorio.') => (v) =>
    v === undefined || v === null || strip(v) === '' || (Array.isArray(v) && v.length === 0) ? msg : null,
  minLength: (n) => (v) => (v && strip(v).length < n ? `Debe tener al menos ${n} caracteres.` : null),
  maxLength: (n) => (v) => (v && strip(v).length > n ? `No puede superar los ${n} caracteres.` : null),
  name: () => (v) => (v && !patterns.name.test(strip(v)) ? 'Usá solo letras y espacios (2 a 60 caracteres).' : null),
  email: () => (v) => (v && !patterns.email.test(strip(v)) ? 'Ingresá un email válido (ej: nombre@dominio.com).' : null),
  phone: () => (v) => (v && !patterns.phone.test(strip(v)) ? 'Ingresá un teléfono válido (8 a 20 dígitos).' : null),
  url: () => (v) => (v && !patterns.url.test(strip(v)) ? 'Ingresá una URL válida que empiece con http:// o https://.' : null),
  oneOf: (list, msg = 'Elegí una opción válida.') => (v) => (v && !list.includes(v) ? msg : null),
  number: ({ min, max } = {}) => (v) => {
    if (v === '' || v === null || v === undefined) return null;
    const n = Number(v);
    if (Number.isNaN(n)) return 'Debe ser un número.';
    if (min !== undefined && n < min) return `El valor mínimo es ${min}.`;
    if (max !== undefined && n > max) return `El valor máximo es ${max}.`;
    return null;
  },
  password: () => (v) => {
    if (!v) return null;
    if (v.length < 8) return 'Mínimo 8 caracteres.';
    if (!/[A-Z]/.test(v)) return 'Debe incluir al menos una mayúscula.';
    if (!/[a-z]/.test(v)) return 'Debe incluir al menos una minúscula.';
    if (!/[0-9]/.test(v)) return 'Debe incluir al menos un número.';
    if (!/[^A-Za-z0-9]/.test(v)) return 'Debe incluir al menos un símbolo.';
    return null;
  },
  matches: (field, msg = 'Los valores no coinciden.') => (v, all) => (v !== all[field] ? msg : null),
  accepted: (msg = 'Debés aceptar para continuar.') => (v) => (v !== true ? msg : null),
  noHtml: () => (v) => (v && /<[^>]*>/.test(v) ? 'No se permiten etiquetas HTML.' : null),
};

export function validate(values, schema) {
  const errors = {};
  for (const field of Object.keys(schema)) {
    for (const rule of schema[field]) {
      const err = rule(values[field], values);
      if (err) {
        errors[field] = err;
        break;
      }
    }
  }
  return errors;
}

export function passwordStrength(v = '') {
  let score = 0;
  if (v.length >= 8) score++;
  if (v.length >= 12) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  const levels = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Fuerte', 'Muy fuerte'];
  const colors = ['danger', 'danger', 'warning', 'info', 'success', 'success'];
  return { score, label: levels[score], color: colors[score] };
}

// Validación de imágenes: tipo MIME real (firma de bytes), extensión, tamaño y dimensiones.
export const IMAGE_RULES = { types: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 2 * 1024 * 1024, minWidth: 300, minHeight: 200, maxWidth: 4000, maxHeight: 4000 };

async function sniffMime(file) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  if (hex.startsWith('ffd8ff')) return 'image/jpeg';
  if (hex.startsWith('89504e47')) return 'image/png';
  if (hex.startsWith('52494646') && hex.slice(16, 24) === '57454250') return 'image/webp';
  return 'desconocido';
}

export async function validateImageFile(file, opts = IMAGE_RULES) {
  if (!file) return { error: 'Seleccioná una imagen.' };
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return { error: 'Extensión no permitida. Usá JPG, PNG o WEBP.' };
  if (!opts.types.includes(file.type)) return { error: 'Tipo de archivo no permitido. Usá JPG, PNG o WEBP.' };
  const real = await sniffMime(file);
  if (real !== file.type && !(real === 'image/jpeg' && file.type === 'image/jpg')) return { error: 'El contenido del archivo no corresponde a una imagen válida.' };
  if (file.size > opts.maxBytes) return { error: `La imagen supera el máximo de ${(opts.maxBytes / 1024 / 1024).toFixed(0)} MB.` };
  if (file.size === 0) return { error: 'El archivo está vacío.' };

  const dataUrl = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    r.readAsDataURL(file);
  });
  const dims = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
  if (!dims) return { error: 'La imagen está dañada o no se puede abrir.' };
  if (dims.w < opts.minWidth || dims.h < opts.minHeight) return { error: `La imagen debe medir al menos ${opts.minWidth}×${opts.minHeight} px.` };
  if (dims.w > opts.maxWidth || dims.h > opts.maxHeight) return { error: `La imagen no puede superar ${opts.maxWidth}×${opts.maxHeight} px.` };

  const compressed = await compressImage(dataUrl, 1200);
  return { dataUrl: compressed, width: dims.w, height: dims.h };
}

// Redimensiona con Canvas API para no exceder el espacio de localStorage.
function compressImage(dataUrl, maxW) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.naturalWidth);
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * scale);
      c.height = Math.round(img.naturalHeight * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/webp', 0.82));
    };
    img.src = dataUrl;
  });
}

export const sanitize = (s = '') => String(s).replace(/[<>]/g, '').trim();
