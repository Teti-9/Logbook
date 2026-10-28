import express from "express";

const ExercisesRouter = (exercisesService) => {
  const router = express.Router();

  router.get("/exercises", async (req, res) => {
    const newData = {
      userId: req.user.id,
      divisionId: req.query.divisionId,
      workoutId: req.query.workoutId,
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
    };

    const result = await exercisesService.getExercises(newData);

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/exercises/:id", async (req, res) => {
    const result = await exercisesService.getExerciseById({
      userId: req.user.id,
      exerciseId: req.params.id,
      divisionId: req.query.divisionId,
      workoutId: req.query.workoutId,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.post("/exercises", async (req, res) => {
    const exerciseCreated = await exercisesService.createExercise({
      userId: req.user.id,
      workoutId: req.query.workoutId,
      body: req.body,
    });

    return res.status(201).json({
      success: true,
      data: exerciseCreated,
    });
  });

  router.delete("/exercises/:id", async (req, res) => {
    const exerciseDeleted = await exercisesService.deleteExercise({
      userId: req.user.id,
      exerciseId: req.params.id,
      divisionId: req.query.divisionId,
      workoutId: req.query.workoutId,
    });

    return res.status(200).json({
      success: true,
      data: exerciseDeleted,
    });
  });

  return router;
};

export default ExercisesRouter;
