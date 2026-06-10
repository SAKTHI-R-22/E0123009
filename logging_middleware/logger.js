// logging_middleware/logger.js
// Reusable logging middleware (CommonJS) – posts to the evaluation service.
// Usage: Log(stack, level, pkg, message)
//   stack: "backend" | "frontend"
//   level: "debug" | "info" | "warn" | "error" | "fatal"
//   pkg: allowed package string (see validation)
//   message: descriptive log text

const LOG_ENDPOINT = "http://4.224.186.213/evaluation-service/logs";
// Bearer token supplied by the assessment (do NOT expose publicly in a real project)
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYWt0aGk3NjEzcmFtYWRhc3NrQGdtYWlsLmNvbSIsImV4cCI6MTc4MTA2OTE0NCwiaWF0IjoxNzgxMDY4MjQ0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMTRhMWY5ZGEtYjcyYS00NzQ4LTlhZDgtZjkyZTE2YmFkZmNlIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2FrdGhpIHIiLCJzdWIiOiJkZTljMWMxYy0xYWI3LTQ5ODMtYTZlYi1mYTg1MzY5ODBjZjUifSwiZW1haWwiOiJzYWt0aGk3NjEzcmFtYWRhc3NrQGdtYWlsLmNvbSIsIm5hbWUiOiJzYWt0aGkgciIsInJvbGxObyI6ImUwMTIzMDA5IiwiYWNjZXNzQ29kZSI6IkR2d0VEWiIsImNsaWVudElEIjoiZGU5YzFjMWMtMWFiNy00OTgzLWE2ZWItZmE4NTM2OTgwY2Y1IiwiY2xpZW50U2VjcmV0IjoiZVFEcG1KeHJXZnd1aGZRcSJ9.yNgj_bDHDN0LvwIER8hI7bBn0lZuhwPNO-6WKmmyeeU";

function validateParams(stack, level, pkg) {
  const stacks = ["backend", "frontend"];
  const levels = ["debug", "info", "warn", "error", "fatal"];
  const backendPkgs = ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"];
  const frontendPkgs = ["api", "component", "hook", "page", "state", "style"];
  const sharedPkgs = ["auth", "config", "middleware", "utils"];

  if (!stacks.includes(stack)) {
    throw new Error(`Invalid stack: ${stack}`);
  }
  if (!levels.includes(level)) {
    throw new Error(`Invalid level: ${level}`);
  }
  const allowedPkgs = stack === "backend" ? [...backendPkgs, ...sharedPkgs] : [...frontendPkgs, ...sharedPkgs];
  if (!allowedPkgs.includes(pkg)) {
    throw new Error(`Invalid package for ${stack}: ${pkg}`);
  }
}

/**
 * Sends a log entry to the remote logging service.
 * Fire‑and‑forget; errors are swallowed to keep UI responsive.
 */
async function Log(stack, level, pkg, message) {
  try {
    validateParams(stack, level, pkg);
    await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH_TOKEN,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (err) {
    console.error("Logging failed:", err);
  }
}

module.exports = { Log };
