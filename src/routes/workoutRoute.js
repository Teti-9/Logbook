import express from "express";

const WorkoutRouter = (workoutService) => {
  const router = express.Router();

  router.get("/workouts", async (req, res) => {
    const query = {
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
    };

    const result = await workoutService.getWorkouts(req.user.id, {
      page: query.page,
      limit: query.limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/workouts/:id", async (req, res) => {
    const result = await workoutService.getWorkoutById({
      userId: req.user.id,
      workoutId: req.params.id,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.post("/workouts", async (req, res) => {
    const workoutCreated = await workoutService.createWorkout(
      req.user.id,
      req.body,
    );

    return res.status(201).json({
      success: true,
      data: workoutCreated,
    });
  });

  router.delete("/workouts/:id", async (req, res) => {
    const workoutDeleted = await workoutService.deleteWorkout(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: workoutDeleted,
    });
  });

  return router;
};

export default WorkoutRouter;
