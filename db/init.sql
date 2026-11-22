-- PostgreSQL ejecuta este archivo automáticamente la PRIMERA vez que arranca
-- el contenedor (cuando el volumen de datos está vacío).
CREATE TABLE IF NOT EXISTS tareas (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  completada  BOOLEAN      NOT NULL DEFAULT FALSE
);
