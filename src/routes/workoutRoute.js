import express from "express";

const WorkoutRouter = (workoutService) => {
  const router = express.Router();

  router.get("/workouts", async (req, res) => {
    const { page, limit } = req.query;

    const result = await workoutService.getWorkouts(req.user.id, {
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/workouts/:id", async (req, res) => {
    const result = await workoutService.getWorkoutById(
      req.user.id,
      req.params.id,
    );

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
