export const limits = { person: 100, place: 120, song: 120, artist: 100, context: 300, connection: 300, date: 10, destination: 120, connector: 100 };
export const travelStatuses = ["visited", "planned", "recommended", "unknown"] as const;
export type TravelStatus = typeof travelStatuses[number];
export type Details = Record<keyof typeof limits, string> & { travelStatus: TravelStatus };
export function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export function validateDetails(value: unknown): Details {
  if (!value || typeof value !== "object") throw new Error("Invalid details");
  const result = {} as Details;
  for (const [key, max] of Object.entries(limits)) {
    const item = (value as Record<string, unknown>)[key];
    if (typeof item !== "string" || item.length > max) throw new Error("Invalid detail");
    result[key as keyof typeof limits] = item;
  }
  if (result.date && !validDate(result.date)) throw new Error("Invalid date");
  const status = (value as Record<string, unknown>).travelStatus;
  if (!travelStatuses.includes(status as TravelStatus)) throw new Error("Invalid travel status");
  result.travelStatus = result.destination ? status as TravelStatus : "unknown";
  return result;
}
