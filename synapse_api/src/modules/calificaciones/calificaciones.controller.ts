import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export class CalificacionesController {
    static async asignarNota(req: Request, res: Response): Promise<any> {
        try {
            const { usuario_id, programa_id, grupo_id, profesor_id, calificacion, observacion } = req.body;

            if (!usuario_id || !programa_id || !profesor_id || calificacion === undefined) {
                return res.status(400).json({ error: "Faltan datos requeridos para calificar." });
            }

            if (calificacion < 0 || calificacion > 5) {
                return res.status(400).json({ error: "La calificacion debe estar entre 0 y 5." });
            }

            // Upsert (crear o actualizar si el usuario ya tiene nota en este programa/grupo por este profesor)
            // Ya que no tenemos un Unique constraint en la DB para la combinacion, buscaremos el registro primero
            const existente = await prisma.calificaciones.findFirst({
                where: {
                    usuario_id,
                    programa_id,
                    grupo_id: grupo_id || null,
                    profesor_id
                }
            });

            let registro;
            if (existente) {
                registro = await prisma.calificaciones.update({
                    where: { id: existente.id },
                    data: {
                        calificacion,
                        observacion,
                        actualizado_en: new Date()
                    }
                });
            } else {
                // Generar UUID manualmente si la base de datos no lo hace por defecto para el ID
                // Usualmente prisma con db.Uuid y default uuid() lo hace, revisaremos si falla.
                // Si falla usaremos crypto.randomUUID()
                registro = await prisma.calificaciones.create({
                    data: {
                        id: require('crypto').randomUUID(),
                        usuario_id,
                        programa_id,
                        grupo_id,
                        profesor_id,
                        calificacion,
                        observacion
                    }
                });
            }

            return res.status(200).json({ ok: true, registro });
        } catch (error: any) {
            console.error("Error al asignar nota:", error);
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    static async obtenerPorGrupo(req: Request, res: Response): Promise<any> {
        try {
            const { grupoId } = req.params;

            const notas = await prisma.calificaciones.findMany({
                where: { grupo_id: grupoId }
            });

            return res.status(200).json({ ok: true, notas });
        } catch (error: any) {
            console.error("Error al obtener notas:", error);
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    static async obtenerPorPrograma(req: Request, res: Response): Promise<any> {
        try {
            const { programaId } = req.params;
            const notas = await prisma.calificaciones.findMany({
                where: { programa_id: programaId }
            });
            return res.status(200).json({ ok: true, notas });
        } catch (error: any) {
            console.error("Error al obtener notas:", error);
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    }
}
