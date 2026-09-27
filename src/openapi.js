const objectSchema = (properties, required = []) => ({
  type: "object",
  properties,
  ...(required.length ? { required } : {}),
});

const id = { type: "integer", minimum: 1, example: 1 };
const successResponse = (schema) => ({
  description: "Success.",
  content: {
    "application/json": {
      schema: objectSchema(
        { success: { type: "boolean", example: true }, data: schema },
        ["success", "data"],
      ),
    },
  },
});
const messageResponse = (message) =>
  successResponse(
    objectSchema({ message: { type: "string", example: message } }, [
      "message",
    ]),
  );
const errorResponse = (description) => ({ description });
const protectedOperation = (operation) => ({
  security: [{ cookieAuth: [] }],
  ...operation,
});
const paginatedParameters = [
  {
    in: "query",
    name: "page",
    schema: { type: "integer", minimum: 1, default: 1 },
  },
  {
    in: "query",
    name: "limit",
    schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
  },
];

const openapi = {
  openapi: "3.0.3",
  info: {
    title: "Logbook API",
    version: "1.1.0",
    description:
      "API for workout plans, training divisions, exercises, logbook entries, and progression history. Authentication uses Better Auth's HTTP-only session cookie.",
  },
  servers: [{ url: "http://localhost:8000", description: "Local development" }],
  tags: [
    {
      name: "Authentication",
      description: "Better Auth email/password session endpoints.",
    },
    { name: "Workouts" },
    { name: "Divisions" },
    { name: "Exercises" },
    { name: "Logbooks" },
    { name: "History" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
        description:
          "HTTP-only Better Auth session cookie. It is set after sign-in; do not send a Bearer token.",
      },
    },
    schemas: {
      WorkoutInput: objectSchema(
        {
          name: { type: "string", example: "Teti workout" },
          observation: {
            type: "string",
            nullable: true,
            example: "Four-day rotation",
          },
        },
        ["name"],
      ),
      DivisionInput: objectSchema(
        {
          name: { type: "string", example: "push" },
          day: {
            type: "string",
            enum: [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ],
            example: "monday",
          },
          workoutId: id,
        },
        ["name", "day", "workoutId"],
      ),
      ExerciseInput: objectSchema(
        {
          name: { type: "string", example: "bench press" },
          target_muscle_group: { type: "string", example: "chest" },
          series_reps: { type: "string", example: "4x8" },
          rest: { type: "integer", minimum: 1, example: 90 },
          advanced_technique: {
            type: "string",
            nullable: true,
            example: "backoff",
            description:
              "Free-form technique label (e.g. 'backoff'); not restricted to a fixed set of values.",
          },
          observation: {
            type: "string",
            nullable: true,
            example: "Keep a controlled eccentric.",
          },
          divisionId: id,
        },
        ["name", "target_muscle_group", "series_reps", "rest", "divisionId"],
      ),
      LogbookInput: objectSchema(
        {
          exerciseId: id,
          topset_weight: { type: "number", minimum: 1, example: 100 },
          topset_reps: { type: "integer", minimum: 1, example: 8 },
          extra: {
            type: "string",
            nullable: true,
            example: "Backoff: 90 kg x 8",
          },
        },
        ["exerciseId", "topset_weight", "topset_reps"],
      ),
      SyncInput: objectSchema(
        {
          exercises: { type: "array", items: id, example: [1, 2] },
        },
        ["exercises"],
      ),
      Pagination: objectSchema(
        {
          total: { type: "integer", example: 12 },
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          totalPages: { type: "integer", example: 2 },
        },
        ["total", "page", "limit", "totalPages"],
      ),
    },
  },
  paths: {
    "/api/auth/sign-up/email": {
      post: {
        tags: ["Authentication"],
        summary: "Create an email/password account",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: objectSchema(
                {
                  name: { type: "string", example: "Ada" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "ada@example.com",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    minLength: 4,
                  },
                },
                ["name", "email", "password"],
              ),
            },
          },
        },
        responses: {
          200: errorResponse(
            "Account created; Better Auth returns the user and may set a session cookie.",
          ),
          400: errorResponse("Invalid or duplicate account data."),
        },
      },
    },
    "/api/auth/sign-in/email": {
      post: {
        tags: ["Authentication"],
        summary: "Sign in and establish a session",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: objectSchema(
                {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
                ["email", "password"],
              ),
            },
          },
        },
        responses: {
          200: errorResponse(
            "Signed in. The response sets the Better Auth session cookie.",
          ),
          401: errorResponse("Invalid email or password."),
        },
      },
    },
    "/api/auth/get-session": {
      get: {
        tags: ["Authentication"],
        summary: "Read the current session",
        responses: {
          200: errorResponse("Current session, or null when unauthenticated."),
        },
      },
    },
    "/api/auth/sign-out": {
      post: {
        tags: ["Authentication"],
        summary: "End the current session",
        responses: { 200: errorResponse("Session cleared.") },
      },
    },
    "/api/workouts": {
      get: protectedOperation({
        tags: ["Workouts"],
        summary: "List the current user's workouts",
        parameters: paginatedParameters,
        responses: {
          200: successResponse(
            objectSchema(
              {
                workouts: { type: "array", items: { type: "object" } },
                pagination: { $ref: "#/components/schemas/Pagination" },
              },
              ["workouts", "pagination"],
            ),
          ),
          401: errorResponse("Missing or invalid session."),
          400: errorResponse("Page cannot be zero or a negative number."),
          404: errorResponse("No workouts found."),
        },
      }),
      post: protectedOperation({
        tags: ["Workouts"],
        summary: "Create a workout",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/WorkoutInput" },
            },
          },
        },
        responses: {
          201: messageResponse("Training split successfully created."),
          401: errorResponse("Missing or invalid session."),
        },
      }),
    },
    "/api/workouts/{id}": {
      get: protectedOperation({
        tags: ["Workouts"],
        summary: "Get one workout",
        parameters: [{ in: "path", name: "id", required: true, schema: id }],
        responses: {
          200: successResponse({ type: "object" }),
          404: errorResponse("Workout not found."),
        },
      }),
      delete: protectedOperation({
        tags: ["Workouts"],
        summary: "Soft-delete an empty workout",
        parameters: [{ in: "path", name: "id", required: true, schema: id }],
        responses: {
          200: messageResponse("Workout successfully deleted."),
          404: errorResponse("Workout not found."),
          409: errorResponse("The workout still contains divisions."),
        },
      }),
    },
    "/api/divisions": {
      get: protectedOperation({
        tags: ["Divisions"],
        summary: "List the current user's divisions",
        parameters: paginatedParameters,
        responses: {
          200: successResponse(
            objectSchema(
              {
                divisions: { type: "array", items: { type: "object" } },
                pagination: { $ref: "#/components/schemas/Pagination" },
              },
              ["divisions", "pagination"],
            ),
          ),
          400: errorResponse("Page cannot be zero or a negative number."),
          404: errorResponse("No divisions found."),
        },
      }),
      post: protectedOperation({
        tags: ["Divisions"],
        summary: "Create a division in a workout",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DivisionInput" },
            },
          },
        },
        responses: {
          201: messageResponse("Division successfully created."),
          400: errorResponse("Invalid day."),
          404: errorResponse("Workout not found."),
          409: errorResponse("A division already exists for this day."),
        },
      }),
    },
    "/api/divisions/{id}": {
      get: protectedOperation({
        tags: ["Divisions"],
        summary: "Get one division",
        parameters: [{ in: "path", name: "id", required: true, schema: id }],
        responses: {
          200: successResponse({ type: "object" }),
          404: errorResponse("Division not found."),
        },
      }),
      delete: protectedOperation({
        tags: ["Divisions"],
        summary: "Soft-delete an empty division",
        parameters: [{ in: "path", name: "id", required: true, schema: id }],
        responses: {
          200: messageResponse("Division successfully deleted."),
          404: errorResponse("Division not found."),
          409: errorResponse("The division still contains exercises."),
        },
      }),
    },
    "/api/exercises": {
      get: protectedOperation({
        tags: ["Exercises"],
        summary: "List the current user's exercises",
        parameters: paginatedParameters,
        responses: {
          200: successResponse(
            objectSchema(
              {
                exercises: { type: "array", items: { type: "object" } },
                pagination: { $ref: "#/components/schemas/Pagination" },
              },
              ["exercises", "pagination"],
            ),
          ),
          400: errorResponse("Page cannot be zero or a negative number."),
          404: errorResponse("No exercises found."),
        },
      }),
      post: protectedOperation({
        tags: ["Exercises"],
        summary: "Create an exercise",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExerciseInput" },
            },
          },
        },
        responses: {
          201: messageResponse("Exercise successfully created."),
          404: errorResponse("Division not found."),
        },
      }),
    },
    "/api/exercises/{id}": {
      get: protectedOperation({
        tags: ["Exercises"],
        summary: "Get one exercise",
        parameters: [{ in: "path", name: "id", required: true, schema: id }],
        responses: {
          200: successResponse({ type: "object" }),
          404: errorResponse("Exercise not found."),
        },
      }),
      delete: protectedOperation({
        tags: ["Exercises"],
        summary: "Soft-delete an exercise without unsynced entries",
        parameters: [{ in: "path", name: "id", required: true, schema: id }],
        responses: {
          200: messageResponse("Exercise successfully deleted."),
          404: errorResponse("Exercise not found."),
          409: errorResponse("The exercise has unsynced logbooks."),
        },
      }),
    },
    "/api/logbooks": {
      get: protectedOperation({
        tags: ["Logbooks"],
        summary: "List unsynced logbook entries",
        responses: {
          200: successResponse({ type: "array", items: { type: "object" } }),
          404: errorResponse("No logbooks found."),
        },
      }),
      post: protectedOperation({
        tags: ["Logbooks"],
        summary: "Create a logbook entry",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LogbookInput" },
            },
          },
        },
        responses: {
          201: messageResponse("Logbook successfully created."),
          400: errorResponse("The exercise already has an unsynced logbook."),
          404: errorResponse("Exercise not found."),
        },
      }),
    },
    "/api/logbooks/{id}": {
      get: protectedOperation({
        tags: ["Logbooks"],
        summary: "Get an unsynced logbook entry",
        parameters: [{ in: "path", name: "id", required: true, schema: id }],
        responses: {
          200: successResponse({ type: "object" }),
          404: errorResponse("Logbook not found."),
        },
      }),
      delete: protectedOperation({
        tags: ["Logbooks"],
        summary: "Soft-delete a logbook entry",
        parameters: [{ in: "path", name: "id", required: true, schema: id }],
        responses: {
          200: messageResponse("Logbook successfully deleted."),
          404: errorResponse("Logbook not found."),
        },
      }),
    },
    "/api/synclogbooks": {
      post: protectedOperation({
        tags: ["Logbooks"],
        summary: "Enqueue selected logbook entries for background sync",
        description:
          "Adds one BullMQ job per exercise id to archive its unsynced logbook into history and mark it synced. Returns immediately; poll GET /api/logbooksjobs/{jobId} with the returned job id(s) to check progress.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SyncInput" },
            },
          },
        },
        responses: {
          200: messageResponse(
            "Logbook(s) successfully added for synchronization.",
          ),
        },
      }),
    },
    "/api/logbooksjobs/{jobId}": {
      get: protectedOperation({
        tags: ["Logbooks"],
        summary: "Check the status of a logbook sync job",
        parameters: [{ in: "path", name: "jobId", required: true, schema: id }],
        responses: {
          200: successResponse(
            objectSchema(
              {
                state: {
                  type: "string",
                  example: "completed",
                  description:
                    "BullMQ job state, e.g. 'waiting', 'active', 'completed', 'failed'.",
                },
                failed: { type: "string", nullable: true },
                returnValue: { type: "object", nullable: true },
              },
              ["state"],
            ),
          ),
          404: errorResponse(
            "Job not found (or it does not belong to the current user).",
          ),
        },
      }),
    },
    "/api/historicals": {
      get: protectedOperation({
        tags: ["History"],
        summary: "List progression history",
        parameters: [
          {
            in: "query",
            name: "search",
            schema: { type: "string" },
            description: "Case-insensitive exercise-name search.",
          },
        ],
        responses: {
          200: successResponse({ type: "array", items: { type: "object" } }),
          404: errorResponse("No historical archives found."),
        },
      }),
    },
    "/api/historicals/{id}": {
      get: protectedOperation({
        tags: ["History"],
        summary: "Get one historical entry",
        parameters: [{ in: "path", name: "id", required: true, schema: id }],
        responses: {
          200: successResponse({ type: "object" }),
          404: errorResponse("Historical archive not found."),
        },
      }),
      delete: protectedOperation({
        tags: ["History"],
        summary: "Soft-delete a historical entry",
        parameters: [{ in: "path", name: "id", required: true, schema: id }],
        responses: {
          200: messageResponse("Historical archive successfully deleted."),
          404: errorResponse("Historical archive not found."),
        },
      }),
    },
  },
};

export default openapi;
