import { prisma } from '../src/config/prisma';
import { PassHash } from '../src/common/utils/passHash.util';
import { generateUUID } from '../src/common/utils/uuidcreate';

async function main() {
    //=====================================================
    const NewUUID = generateUUID()
    //=====================================================

    const users = await prisma.usuarios.createMany({
        data: [
            {
                id: generateUUID(), // Genera un UUID distinto por usuario
                nombres: "Mariana",
                apellidos: "Bastidas Quintero",
                tipo_documento_id: "01a02b37-677e-740f-a51d-fecec6108083",
                numero_documento: "1000000001",
                fecha_nacimiento: new Date("2008-01-01T00:00:00.000Z"), // ISO-8601 explícito o new Date()
                correo_electronico: "mariquintero0936@gmail.com",
                password_hash: "$2b$10$R2indTzEnHlyv0vjGWvUg.M4/pgd/y.djkaAufU9TtqrrCJdSv8g6",
                rol_id: "01a02b36-efbe-71cd-afd4-25d0e387b42b",
                activo: true,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: generateUUID(),
                nombres: "Juan Andres",
                apellidos: "Jaramillo Garcia",
                tipo_documento_id: "01a02b37-677e-740f-a51d-fecec6108083",
                numero_documento: "1000000002",
                fecha_nacimiento: new Date("2006-10-15T00:00:00.000Z"),
                correo_electronico: "andresjll40@gmail.com",
                password_hash: "$2b$10$hHUM2/Qk/T9pbHq8M0zRJeBO9oRkRcrYlJ0e3x/azT0bnk7SyOgr6",
                rol_id: "01a02b37-677e-740f-a51d-fecec6108083",
                activo: true,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: generateUUID(),
                nombres: "Jhon Alexander",
                apellidos: "Lenis Holgin",
                tipo_documento_id: "01a02b37-677e-740f-a51d-fecec6108083",
                numero_documento: "1000000003",
                fecha_nacimiento: new Date("2006-01-01T00:00:00.000Z"),
                correo_electronico: "jhonalexander0606@gmail.com",
                password_hash: "$2b$10$h28Mhd5MCf73Cn1w0s00y.V2jRqn2pOjZCFUB4QColdVx1lNd9oc.",
                rol_id: "01a02b37-9d84-764b-a374-10c4ae08ea2d",
                activo: true,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: generateUUID(),
                nombres: "Admin",
                apellidos: "Guard",
                tipo_documento_id: "01a02b37-9d84-764b-a374-10c4ae08ea2d",
                numero_documento: "1000000000",
                fecha_nacimiento: new Date("2000-01-01T00:00:00.000Z"),
                correo_electronico: "adminguard@synapse.com",
                password_hash: "$2b$10$BrxVA7V.7DUNm2.ydbwNduE6y3BrE4bN8Bk/AO.znnMKAf28N2rce",
                rol_id: "01a02b37-b11a-75ed-9f51-f1cb6fd1cd14",
                activo: true,
                creado_en: new Date(),
                actualizado_en: new Date()
            }
        ],
        skipDuplicates: true
    });
    console.log(`✅ Inserción finalizada: ${users.count} usuarios creados.`);
    console.log('Se creo el ususario correctamente', users);

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
