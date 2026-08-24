import { prisma } from './src/config/prisma.js';
async function run() {
  const asigs = await prisma.profesores_programas.findMany();
  console.log('Asignaciones:', asigs);
  process.exit(0);
}
run();
