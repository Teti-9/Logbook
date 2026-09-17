import express from "express";

const WorkoutRouter = (workoutService) => {
  const router = express.Router();

  /**
   * @swagger
   *
   * /api/divisions:
   *   get:
   *     summary: Return all divisions.
   *     tags: [Division]
   *     parameters:
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination.
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 10
   *         description: Number of items per page.
   *     responses:
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Expired or invalid token (Only with manual JWT implementation.)
   *       200:
   *         description: Success.
   *       404:
   *         description: No divisions found.
   *       500:
   *         description: There was an internal server error.
   *
   *   post:
   *     summary: Create a new division.
   *     tags: [Division]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Push, Pull, etc..."
   *               day:
   *                 type: string
   *                 example: "Monday, Tuesday..."
   *     responses:
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Expired or invalid token (Only with manual JWT implementation.)
   *       201:
   *         description: Training split successfully created.
   *       400:
   *        description: Invalid day of the week.
   *       409:
   *         description: A training split for this day already exists.
   *       500:
   *         description: There was an internal server error.
   *
   * /api/divisions/{id}:
   *   get:
   *     summary: Return a single division.
   *     tags: [Division]
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *        description: Division ID.
   *     responses:
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Expired or invalid token (Only with manual JWT implementation.)
   *       200:
   *         description: Success.
   *       404:
   *         description: Division not found.
   *       500:
   *         description: There was an internal server error.
   *
   *   delete:
   *     summary: Soft-delete a division.
   *     tags: [Division]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *        description: Division ID to be deleted.
   *     responses:
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Expired or invalid token (Only with manual JWT implementation.)
   *       200:
   *         description: Division successfully deleted.
   *       404:
   *         description: Division not found.
   *       409:
   *         description: Division contain exercises, please delete them before hand.
   *       500:
   *         description: There was an internal server error.
   */

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
