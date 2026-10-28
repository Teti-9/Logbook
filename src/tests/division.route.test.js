import { describe, it, expect, beforeEach } from "vitest";
import { getAuthedAgent } from "./user.route.js";
import { prisma } from "./setup.js";
import request from "supertest";
import app from "../server.js";

describe("division routes", () => {
  let agent, user, workout, division;

  beforeEach(async () => {
    ({ agent, user } = await getAuthedAgent());

    workout = await prisma.workout.create({
      data: {
        name: "main workout",
        observation: "test",
        userId: Number(user.id),
      },
    });

    division = await prisma.division.create({
      data: {
        name: "push",
        day: "monday",
        workoutId: workout.id,
        userId: Number(user.id),
      },
    });
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/divisions");
    expect(res.status).toBe(401);
  });

  it("create a division without a workout that exists", async () => {
    const res = await agent.post("/api/divisions").send({
      name: "pull",
      day: "tuesday",
      workoutId: workout.id + 1,
      userId: Number(user.id),
    });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toBe(
      "Workout not found. Please create a workout first.",
    );
  });

  it("day is not a valid day", async () => {
    const res = await agent.post("/api/divisions").send({
      name: "pull",
      day: "RANDOM",
      workoutId: workout.id,
      userId: Number(user.id),
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("create a second division with the same day", async () => {
    const res = await agent.post("/api/divisions").send({
      name: "push",
      day: "Monday",
      workoutId: workout.id,
      userId: Number(user.id),
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("create a division", async () => {
    const res = await agent.post("/api/divisions").send({
      name: "pull",
      day: "tuesday",
      workoutId: workout.id,
      userId: Number(user.id),
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe("Division successfully created.");
  });

  it("divisions not found", async () => {
    const res = await agent
      .get(`/api/divisions?workoutId=${workout.id + 1}`)
      .query({ page: 1, limit: 3 });

    expect(res.body.success).toBe(false);
    expect(res.status).toBe(404);
    expect(res.body.data).toBe("No divisions found.");
  });

  it("does not return a division that belongs to another user", async () => {
    const res = await agent.get(
      `/api/divisions/${division.id + 1}?workoutId=${workout.id}`,
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toBe("Division not found.");
  });

  it("returns divisions for the logged user", async () => {
    const res = await agent
      .get(`/api/divisions?workoutId=${workout.id}`)
      .query({ page: 1, limit: 3 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.divisions).toHaveLength(1);
  });

  it("division not found by its id", async () => {
    const res = await agent.get(
      `/api/divisions/${division.id + 999}?workoutId=${workout.id}`,
    );

    expect(res.body.success).toBe(false);
    expect(res.status).toBe(404);
    expect(res.body.data).toBe("Division not found.");
  });

  it("returns a division by its id for the logged user", async () => {
    const res = await agent.get(
      `/api/divisions/${division.id}?workoutId=${workout.id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: division.id,
      name: division.name,
      day: division.day,
      userId: division.userId,
      isDeleted: false,
    });
  });

  it("division contain exercises", async () => {
    await prisma.exercises.create({
      data: {
        name: "push",
        target_muscle_group: "chest",
        series_reps: "2x9",
        rest: 120,
        advanced_technique: "backoff",
        observation: "machine",
        workoutId: workout.id,
        divisionId: division.id,
        userId: Number(user.id),
      },
    });

    const res = await agent.delete(
      `/api/divisions/${division.id}?workoutId=${workout.id}`,
    );
    expect(res.status).toBe(409);
    expect(res.body.data).toBe(
      "Division contain exercises, please delete them before hand.",
    );
  });

  it("delete a division by its id for the logged user", async () => {
    const res = await agent.delete(
      `/api/divisions/${division.id}?workoutId=${workout.id}`,
    );
    expect(res.status).toBe(200);
    expect(res.body.data).toStrictEqual({
      message: "Division successfully deleted.",
    });

    const postRes = await agent.get(
      `/api/divisions/${division.id}?workoutId=${workout.id}`,
    );
    expect(postRes.body.success).toBe(false);
    expect(postRes.status).toBe(404);
    expect(postRes.body.data).toBe("Division not found.");
  });
});
