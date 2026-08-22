import { prisma } from '../src/config/prisma';
import { PassHash } from '../src/common/utils/passHash.util';
import { generateUUID } from '../src/common/utils/uuidcreate';
import { log } from 'console';

async function main() {
    //=====================================================
    log('Comenzando la insercion de semilla');
    const NewUUID = generateUUID()

    const roles = await prisma.roles.createMany({
        data: [
            {
                id: NewUUID,
                nombre: 'ESTUDIANTE',
                descripcion: 'Solo puede iniciar sesion como Aprendiz y Estudante'
            },
            {
                id: NewUUID,
                nombre: 'PROFESOR',
                descripcion: 'Solo puede iniciar sesion como Profesor y acceder a su panel correspondiente'
            },
            {
                id: NewUUID,
                nombre: 'COORDINADOR',
                descripcion: 'Solo puede iniciar sesion como Coordinador y acceder a su panel correspondiente'
            },
            {
                id: NewUUID,
                nombre: 'ADMIN',
                descripcion: 'Solo puede iniciar sesion como Administrador'
            }
        ],
        skipDuplicates: true
    })
    console.log('Los 4 roles fueron creados correctamente', roles)

    //=====================================================
        const TipoDocumeto = await prisma.tipos_documento.createMany({
            data: [
                {
                    id: NewUUID,
                    sigla: 'TI',
                    nombre_completo: 'Tarjeta de Identidad'
                },
                {
                    id: NewUUID,
                    sigla: 'CC',
                    nombre_completo: 'Ceduda de Ciudadania'
                },
                {
                    id: NewUUID,
                    sigla: 'CE',
                    nombre_completo: 'Cedula de Extranjeria'
                },
                {
                    id: NewUUID,
                    sigla: 'PASS',
                    nombre_completo: 'Pasaporte'
                }

            ],
        skipDuplicates: true
        });
        console.log('Los 4 tipos de documentos creados correctamente', TipoDocumeto)
    //=====================================================

   /* const hashed = await PassHash.hash('Admin123$')
    const admin = await prisma.usuarios.createMany({
        data: [

        ]
    });
    console.log('Admin created', admin);*/

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
