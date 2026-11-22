// OPERACIÓN DE EJEMPLO (la que pide el enunciado).
// 1. Guarda una tarea con POST /tareas.
// 2. La consulta con GET /tareas/:id.
// 3. Compara lo consultado con lo que se guardó.
// Si coincide termina con código 0 (éxito). Si no, termina con código 1 (falla).
// Jenkins usa ese código para decidir si la construcción pasa o falla.
const BASE = process.env.API_URL || 'http://localhost:3000';

const esperado = { titulo: 'Estudiar Docker', descripcion: 'Repasar redes y volumenes', completada: false };

async function main() {
  console.log(`Guardando tarea en ${BASE}/tareas ...`);
  const creada = await fetch(`${BASE}/tareas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo: esperado.titulo, descripcion: esperado.descripcion }),
  });
  if (creada.status !== 201) {
    throw new Error(`El POST respondió ${creada.status}, se esperaba 201`);
  }
  const { id } = await creada.json();
  console.log(`Guardada con id ${id}. Consultando ...`);

  const consulta = await fetch(`${BASE}/tareas/${id}`);
  const obtenido = await consulta.json();
  const resumen = { titulo: obtenido.titulo, descripcion: obtenido.descripcion, completada: obtenido.completada };
  console.log('Resultado esperado:', JSON.stringify(esperado));
  console.log('Resultado obtenido:', JSON.stringify(resumen));

  const coincide =
    resumen.titulo === esperado.titulo &&
    resumen.descripcion === esperado.descripcion &&
    resumen.completada === esperado.completada;

  if (!coincide) {
    throw new Error('El resultado obtenido NO coincide con el esperado');
  }
  console.log('OPERACION DE EJEMPLO: OK');
}

main().catch((err) => {
  console.error('OPERACION DE EJEMPLO: FALLO ->', err.message);
  process.exit(1);
});
