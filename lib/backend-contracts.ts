export type PlatformAccessState =
  | { kind: "ready" }
  | { kind: "unauthenticated" }
  | { kind: "unavailable" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function classifyPlatformAccess(
  status: number,
  body: unknown,
): PlatformAccessState {
  if (status === 401) {
    return { kind: "unauthenticated" };
  }
  if (
    status === 200 &&
    isRecord(body) &&
    body.is_platform_admin === true
  ) {
    return { kind: "ready" };
  }
  return { kind: "unavailable" };
}
