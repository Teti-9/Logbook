import makeApiRequest from "../utils/apiRequest.js";
import errorHandling from "../utils/error.js";
import { z } from "zod";

const deleteWorkoutbyId = {
  name: "delete_workoutbyId",
  config: {
    description: "Delete a workout by it's id",
    inputSchema: z.object({
      id: z.number().describe("Id of the workout"),
    }),
  },
  handler: errorHandling("Delete a workout by it's id", async ({ id }) => {
    const workout = await makeApiRequest(`/workouts/${id}`, {
      method: "DELETE",
    });
    return {
      content: [
        {
          type: "text",
          text: `Workout: ${JSON.stringify(workout)}`,
        },
      ],
    };
  }),
};

const deleteDivisionbyId = {
  name: "delete_divisionbyId",
  config: {
    description: "Delete a division by it's id",
    inputSchema: z.object({
      id: z.number().describe("Id of the division"),
      workoutId: z
        .number()
        .describe("Id of the workout that this division belongs to"),
    }),
  },
  handler: errorHandling(
    "Delete a division by it's id",
    async ({ id, workoutId }) => {
      const division = await makeApiRequest(
        `/divisions/${id}?workoutId=${workoutId}`,
        {
          method: "DELETE",
        },
      );
      return {
        content: [
          {
            type: "text",
            text: `Division: ${JSON.stringify(division)}`,
          },
        ],
      };
    },
  ),
};

const deleteExercisebyId = {
  name: "delete_exercisebyId",
  config: {
    description: "Delete a exercise by it's id",
    inputSchema: z.object({
      id: z.number().describe("Id of the exercise"),
      workoutId: z
        .number()
        .describe("Id of the workout that this exercise belongs to"),
      divisionId: z
        .number()
        .describe("Id of the division that this exercise belongs to"),
    }),
  },
  handler: errorHandling(
    "Delete a exercises by it's id",
    async ({ id, workoutId, divisionId }) => {
      const exercise = await makeApiRequest(
        `/exercises/${id}?workoutId=${workoutId}&divisionId=${divisionId}`,
        {
          method: "DELETE",
        },
      );
      return {
        content: [
          {
            type: "text",
            text: `Exercise: ${JSON.stringify(exercise)}`,
          },
        ],
      };
    },
  ),
};

const deletelogbookbyId = {
  name: "delete_logbookbyId",
  config: {
    description: "Delete a logbook by it's id",
    inputSchema: z.object({
      id: z.number().describe("Id of the logbook"),
      workoutId: z
        .number()
        .describe("Id of the workout that this logbook belongs to"),
    }),
  },
  handler: errorHandling(
    "Delete a logbook by it's id",
    async ({ id, workoutId }) => {
      const logbook = await makeApiRequest(
        `/logbooks/${id}?workoutId=${workoutId}`,
        {
          method: "DELETE",
        },
      );
      return {
        content: [
          {
            type: "text",
            text: `Logbook: ${JSON.stringify(logbook)}`,
          },
        ],
      };
    },
  ),
};

const deletehistoricalbyId = {
  name: "delete_historicalbyId",
  config: {
    description: "Delete a historical by it's id",
    inputSchema: z.object({
      id: z.number().describe("Id of the historical"),
      workoutId: z
        .number()
        .describe("Id of the workout that this historical belongs to"),
    }),
  },
  handler: errorHandling(
    "Delete a historical by it's id",
    async ({ id, workoutId }) => {
      const historical = await makeApiRequest(
        `/historicals/${id}?workoutId=${workoutId}`,
        {
          method: "DELETE",
        },
      );
      return {
        content: [
          {
            type: "text",
            text: `Historical: ${JSON.stringify(historical)}`,
          },
        ],
      };
    },
  ),
};

export const deleteTools = [
  deleteWorkoutbyId,
  deleteDivisionbyId,
  deleteExercisebyId,
  deletelogbookbyId,
  deletehistoricalbyId,
];
