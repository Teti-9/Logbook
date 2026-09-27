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
    }),
  },
  handler: errorHandling("Delete a division by it's id", async ({ id }) => {
    const division = await makeApiRequest(`/divisions/${id}`, {
      method: "DELETE",
    });
    return {
      content: [
        {
          type: "text",
          text: `Division: ${JSON.stringify(division)}`,
        },
      ],
    };
  }),
};

const deleteExercisebyId = {
  name: "delete_exercisebyId",
  config: {
    description: "Delete a exercise by it's id",
    inputSchema: z.object({
      id: z.number().describe("Id of the exercise"),
    }),
  },
  handler: errorHandling("Delete a exercises by it's id", async ({ id }) => {
    const exercise = await makeApiRequest(`/exercises/${id}`, {
      method: "DELETE",
    });
    return {
      content: [
        {
          type: "text",
          text: `Exercise: ${JSON.stringify(exercise)}`,
        },
      ],
    };
  }),
};

const deletelogbookbyId = {
  name: "delete_logbookbyId",
  config: {
    description: "Delete a logbook by it's id",
    inputSchema: z.object({
      id: z.number().describe("Id of the logbook"),
    }),
  },
  handler: errorHandling("Delete a logbook by it's id", async ({ id }) => {
    const logbook = await makeApiRequest(`/logbooks/${id}`, {
      method: "DELETE",
    });
    return {
      content: [
        {
          type: "text",
          text: `Logbook: ${JSON.stringify(logbook)}`,
        },
      ],
    };
  }),
};

const deletehistoricalbyId = {
  name: "delete_historicalbyId",
  config: {
    description: "Delete a historical by it's id",
    inputSchema: z.object({
      id: z.number().describe("Id of the historical"),
    }),
  },
  handler: errorHandling("Delete a historical by it's id", async ({ id }) => {
    const historical = await makeApiRequest(`/historicals/${id}`, {
      method: "DELETE",
    });
    return {
      content: [
        {
          type: "text",
          text: `Historical: ${JSON.stringify(historical)}`,
        },
      ],
    };
  }),
};

export const deleteTools = [
  deleteWorkoutbyId,
  deleteDivisionbyId,
  deleteExercisebyId,
  deletelogbookbyId,
  deletehistoricalbyId,
];
