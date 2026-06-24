/* lodging.js — the booking layer: one entry per lodging stop (keyed by stop id)
   plus tours/transport "extras". BOOKED stops carry a confirmed `booked` object;
   TO-BOOK stops carry an estimate, a shortlist, and a date-filtered search link.
   Prices are CAD stay totals (tax in) for 2 adults + 2 teens (15, 13).
   Source of truth: East Coast Trip/trip-data.json (lastUpdated 2026-06-24). */

const B  = "https://www.booking.com/hotel/ca/";
const SR = "https://www.booking.com/searchresults.html";
function bk(slug, ci, co) {
  return B + slug + ".html?aid=8132308&checkin=" + ci + "&checkout=" + co +
    "&no_rooms=1&group_adults=2&group_children=2&age=15&age=13&selected_currency=CAD";
}
function search(place, ci, co) {
  return SR + "?ss=" + encodeURIComponent(place) + "&checkin=" + ci + "&checkout=" + co +
    "&group_adults=2&group_children=2&age=15&age=13&selected_currency=CAD";
}
function gsearch(q) { return "https://www.google.com/search?q=" + encodeURIComponent(q); }

export const LODGING = {
  pulled: "June 24, 2026",

  /* totals for the booking tracker (tax in) */
  bookedTotal: 5637.66,             // Ottawa 486.67 + Québec 823.56 + Fredericton 322.54 + PEI 898.97 + Cape Breton 840.41 + Halifax 1967.96 + Edmundston 297.55
  toBookEst: { lo: 862, hi: 1205 }, // Montréal stay (~$632–975) + whale tour (~$230)

  /* one entry per lodging stop, in route order */
  stops: {

    ottawa: {
      status: "booked", dates: "Jul 29 – 31", nights: 2,
      booked: {
        name: "DoubleTree by Hilton Ottawa Downtown", type: "Hotel",
        detail: "Double room · two double beds · indoor pool",
        total: 486.67,
        note: "Downtown — walk to Parliament Hill and the ByWard Market. $250 deposit on arrival; breakfast $28/pp extra.",
        url: bk("doubletree-by-hilton-ottawa-downtown", "2026-07-29", "2026-07-31")
      }
    },

    quebec: {
      status: "booked", dates: "Jul 31 – Aug 2", nights: 2,
      booked: {
        name: "Le 201 — heart of Old Québec", type: "Airbnb",
        detail: "2-bedroom apartment · 2 queen beds · 2 bath",
        total: 823.56,
        note: "Host Harry · self check-in, right inside the old-town walls — walk to everything."
      }
    },

    fredericton: {
      status: "booked", dates: "Aug 2 – 3", nights: 1,
      booked: {
        name: "Crowne Plaza Fredericton Lord Beaverbrook", type: "Hotel",
        detail: "Premium Queen room · two queen beds · indoor pool",
        total: 322.54,
        note: "Downtown riverfront — walk the Garrison District. A one-night exhale before the bridge.",
        url: bk("crowne-plaza-fredericton-lord-beaverbrook", "2026-08-02", "2026-08-03")
      }
    },

    pei: {
      status: "booked", dates: "Aug 3 – 6", nights: 3,
      booked: {
        name: "Private waterfront cottage, New Glasgow", type: "Airbnb",
        detail: "2-bedroom cottage · on the water · ~10 min to Cavendish Beach",
        total: 898.97,
        note: "Host Emily · self check-in (keypad). Waterfront — no A/C, but cool nights and a sea breeze.",
        url: "https://www.airbnb.ca/rooms/1703866079477440006?check_in=2026-08-03&check_out=2026-08-06&adults=4"
      }
    },

    capebreton: {
      status: "booked", dates: "Aug 6 – 8", nights: 2,
      booked: {
        name: "Cabot Trail Place, Petit Étang", type: "Airbnb",
        detail: "2-bedroom apartment · Chéticamp side · ~20 min to Skyline",
        total: 840.41,
        note: "Host Don · self check-in (lockbox). Closest bed to the Skyline trailhead; free cancel 24h then non-refundable."
      }
    },

    halifax: {
      status: "booked", dates: "Aug 8 – 12", nights: 4,
      booked: {
        name: "Four Points by Sheraton Halifax", type: "Hotel",
        detail: "Queen room · two queen beds · indoor pool",
        total: 1967.96,
        note: "Downtown — 450 m to the waterfront. The 4-night hub. Parking $30/day (first-come); $100 deposit on arrival.",
        url: bk("four-points-by-sheraton-halifax", "2026-08-08", "2026-08-12")
      }
    },

    edmundston: {
      status: "booked", dates: "Aug 12 – 13", nights: 1,
      booked: {
        name: "Days Inn by Wyndham Edmundston", type: "Hotel",
        detail: "Queen room · two queen beds · free parking",
        total: 297.55,
        note: "A simple highway-hotel night to break the long drive home. Free cancel until Aug 10.",
        url: bk("days-inn-edmundston", "2026-08-12", "2026-08-13")
      }
    },

    montreal: {
      status: "tobook", dates: "Aug 13 – 15", nights: 2, est: "$632–975",
      searchUrl: search("Montreal, Quebec", "2026-08-13", "2026-08-15"),
      searchLabel: "Search Montréal stays · Aug 13–15",
      intro: "Old Montréal / downtown — the post-Osheaga window means better rates; book refundable. Top picks: Holiday Inn & Suites Centre-ville (~$632, pool) or an Old Montréal loft (~$975+).",
      candidates: [
        { name: "Holiday Inn & Suites Montréal Centre-ville", type: "Hotel", total: 632, pick: true, note: "Best value — indoor pool, central downtown", url: search("Holiday Inn Suites Montreal Centre-ville", "2026-08-13", "2026-08-15") },
        { name: "Old Montréal loft", type: "Airbnb", total: 975, note: "Splurge — Vieux-Montréal character, walkable Old Port", url: search("Old Montreal", "2026-08-13", "2026-08-15") }
      ]
    }
  },

  /* tours & transport — tracked alongside lodging in the booking hub */
  extras: [
    {
      id: "ferry", label: "Wood Islands → Caribou ferry", kind: "Transport",
      status: "booked", when: "Aug 6 · 10:00 AM", confirmation: "2479970",
      note: "Northumberland Ferries · 75-min crossing · car + 4. Leave New Glasgow ~7:45 AM; check in ≥40 min early; then ~4 hr to Petit Étang."
    },
    {
      id: "whale", label: "Whale-watching tour", kind: "Tour",
      status: "tobook", when: "Aug 7 · ~midday · Pleasant Bay", est: "~$230",
      note: "Pilot whales reliable in August; ~20 min from the Skyline trailhead, pairs with the evening hike. Options: Pleasant Bay Whale Watching (big boat, ~$60 adult) or Capt. Mark's Zodiac (~$95 adult). Reserve ahead for 4.",
      searchUrl: gsearch("whale watching tour Pleasant Bay Cape Breton August 2026"),
      searchLabel: "Find a Pleasant Bay tour"
    },
    {
      id: "skyline", label: "Skyline Trail parking — golden-hour block", kind: "Reservation",
      status: "booked", when: "Aug 7 · 5–9 PM", confirmation: "INPC26-27015964B1",
      note: "Sunset hike (sunset ~8:21 PM) — check in by 6 PM, no in/out, exit the lot by 9 PM. Bring confirmation + photo ID + plate. Headlamps; moose at dusk."
    }
  ]
};
