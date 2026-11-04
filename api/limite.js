// Límite simple de pedidos por IP para evitar abusos (en memoria).
module.exports = function limite({ maximo, ventanaMs }) {
  const registros = new Map();
  return (req, res, next) => {
    const ahora = Date.now();
    const ip = req.ip;
    const previos = (registros.get(ip) || []).filter((t) => ahora - t < ventanaMs);
    if (previos.length >= maximo) {
      return res.status(429).json({ error: 'Demasiados intentos. Probá de nuevo en un rato.' });
    }
    previos.push(ahora);
    registros.set(ip, previos);
    next();
  };
};
