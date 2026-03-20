import { Router } from "express";
import { tagController } from "../controllers/tagController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", tagController.browse);
router.get("/:id", tagController.read);
router.post("/", tagController.add);
router.put("/:id", tagController.edit);
router.delete("/:id", tagController.destroy);

export default router;
