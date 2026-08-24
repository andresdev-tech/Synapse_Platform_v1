const fs = require('fs');

function addCreateGroup() {
  const controllerPath = 'src/modules/grupos/grupos.controller.ts';
  let controller = fs.readFileSync(controllerPath, 'utf8');
  if (!controller.includes('createGroup')) {
    const newMethod = `
    static async createGroup(req: Request, res: Response): Promise<any> {
      try {
          const programa_id = req.params.programaId;
          const { materia, nombre, capacidad_maxima } = req.body;
          
          if (!programa_id || !nombre || !capacidad_maxima) {
            return res.status(400).json({ success: false, message: "Faltan datos requeridos" });
          }

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
    // import crypto if not exists
    if (!controller.includes('import crypto')) {
      controller = 'import crypto from "crypto";\n' + controller;
    }
    controller = controller.replace("export class GruposController {", "export class GruposController {\n" + newMethod);
    fs.writeFileSync(controllerPath, controller);
  }

  const routesPath = 'src/modules/grupos/grupos.routes.ts';
  let routes = fs.readFileSync(routesPath, 'utf8');
  if (!routes.includes('createGroup')) {
    const newRoute = `
router.post(
  "/programa/:programaId",
  authMiddleware,
  GruposController.createGroup
);
`;
    routes = routes.replace("export default router;", newRoute + "\nexport default router;");
    fs.writeFileSync(routesPath, routes);
  }
}

function addCreateSchedule() {
  const controllerPath = 'src/modules/programas/programs.controller.ts';
  let controller = fs.readFileSync(controllerPath, 'utf8');
  if (!controller.includes('createSchedule')) {
    const newMethod = `
    static async createSchedule(req: Request, res: Response): Promise<any> {
      try {
          const programa_id = req.params.id;
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
`;
    controller = controller.replace("export class ProgramasController {", "export class ProgramasController {\n" + newMethod);
    fs.writeFileSync(controllerPath, controller);
  }

  const routesPath = 'src/modules/programas/programs.routes.ts';
  let routes = fs.readFileSync(routesPath, 'utf8');
  if (!routes.includes('createSchedule')) {
    const newRoute = `
router.post(
  "/:id/horarios",
  authMiddleware,
  ProgramasController.createSchedule
);
`;
    routes = routes.replace("export default router;", newRoute + "\nexport default router;");
    fs.writeFileSync(routesPath, routes);
  }
}

addCreateGroup();
addCreateSchedule();
console.log("Backend updated successfully.");
