import express from "express";

const DivisionRouter = (divisionService) => {
  const router = express.Router();

  router.get("/divisions", async (req, res) => {
    const { page, limit } = req.query;

    const result = await divisionService.getDivisions(req.user.id, {
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.get("/divisions/:id", async (req, res) => {
    const result = await divisionService.getDivisionById(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  });

  router.post("/divisions", async (req, res) => {
    const divisionCreated = await divisionService.createDivision(
      req.user.id,
      req.body,
    );

    return res.status(201).json({
      success: true,
      data: divisionCreated,
    });
  });

  router.delete("/divisions/:id", async (req, res) => {
    const divisionDeleted = await divisionService.deleteDivision(
      req.user.id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: divisionDeleted,
    });
  });

  return router;
};

export default DivisionRouter;
