// Proyectos y demos. El listado es público; el detalle y las demos solo se
// devuelven a usuarios registrados. Son proyectos de ejemplo: reemplazalos por los reales.
const express = require('express');
const { requiereSesion } = require('./auth');

const proyectos = [
  {
    id: 'clima-salta',
    titulo: 'Clima Salta',
    resumen: 'Pronóstico del tiempo según tu ubicación.',
    descripcion:
      'Aplicación que usa la geolocalización del navegador y la API pública de Open-Meteo para mostrar el clima actual y el pronóstico de 5 días.',
    tecnologias: ['JavaScript', 'React', 'API REST'],
    demo: 'clima',
  },
  {
    id: 'tablero-tareas',
    titulo: 'Tablero de tareas',
    resumen: 'Organizador de tareas estilo kanban.',
    descripcion:
      'Tablero con columnas Por hacer, En curso y Hecho. Las tareas se arrastran entre columnas y quedan guardadas en el navegador.',
    tecnologias: ['React', 'Drag & Drop API', 'localStorage'],
    demo: 'kanban',
  },
  {
    id: 'explorador-api',
    titulo: 'Explorador de API',
    resumen: 'Consultas a una API REST desde el navegador.',
    descripcion:
      'Herramienta para probar pedidos GET a una API REST pública, con validación de parámetros, código de estado y tiempo de respuesta.',
    tecnologias: ['JavaScript', 'Fetch API', 'JSON'],
    demo: 'api',
  },
];

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ proyectos: proyectos.map(({ id, titulo, resumen }) => ({ id, titulo, resumen })) });
});

router.get('/:id', requiereSesion, (req, res) => {
  const proyecto = proyectos.find((p) => p.id === req.params.id);
  if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado.' });
  res.json({ proyecto });
});

module.exports = { router };
