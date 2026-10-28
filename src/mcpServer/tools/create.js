import makeApiRequest from "../utils/apiRequest.js";
import errorHandling from "../utils/error.js";
import { z } from "zod";

const createWorkout = {
  name: "create_workout",
  config: {
    description: "Create a new workout",
    inputSchema: z.object({
      name: z.string().describe("Workout name (e.g. Main Workout)"),
      observation: z.string().optional().describe("Observation note"),
    }),
  },
  handler: errorHandling(
    "Create a new workout",
    async ({ name, observation }) => {
      const workout = await makeApiRequest("/workouts", {
        method: "POST",
        body: { name, observation },
      });
      return {
        content: [
          { type: "text", text: `Workout created: ${JSON.stringify(workout)}` },
        ],
      };
    },
  ),
};

const createDivision = {
  name: "create_division",
  config: {
    description: "Create a new division",
    inputSchema: z.object({
      name: z.string().describe("Division name (e.g. Push)"),
      day: z.string().describe("Day of the week (e.g Monday)"),
      workoutId: z
        .number()
        .describe("Id of the workout that this division belongs to"),
    }),
  },
  handler: errorHandling(
    "Create a new division",
    async ({ name, day, workoutId }) => {
      const division = await makeApiRequest("/divisions", {
        method: "POST",
        body: { name, day, workoutId },
      });
      return {
        content: [
          {
            type: "text",
            text: `Division created: ${JSON.stringify(division)}`,
          },
        ],
      };
    },
  ),
};

const createExercise = {
  name: "create_exercise",
  config: {
    description: "Create a new exercise",
    inputSchema: z.object({
      name: z.string().describe("Exercise name (e.g. Bench press)"),
      target_muscle_group: z.string().describe("Target muscle (e.g Chest)"),
      series_reps: z.string().describe("Series and reps (e.g 2x8)"),
      rest: z.number().describe("Rest between exercises (e.g 120)"),
      advanced_technique: z.string().optional().describe("(e.g backoff)"),
      observation: z.string().optional().describe("Observation note"),
      workoutId: z
        .number()
        .describe("Id of the workout that this exercise belongs to"),
      divisionId: z
        .number()
        .describe("Id of the division that this exercise belongs to"),
    }),
  },
  handler: errorHandling(
    "Create a new exercise",
    async ({
      name,
      target_muscle_group,
      series_reps,
      rest,
      advanced_technique,
      observation,
      workoutId,
      divisionId,
    }) => {
      const exercise = await makeApiRequest(
        `/exercises?workoutId=${workoutId}`,
        {
          method: "POST",
          body: {
            name,
            target_muscle_group,
            series_reps,
            rest,
            advanced_technique,
            observation,
            divisionId,
          },
        },
      );
      return {
        content: [
          {
            type: "text",
            text: `Exercise created: ${JSON.stringify(exercise)}`,
          },
        ],
      };
    },
  ),
};

const createLogbook = {
  name: "create_logbook",
  config: {
    description: "Create a new logbook",
    inputSchema: z.object({
      exerciseId: z
        .number()
        .describe("Id of the exercise that this logbook belongs to"),
      topset_weight: z
        .number()
        .describe("Topset weight of the exercise (e.g) 50"),
      topset_reps: z.number().describe("Topset reps of the exercise (e.g) 8"),
      extra: z.string().optional().describe("Extra information"),
      workoutId: z
        .number()
        .describe("Id of the workout that this logbook belongs to"),
      divisionId: z
        .number()
        .describe("Id of the divisionn that this logbook belongs to"),
    }),
  },
  handler: errorHandling(
    "Create a new logbook",
    async ({
      exerciseId,
      topset_weight,
      topset_reps,
      extra,
      workoutId,
      divisionId,
    }) => {
      const logbook = await makeApiRequest(`/logbooks?workoutId=${workoutId}`, {
        method: "POST",
        body: { exerciseId, topset_weight, topset_reps, extra, divisionId },
      });
      return {
        content: [
          { type: "text", text: `Logbook created: ${JSON.stringify(logbook)}` },
        ],
      };
    },
  ),
};

const syncLogbook = {
  name: "sync_logbooks",
  config: {
    description: "Sync one or more logbooks",
    inputSchema: z.object({
      exercises: z
        .array(z.number())
        .describe(
          "Id of the exercise(s) with unsyced logbook(s) (e.g one or more comma separated numbers inside an array: [1, 2])",
        ),
      workoutId: z
        .number()
        .describe("Id of the workout that this logbook belongs to"),
    }),
  },
  handler: errorHandling(
    "Sync one or more logbooks",
    async ({ exercises, workoutId }) => {
      const logbooks = await makeApiRequest(
        `/synclogbooks?workoutId=${workoutId}`,
        {
          method: "POST",
          body: { exercises },
        },
      );
      return {
        content: [
          {
            type: "text",
            text: `Logbook(s) added for syncronization: ${JSON.stringify(logbooks)}`,
          },
        ],
      };
    },
  ),
};

export const createTools = [
  createWorkout,
  createDivision,
  createExercise,
  createLogbook,
  syncLogbook,
];
