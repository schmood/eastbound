/* nav.js — Google Maps deep links. Open the native Maps app for turn-by-turn
   (needs a connection) using coordinates we ship offline in trip-days.js. */

export function openNav(geo, fromCoord) {
  if (!geo) return;
  var dest = geo.coord ? geo.coord[0] + "," + geo.coord[1] : encodeURIComponent(geo.name);
  var url = "https://www.google.com/maps/dir/?api=1&destination=" + dest + "&travelmode=driving";
  if (fromCoord) url += "&origin=" + fromCoord[0] + "," + fromCoord[1];
  window.open(url, "_blank", "noopener");
}

export function openMaps(name) {
  window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(name), "_blank", "noopener");
}
