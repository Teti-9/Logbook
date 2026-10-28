import request from "supertest";
import app from "../server.js";

export async function getAuthedAgent({
  email = "test@example.com",
  password = "1234",
  name = "Test User",
} = {}) {
  const agent = request.agent(app);
  await agent.post("/api/auth/sign-up/email").send({ email, password, name });

  const res = await agent
    .post("/api/auth/sign-in/email")
    .send({ email, password });
  if (res.status !== 200)
    throw new Error(
      `Sign-in failed: ${res.status} ${JSON.stringify(res.body)}`,
    );

  return { agent, user: res.body.user };
}
