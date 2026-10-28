import express from "express";

const DivisionRouter = (divisionService) => {
  const router = express.Router();

  router.get("/divisions", async (req, res) => {
    const newData = {
      userId: req.user.id,
      workoutId: req.query.workoutId,
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
    };

    const result = await divisionService.getDivisions(newData);

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/divisions/:id", async (req, res) => {
    const result = await divisionService.getDivisionById({
      userId: req.user.id,
      divisionId: req.params.id,
      workoutId: req.query.workoutId,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.post("/divisions", async (req, res) => {
    const divisionCreated = await divisionService.createDivision({
      userId: req.user.id,
      body: req.body,
    });

    return res.status(201).json({
      success: true,
      data: divisionCreated,
    });
  });

  router.delete("/divisions/:id", async (req, res) => {
    const divisionDeleted = await divisionService.deleteDivision({
      userId: req.user.id,
      divisionId: req.params.id,
      workoutId: req.query.workoutId,
    });

    return res.status(200).json({
      success: true,
      data: divisionDeleted,
    });
  });

  return router;
};

export default DivisionRouter;
