import express from "express";

const LogbookRouter = (logbookService) => {
  const router = express.Router();

  router.get("/logbooks", async (req, res) => {
    const result = await logbookService.getLogbooks(req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/logbooks/:id", async (req, res) => {
    const result = await logbookService.getLogbookById(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.post("/logbooks", async (req, res) => {
    const logbookCreated = await logbookService.createLogbook(
      req.user.id,
      req.body,
    );

    return res.status(201).json({
      success: true,
      data: logbookCreated,
    });
  });

  router.post("/synclogbooks", async (req, res) => {
    const result = await logbookService.syncLogbook(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/logbooksjobs/:jobId", async (req, res) => {
    const jobStatus = await logbookService.logbookJob(
      req.user.id,
      req.params.jobId,
    );

    return res.status(200).json({
      success: true,
      data: jobStatus,
    });
  });

  router.delete("/logbooks/:id", async (req, res) => {
    const logbookDeleted = await logbookService.deleteLogbook(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: logbookDeleted,
    });
  });

  return router;
};

export default LogbookRouter;
