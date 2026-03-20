import { Router } from "express";
import { noteController } from "../controllers/noteController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", noteController.browse);
router.get("/:id", noteController.read);
router.post("/", noteController.add);
router.put("/:id", noteController.edit);
router.delete("/:id", noteController.destroy);

export default router;
