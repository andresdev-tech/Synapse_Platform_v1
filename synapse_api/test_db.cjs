const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const asigs = await prisma.profesores_programas.findMany();
  console.log("Asignaciones:", asigs);
  const users = await prisma.usuarios.findMany({
    include: { roles: true }
  });
  console.log("Profesor en DB id:", users.find(u => u.roles && u.roles.nombre === 'PROFESOR')?.id);
}
check().finally(() => prisma.$disconnect());
