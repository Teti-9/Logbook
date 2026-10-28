import express from "express";

const LogbookRouter = (logbookService) => {
  const router = express.Router();

  router.get("/logbooks", async (req, res) => {
    const result = await logbookService.getLogbooks({
      userId: req.user.id,
      workoutId: req.query.workoutId,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/logbooks/:id", async (req, res) => {
    const result = await logbookService.getLogbookById({
      userId: req.user.id,
      logbookId: req.params.id,
      workoutId: req.query.workoutId,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.post("/logbooks", async (req, res) => {
    const logbookCreated = await logbookService.createLogbook({
      userId: req.user.id,
      workoutId: req.query.workoutId,
      body: req.body,
    });

    return res.status(201).json({
      success: true,
      data: logbookCreated,
    });
  });

  router.post("/synclogbooks", async (req, res) => {
    const result = await logbookService.syncLogbook({
      userId: req.user.id,
      workoutId: req.query.workoutId,
      body: req.body,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/logbooksjobs/:jobId", async (req, res) => {
    const jobStatus = await logbookService.logbookJob({
      userId: req.user.id,
      jobId: req.params.jobId,
    });

    return res.status(200).json({
      success: true,
      data: jobStatus,
    });
  });

  router.delete("/logbooks/:id", async (req, res) => {
    const logbookDeleted = await logbookService.deleteLogbook({
      userId: req.user.id,
      logbookId: req.params.id,
      workoutId: req.query.workoutId,
    });

    return res.status(200).json({
      success: true,
      data: logbookDeleted,
    });
  });

  return router;
};

export default LogbookRouter;
