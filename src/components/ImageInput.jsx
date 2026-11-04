import { useRef, useState } from 'react';
import { validateImageFile, IMAGE_RULES } from '../utils/validators';

// Selector de imagen con arrastrar y soltar, validación estricta y vista previa.
export default function ImageInput({ value, onChange, error: externalError, label = 'Imagen de portada' }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const input = useRef(null);

  const handle = async (file) => {
    setBusy(true);
    setError('');
    const res = await validateImageFile(file);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      if (input.current) input.current.value = '';
      return;
    }
    onChange(res.dataUrl);
  };

  const shown = error || externalError;
  return (
    <div className="mb-3">
      <label className="form-label">{label} <span className="text-accent">*</span></label>
      <div
        className={`pf-dropzone ${drag ? 'is-drag' : ''} ${shown ? 'is-invalid' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]); }}
        onClick={() => input.current?.click()}
        role="button" tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
      >
        {value ? (
          <img src={value} alt="Vista previa" className="img-fluid rounded" style={{ maxHeight: 180 }} />
        ) : (
          <div className="text-center py-3">
            <i className="bi bi-cloud-arrow-up fs-2 text-accent" />
            <div>{busy ? 'Validando imagen…' : 'Arrastrá una imagen o hacé clic para elegir'}</div>
          </div>
        )}
        <input ref={input} type="file" accept={IMAGE_RULES.types.join(',')} hidden onChange={(e) => e.target.files[0] && handle(e.target.files[0])} />
      </div>
      {shown ? <div className="invalid-feedback d-block">{shown}</div> : (
        <div className="form-text">JPG, PNG o WEBP · máx. 2 MB · entre {IMAGE_RULES.minWidth}×{IMAGE_RULES.minHeight} y {IMAGE_RULES.maxWidth}×{IMAGE_RULES.maxHeight} px.</div>
      )}
      {value && <button type="button" className="btn btn-sm btn-link text-danger px-0" onClick={() => onChange('')}>Quitar imagen</button>}
    </div>
  );
}
