import { Router } from "express";
import { CalificacionesController } from "./calificaciones.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";

const router = Router();

// Todas las rutas requieren estar autenticado
router.use(authMiddleware);

// Obtener las notas de un grupo
router.get("/grupo/:grupoId", CalificacionesController.obtenerPorGrupo);
router.get("/programa/:programaId", CalificacionesController.obtenerPorPrograma);

// Asignar o actualizar nota
router.post("/", CalificacionesController.asignarNota);

export default router;
