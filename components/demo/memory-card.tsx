import { useEffect, useState } from "react";
import { statusLabel, type JourneyMemory } from "./journey-connection";
export type Memory = JourneyMemory & {
  originalTranscript: string;
  transcript: string;
  analyzed: boolean;
  photo: string;
  audio: Blob | null;
  sample: boolean;
  person: string;
  place: string;
  song: string;
  artist: string;
  context: string;
  connection: string;
  date: string;
};
export function MemoryCard({ memory }: { memory: Memory }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!memory.audio) return;
    const u = URL.createObjectURL(memory.audio);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [memory.audio]);
  return (
    <article className="demo-memory">
      <img src={memory.photo} alt="The photograph you chose for this memory" />
      <div className="demo-memory-copy">
        <p className="demo-mini">A MOMENT WORTH KEEPING</p>
        {memory.date && (
          <time className="demo-memory-date" dateTime={memory.date}>
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(`${memory.date}T12:00:00`))}
          </time>
        )}
        <h2>{memory.place || "Somewhere along the way."}</h2>
        {memory.sample ? (
          <>
            <p className="demo-mini">EXAMPLE VOICE NOTE · SAMPLE TRANSCRIPT</p>
            <blockquote>“{memory.transcript}”</blockquote>
          </>
        ) : url ? (
          <>
            <p className="demo-mini">YOUR ORIGINAL VOICE NOTE</p>
            <audio src={url} controls aria-label="Your saved voice note" />
            <p className="demo-hint">
              Your original recording, kept alongside your words.
            </p>
          </>
        ) : (
          <p className="demo-hint">A quiet moment. No voice note added.</p>
        )}
        {memory.transcript && !memory.sample && <><p className="demo-mini">{memory.transcript !== memory.originalTranscript ? "YOUR WORDS · EDITED" : "YOUR WORDS · TRANSCRIPT"}</p><blockquote>“{memory.transcript}”</blockquote></>}
        {memory.originalTranscript && memory.transcript !== memory.originalTranscript && <details className="demo-original"><summary>{/[ぁ-んァ-ヶ一-龯]/.test(memory.originalTranscript) ? "元の文字起こしを見る" : "View original transcript"}</summary><p>{memory.originalTranscript}</p></details>}
        <dl>
          {memory.person && (
            <>
              <dt>People</dt>
              <dd>{memory.person}</dd>
            </>
          )}
          {(memory.song || memory.artist) && (
            <>
              <dt>The song</dt>
              <dd>
                {[memory.song, memory.artist].filter(Boolean).join(" — ")}
              </dd>
            </>
          )}
          {memory.context && (
            <>
              <dt>Context</dt>
              <dd>{memory.context}</dd>
            </>
          )}
          {memory.connection && (
            <>
              <dt>The connection</dt>
              <dd>{memory.connection}</dd>
            </>
          )}
          {memory.destination && <><dt>Next destination</dt><dd>{memory.destination} · {statusLabel(memory.travelStatus, /[ぁ-んァ-ヶ一-龯]/.test(memory.transcript))}</dd></>}
        </dl>
      </div>
    </article>
  );
}
