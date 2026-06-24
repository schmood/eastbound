/* facts.js — 35 fun facts for the daily 9 AM trip-countdown push.
   Whimsical, hook-first voice (for two teens) — varied openers so 35 mornings
   don't feel formulaic. Accurate, just not a textbook. One per morning; the
   list cycles, so it keeps working during and after the trip too. */

export const FACTS = [
  // Ottawa
  "Did you know Ottawa's Rideau Canal freezes into the world's biggest skating rink every winter? Imagine gliding 7.8 km to class. ⛸️",
  "Fun fact: a queen picked Ottawa as Canada's capital back in 1857 — basically choosing the country's group-chat admin. 👑",
  "Throwback: Ottawa's ByWard Market has been selling treats since 1826 — older than the lightbulb AND the telephone.",
  "Did you know the tower on Parliament Hill has 53 bells that someone plays by hand? The world's most extra wind chime. 🔔",
  // Québec City
  "Did you know Québec City is the only walled city north of Mexico that still has its real walls? Like walking onto a movie set. 🏰",
  "Plot twist: Québec City has been around since 1608 — 400+ years of people getting happily lost in cobblestone alleys.",
  "Did you know Montmorency Falls is actually taller than Niagara? 83 m of waterfall — with a zipline across it. 😮",
  "Fun fact: Old Québec has a tiny railway up a cliff (a funicular) that's been carrying people since 1879. Lazy genius.",
  "Did you know the Château Frontenac might be the most photographed hotel on Earth? Let's add a few hundred more. 📸",
  // Fredericton
  "Did you know Fredericton is nicknamed 'the City of Stately Elms'? Translation: dreamy tree-lined streets made for photos. 🌳",
  "Fun fact: we'll roll past a university older than Canada itself — it opened in 1785. Imagine the homework pile.",
  // PEI
  "Did you know the bridge onto PEI is nearly 13 km — the longest bridge over icy water in the world? Hold your breath… or don't. 🌉",
  "Plot twist: PEI's beaches are literally red. The sand is full of rust — nature's blush palette. 🎨",
  "Did you know 'Anne of Green Gables' is set on PEI, and the green-gabled farmhouse is a real place? Anne would've had the best feed.",
  "Fun fact: PEI is Canada's tiniest province — you could cross the whole thing in about one good playlist. 🎶",
  "Did you know the meeting that kicked off Canada becoming a country happened on PEI in 1864? It all started with a hangout on the island.",
  // Cape Breton
  "Did you know the Cabot Trail is rated one of the prettiest drives on the planet? ~300 km of cliffs, ocean, and 'pull over for a pic.' 🌊",
  "Fun fact: the Cabot Trail is named after an explorer who showed up in 1497 — 500+ years before our trip.",
  "Did you know we might actually spot whales at Pleasant Bay? Pilot whales love showing off there in August. 🐋",
  "Heads up: on the Skyline Trail, moose just stroll out at dusk. Bring a headlamp and your best stay-calm face. 🫎",
  "Did you know people in Cape Breton still speak Scottish Gaelic? One of the only places outside Scotland where you'll hear it.",
  // Halifax & South Shore
  "Did you know a cannon fires in Halifax at exactly noon, every single day, since 1857? Don't worry — it's on purpose. 💥",
  "Fun fact (a bit eerie): the ships that raced to the sinking Titanic came from Halifax — and there's a real Titanic gallery here. 🚢",
  "Did you know Halifax had the biggest explosion in history before the atomic bomb? A ship blew up in the harbour in 1917.",
  "Did you know Peggy's Cove lighthouse is one of the most photographed in the world? A tiny red-and-white icon on giant smooth rocks.",
  "Fun fact: that sailboat on the back of the Canadian dime is real — the Bluenose II lives in Lunenburg. Go check your change. 🪙",
  "Did you know Mahone Bay has three little churches lined up perfectly along the water? A postcard that actually exists. 💌",
  // Edmundston
  "Did you know we'll cross into the 'Republic of Madawaska' — a town that jokingly declared itself a country, flag and 'president' included? Iconic. 🚩",
  "Fun fact: the local specialty is ployes — thin buckwheat pancakes. Pancakes for the road? Yes. 🥞",
  "Plot twist: there was a 'war' over this border in the 1830s… with zero battles. The most Canadian war ever. 😅",
  // Montréal
  "Did you know Montréal is the second-biggest French-speaking city in the world, after Paris? 'Bonjour-hi!' 🥐",
  "Did you know the ceiling inside Notre-Dame Basilica is deep blue with thousands of gold stars? Like standing under the night sky indoors. ✨",
  "Fun fact: the park on Montréal's mountain was designed by the same person who made NYC's Central Park. Fancy.",
  "Plot twist: Montréal has a whole city underground — 33 km of tunnels with shops and food. A mall, but make it secret. 🛍️",
  "Did you know Jean-Talon Market is one of the biggest open-air markets in North America? Snacks as far as the eye can see. 🍓"
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
