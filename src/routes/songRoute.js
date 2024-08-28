import express from "express";
import songController from "../controllers/songController.js";

const router = express.Router();

router.get("/songs", songController.getAllSongs);
router.post("/songs", songController.createSong);
router.put("/songs/:id", songController.updateSong);
router.delete("/songs/:id", songController.deleteSong);
router.get("/statistics", songController.getStatistics);

export default router;
