import { describe, it, expect, beforeEach } from "vitest";
import { getAuthedAgent } from "./user.route.js";
import { prisma } from "./setup.js";
import request from "supertest";
import app from "../server.js";

describe("historical routes", () => {
  let agent, user, workout, division, exercise, logbook, historical;

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

    logbook = await prisma.logbook.create({
      data: {
        exerciseId: exercise.id,
        topset_weight: 30,
        topset_reps: 8,
        extra: "progressed 2-5%",
        workoutId: workout.id,
        divisionId: division.id,
        userId: Number(user.id),
      },
    });

    historical = await prisma.historical.create({
      data: {
        previous_topset_weight: 30,
        previous_topset_reps: 9,
        extra: "progressed 2-5%",
        workoutId: workout.id,
        divisionId: division.id,
        userId: Number(user.id),
        exerciseId: exercise.id,
        logbookId: logbook.id,
      },
    });
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/historicals");
    expect(res.status).toBe(401);
  });

  it("historicals not found", async () => {
    const res = await agent.get(
      `/api/historicals?workoutId=${workout.id + 1}&search=''`,
    );

    expect(res.body.success).toBe(false);
    expect(res.status).toBe(404);
    expect(res.body.data).toBe("No historical archives found.");
  });

  it("does not return a historical archive that belongs to another user", async () => {
    const res = await agent.get(
      `/api/historicals/${historical.id}?workoutId=${workout.id + 1}`,
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toBe("Historical archive not found.");
  });

  it("returns historicals for the logged user", async () => {
    const res = await agent.get(`/api/historicals?workoutId=${workout.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  it("historical not found by its id", async () => {
    const res = await agent.get(
      `/api/historicals/${historical.id + 999}?workoutId=${workout.id}`,
    );

    expect(res.body.success).toBe(false);
    expect(res.status).toBe(404);
    expect(res.body.data).toBe("Historical archive not found.");
  });

  it("returns a historical archive by its id for the logged user", async () => {
    const res = await agent.get(
      `/api/historicals/${historical.id}?workoutId=${workout.id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: historical.id,
      previous_topset_weight: historical.previous_topset_weight,
      previous_topset_reps: historical.previous_topset_reps,
      extra: historical.extra,
      isDeleted: false,
    });
  });

  it("delete a historical by its id for the logged user", async () => {
    const res = await agent.delete(
      `/api/historicals/${historical.id}?workoutId=${workout.id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.data).toStrictEqual({
      message: "Historical archive successfully deleted.",
    });

    const postRes = await agent.get(
      `/api/historicals/${historical.id}?workoutId=${workout.id}`,
    );
    expect(postRes.body.success).toBe(false);
    expect(postRes.status).toBe(404);
    expect(postRes.body.data).toBe("Historical archive not found.");
  });
});
