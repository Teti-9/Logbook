import { authFetch } from "./auth.js";

export default async function syncLogbookService(body, workoutId) {
  const LOGBOOK_API = `http://localhost:8000/api/synclogbooks?workoutId=${workoutId}`;

  try {
    const response = await authFetch(LOGBOOK_API, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const data = await response.json();
      return { success: true, data: data };
    } else {
      const errorData = await response.json();
      let errorMessage = errorData.data;

      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
