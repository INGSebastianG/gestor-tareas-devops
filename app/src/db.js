// Conexión a PostgreSQL.
// Fíjate en DB_HOST: vale "db", que es el NOMBRE DEL SERVICIO en docker-compose.yml.
// Docker tiene un DNS interno: dentro de la misma red, "db" se traduce a la IP
// del contenedor de la base de datos. Por eso nunca escribimos una IP fija.
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Aunque docker-compose espera a que la base esté "healthy", reintentamos
// por si acaso (por ejemplo, si alguien levanta la app sola).
async function esperarBaseDeDatos(intentos = 10) {
  for (let i = 1; i <= intentos; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('Conectado a PostgreSQL');
      return;
    } catch (err) {
      console.log(`Base de datos no disponible (intento ${i}/${intentos}): ${err.message}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error('No se pudo conectar a la base de datos');
}

module.exports = { pool, esperarBaseDeDatos };
