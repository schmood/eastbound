/* facts.js — 35 fun facts for the daily 9 AM trip-countdown push.
   One per morning from late June to departure (Jul 29). The list cycles, so it
   keeps working during and after the trip too. Reviewed/curated content. */

export const FACTS = [
  // Ottawa
  "Ottawa's Rideau Canal freezes into the world's largest naturally frozen skating rink each winter (~7.8 km) — and it's a UNESCO World Heritage Site.",
  "Queen Victoria chose Ottawa as Canada's capital back in 1857, partly because it sat safely between English and French Canada.",
  "Ottawa's ByWard Market has been running since 1826 — one of Canada's oldest public markets.",
  "The Peace Tower on Parliament Hill holds a 53-bell carillon that's still played by hand.",
  // Québec City
  "Old Québec is the only walled city north of Mexico with its fortifications still standing — a UNESCO World Heritage Site.",
  "Québec City was founded by Samuel de Champlain in 1608 — it's more than 400 years old.",
  "Montmorency Falls is 83 m tall — about 30 m higher than Niagara Falls.",
  "Old Québec's funicular has carried people between the Upper and Lower Towns since 1879.",
  "The Château Frontenac is often called the most photographed hotel in the world.",
  // Fredericton
  "Fredericton is nicknamed 'The City of Stately Elms.'",
  "Fredericton's University of New Brunswick (1785) is one of the oldest public universities in North America.",
  // PEI
  "The Confederation Bridge to PEI is 12.9 km long — the world's longest bridge over ice-covered water (about a 10-minute drive).",
  "PEI's red soil and beaches get their colour from iron oxide — basically rust.",
  "The real farmhouse behind 'Anne of Green Gables' (1908) is on PEI; author L.M. Montgomery grew up nearby.",
  "PEI is Canada's smallest province in both area and population.",
  "PEI is the 'Birthplace of Confederation' — an 1864 meeting in Charlottetown set Canada on the path to becoming a country.",
  // Cape Breton
  "The Cabot Trail is a ~298 km loop regularly ranked among the most scenic drives on Earth.",
  "The Cabot Trail is named for explorer John Cabot, who reached Atlantic Canada in 1497.",
  "Pleasant Bay is known as the 'Whale-Watching Capital of Cape Breton' — pilot whales are common in August.",
  "On the Skyline Trail's cliff-top boardwalk, moose are often spotted at dusk (bring a headlamp!).",
  "Cape Breton is one of the few places outside Scotland where Scottish Gaelic is still spoken and taught.",
  // Halifax & South Shore
  "The Halifax Citadel fires a cannon at noon every single day — a tradition since 1857 that once helped ships set their clocks.",
  "Halifax was the main recovery port after the Titanic sank in 1912; about 150 victims are buried here.",
  "The 1917 Halifax Explosion was the largest human-made blast in history until the atomic bomb.",
  "Peggy's Cove lighthouse, perched on smooth granite, is one of the most photographed lighthouses in the world.",
  "Lunenburg's Old Town is a UNESCO site and home port of the Bluenose II — the schooner on the Canadian dime.",
  "Mahone Bay is famous for its postcard view of three churches lined up along the waterfront.",
  // Edmundston
  "Edmundston is capital of the tongue-in-cheek 'Republic of Madawaska,' complete with its own flag and a 'president' (the mayor).",
  "Edmundston's Brayon culture has its own signature dish: ployes, thin buckwheat pancakes.",
  "The Edmundston area was the focus of the 1838–39 'Aroostook War' — a US–British border standoff settled without a single battle.",
  // Montréal
  "Montréal is the largest French-speaking city in the Americas — and second in the world after Paris.",
  "Inside Montréal's Notre-Dame Basilica, the ceiling is a deep cobalt blue scattered with thousands of gold stars.",
  "Montréal's Mount Royal Park was designed by Frederick Law Olmsted — the man behind New York's Central Park.",
  "Beneath downtown Montréal lies the RÉSO, the world's largest underground city, with ~33 km of tunnels.",
  "Montréal's Jean-Talon Market is one of the largest open-air public markets in North America."
];

export const DEPART = "2026-07-29";
export const HOME = "2026-08-15";

// integer day-number for a YYYY-MM-DD string (UTC midnight), used for diffs + indexing
function dayNum(ymd) { return Math.floor(Date.parse(ymd + "T00:00:00Z") / 86400000); }

// the notification for a given local date: a countdown/title + the day's fact
export function factForDate(ymd) {
  const n = dayNum(ymd);
  const fact = FACTS[((n % FACTS.length) + FACTS.length) % FACTS.length];
  const toGo = dayNum(DEPART) - n;
  let title;
  if (toGo > 0) title = `Eastbound — ${toGo} ${toGo === 1 ? "day" : "days"} to go 🧭`;
  else if (ymd <= HOME) title = `Eastbound — Day ${n - dayNum(DEPART) + 1} on the road 🧭`;
  else title = "Eastbound 🧭";
  return { title, body: fact };
}
