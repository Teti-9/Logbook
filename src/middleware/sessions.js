import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";

export default async function sessionsMiddleware(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ success: false, data: "Unauthorized." });
    }

    req.user = { id: Number(session.user.id) };
    return next();
  } catch (error) {
    return next(error);
  }
}
