export type PlatformActionState = { status: "idle" | "success" | "error"; message: string; requestId: string | null };
export const INITIAL_ACTION_STATE: PlatformActionState = { status: "idle", message: "", requestId: null };
