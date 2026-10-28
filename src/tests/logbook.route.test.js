import { describe, it, expect, beforeEach } from "vitest";
import { getAuthedAgent } from "./user.route.js";
import { prisma } from "./setup.js";
import request from "supertest";
import app from "../server.js";

describe("logbook routes", () => {
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
    const res = await request(app).get("/api/logbooks");
    expect(res.status).toBe(401);
  });

  it("create a logbook without a valid exercise.", async () => {
    const res = await agent.post(`/api/logbooks?workoutId=${workout.id}`).send({
      exerciseId: exercise.id + 1,
      topset_weight: 30,
      topset_reps: 8,
      extra: "progressed 2-5%",
      divisionId: division.id,
      userId: Number(user.id),
    });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toBe("Exercise not found.");
  });

  it("logbook already exists but not synced", async () => {
    await agent.post(`/api/logbooks?workoutId=${workout.id}`).send({
      exerciseId: exercise.id,
      topset_weight: 20,
      topset_reps: 9,
      extra: "progressed 2-5%",
      divisionId: division.id,
      userId: Number(user.id),
    });

    const postRes = await agent
      .post(`/api/logbooks?workoutId=${workout.id}`)
      .send({
        exerciseId: exercise.id,
        topset_weight: 20,
        topset_reps: 9,
        extra: "progressed 2-5%",
        divisionId: division.id,
        userId: Number(user.id),
      });

    expect(postRes.status).toBe(400);
    expect(postRes.body.success).toBe(false);
    expect(postRes.body.data).toBe(
      "A logbook for this exercise already exists and it is not yet synced.",
    );
  });

  it("create a logbook", async () => {
    const res = await agent.post(`/api/logbooks?workoutId=${workout.id}`).send({
      exerciseId: exercise.id,
      topset_weight: 30,
      topset_reps: 8,
      extra: "progressed 2-5%",
      divisionId: division.id,
      userId: Number(user.id),
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe("Logbook successfully created.");
  });

  it("logbooks not found", async () => {
    const res = await agent
      .get(`/api/logbooks?workoutId=${workout.id + 1}`)
      .query({ page: 1, limit: 3 });

    expect(res.body.success).toBe(false);
    expect(res.status).toBe(404);
    expect(res.body.data).toBe("No logbooks found.");
  });

  it("does not return logbooks that belongs to another user", async () => {
    await agent.post(`/api/logbooks?workoutId=${workout.id}`).send({
      exerciseId: exercise.id,
      topset_weight: 20,
      topset_reps: 9,
      extra: "progressed 2-5%",
      divisionId: division.id,
      userId: Number(user.id),
    });

    const postRes = await agent
      .get(`/api/logbooks?workoutId=${workout.id + 1}`)
      .query({ page: 1, limit: 3 });

    expect(postRes.status).toBe(404);
    expect(postRes.body.success).toBe(false);
    expect(postRes.body.data).toBe("No logbooks found.");
  });

  it("return logbooks for the logged user", async () => {
    await agent.post(`/api/logbooks?workoutId=${workout.id}`).send({
      exerciseId: exercise.id,
      topset_weight: 20,
      topset_reps: 9,
      extra: "progressed 2-5%",
      divisionId: division.id,
      userId: Number(user.id),
    });

    const postRes = await agent
      .get(`/api/logbooks?workoutId=${workout.id}`)
      .query({ page: 1, limit: 3 });

    expect(postRes.status).toBe(200);
    expect(postRes.body.success).toBe(true);
    expect(postRes.body.data).toHaveLength(1);
  });

  it("logbook not found by its id", async () => {
    const res = await agent.get(`/api/logbooks/${999}?workoutId=${workout.id}`);

    expect(res.body.success).toBe(false);
    expect(res.status).toBe(404);
    expect(res.body.data).toBe("Logbook not found.");
  });

  it("returns a logbook by its id for the logged user", async () => {
    await agent.post(`/api/logbooks?workoutId=${workout.id}`).send({
      exerciseId: exercise.id,
      topset_weight: 20,
      topset_reps: 9,
      extra: "progressed 2-5%",
      divisionId: division.id,
      userId: Number(user.id),
    });

    const postRes = await agent
      .get(`/api/logbooks?workoutId=${workout.id}`)
      .query({ page: 1, limit: 3 });

    const afterRes = await agent.get(
      `/api/logbooks/${postRes.body.data[0].id}?workoutId=${workout.id}`,
    );

    expect(afterRes.status).toBe(200);
    expect(afterRes.body.success).toBe(true);
    expect(afterRes.body.data).toMatchObject({
      id: postRes.body.data[0].id,
      topset_weight: postRes.body.data[0].topset_weight,
      topset_reps: postRes.body.data[0].topset_reps,
      extra: postRes.body.data[0].extra,
    });
  });

  it("add logbooks for sync and get a job by it's id", async () => {
    await agent.post(`/api/logbooks?workoutId=${workout.id}`).send({
      exerciseId: exercise.id,
      topset_weight: 20,
      topset_reps: 9,
      extra: "progressed 2-5%",
      divisionId: division.id,
      userId: Number(user.id),
    });

    const res = await agent
      .post(`/api/synclogbooks?workoutId=${workout.id}`)
      .send({
        exercises: [exercise.id, exercise.id + 1],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe(
      "Logbook(s) successfully added for synchronization.",
    );

    // const postRes = await agent.get(`/api/logbooksjobs?workoutId=${res.body.data.id}`)
  }, 10000);

  it("delete a logbook by its id for the logged user", async () => {
    await agent.post(`/api/logbooks?workoutId=${workout.id}`).send({
      exerciseId: exercise.id,
      topset_weight: 20,
      topset_reps: 9,
      extra: "progressed 2-5%",
      divisionId: division.id,
      userId: Number(user.id),
    });

    const postRes = await agent
      .get(`/api/logbooks?workoutId=${workout.id}`)
      .query({ page: 1, limit: 3 });

    const beforeRes = await agent.delete(
      `/api/logbooks/${postRes.body.data[0].id}?workoutId=${workout.id}`,
    );

    expect(beforeRes.status).toBe(200);
    expect(beforeRes.body.data.message).toBe("Logbook successfully deleted.");

    const afterRes = await agent.get(
      `/api/logbooks/${postRes.body.data[0].id}?workoutId=${workout.id}`,
    );

    expect(afterRes.body.success).toBe(false);
    expect(afterRes.status).toBe(404);
    expect(afterRes.body.data).toBe("Logbook not found.");
  });
});
