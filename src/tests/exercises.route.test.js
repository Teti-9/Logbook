import { describe, it, expect, beforeEach } from "vitest";
import { getAuthedAgent } from "./user.route.js";
import { prisma } from "./setup.js";
import request from "supertest";
import app from "../server.js";

describe("exercises routes", () => {
  let agent, user, workout, division, exercise;

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

    exercise = await prisma.exercises.create({
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
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/exercises");
    expect(res.status).toBe(401);
  });

  it("create a exercise without a valid division.", async () => {
    const res = await agent
      .post(`/api/exercises?workoutId=${workout.id}`)
      .send({
        name: "push",
        target_muscle_group: "chest",
        series_reps: "2x9",
        rest: 120,
        advanced_technique: "backoff",
        observation: "machine",
        divisionId: division.id + 1,
        userId: Number(user.id),
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toBe("Division not found.");
  });

  it("create a exercise", async () => {
    const res = await agent
      .post(`/api/exercises?workoutId=${workout.id}`)
      .send({
        name: "push",
        target_muscle_group: "chest",
        series_reps: "2x9",
        rest: 120,
        advanced_technique: "backoff",
        observation: "machine",
        divisionId: division.id,
        userId: Number(user.id),
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe("Exercise successfully created.");
  });

  it("exercises not found", async () => {
    const res = await agent
      .get(
        `/api/exercises?workoutId=${workout.id}&divisionId=${division.id + 1}`,
      )
      .query({ page: 1, limit: 3 });

    expect(res.body.success).toBe(false);
    expect(res.status).toBe(404);
    expect(res.body.data).toBe("No exercises found.");
  });

  it("does not return a exercise that belongs to another user", async () => {
    const res = await agent.get(
      `/api/exercises/${exercise.id + 1}?workoutId=${workout.id}&divisionId=${division.id}`,
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toBe("Exercise not found.");
  });

  it("returns exercises for the logged user", async () => {
    const res = await agent
      .get(`/api/exercises?workoutId=${workout.id}&divisionId=${division.id}`)
      .query({ page: 1, limit: 3 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.exercises).toHaveLength(1);
  });

  it("exercise not found by its id", async () => {
    const res = await agent.get(
      `/api/exercises/${exercise.id + 999}?workoutId=${workout.id}&divisionId=${division.id}`,
    );

    expect(res.body.success).toBe(false);
    expect(res.status).toBe(404);
    expect(res.body.data).toBe("Exercise not found.");
  });

  it("returns a exercise by its id for the logged user", async () => {
    const res = await agent.get(
      `/api/exercises/${exercise.id}?workoutId=${workout.id}&divisionId=${division.id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: exercise.id,
      name: exercise.name,
      target_muscle_group: exercise.target_muscle_group,
      series_reps: exercise.series_reps,
      rest: exercise.rest,
      advanced_technique: exercise.advanced_technique,
      observation: exercise.observation,
      userId: division.userId,
      isDeleted: false,
    });
  });

  it("exercise contain unsynced logbooks", async () => {
    await prisma.logbook.create({
      data: {
        topset_weight: 20,
        topset_reps: 9,
        extra: "progressed 2-5%",
        sync: false,
        workoutId: workout.id,
        divisionId: division.id,
        exerciseId: exercise.id,
        userId: Number(user.id),
      },
    });

    const res = await agent.delete(
      `/api/exercises/${exercise.id}?workoutId=${workout.id}&divisionId=${division.id}`,
    );
    expect(res.status).toBe(409);
    expect(res.body.data).toBe(
      "Exercise contains unsynced logbooks, please delete or sync them before hand.",
    );
  });

  it("delete a exercise by its id for the logged user", async () => {
    const res = await agent.delete(
      `/api/exercises/${exercise.id}?workoutId=${workout.id}&divisionId=${division.id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.data).toStrictEqual({
      message: "Exercise successfully deleted.",
    });

    const postRes = await agent.get(
      `/api/exercises/${exercise.id}?workoutId=${workout.id}&divisionId=${division.id}`,
    );
    expect(postRes.body.success).toBe(false);
    expect(postRes.status).toBe(404);
    expect(postRes.body.data).toBe("Exercise not found.");
  });
});
