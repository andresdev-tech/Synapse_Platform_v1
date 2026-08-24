const fs = require('fs');

// 1. Fix programs.controller.ts (add crypto import)
let progCtrlPath = 'src/modules/programas/programs.controller.ts';
let progCtrl = fs.readFileSync(progCtrlPath, 'utf8');
if (!progCtrl.includes('import crypto from "crypto";')) {
    progCtrl = 'import crypto from "crypto";\n' + progCtrl;
    fs.writeFileSync(progCtrlPath, progCtrl);
}

// 2. Fix grupos.controller.ts (add createGroup method inside GroupsController)
let grpCtrlPath = 'src/modules/grupos/grupos.controller.ts';
let grpCtrl = fs.readFileSync(grpCtrlPath, 'utf8');
if (!grpCtrl.includes('createGroup')) {
    const newMethod = `
    static async createGroup(req: Request, res: Response): Promise<any> {
      try {
          const programa_id = String(req.params.programaId);
          const { materia, nombre, capacidad_maxima } = req.body;
          
          if (!programa_id || !nombre || !capacidad_maxima) {
            return res.status(400).json({ success: false, message: "Faltan datos requeridos" });
          }

          const { prisma } = require("../../config/prisma");

          const grupo = await prisma.grupos.create({
            data: {
              id: crypto.randomUUID(),
              programa_id,
              materia: materia || "General",
              nombre,
              capacidad_maxima: Number(capacidad_maxima),
              capacidad_actual: 0,
              estado: "activo",
              creado_en: new Date(),
              actualizado_en: new Date()
            }
          });

          return res.status(201).json({ success: true, data: grupo });
      } catch (error: any) {
          return res.status(500).json({ success: false, message: error.message });
      }
    }
`;
    grpCtrl = grpCtrl.replace('export class GroupsController {', 'export class GroupsController {\n' + newMethod);
    fs.writeFileSync(grpCtrlPath, grpCtrl);
}

// 3. Fix grupos.routes.ts (change GruposController to GroupsController)
let grpRoutesPath = 'src/modules/grupos/grupos.routes.ts';
let grpRoutes = fs.readFileSync(grpRoutesPath, 'utf8');
if (grpRoutes.includes('GruposController.createGroup')) {
    grpRoutes = grpRoutes.replace('GruposController.createGroup', 'GroupsController.createGroup');
    fs.writeFileSync(grpRoutesPath, grpRoutes);
}

// 4. Ensure authMiddleware is imported in grupos.routes.ts if missing
if (grpRoutes.includes('authMiddleware') && !grpRoutes.includes('import { authMiddleware }')) {
    grpRoutes = 'import { authMiddleware } from "../../common/middlewares/auth.middleware";\n' + grpRoutes;
    fs.writeFileSync(grpRoutesPath, grpRoutes);
}

console.log("Fixed backend!");
