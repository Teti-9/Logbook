import dotenv from "dotenv";

dotenv.config();

const USER_AGENT = "logbook-api/1.0";
const API_BASE = "http://localhost:8000/api";
const EMAIL = "teti@teti.com";
const PASSWORD = "1234";
const ORIGIN = "http://localhost:8000/api";

let sessionCookie = null;
let signInPromise = null;

function baseHeaders() {
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/json",
  };
  if (ORIGIN) headers.Origin = ORIGIN;
  return headers;
}

async function signIn() {
  if (!EMAIL || !PASSWORD) {
    throw new Error("EMAIL and PASSWORD must be set");
  }

  const response = await fetch(`${API_BASE}/auth/sign-in/email`, {
    method: "POST",
    headers: { ...baseHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Sign-in failed, HTTP ${response.status}: ${details}`);
  }

  const cookies = response.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .filter(Boolean);

  if (cookies.length === 0) {
    throw new Error("Sign-in succeeded but no Set-Cookie header was returned");
  }

  sessionCookie = cookies.join("; ");
}

function ensureSignedIn(force = false) {
  if (!force && sessionCookie) return Promise.resolve();
  if (!signInPromise) {
    signInPromise = signIn().finally(() => {
      signInPromise = null;
    });
  }
  return signInPromise;
}

async function makeApiRequest(
  path,
  { method = "GET", body } = {},
  retried = false,
) {
  await ensureSignedIn();

  const headers = { ...baseHeaders(), Cookie: sessionCookie };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !retried) {
    await ensureSignedIn(true);
    return makeApiRequest(path, { method, body }, true);
  }

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${details}`);
  }
  return response.json();
}

export default makeApiRequest;
