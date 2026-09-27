import express from "express";

const ExercisesRouter = (exercisesService) => {
  const router = express.Router();

  router.get("/exercises", async (req, res) => {
    const query = {
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
    };

    const result = await exercisesService.getExercises(req.user.id, {
      page: query.page,
      limit: query.limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/exercises/:id", async (req, res) => {
    const result = await exercisesService.getExerciseById(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.post("/exercises", async (req, res) => {
    const exerciseCreated = await exercisesService.createExercise(
      req.user.id,
      req.body,
    );

    return res.status(201).json({
      success: true,
      data: exerciseCreated,
    });
  });

  router.delete("/exercises/:id", async (req, res) => {
    const exerciseDeleted = await exercisesService.deleteExercise(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: exerciseDeleted,
    });
  });

  return router;
};

export default ExercisesRouter;
