// API sencilla de un gestor de tareas.
// Tres rutas:
//   GET  /salud          -> responde si la app y la base están vivas
//   POST /tareas         -> guarda una tarea (titulo, descripcion)
//   GET  /tareas/:id     -> consulta una tarea por su id
const express = require('express');
const { pool, esperarBaseDeDatos } = require('./db');

const app = express();
app.use(express.json());

app.get('/salud', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ estado: 'ok', baseDeDatos: 'conectada' });
  } catch (err) {
    res.status(500).json({ estado: 'error', detalle: err.message });
  }
});

app.post('/tareas', async (req, res) => {
  const { titulo, descripcion } = req.body;
  if (!titulo || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos: titulo y descripcion son obligatorios' });
  }
  // $1 y $2 son parámetros: evitan inyección SQL.
  const resultado = await pool.query(
    'INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2) RETURNING id, titulo, descripcion, completada',
    [titulo, descripcion]
  );
  res.status(201).json(resultado.rows[0]);
});

app.get('/tareas/:id', async (req, res) => {
  const resultado = await pool.query(
    'SELECT id, titulo, descripcion, completada FROM tareas WHERE id = $1',
    [req.params.id]
  );
  if (resultado.rows.length === 0) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  res.json(resultado.rows[0]);
});

const PUERTO = Number(process.env.PORT || 3000);

esperarBaseDeDatos()
  .then(() => {
    app.listen(PUERTO, () => console.log(`Gestor de tareas API escuchando en el puerto ${PUERTO}`));
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
