/* people.js — the four of us. After the one shared family password, identity is
   just "which of these did you tap" — there are no per-person accounts, logins,
   or emails. `id` must match the server's allow-list (server/index.js →
   PEOPLE_IDS) and the `author` stored on each note; `name` is what shows on
   screen, `color`/`initials` drive the avatar. */
export const PEOPLE = [
  { id: "attila",   name: "Attila", color: "#3b6ea5", initials: "A", avatar: "/avatars/attila.jpg" },
  { id: "jennifer", name: "Jen",    color: "#c0567e", initials: "J", avatar: "/avatars/jennifer.jpg" },
  { id: "vera",     name: "Vera",   color: "#4e9a6b", initials: "V", avatar: "/avatars/vera.jpg" },
  { id: "hazel",    name: "Hazel",  color: "#d08c34", initials: "H", avatar: "/avatars/hazel.jpg" }
];

const BY_ID = Object.fromEntries(PEOPLE.map((p) => [p.id, p]));

// returns the person or null (callers fall back to a "?" avatar when null)
export function personById(id) { return BY_ID[id] || null; }
