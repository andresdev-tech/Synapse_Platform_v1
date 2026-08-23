import { prisma } from '../src/config/prisma';
import { generateUUID } from '../src/common/utils/uuidcreate';;

async function main() {
    const programId = generateUUID();

   const programas = await prisma.programas.createMany({
        data: [
            {
                id: programId,
                nombre: "Análisis y Desarrollo de Software",
                slug: "analisis-desarrollo-software",
                descripcion: "Formación orientada al análisis, diseño, desarrollo, implementación y mantenimiento de aplicaciones de software.",
                sector: "Tecnologías de la Información",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Desarrollo de Aplicaciones Web",
                slug: "desarrollo-aplicaciones-web",
                descripcion: "Programa enfocado en el desarrollo de aplicaciones web modernas utilizando tecnologías frontend y backend.",
                sector: "Tecnologías de la Información",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Desarrollo de Aplicaciones Móviles",
                slug: "desarrollo-aplicaciones-moviles",
                descripcion: "Formación en diseño y desarrollo de aplicaciones móviles para diferentes plataformas y dispositivos.",
                sector: "Tecnologías de la Información",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Administración de Sistemas Informáticos",
                slug: "administracion-sistemas-informaticos",
                descripcion: "Programa orientado a la instalación, configuración, administración y mantenimiento de sistemas informáticos.",
                sector: "Tecnologías de la Información",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Gestión de Redes de Datos",
                slug: "gestion-redes-datos",
                descripcion: "Formación enfocada en el diseño, implementación, configuración y administración de redes de comunicación.",
                sector: "Tecnologías de la Información",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Seguridad Informática",
                slug: "seguridad-informatica",
                descripcion: "Programa dedicado a la protección de sistemas, redes y datos frente a amenazas y vulnerabilidades informáticas.",
                sector: "Tecnologías de la Información",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Diseño Gráfico",
                slug: "diseno-grafico",
                descripcion: "Formación en creación de piezas gráficas, identidad visual, composición y comunicación mediante recursos digitales.",
                sector: "Industrias Creativas",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Producción Multimedia",
                slug: "produccion-multimedia",
                descripcion: "Programa enfocado en la creación y edición de contenidos audiovisuales, gráficos, animaciones y recursos digitales.",
                sector: "Industrias Creativas",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Gestión Administrativa",
                slug: "gestion-administrativa",
                descripcion: "Formación orientada a la gestión de procesos administrativos, documentación, atención al cliente y apoyo empresarial.",
                sector: "Administración y Finanzas",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Contabilidad y Finanzas",
                slug: "contabilidad-finanzas",
                descripcion: "Programa enfocado en procesos contables, financieros, tributarios y manejo de información económica empresarial.",
                sector: "Administración y Finanzas",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Gestión Empresarial",
                slug: "gestion-empresarial",
                descripcion: "Formación orientada a la planificación, organización y gestión de recursos para el desarrollo de organizaciones.",
                sector: "Administración y Finanzas",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Mercadeo y Ventas",
                slug: "mercadeo-ventas",
                descripcion: "Programa enfocado en estrategias comerciales, marketing, servicio al cliente y procesos de ventas.",
                sector: "Comercio y Servicios",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Gestión Logística",
                slug: "gestion-logistica",
                descripcion: "Formación en planificación, almacenamiento, distribución y control de procesos relacionados con la cadena de suministro.",
                sector: "Logística",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Gestión de Recursos Humanos",
                slug: "gestion-recursos-humanos",
                descripcion: "Programa orientado a la administración del talento humano, selección, capacitación y bienestar organizacional.",
                sector: "Administración y Finanzas",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Electricidad Industrial",
                slug: "electricidad-industrial",
                descripcion: "Formación en instalación, mantenimiento y diagnóstico de sistemas eléctricos utilizados en entornos industriales.",
                sector: "Industria",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Mantenimiento Electromecánico",
                slug: "mantenimiento-electromecanico",
                descripcion: "Programa enfocado en mantenimiento preventivo y correctivo de equipos y sistemas electromecánicos.",
                sector: "Industria",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Gestión Ambiental",
                slug: "gestion-ambiental",
                descripcion: "Formación orientada a la gestión de recursos naturales, prevención de impactos ambientales y desarrollo sostenible.",
                sector: "Medio Ambiente",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            },
            {
                id: programId,
                nombre: "Seguridad y Salud en el Trabajo",
                slug: "seguridad-salud-trabajo",
                descripcion: "Programa enfocado en la prevención de riesgos laborales, promoción de ambientes seguros y gestión de la seguridad ocupacional.",
                sector: "Servicios",
                estado: "Activado",
                imagen_url: null,
                creado_en: new Date(),
                actualizado_en: new Date()
            }
        ],
        skipDuplicates: true
    });
    console.log(`Los ${programas.count}, fueron creados correctamente.`)
    

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

