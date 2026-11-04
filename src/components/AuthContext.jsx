import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

// Guarda el usuario con sesión iniciada y expone registro, ingreso y salida.
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api('/auth/yo')
      .then((d) => setUsuario(d.usuario))
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  const registrar = async (datos) => {
    const d = await api('/auth/registro', { method: 'POST', body: datos });
    setUsuario(d.usuario);
  };

  const ingresar = async (datos) => {
    const d = await api('/auth/ingresar', { method: 'POST', body: datos });
    setUsuario(d.usuario);
  };

  const salir = async () => {
    await api('/auth/salir', { method: 'POST' }).catch(() => {});
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, registrar, ingresar, salir }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
