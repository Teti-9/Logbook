import { describe, it, expect, beforeEach } from "vitest";
import { getAuthedAgent } from "./user.route.js";
import { prisma } from "./setup.js";
import request from "supertest";
import app from "../server.js";

describe("workout routes", () => {
  let agent, user, workout;

  beforeEach(async () => {
    ({ agent, user } = await getAuthedAgent());

    workout = await prisma.workout.create({
      data: {
        name: "main workout",
        observation: "test",
        userId: Number(user.id),
      },
    });
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/workouts");
    expect(res.status).toBe(401);
  });

  it("create a workout", async () => {
    const res = await agent.post("/api/workouts").send({
      name: "second workout",
      observation: "test 2",
      userId: Number(user.id),
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe("Training split successfully created.");
  });

  it("workouts not found", async () => {
    await agent.delete(`/api/workouts/${workout.id}`);
    const res = await agent.get(`/api/workouts`).query({ page: 1, limit: 3 });

    expect(res.body.success).toBe(false);
    expect(res.status).toBe(200);
    expect(res.body.data).toBe("No workouts found.");
  });

  it("does not return a workout that belongs to another user", async () => {
    const res = await agent.get(`/api/workouts/${workout.id + 1}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("returns workouts for the logged user", async () => {
    const res = await agent.get("/api/workouts").query({ page: 1, limit: 3 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.workouts).toHaveLength(1);
  });

  it("workout not found by its id", async () => {
    const res = await agent.get(`/api/workouts/${workout.id + 999}`);

    expect(res.body.success).toBe(false);
    expect(res.status).toBe(404);
    expect(res.body.data).toBe("Workout not found.");
  });

  it("returns a workout by its id for the logged user", async () => {
    const res = await agent.get(`/api/workouts/${workout.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: workout.id,
      name: workout.name,
      userId: workout.userId,
      isDeleted: false,
    });
  });

  it("workout contain divisions", async () => {
    await prisma.division.create({
      data: {
        name: "push",
        day: "monday",
        workoutId: workout.id,
        userId: Number(user.id),
      },
    });

    const res = await agent.delete(`/api/workouts/${workout.id}`);
    expect(res.status).toBe(409);
    expect(res.body.data).toBe(
      "Workout contain divisions, please delete them before hand.",
    );
  });

  it("delete a workout by its id for the logged user", async () => {
    const res = await agent.delete(`/api/workouts/${workout.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toStrictEqual({
      message: "Workout successfully deleted.",
    });

    const postRes = await agent.get(`/api/workouts/${workout.id}`);
    expect(postRes.body.success).toBe(false);
    expect(postRes.status).toBe(404);
    expect(postRes.body.data).toBe("Workout not found.");
  });
});
