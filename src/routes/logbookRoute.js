import express from "express";

const LogbookRouter = (logbookService) => {
  const router = express.Router();

  /**
   * @swagger
   *
   * /api/logbooks:
   *   get:
   *     summary: Return all logbooks.
   *     tags: [Logbook]
   *     responses:
   *       200:
   *         description: Success.
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Expired or invalid token (Only with manual JWT implementation.)
   *       404:
   *         description: No logbooks found.
   *       500:
   *         description: There was an internal server error.
   *
   *   post:
   *     summary: Create a new logbook entry.
   *     tags: [Logbook]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - exerciseId
   *               - topset_weight
   *               - topset_reps
   *               - extra
   *             properties:
   *               exerciseId:
   *                 type: integer
   *                 example: 1
   *               topset_weight:
   *                 type: number
   *                 example: 100
   *               topset_reps:
   *                 type: integer
   *                 example: 8
   *               extra:
   *                 type: string
   *                 example: back off progression 90x8
   *     responses:
   *       201:
   *         description: Logbook successfully created.
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Expired or invalid token (Only with manual JWT implementation.)
   *       404:
   *         description: Exercise not found.
   *       400:
   *         description: A logbook for this exercise already exists and it is not yet synced.
   *       500:
   *         description: There was an internal server error.
   *
   * /api/synclogbooks:
   *   post:
   *     summary: Synchronize one or more logbooks.
   *     tags: [Logbook]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - exercises
   *             properties:
   *               exercises:
   *                 type: array
   *                 items:
   *                   type: integer
   *                 example: [1, 2, 3]
   *     responses:
   *       200:
   *         description: Logbooks successfully synchronized.
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Expired or invalid token (Only with manual JWT implementation.)
   *       500:
   *         description: There was an internal server error.
   *
   * /api/logbooks/{id}:
   *   get:
   *     summary: Return a single logbook.
   *     tags: [Logbook]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Logbook ID.
   *     responses:
   *       200:
   *         description: Success.
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Expired or invalid token (Only with manual JWT implementation.)
   *       404:
   *         description: Logbook not found.
   *       500:
   *         description: There was an internal server error.
   *
   *   delete:
   *     summary: Soft-delete a logbook.
   *     tags: [Logbook]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Logbook ID to be deleted.
   *     responses:
   *       200:
   *         description: Logbook successfully deleted.
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Expired or invalid token (Only with manual JWT implementation.)
   *       404:
   *         description: Logbook not found.
   *       500:
   *         description: There was an internal server error.
   */

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
