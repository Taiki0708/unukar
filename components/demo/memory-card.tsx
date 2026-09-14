import { useEffect, useState } from "react";
import { SAMPLE_TRANSCRIPT } from "./voice-capture";
export type Memory = {
  photo: string;
  audio: Blob | null;
  sample: boolean;
  person: string;
  place: string;
  song: string;
  artist: string;
  context: string;
  connection: string;
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
        <h2>{memory.place || "Somewhere along the way."}</h2>
        {memory.sample ? (
          <>
            <p className="demo-mini">EXAMPLE VOICE NOTE · SAMPLE TRANSCRIPT</p>
            <blockquote>“{SAMPLE_TRANSCRIPT}”</blockquote>
          </>
        ) : url ? (
          <>
            <p className="demo-mini">YOUR ORIGINAL VOICE NOTE</p>
            <audio src={url} controls aria-label="Your saved voice note" />
            <p className="demo-hint">
              Kept as you said it. No transcription or rewriting.
            </p>
          </>
        ) : (
          <p className="demo-hint">A quiet moment. No voice note added.</p>
        )}
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
              <dt>Led me to</dt>
              <dd>{memory.connection}</dd>
            </>
          )}
        </dl>
      </div>
    </article>
  );
}
