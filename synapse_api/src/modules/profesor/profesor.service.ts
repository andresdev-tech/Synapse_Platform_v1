import { prisma } from "../../config/prisma";
import { v4 as uuidv4 } from "uuid";

export class ProfesorService {
    static async misProgramas(profesorId: string) {
        const asignaciones = await prisma.profesores_programas.findMany({
            where: { profesor_id: profesorId },
            include: { programas: true }
        });
        
        return asignaciones.map((a: any) => a.programas);
    }

    static async obtenerGrupo(programaId: string) {
        // En base a la estructura de la tabla inscripciones y el frontend
        const inscripciones = await prisma.inscripciones.findMany({
            where: { programa_id: programaId, estado: "activo" },
            include: {
                usuarios_inscripciones_usuario_idTousuarios: {
                    include: { tipos_documento: true }
                }
            }
        });

        return inscripciones.map((ins: any) => ({
            inscripcion_id: ins.id,
            estado: ins.estado,
            total_faltas: ins.total_faltas,
            limite_faltas: ins.limite_faltas,
            suspendido: ins.suspendido,
            fecha_inscripcion: ins.fecha_inscripcion,
            usuario_id: ins.usuario_id,
            nombres: ins.usuarios_inscripciones_usuario_idTousuarios.nombres,
            apellidos: ins.usuarios_inscripciones_usuario_idTousuarios.apellidos,
            correo_electronico: ins.usuarios_inscripciones_usuario_idTousuarios.correo_electronico,
            numero_documento: ins.usuarios_inscripciones_usuario_idTousuarios.numero_documento,
            tipo_documento: ins.usuarios_inscripciones_usuario_idTousuarios.tipos_documento?.sigla || ""
        }));
    }

    static async actualizarFaltas(inscripcionId: string, faltas: number) {
        const inscripcion = await prisma.inscripciones.findUnique({
            where: { id: inscripcionId }
        });

        if (!inscripcion) {
            throw new Error("Inscripci�n no encontrada");
        }

        const suspendido = faltas >= inscripcion.limite_faltas;
        
        const updated = await prisma.inscripciones.update({
            where: { id: inscripcionId },
            data: {
                total_faltas: faltas,
                suspendido: suspendido,
                fecha_suspension: suspendido && !inscripcion.suspendido ? new Date() : inscripcion.fecha_suspension
            }
        });

        return updated;
    }

    static async calificar(grupoId: string, usuarioId: string, profesorId: string, calificacion: number) {
        const grupo = await prisma.grupos.findUnique({ where: { id: grupoId }});
        if (!grupo) throw new Error("Grupo no encontrado");

        const cal = await prisma.calificaciones.create({
            data: {
                id: uuidv4(),
                usuario_id: usuarioId,
                programa_id: grupo.programa_id,
                grupo_id: grupoId,
                profesor_id: profesorId,
                calificacion: calificacion
            }
        });

        return cal;
    }
}

