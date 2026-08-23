import { Router } from "express";
import { ProfesorController } from "./profesor.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { roleMiddleware } from "../../common/middlewares/role.middleware";
import { Roles } from "../../common/constants/roles";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware([String(Roles("3")), String(Roles("5"))])); // 3 = Profesor, 5 = Admin

router.get("/programas", ProfesorController.misProgramas);
router.get("/programas/:programaId/grupo", ProfesorController.obtenerGrupo);
router.put("/inscripcion/:inscripcionId/faltas", ProfesorController.actualizarFaltas);
router.post("/calificar", ProfesorController.calificar);

export default router;

