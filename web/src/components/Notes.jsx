/* Notes.jsx — the journal UI: a single note, the composer (auto-growing,
   ⌘/Ctrl+Enter to post), and the per-day notes section used on day pages. */
import { useState, useRef } from "react";
import { Icon } from "../lib/icons.jsx";
import { Avatar, SectionTitle } from "./ui.jsx";
import { useAuth } from "../auth.jsx";
import { useNotes } from "../notes.jsx";
import { personById } from "../data/people.js";
import { fmtTime } from "../lib/dates.js";

export function NoteItem({ note, allowDelete }) {
  const { user } = useAuth();
  const { deleteNote } = useNotes();
  const p = personById(note.author) || { name: "?", color: "#888", initials: "?" };
  const canDel = allowDelete && user && user.id === note.author;
  return (
    <div className={"note" + (note.pending ? " is-pending" : "")}>
      <Avatar person={p} />
      <div className="note-b">
        <div className="note-h">
          <b>{p.name}</b>
          <span>{note.pending ? "sending…" : fmtTime(note.ts)}</span>
          {canDel && <button className="note-del" onClick={() => deleteNote(note)} aria-label="Delete note">×</button>}
        </div>
        <div className="note-t">{note.text}</div>
      </div>
    </div>
  );
}

export function NoteComposer({ date, onPosted }) {
  const { user } = useAuth();
  const { addNote } = useNotes();
  const [text, setText] = useState("");
  const ref = useRef(null);

  const grow = (el) => { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 130) + "px"; };
  const submit = () => {
    if (addNote(date, text)) {
      setText("");
      if (ref.current) ref.current.style.height = "auto";
      if (onPosted) onPosted(date);
    }
  };
  const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); submit(); } };

  return (
    <div className="note-compose">
      <Avatar person={user} />
      <textarea
        ref={ref} rows={1} value={text}
        placeholder={"Add a note as " + (user ? user.name : "") + "…"}
        onChange={(e) => { setText(e.target.value); grow(e.target); }}
        onKeyDown={onKey}
      />
      <button className="note-send" onClick={submit} aria-label="Post note"><Icon name="send" /></button>
    </div>
  );
}

export function NotesSection({ date }) {
  const { notesForDay } = useNotes();
  const notes = notesForDay(date);
  return (
    <>
      <SectionTitle>{"Trip notes" + (notes.length ? " · " + notes.length : "")}</SectionTitle>
      <div className="card notes">
        {notes.length
          ? <div className="note-list">{notes.map((n) => <NoteItem key={n.id} note={n} allowDelete />)}</div>
          : <div className="note-empty">No notes yet for this day — start the journal.</div>}
        <NoteComposer date={date} />
      </div>
    </>
  );
}
