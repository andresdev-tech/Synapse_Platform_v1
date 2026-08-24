import { prisma } from './src/config/prisma.js';

async function test() {
  try {
    const roles = await prisma.roles.findMany();
    console.log("Roles in DB:", roles);

    const profesores = await prisma.usuarios.findMany({
      where: {
        rol_id: '3' // Assuming 3 is Profesor
      }
    });
    console.log("Profesores (rol_id 3):", profesores.map(p => ({ id: p.id, nombres: p.nombres, rol_id: p.rol_id })));

    const programas = await prisma.programas.findMany();
    console.log("Programas in DB:", programas.map(p => p.nombre));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
