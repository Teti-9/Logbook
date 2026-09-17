import express from "express";

const ExercisesRouter = (exercisesService) => {
  const router = express.Router();

  /**
   * @swagger
   *
   * /api/exercises:
   *   get:
   *     summary: Return all exercises.
   *     tags: [Exercise]
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
   *         description: No exercises found.
   *       500:
   *         description: There was an internal server error.
   *
   *   post:
   *     summary: Create a new exercise.
   *     tags: [Exercise]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - target_muscle_group
   *               - series_reps
   *               - rest
   *               - advanced_technique
   *               - observation
   *               - divisionId
   *             properties:
   *               name:
   *                 type: string
   *                 example: Bench Press
   *               target_muscle_group:
   *                 type: string
   *                 example: Chest
   *               series_reps:
   *                 type: string
   *                 example: 4x8
   *               rest:
   *                 type: number
   *                 example: 90
   *               advanced_technique:
   *                 type: string
   *                 example: Backoff (Optional)
   *               observation:
   *                 type: string
   *                 example: Focus on form and control. (Optional)
   *               divisionId:
   *                 type: integer
   *                 example: 1
   *     responses:
   *       201:
   *         description: Exercise successfully created.
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Expired or invalid token (Only with manual JWT implementation.)
   *       404:
   *         description: Division not found.
   *       500:
   *         description: There was an internal server error.
   *
   * /api/exercises/{id}:
   *   get:
   *     summary: Return a single exercise.
   *     tags: [Exercise]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Exercise ID.
   *     responses:
   *       200:
   *         description: Success.
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Expired or invalid token (Only with manual JWT implementation.)
   *       404:
   *         description: Exercise not found.
   *       500:
   *         description: There was an internal server error.
   *
   *   delete:
   *     summary: Soft-delete an exercise.
   *     tags: [Exercise]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Exercise ID to be deleted.
   *     responses:
   *       200:
   *         description: Exercise successfully deleted.
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Expired or invalid token (Only with manual JWT implementation.)
   *       404:
   *         description: Exercise not found.
   *       409:
   *         description: Exercise contains unsynced logbooks, please delete or sync them before hand.
   *       500:
   *         description: There was an internal server error.
   */

  router.get("/exercises", async (req, res) => {
    const { page, limit } = req.query;

    const result = await exercisesService.getExercises(req.user.id, {
      page,
      limit,
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
