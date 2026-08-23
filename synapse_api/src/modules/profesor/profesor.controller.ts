import { Request, Response } from "express";
import { ProfesorService } from "./profesor.service";

export class ProfesorController {
    static async misProgramas(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const programas = await ProfesorService.misProgramas(userId);
            return res.status(200).json(programas);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async obtenerGrupo(req: Request, res: Response) {
        try {
            const programaId = String(req.params.programaId);
            const grupo = await ProfesorService.obtenerGrupo(programaId);
            return res.status(200).json(grupo);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async actualizarFaltas(req: Request, res: Response) {
        try {
            const inscripcionId = String(req.params.inscripcionId);
            const faltas = Number(req.body.faltas);
            const resultado = await ProfesorService.actualizarFaltas(inscripcionId, faltas);
            return res.status(200).json(resultado);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async calificar(req: any, res: Response) {
        try {
            const profesorId = req.user.id;
            const { grupoId, usuarioId, calificacion } = req.body;
            const resultado = await ProfesorService.calificar(grupoId, usuarioId, profesorId, calificacion);
            return res.status(200).json(resultado);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}

