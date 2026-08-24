import crypto from "crypto";
import { Request, Response } from "express";
import { ProgramasService } from "./programs.service";
import { prisma } from "../../config/prisma.js";
import crypto from "crypto";
import { generateUUID } from "../../common/utils/uuidcreate";
import { prisma } from "../../config/prisma";

export class ProgramasController {

  static async asignarProfesor(req: Request, res: Response): Promise<any> {
      try {
          const id = String(req.params.id); // programa_id
          const { usuario_id } = req.body;
          
          if (!id || !usuario_id) {
            return res.status(400).json({ success: false, message: "programa_id y usuario_id son requeridos" });
          }

          // Verificar si ya existe
          const existe = await prisma.profesores_programas.findFirst({
            where: { profesor_id: usuario_id, programa_id: id }
          });

          if (existe) {
            return res.status(400).json({ success: false, message: "El profesor ya estǭ asignado a este programa" });
          }

          const asignacion = await prisma.profesores_programas.create({
            data: {
              id: crypto.randomUUID(),
              profesor_id: usuario_id,
              programa_id: id
            }
          });

          return res.status(201).json({
              success: true,
              data: asignacion
          });
      } catch (error: any) {
          return res.status(500).json({
              success: false,
              message: error.message,
          });
      }
  }

    static async createSchedule(req: Request, res: Response): Promise<any> {
      try {
          const programa_id = String(req.params.id);
          const { modalidad, jornada, horarios_json } = req.body;
          
          if (!programa_id || !modalidad || !jornada) {
            return res.status(400).json({ success: false, message: "Faltan datos requeridos" });
          }

          const horario = await prisma.programas_horarios.create({
            data: {
              id: crypto.randomUUID(),
              programa_id,
              modalidad,
              jornada,
              horarios_json: horarios_json || {},
              creado_en: new Date()
            }
          });

          return res.status(201).json({ success: true, data: horario });
      } catch (error: any) {
          return res.status(500).json({ success: false, message: error.message });
      }
    }

  static async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const programas =
        await ProgramasService.getAll();

      res.status(200).json(programas);
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getById(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const programa =
        await ProgramasService.getById(id);

      res.status(200).json(programa);
    } catch (error: any) {
      res.status(404).json({
        message: error.message,
      });
    }
  }

  static async create(
    req: Request,
    res: Response
  ) {
    try {
      const programa = await ProgramasService.create({
        ...req.body,
        id: generateUUID(),
      });

      res.status(201).json(programa);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async update(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const programa =
        await ProgramasService.update(
          id,
          req.body
        );

      res.status(200).json(programa);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async delete(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      await ProgramasService.delete(id);

      res.status(200).json({
        message:
          "Programa eliminado correctamente",
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}