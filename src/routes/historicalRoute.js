import express from "express";

const HistoricalRouter = (historicalService) => {
  const router = express.Router();

  router.get("/historicals", async (req, res) => {
    const result = await historicalService.getHistorical({
      userId: req.user.id,
      search: req.query.search,
      workoutId: req.query.workoutId,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/historicals/:id", async (req, res) => {
    const result = await historicalService.getHistoricalById({
      userId: req.user.id,
      historicalId: req.params.id,
      workoutId: req.query.workoutId,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.delete("/historicals/:id", async (req, res) => {
    const historicalDeleted = await historicalService.deleteHistorical({
      userId: req.user.id,
      historicalId: req.params.id,
      workoutId: req.query.workoutId,
    });

    return res.status(200).json({
      success: true,
      data: historicalDeleted,
    });
  });

  return router;
};

export default HistoricalRouter;
