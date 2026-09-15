import express from "express";

const HistoricalRouter = (historicalService) => {
  const router = express.Router();

  /**
   * @swagger
   *
   * /api/historicals:
   *   get:
   *     summary: Return all historical archives.
   *     tags: [Historical]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: search
   *         required: false
   *         schema:
   *           type: string
   *         description: Optional search term for filtering historical archives.
   *     responses:
   *       200:
   *         description: Success.
   *       401:
   *         description: Token not included.
   *       403:
   *         description: Expired or invalid token.
   *       404:
   *         description: No historical archives found.
   *       500:
   *         description: There was an internal server error.
   *
   * /api/historicals/{id}:
   *   get:
   *     summary: Return a single historical archive.
   *     tags: [Historical]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Historical archive ID.
   *     responses:
   *       200:
   *         description: Success.
   *       401:
   *         description: Token not included.
   *       403:
   *         description: Expired or invalid token.
   *       404:
   *         description: Historical archive not found.
   *       500:
   *         description: There was an internal server error.
   *
   *   delete:
   *     summary: Soft-delete a historical archive.
   *     tags: [Historical]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Historical archive ID to be deleted.
   *     responses:
   *       200:
   *         description: Historical archive successfully deleted.
   *       401:
   *         description: Token not included.
   *       403:
   *         description: Expired or invalid token.
   *       404:
   *         description: Historical archive not found.
   *       500:
   *         description: There was an internal server error.
   */

  router.get("/historicals", async (req, res) => {
    const { search } = req.query;
    const isDeleted = false;

    const result = await historicalService.getHistorical(
      req.user.id,
      isDeleted,
      search,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/historicals/:id", async (req, res) => {
    const result = await historicalService.getHistoricalById(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.delete("/historicals/:id", async (req, res) => {
    const historicalDeleted = await historicalService.deleteHistorical(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: historicalDeleted,
    });
  });

  return router;
};

export default HistoricalRouter;
