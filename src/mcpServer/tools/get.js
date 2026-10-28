import makeApiRequest from "../utils/apiRequest.js";
import errorHandling from "../utils/error.js";
import { z } from "zod";

const getWorkouts = {
  name: "get_workouts",
  config: {
    description: "Return all workouts",
    inputSchema: z.object({
      page: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Page number (optional and defaults to 1.)"),
      limit: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Items per page (optional and defaults to 10.)"),
    }),
  },
  handler: errorHandling("Return all workouts", async ({ page, limit }) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.set("page", String(page));
    if (limit !== undefined) params.set("limit", String(limit));

    const response = await makeApiRequest(`/workouts?${params}`, {
      method: "GET",
    });
    const { workouts, pagination } = response.data;
    return {
      content: [
        {
          type: "text",
          text: `Workouts: ${JSON.stringify({ workouts, pagination })}`,
        },
      ],
    };
  }),
};

const getWorkoutbyId = {
  name: "get_workoutbyId",
  config: {
    description: "Return a workout by it's id",
    inputSchema: z.object({
      id: z.number().describe("Id of the workout"),
    }),
  },
  handler: errorHandling("Return a workout by it's id", async ({ id }) => {
    const workout = await makeApiRequest(`/workouts/${id}`, {
      method: "GET",
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

const getDivisions = {
  name: "get_divisions",
  config: {
    description: "Return all divisions",
    inputSchema: z.object({
      page: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Page number (optional and defaults to 1.)"),
      limit: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Items per page (optional and defaults to 10.)"),
      workoutId: z
        .number()
        .describe("Id of the workout that this division belongs to"),
    }),
  },
  handler: errorHandling(
    "Return all divisions",
    async ({ page, limit, workoutId }) => {
      const params = new URLSearchParams();
      if (workoutId !== undefined) params.set("workoutId", String(workoutId));
      if (page !== undefined) params.set("page", String(page));
      if (limit !== undefined) params.set("limit", String(limit));
      const response = await makeApiRequest(`/divisions?${params}`, {
        method: "GET",
      });
      const { divisions, pagination } = response.data;
      return {
        content: [
          {
            type: "text",
            text: `Divisions: ${JSON.stringify({ divisions, pagination })}`,
          },
        ],
      };
    },
  ),
};

const getDivisionbyId = {
  name: "get_divisionbyId",
  config: {
    description: "Return a division by it's id",
    inputSchema: z.object({
      id: z.number().describe("Id of the division"),
      workoutId: z
        .number()
        .describe("Id of the workout that this division belongs to"),
    }),
  },
  handler: errorHandling(
    "Return a division by it's id",
    async ({ id, workoutId }) => {
      const division = await makeApiRequest(
        `/divisions/${id}?workoutId=${workoutId}`,
        {
          method: "GET",
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

const getExercises = {
  name: "get_exercises",
  config: {
    description: "Return all exercises",
    inputSchema: z.object({
      page: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Page number (optional and defaults to 1.)"),
      limit: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Items per page (optional and defaults to 10.)"),
      workoutId: z
        .number()
        .describe("Id of the workout that this exercise belongs to"),
      divisionId: z
        .number()
        .describe("Id of the division that this exercise belongs to"),
    }),
  },
  handler: errorHandling(
    "Return all exercises",
    async ({ page, limit, workoutId, divisionId }) => {
      const params = new URLSearchParams();
      if (workoutId !== undefined) params.set("workoutId", String(workoutId));
      if (divisionId !== undefined)
        params.set("divisionId", String(divisionId));
      if (page !== undefined) params.set("page", String(page));
      if (limit !== undefined) params.set("limit", String(limit));
      const response = await makeApiRequest(`/exercises?${params}`, {
        method: "GET",
      });
      const { exercises, pagination } = response.data;
      return {
        content: [
          {
            type: "text",
            text: `Exercises: ${JSON.stringify({ exercises, pagination })}`,
          },
        ],
      };
    },
  ),
};

const getExercisebyId = {
  name: "get_exercisebyId",
  config: {
    description: "Return a exercise by it's id",
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
    "Return a exercises by it's id",
    async ({ id, workoutId, divisionId }) => {
      const exercise = await makeApiRequest(
        `/exercises/${id}?workoutId=${workoutId}&divisionId=${divisionId}`,
        {
          method: "GET",
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

const getLogbooks = {
  name: "get_logbooks",
  config: {
    description: "Return all logbooks",
    inputSchema: z.object({
      workoutId: z
        .number()
        .describe("Id of the workout that this logbook belongs to"),
    }),
  },
  handler: errorHandling("Return all logbooks", async ({ workoutId }) => {
    const response = await makeApiRequest(`/logbooks?workoutId=${workoutId}`, {
      method: "GET",
    });
    return {
      content: [
        { type: "text", text: `Logbooks: ${JSON.stringify(response)}` },
      ],
    };
  }),
};

const getlogbookbyId = {
  name: "get_logbookbyId",
  config: {
    description: "Return a logbook by it's id",
    inputSchema: z.object({
      id: z.number().describe("Id of the logbook"),
      workoutId: z
        .number()
        .describe("Id of the workout that this logbook belongs to"),
    }),
  },
  handler: errorHandling(
    "Return a logbook by it's id",
    async ({ id, workoutId }) => {
      const logbook = await makeApiRequest(
        `/logbooks/${id}?workoutId=${workoutId}`,
        {
          method: "GET",
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

const getlogbookJob = {
  name: "get_logbookJob",
  config: {
    description: "Return a BullMQ job by it's id",
    inputSchema: z.object({
      jobId: z.number().describe("Id of the job"),
    }),
  },
  handler: errorHandling(
    "Return a BullMQ job by it's id",
    async ({ jobId }) => {
      const job = await makeApiRequest(`/logbooksjobs/${jobId}`, {
        method: "GET",
      });
      return {
        content: [
          {
            type: "text",
            text: `Job: ${JSON.stringify(job)}`,
          },
        ],
      };
    },
  ),
};

const getHistoricals = {
  name: "get_historicals",
  config: {
    description: "Return all historicals",
    inputSchema: z.object({
      search: z.string().optional().describe("Name of the exercise"),
      workoutId: z
        .number()
        .describe("Id of the workout that this historical belongs to"),
    }),
  },
  handler: errorHandling(
    "Return all historicals",
    async ({ search, workoutId }) => {
      const params = new URLSearchParams();
      if (search !== undefined) params.set("search", search);
      if (workoutId !== undefined) params.set("workoutId", workoutId);

      const response = await makeApiRequest(`/historicals?${params}`, {
        method: "GET",
      });
      return {
        content: [
          { type: "text", text: `Historicals: ${JSON.stringify(response)}` },
        ],
      };
    },
  ),
};

const gethistoricalbyId = {
  name: "get_historicalbyId",
  config: {
    description: "Return a historical by it's id",
    inputSchema: z.object({
      id: z.number().describe("Id of the historical"),
      workoutId: z
        .number()
        .describe("Id of the workout that this historical belongs to"),
    }),
  },
  handler: errorHandling(
    "Return a historical by it's id",
    async ({ id, workoutId }) => {
      const historical = await makeApiRequest(
        `/historicals/${id}?workoutId=${workoutId}`,
        {
          method: "GET",
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

export const getTools = [
  getWorkouts,
  getWorkoutbyId,
  getDivisions,
  getDivisionbyId,
  getExercises,
  getExercisebyId,
  getLogbooks,
  getlogbookbyId,
  getlogbookJob,
  getHistoricals,
  gethistoricalbyId,
];
