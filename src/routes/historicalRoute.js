import express from "express";

const HistoricalRouter = (historicalService) => {
  const router = express.Router();

  router.get("/historicals", async (req, res) => {
    const { search } = req.query;
    const isDeleted = false;

    const result = await historicalService.getHistorical(
      req.user.id,
      isDeleted,
      search,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/historicals/:id", async (req, res) => {
    const result = await historicalService.getHistoricalById(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.delete("/historicals/:id", async (req, res) => {
    const historicalDeleted = await historicalService.deleteHistorical(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: historicalDeleted,
    });
  });

  return router;
};

export default HistoricalRouter;
