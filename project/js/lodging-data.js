/* lodging-data.js — the booking layer for PLAN E.
   Source of truth: Plan-E-Booking-Checklist.md (booked properties + prices) and
   Accommodations-Brief.md (candidate shortlists for the stops still to book).
   Prices are CAD stay totals for 2 adults + 2 teens; pulled June 9–10, 2026.
   BOOKED items show a confirmed ✓; TO-BOOK items show an estimate, a curated
   shortlist, and a date-filtered search link. Recheck before booking. */
(function (global) {

  var B = "https://www.booking.com/hotel/ca/";
  var SR = "https://www.booking.com/searchresults.html";
  function bk(slug, ci, co) {
    return B + slug + ".html?aid=8132308&checkin=" + ci + "&checkout=" + co +
      "&no_rooms=1&group_adults=2&group_children=2&age=15&age=13&selected_currency=CAD";
  }
  function search(place, ci, co) {
    return SR + "?ss=" + encodeURIComponent(place) + "&checkin=" + ci + "&checkout=" + co +
      "&group_adults=2&group_children=2&age=15&age=13&selected_currency=CAD";
  }
  function gsearch(q) { return "https://www.google.com/search?q=" + encodeURIComponent(q); }

  var LODGING = {
    pulled: "June 9–10, 2026",

    /* totals for the booking tracker */
    bookedTotal: 5168,             // Ottawa 406 + Québec 824 + Fredericton 271 + PEI 899 + Cape Breton 841 + Halifax 1676 + Edmundston 251
    toBookEst: { lo: 530, hi: 730 },    // Montréal hotel + whale tour

    /* one entry per lodging stop, in route order */
    stops: {

      ottawa: {
        status: "booked", dates: "Jul 29 – 31", nights: 2,
        booked: {
          name: "DoubleTree by Hilton Ottawa Downtown", type: "Hotel",
          detail: "Two double beds · indoor pool · A/C",
          total: 406,
          note: "Downtown — walk to Parliament Hill and the ByWard Market. The gentle first-night landing.",
          url: bk("doubletree-by-hilton-ottawa-downtown", "2026-07-29", "2026-07-31")
        }
      },

      quebec: {
        status: "booked", dates: "Jul 31 – Aug 2", nights: 2,
        booked: {
          name: "Le 201 — heart of Old Québec", type: "Airbnb",
          detail: "2 BR · 2 queen beds · 2 bath",
          total: 824,
          note: "Right inside the walls of the old town — walk to everything."
        }
      },

      fredericton: {
        status: "booked", dates: "Aug 2 – 3", nights: 1,
        booked: {
          name: "Crowne Plaza Lord Beaverbrook", type: "Hotel",
          detail: "Two queens · downtown riverfront · indoor pool · A/C",
          total: 271,
          note: "On the Saint John River — walk the Garrison District. A one-night exhale before the bridge.",
          url: bk("crowne-plaza-fredericton-lord-beaverbrook", "2026-08-02", "2026-08-03")
        }
      },

      pei: {
        status: "booked", dates: "Aug 3 – 6", nights: 3,
        booked: {
          name: "Private waterfront cottage, New Glasgow", type: "Airbnb",
          detail: "2 BR · on the river · ~10 min to Cavendish Beach",
          total: 899,
          note: "Waterfront — no A/C, but cool nights and a sea breeze.",
          url: "https://www.airbnb.ca/rooms/1703866079477440006?check_in=2026-08-03&check_out=2026-08-06&adults=4"
        }
      },

      capebreton: {
        status: "booked", dates: "Aug 6 – 8", nights: 2,
        booked: {
          name: "Cabot Trail Place, Petit Étang", type: "Airbnb",
          detail: "2 BR · best base for Skyline + whales",
          total: 841,
          note: "Steps from the Trail's Chéticamp gate — closest bed to the Skyline hike."
        }
      },

      halifax: {
        status: "booked", dates: "Aug 8 – 12", nights: 4,
        booked: {
          name: "Four Points by Sheraton", type: "Hotel",
          detail: "Queen Room · two queen beds · indoor pool · A/C",
          total: 1676,
          note: "Downtown — 450 m to the waterfront. The 4-night hub for the city and every South Shore day trip.",
          url: bk("four-points-by-sheraton-halifax", "2026-08-08", "2026-08-12")
        }
      },

      edmundston: {
        status: "booked", dates: "Aug 12 – 13", nights: 1,
        booked: {
          name: "Days Inn by Wyndham Edmundston", type: "Hotel",
          detail: "Free parking · A/C",
          total: 251,
          note: "A simple highway-hotel night to break the long drive home before the river-valley run to Montréal.",
          url: bk("days-inn-edmundston", "2026-08-12", "2026-08-13")
        }
      },

      montreal: {
        status: "tobook", dates: "Aug 13 – 15", nights: 2, est: "$350–500",
        searchUrl: search("Montreal, Quebec", "2026-08-13", "2026-08-15"),
        searchLabel: "Search Montréal stays · Aug 13–15",
        intro: "Post-Osheaga window means better rates — book refundable. Old Montréal or downtown, walkable or one metro hop to the action.",
        candidates: [
          { name: "Hôtel Europa, BW Signature", type: "Hotel", total: 478, rating: "7.7", count: "2,697", pick: true, note: "Best value — half the Osheaga-week price, same room", url: bk("best-western-europa-downtown", "2026-08-13", "2026-08-15") },
          { name: "Comfort Suites Downtown", type: "Hotel", total: 525, rating: "7.4", count: "883", note: "Crescent St, family rooms", url: bk("qi-downtown", "2026-08-13", "2026-08-15") },
          { name: "Warwick Le Crystal", type: "Hotel", total: 798, rating: "9.0", count: "1,991", note: "Splurge — 5★ rooftop saltwater pool, a celebration finale", url: bk("warwick-le-crystal-montreal", "2026-08-13", "2026-08-15") }
        ]
      }
    },

    /* tours & transport — tracked alongside lodging in the booking hub */
    extras: [
      {
        id: "ferry", label: "Wood Islands → Caribou ferry", kind: "Transport",
        status: "booked", when: "Aug 6 · 10:00 AM",
        note: "Car + 4. Leave the New Glasgow cottage ~7:45 AM; ~4 hr on to Petit Étang."
      },
      {
        id: "whale", label: "Whale-watching tour", kind: "Tour",
        status: "tobook", when: "Aug 7 · ~midday · Pleasant Bay", est: "$180–230",
        note: "Pairs with the Skyline sunset hike — a midday sailing, then the 5–9 PM trail block. Peak-season tours sell out; reserve ahead for 4.",
        searchUrl: gsearch("whale watching tour Pleasant Bay Cape Breton August 2026"),
        searchLabel: "Find a Pleasant Bay tour"
      },
      {
        id: "skyline", label: "Skyline Trail parking — golden-hour block", kind: "Reservation",
        status: "booked", when: "Aug 7 · 5–9 PM",
        note: "Sunset hike — check in by 6 PM, start ~6:15; sunset ~8:21 PM. Bring headlamps (moose country at dusk)."
      }
    ]
  };

  global.LODGING = LODGING;
})(window);
