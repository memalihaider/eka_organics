/* PIN-code helpers.
   ⚠ Delivery estimates are approximations. Before launch, replace checkPin()
   with your courier's serviceability API (Shiprocket / Delhivery). */

const STATE_BY_PIN: [number, number, string][] = [
  [11, 11, "Delhi"], [12, 13, "Haryana"], [14, 16, "Punjab"], [17, 17, "Himachal Pradesh"],
  [18, 19, "Jammu & Kashmir"], [20, 28, "Uttar Pradesh"], [30, 34, "Rajasthan"], [36, 39, "Gujarat"],
  [40, 44, "Maharashtra"], [45, 48, "Madhya Pradesh"], [49, 49, "Chhattisgarh"], [50, 50, "Telangana"],
  [51, 53, "Andhra Pradesh"], [56, 59, "Karnataka"], [60, 64, "Tamil Nadu"], [67, 69, "Kerala"],
  [70, 74, "West Bengal"], [75, 77, "Odisha"], [78, 78, "Assam"], [79, 79, "North East"], [80, 85, "Bihar"],
];

export const STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "North East", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

const METRO: Record<number, string> = { 11: "Delhi NCR", 40: "Mumbai", 56: "Bengaluru", 60: "Chennai", 70: "Kolkata", 50: "Hyderabad", 41: "Pune", 38: "Ahmedabad", 12: "Gurugram" };

export function stateFor(pin: string) {
  const d = +pin.slice(0, 2);
  return STATE_BY_PIN.find(([a, b]) => d >= a && d <= b)?.[2] ?? "";
}

function addWorkingDays(n: number) {
  const d = new Date();
  let added = 0;
  while (added < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) added++; }
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export type PinResult =
  | { ok: false }
  | { ok: true; metro?: string; remote: boolean; by: string; cod: boolean; place: string };

export function checkPin(pin: string): PinResult {
  if (!/^[1-8]\d{5}$/.test(pin)) return { ok: false };
  const d = +pin.slice(0, 2);
  const remote = [18, 19, 79].includes(d) || pin.startsWith("744");
  const metro = METRO[d];
  const days = metro ? 3 : remote ? 8 : 6;
  return { ok: true, metro, remote, by: addWorkingDays(days), cod: !remote, place: metro || stateFor(pin) };
}
