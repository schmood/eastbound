# Travel Itinerary Revision

_Started 2026-06-10 13:55 UTC_

---

## User

the site itself was briefed around Plan A's 9 stops and old B/C dates, so alongside this prompt, tell the design project that Plan-B-Itinerary.md and Plan-C-Itinerary.md were revised — it should re-read them, not rely on what it built before.

## Assistant

_[tool: list_files]_

_[tool: local_ls]_

_[tool: local_read]_

_[tool: local_read]_

_[tool: local_read]_

The project already has a lodging layer scaffolded — let me re-read the revised briefs and the current implementation to see what needs updating.

_[tool: read_file]_

_[tool: read_file]_

Now let me look at the current implementation to see what's stale.

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: local_read]_

_[tool: read_file]_

Let me check the comparison doc for the revised headline numbers, plus map.js and lodging.css.

_[tool: grep]_

_[tool: update_todos]_

_[tool: str_replace_edit]_

Now the edits. First `js/data.js` — revised routes, Montréal-as-finale copy, legs, budgets, compare rows, Kingston removal:

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Re-read the revised briefs and brought the site in line with them:

- **Plans B & C re-ordered** — Montréal is now the 2-night finale (Aug 11–13, between Edmundston and home), outbound goes Ottawa → Québec City direct, the Kingston/waypoint night is gone, and both plans now end Aug 13 (15 nights). Drive legs, dates, budgets, and the comparison table/cards all updated (~$8,200 B / ~$8,400 C).
- **Lodging data rebuilt** from the revised Accommodations-Brief: Alma at Aug 3–5 (the in-village M1 suite is back as the pick), PEI split A/C Aug 3–5 vs B Aug 5–8, Cape Breton now one shared A & C window (Aug 5–8) with the amber "book first" warning, the new midweek Montréal shortlist (Europa $478 etc.), shared Québec/Fredericton/Halifax dates, and the new budget bands + scarcity order.
- **The notes**: Montréal B/C now carries the quiet "moved to dodge Osheaga/Pride — half price midweek" line; the price caveat reads "pulled June 9–10, 2026" everywhere.

One caveat: status chips you'd already clicked persist by property — properties that changed dates/IDs (Alma, PEI-B, Montréal) reset to "Considering". Verifier is doing a background pass now.

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Summer Trip"
Project currently has 3 file(s)
User is viewing file: The Long Way East.html
Current date is now June 10, 2026
</system-info>

<pasted_text name="Pasted text (84 lines)">
Update our "East Coast Journey" site with two changes: (1) add a fourth option,
Plan D, to the plan switcher and comparison; (2) add a LODGING layer to every
stop. Keep the existing travel-magazine style, the plan switcher, the triple-route
overlay map, and the trade-off radar — just make them all 4-way.

IMPORTANT — dates were revised (the "Osheaga fix"): Plans B, C and D all run their
Montréal as a 2-night finale on the RETURN (mid-August, midweek) to dodge the
Osheaga festival weekend. All four plans now drive Ottawa → Québec City outbound.
Use the exact per-stop dates below — the lodging links depend on them.

==================================================
THE FOUR PLANS (route · nights · home date · ~cost for 4)
==================================================
PLAN A — "Cape Breton Epic"   · 17 nights · home Aug 15 · ~4,400 km · ~$9,000
PLAN B — "Cities &amp; Fundy"      · 15 nights · home Aug 13 · ~4,100 km · ~$8,200
PLAN C — "Best of Both"        · 15 nights · home Aug 13 · ~4,300 km · ~$8,400
PLAN D — "Plan A, rebalanced"  · 16 nights · home Aug 14 · ~4,400 km · ~$8,700

PER-STOP DATES &amp; NIGHTS (check-in → check-out):
PLAN A: Ottawa Jul29–31 (2) · Québec City Jul31–Aug2 (2) · Fredericton Aug2–3 (1)
  · PEI/Cavendish Aug3–5 (2) · Cape Breton/Baddeck Aug5–8 (3) · Halifax Aug8–10 (2)
  · Lunenburg/South Shore Aug10–13 (3) · Edmundston Aug13–14 (1) · Montréal Aug14–15 (1)
PLAN B: Ottawa Jul29–31 (2) · Québec City Jul31–Aug2 (2) · Fredericton Aug2–3 (1)
  · Bay of Fundy/Alma Aug3–5 (2) · PEI/Cavendish Aug5–8 (3) · Halifax Aug8–10 (2)
  · Edmundston Aug10–11 (1) · Montréal Aug11–13 (2)
PLAN C: Ottawa Jul29–31 (2) · Québec City Jul31–Aug2 (2) · Fredericton Aug2–3 (1)
  · PEI/Cavendish Aug3–5 (2) · Cape Breton/Baddeck Aug5–8 (3) · Halifax Aug8–10 (2)
  · Edmundston Aug10–11 (1) · Montréal Aug11–13 (2)
PLAN D: Ottawa Jul29–31 (2) · Québec City Jul31–Aug2 (2) · Fredericton Aug2–3 (1)
  · PEI/Cavendish Aug3–5 (2) · Cape Breton/Baddeck Aug5–7 (2) · Halifax Aug7–9 (2)
  · Lunenburg Aug9–11 (2) · Edmundston Aug11–12 (1) · Montréal Aug12–14 (2)

PLAN D — what it is: a rebalanced Plan A. Cape Breton 3→2 nights (Cabot Trail +
whales in one day; Louisbourg optional), Lunenburg 3→2 nights, Montréal 1→2 nights
(real city finale). Highlights: Cabot Trail, whales, South Shore (lighter), strong
Montréal finish. Trade-off: Cape Breton &amp; Lunenburg both feel a touch rushed.
Best for: Plan A fans who want a proper Montréal and a day less driving.

RADAR SCORES (1–5) — add Plan D's column:
  Dimension          | A | B | C | D
  Adventure          | 5 | 3 | 5 | 4
  Relaxation         | 2 | 5 | 3 | 3
  Less driving       | 2 | 5 | 3 | 2
  Cities &amp; culture   | 3 | 5 | 4 | 4
  Beaches &amp; chill    | 4 | 5 | 3 | 3
  History            | 5 | 3 | 4 | 4
  Value              | 4 | 5 | 4 | 4

Triple-route overlay → make it a FOUR-route overlay (A coral, B teal, C navy,
D gold/amber). All four share the same spine (Ottawa → Québec City) and Halifax +
PEI; they diverge in the east (A &amp; D: Cape Breton + South Shore; B: Bay of Fundy;
C: Cape Breton only). A and D share the same eastern stops but D has fewer nights.

==================================================
NEW: LODGING LAYER
==================================================
Add a "Where we'd stay" panel to each stop section, AND a "Lodging at a glance"
view. The selected plan drives the dates used in every lodging link.

For each stop show: recommended AREA + property type + rough nightly price, 2–3
starter picks where we have them, and a "See live options" button that opens a
pre-filtered search carrying the SELECTED PLAN's check-in/out for that stop, 4
guests (2 adults + kids 15 &amp; 13), 2-bedroom minimum.

Link templates (substitute the selected plan's dates):
  Airbnb search: https://www.airbnb.ca/s/{LOCATION}/homes?checkin={IN}&amp;checkout={OUT}&amp;adults=4&amp;min_bedrooms=2
  Airbnb listing: https://www.airbnb.ca/rooms/{ID}?check_in={IN}&amp;check_out={OUT}&amp;adults=4
  Booking.com:   https://www.booking.com/searchresults.html?ss={LOCATION}&amp;checkin={IN}&amp;checkout={OUT}&amp;group_adults=2&amp;group_children=2&amp;age=15&amp;age=13&amp;no_rooms=1

RESEARCHED STARTER PICKS (pulled June 2026 — show with a "prices indicative, tap to
refresh" note; these dates match Plans A/C/D for PEI &amp; Cape Breton and Plan A for
Lunenburg — rebuild each link with the selected plan's actual dates):
- PEI / Cavendish area:
   - Airbnb "Cozy 2 BR Cottage close to Cavendish" (Kensington), id 36665251, ~$407/nt — best value+location
   - Airbnb "Cavendish Country Inn 2BR cottage", id 1416723301686119588, ~$524/nt
   - Booking "Cavendish Memotree Resort", ~$230/nt, indoor pool, family-friendly
   Recommended area: North Rustico / Stanley Bridge (near beaches, better value than beachfront Cavendish)
- Cape Breton / Baddeck:
   - Airbnb "Sunset Shenacadie Escape" (Bras d'Or), id 1681598335352177466, ~$202/nt — best value
   - Airbnb "Driftwood Way, Petit Étang" (Chéticamp, best for Cabot Trail), id 1683083108307158401, ~$332/nt
   - Booking "Trailsman Lodge" (Baddeck), ~$199/nt, private beach
   Note: Baddeck has thin Airbnb inventory — book this stop first.
- Lunenburg / South Shore (Plans A &amp; D):
   - Airbnb
</pasted_text>

<!-- The user attached a local folder named "East Coast Trip". It may contain a codebase, design components, or other files. Explore it with local_ls("East Coast Trip") — all paths into this folder must start with "East Coast Trip/". -->

## Assistant

_[tool: local_ls]_

_[tool: read_file]_

The project already has Plans A/B/C and the lodging layer (just revised). This brief's genuinely new ask is **Plan D** — a fourth option threaded through the switcher, the comparison table, the radar, the four-route overlay map, and the lodging layer. Let me gather what I need.

I've hit a permission prompt — the "East Coast Trip" folder was attached in an earlier session and the browser needs you to re-grant access (there's an **Allow** banner in the chat).

I don't strictly need that folder to do this — the brief you pasted has all of Plan D's data, and the project files have the rest. But since the access prompt is open, go ahead and click **Allow** (or **Cancel** if you'd rather I just work from the pasted brief), and I'll pick up Plan D from there: threading it through the switcher, the comparison table, the trade-off radar, the four-route overlay (gold/amber), and adding its lodging date-variants.Access restored. Let me grab Plan D's itinerary and the radar/comparison internals.

_[tool: local_ls]_

_[tool: grep]_

_[tool: read_file]_

Let me read the Plan D itinerary and the rest of data.js (PLANS, RADAR, theming, VIS colors in compare).

_[tool: local_read]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

Now let me read the PLANS block, RADAR, theming, and the journey.js plan switcher to see every place `["A","B","C"]` is hardcoded.

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

Let me see the switcher markup in the HTML, the `MONTREAL_RETURN` override, and the per-plan theming CSS.

_[tool: read_file]_

_[tool: read_file]_

Let me read `lodging.js` fully to see how it selects a variant per active plan, and the MONTREAL_RETURN override block.

_[tool: read_file]_

Let me read the compare.js overlay-build and table-render sections precisely so I edit the exact strings.Now let me read the table-render section (143–230) to see the comparison-table body rendering.

_[tool: read_file]_

_[tool: read_file]_

Let me see the plan-cards loop (274+) and the radar dots line tail.

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

I have the full map now. Let me make the edits. Starting with **data.js** — add Plan D, its radar scores, and the comparison column:

_[tool: run_script]_

Now **compare.js** — many `["A","B","C"]` loops plus copy. I'll batch them via a script:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now **map.js**, **journey.js**, **journey.css**, and the **HTML switcher**:

_[tool: read_file]_

Let me check the segmented-control CSS handles a 4th button, then do the lodging data.

_[tool: str_replace_edit]_

The seg hides labels under 520px so four letters fit. Now the lodging layer. First, fold Plan D into the shared stops and add its band:

_[tool: run_script]_

Halifax for Plan D is Aug 7–9, not the shared Aug 8–10 — I need to revert that and give D its own dated variants. Let me do all the D lodging variants in one script:

_[tool: grep]_

_[tool: show_html]_

Let me verify the lodging variants landed and the page loads.All five Plan D variants and EDM_D are in place. Let me switch to Plan D and screenshot to verify it renders.

_[tool: show_html]_

_[tool: str_replace_edit]_

The hero subtitle still says "three ways." Let me update it and check the compare section + Plan D.

_[tool: show_html]_

_[tool: save_screenshot]_

## Assistant

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: multi_screenshot]_

Plan D renders — gold theme, correct stats. Now let me verify the four-route overlay map, radar, table, and a Plan D lodging block.

_[tool: get_webview_logs]_

The screenshot tool captures from the top of the DOM, so scrolling won't reframe it — I'll let the verifier check the deeper sections visually. Let me confirm there are no console errors and that the DOM rendered for Plan D.No errors. Let me hand off to the user on Plan D and run a directed verifier pass on the four-way comparison and Plan D lodging.

_[tool: done]_

_[tool: fork_verifier_agent]_

Plan D is in, threaded through everything four-way:

- **Switcher & theming** — fourth button (D · Rebalanced), gold/amber accent that re-themes the page like the others, arrow-key nav now cycles all four.
- **Plan D itinerary** — 16 nights, home Aug 14, ~4,400 km, ~$8,700; Cape Breton 2n + Lunenburg 2n + a real 2-night Montréal finale (Aug 12–14). Drives Ottawa → Québec City outbound like the rest.
- **Comparison centerpiece** — four-route overlay map (A coral, B teal, C navy, **D gold**), the radar gained Plan D's column with your scores, and the side-by-side table has a D column. Copy updated from "three ways" → "four ways" throughout.
- **Lodging layer** — Plan D folds into the shared Ottawa/Québec/Fredericton/PEI stops and gets its own dated windows for Cape Breton (Aug 5–7), Halifax (Aug 7–9), Lunenburg (Aug 9–11), Edmundston (Aug 11–12) and the Montréal finale (Aug 12–14), each with live-linked picks at the selected plan's dates.

One note: since A and D share the exact eastern stops, their route lines overlap on the overlay map — hovering a legend item isolates either one. Directed verifier is doing a visual pass on the comparison and Plan D lodging now.

## User

No issues found

## Assistant

Verifier passed — Plan D is live across the switcher, four-route map, radar, comparison table, and lodging layer, with no issues.

## User

ADD PLAN E to the site — make the plan switcher, the route-overlay map, and the
trade-off radar 5-way.

PLAN E — "Stay Unpacked" (accent: forest green) · 17 nights · home Aug 15 ·
~4,400 km · ~$8,900 · 8 lodgings (fewest) · pace: easy/settled.
Route & dates: Ottawa Jul29–31 (2) → Québec City Jul31–Aug2 (2) → Fredericton
Aug2–3 (1) → PEI/Cavendish Aug3–6 (3) → Cape Breton/Baddeck Aug6–9 (3) →
HALIFAX HUB Aug9–12 (3) → Edmundston Aug12–13 (1) → Montréal Aug13–15 (2) → home Aug15.

What's distinctive (build for this):
- Halifax is a 3-NIGHT HUB. The South Shore (Peggy's Cove, Mahone Bay, Lunenburg)
  is NOT a separate overnight — render those as day-trip pins hanging off the
  Halifax marker on the map (dotted spurs), and in the stop section show a
  "Day trips from here" sub-list rather than their own sections.
- It keeps the same eastern stops as Plans A/D (Cape Breton + Halifax) but with NO
  Lunenburg overnight marker. On the route-overlay map, E should trace the same
  line as A/D minus the Lunenburg leg.
- Theme line: "the stay-unpacked option — fewest lodging moves, most beach time,
  3-3-3 rhythm (PEI · Cape Breton · Halifax)."

Radar scores (1–5) — add E's column:
  Adventure 5 · Relaxation 5 · Less driving 3 · Cities 4 · Beaches 5 · History 4 · Value 4

Lodging layer (per the existing lodging spec): PEI Aug3–6 (3 nts) and Cape Breton
Aug6–9 (3 nts) reuse the researched starter picks but with these dates; Halifax
Aug9–12 (3 nts) has plenty of supply — recommended area: downtown/waterfront, with
a note that this single base covers the South Shore day trips. Montréal Aug13–14.

Also update the comparison view to include a "Lodging moves" metric (A:9 B:8 C:8
D:9 E:8) and flag E as "fewest moves."

Source of truth: Plan-E-Itinerary.md, plus the updated Plans-A-vs-B-Comparison.md
and Trip-Options-Family-Report.html.

## Assistant

_[tool: local_read]_

_[tool: local_read]_

Let me read the Plan E source files before building.

_[tool: read_file]_

_[tool: grep]_

Comprehensive brief. Let me check how `expand()` merges overrides and how `unique` is used, so I can wire the Halifax hub + day-trips correctly.

_[tool: grep]_

Let me see the base Halifax stop content so the hub override reads coherently.

## Assistant

_[tool: read_file]_

_[tool: str_replace_edit]_

Now I'll build Plan E. Starting with **data.js** — the Halifax-hub override, Plan E itself, radar, comparison rows + the new "Lodging moves" metric, and the day-trips field in `expand()`:

_[tool: str_replace_edit]_

Now add Plan E to the PLANS object:Now the radar scores and the comparison rows (adding the E column everywhere + the new "Lodging moves" metric):

_[tool: str_replace_edit]_

_[tool: run_script]_

Now **compare.js** — add E and bump all the four-way references to five:

_[tool: str_replace_edit]_

Now **map.js** — Plan E accent plus the dotted South Shore day-trip spurs off the Halifax hub:

_[tool: read_file]_

_[tool: str_replace_edit]_

Now wire the day-trips sub-list into the stop, and extend arrow-key nav to five plans:

_[tool: str_replace_edit]_

Now the **HTML switcher** button, **journey.css** theming + day-trip styles:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

Let me look at the existing stop/moments and waypoint styling to match the day-trip list and map pins.

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: grep]_

Now the lodging layer for Plan E. Let me check the current plans-array state and the option sets I'll reuse.

_[tool: run_script]_

Now the Plan E lodging — shared-stop plan arrays, five new dated variants, EDM_E, and the band:

_[tool: show_html]_

All Plan E variants landed. Let me load the page, switch to Plan E, and verify it renders cleanly.

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: get_webview_logs]_

Everything wired — 8 lodgings with correct E dates, day-trips list, 5-way switcher/table/radar/cards, the new "Lodging moves" row. Let me confirm no console errors and screenshot the per-plan map (day-trip spurs) for Plan E.

_[tool: save_screenshot]_

_[tool: snip]_

_[tool: done]_

Plan E renders — hero shows "PLAN E · Stay Unpacked · 17 nights · ~$8,900 · Easy," subtitle now "five ways," and the structure checks out (5-way switcher/table/radar/cards, 8 lodgings, day-trips list). The live Leaflet map (route color + day-trip spurs) needs a real pixel capture, so I'll hand that to the verifier.

_[tool: fork_verifier_agent]_

Plan E ("Stay Unpacked") is in and threaded through everything five-way:

- **Switcher & theming** — fifth button (E · Unpacked) with a forest-green accent; arrow-keys cycle all five.
- **Itinerary** — 17 nights, home Aug 15, ~$8,900, easy/settled pace; the distinctive **3-3-3 rhythm** (PEI 3 · Cape Breton 3 · Halifax 3) with **8 lodgings — the fewest**.
- **Halifax hub** — rendered as a 3-night base with a "Day trips from here" sub-list (Peggy's Cove · Mahone Bay · Lunenburg) instead of a separate Lunenburg section; on the route map those hang off the Halifax pin as **dotted spurs**, and E's line skips the Lunenburg overnight (matching A/D minus that leg).
- **Comparison** — overlay map, radar, and table are all 5-way, plus a new **"Lodging moves"** metric (A 9 · B 8 · C 8 · D 9 · E **8 · fewest**).
- **Lodging** — E folds into the shared Ottawa/Québec/Fredericton stops and gets its own dated windows: PEI Aug 3–6 (3n), Cape Breton Aug 6–9 (3n), the Halifax hub Aug 9–12 (3n, noting it covers the South Shore day trips), Edmundston Aug 12–13, and the Montréal finale Aug 13–15.

Verifier is doing a visual pass on the map spurs and comparison now.

## User

No issues found

## Assistant

Verifier passed — Plan E is fully live across the switcher, five-route overlay map (with the Halifax day-trip spurs), radar, comparison table, the new "Lodging moves" metric, and the lodging layer. No issues.

## User

UPDATE PLAN E on the site — its night split changed (total unchanged: 17 nights,
home Aug 15, 8 lodgings, ~$8,900, accent forest green).

New per-stop dates & nights:
Ottawa Jul29–31 (2) → Québec City Jul31–Aug2 (2) → Fredericton Aug2–3 (1) →
PEI/Cavendish Aug3–6 (3) → Cape Breton/Baddeck Aug6–8 (2) →
HALIFAX HUB Aug8–12 (4) → Edmundston Aug12–13 (1) → Montréal Aug13–15 (2) → home Aug15.

Changes from the previous Plan E build:
- Cape Breton: 3 → 2 nights (one full Cabot Trail day; Louisbourg now optional).
- Halifax hub: 3 → 4 nights — now THREE full days off one base:
  (1) Halifax city day, (2) South Shore loop day trip (Peggy's Cove · Mahone Bay ·
  Lunenburg), (3) a beach/flex day (Halifax-area beach, harbour tour, or downtown).
  Keep the South Shore as day-trip pins hanging off the Halifax marker — emphasize
  Halifax is now an even stronger 4-night anchor.
- PEI stays 3 nights; Montréal stays the 2-night finale (Aug 13–14).
- Tagline tweak: "fewest lodging moves (8) and the most settled base — 4 nights in
  one Halifax hotel." (Drop any "3-3-3" wording.)

Radar scores unchanged: Adventure 5 · Relaxation 5 · Less driving 3 · Cities 4 ·
Beaches 5 · History 4 · Value 4.

Lodging layer: Cape Breton now Aug 6–8 (2 nts); Halifax Aug 8–12 (4 nts, downtown/
waterfront, single base for all South Shore day trips); PEI Aug 3–6 (3 nts). Rebuild
the date-aware search links accordingly.

Source of truth: the updated Plan-E-Itinerary.md.

## Assistant

_[tool: local_read]_

Let me re-read the updated source of truth before editing.

_[tool: str_replace_edit]_

All confirmed. Now the **data.js** edits — Plan E route nights, the hub override, tagline, checklist, and the comparison Cape Breton row:

_[tool: run_script]_

## Assistant

_[tool: run_script]_

_[tool: show_html]_

All replacements landed cleanly. Let me verify Plan E now reflects the new split.

_[tool: eval_js]_

_[tool: get_webview_logs]_

Plan E now reflects the new split perfectly — PEI 3n, **Cape Breton Aug 6–8 (2n, $398)**, **Halifax hub Aug 8–12 (4n, Barrington $1,456)**, Montréal finale, 8 stays total; hub tag reads "one base, four nights" and the comparison Cape Breton row shows E as 2 nights. Let me confirm a clean console and hand off.

_[tool: done]_

_[tool: fork_verifier_agent]_

Plan E's night split is updated (total still 17, home Aug 15, 8 lodgings, ~$8,900, forest green):

- **Cape Breton → 2 nights** (Aug 6–8) — one full Cabot Trail day, Louisbourg now optional; lodging totals recomputed (Trailsman $398, etc.).
- **Halifax hub → 4 nights** (Aug 8–12) — now the trip's strongest single anchor, framed as three full days off one base (city · South Shore loop · beach/flex). South Shore stays as dotted day-trip pins off the Halifax marker; lodging recomputed (Barrington $1,456, etc.).
- **PEI** stays 3 nights, **Montréal** stays the 2-night finale.
- Tagline rewritten to "fewest lodging moves (8) and the most settled base — four nights in one Halifax hotel"; all "3-3-3" wording removed. Comparison table's Cape Breton row now reads E = 2 nights.

Verifier is doing a visual pass on the hub, day-trip spurs, and comparison now.

## User

No issues found

## Assistant

Verifier passed — Plan E's revised split is live: Cape Breton 2 nights (Aug 6–8), the 4-night Halifax hub (Aug 8–12) with its day-trip spurs intact, PEI 3 nights, Montréal finale, 8 lodgings total, and the comparison table updated. No issues.

