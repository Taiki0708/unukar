"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { validateDetails } from "../../lib/memory-analysis";
import { VoiceCapture, SAMPLE_TRANSCRIPT } from "./voice-capture";
import { TranscriptEditor } from "./transcript-editor";
import { JourneyConnection, ConnectionReview } from "./journey-connection";
import { MemoryCard, type Memory } from "./memory-card";
const STEPS = [
  "Capture",
  "Add context",
  "Connection",
  "Memory saved",
  "See the connection",
];
const INITIAL: Memory = {
  destination: "",
  connector: "",
  travelStatus: "unknown",
  clarificationSkipped: false,
  originalTranscript: "",
  transcript: "",
  analyzed: false,
  date: "",
  photo: "/images/hero.jpg",
  audio: null,
  sample: false,
  person: "",
  place: "",
  song: "",
  artist: "",
  context: "",
  connection: "",
};
function localToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function DemoFlow() {
  const [step, setStep] = useState(0);
  const [memory, setMemory] = useState<Memory>(INITIAL);
  const [yes, setYes] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [voiceBusy, setVoiceBusy] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const analysisLock = useRef(false);
  const upload = useRef("");
  const heading = useRef<HTMLHeadingElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRequest = useRef(0);
  useEffect(() => {
    setMemory((m) => ({ ...m, date: m.date || localToday() }));
  }, []);
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  useEffect(
    () => () => {
      photoRequest.current++;
      if (upload.current) URL.revokeObjectURL(upload.current);
    },
    [],
  );
  function update(key: keyof Memory, value: string) {
    setMemory((m) => ({ ...m, [key]: value }));
  }
  function choose(photo: string) {
    photoRequest.current++;
    if (upload.current) {
      URL.revokeObjectURL(upload.current);
      upload.current = "";
    }
    update("photo", photo);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }
  async function pick(file?: File) {
    if (!file) return;
    const request = ++photoRequest.current;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("Choose a JPG, PNG or WebP photo smaller than 10 MB.");
      return;
    }
    const u = URL.createObjectURL(file);
    const image = new Image();
    image.src = u;
    try {
      await image.decode();
      if (request !== photoRequest.current) {
        URL.revokeObjectURL(u);
        return;
      }
      if (upload.current) URL.revokeObjectURL(upload.current);
      upload.current = u;
      update("photo", u);
      setError("");
    } catch {
      URL.revokeObjectURL(u);
      setError("That photo couldn’t be opened. Please choose another.");
    }
  }
  async function analyze() {
    if (analysisLock.current) return;
    if (memory.sample) {
      setMemory(m => ({ ...m, originalTranscript: SAMPLE_TRANSCRIPT, transcript: SAMPLE_TRANSCRIPT, person: "Emma", place: "", context: "We ended up talking for hours.", connection: "She told me about Laos, and now I think I’m going to change my route.", destination: "Laos", connector: "Emma", travelStatus: "planned", clarificationSkipped: false, analyzed: false }));
      setYes(true); next(); return;
    }
    if (!memory.audio || memory.analyzed) { next(); return; }
    if (memory.audio.size > 3 * 1024 * 1024) { setAnalysisError("Please record a shorter note (up to 3 MB)."); return; }
    analysisLock.current = true; setBusy(true); setAnalysisError("");
    try {
      const form = new FormData();
      form.set("audio", memory.audio, "memory");
      form.set("today", localToday());
      const response = await fetch("/api/memory", { method: "POST", body: form, signal: AbortSignal.timeout(55000) });
      const result = await response.json();
      if (typeof result.transcript === "string") setMemory(m => ({ ...m, originalTranscript: result.transcript, transcript: result.transcript }));
      if (!response.ok) throw new Error(result.error || "Please try again.");
      const details = validateDetails(result.details);
      setMemory(m => ({ ...m, ...details, date: details.date || m.date, originalTranscript: result.transcript, transcript: result.transcript, analyzed: true, clarificationSkipped: false }));
      setYes(Boolean(details.connection)); next();
    } catch (error) {
      setAnalysisError(error instanceof Error && error.name !== "TimeoutError" ? error.message : "This is taking too long. Your recording is still here. Try again or continue without AI.");
    } finally { analysisLock.current = false; setBusy(false); }
  }
  function next() {
    setStep((s) => Math.min(s + 1, 4));
  }
  function reset() {
    choose("/images/hero.jpg");
    setMemory({ ...INITIAL, date: localToday() });
    setYes(false);
    setStep(0);
  }
  return (
    <div className="demo-shell">
      <header className="wrap header">
        <Link className="wordmark" href="/">
          UNUKAR
        </Link>
        <Link className="demo-home" href="/">
          ← Back to the story
        </Link>
      </header>
      <main className="demo-main" id="demo-main">
        <div className="demo-intro">
          <p className="eyebrow">A SMALL MOMENT. A BIGGER STORY.</p>
          <p className="demo-hint">
            A one-minute taste of UNUKAR. Photos stay in this browser. Voice analysis sends audio to Google Gemini. UNUKAR does not permanently save this demo.
          </p>
        </div>
        <ol className="demo-progress" aria-label="Your progress">
          {STEPS.map((name, i) => (
            <li
              key={name}
              aria-current={i === step ? "step" : undefined}
              className={i === step ? "current" : i < step ? "complete" : ""}
            >
              <span>0{i + 1}</span>
              <span>{name}</span>
            </li>
          ))}
        </ol>
        <div className="demo-stage">
          <p className="demo-mini">
            {String(step + 1).padStart(2, "0")} / {STEPS[step].toUpperCase()}
          </p>
          <h1 ref={heading} tabIndex={-1}>
            {
              [
                "Keep this moment.",
                memory.analyzed ? "Your words. A little more connected." : "Anything else you want to keep?",
                "Did this moment change where you went next?",
                "A little piece of your journey.",
                "Look where one connection can lead.",
              ][step]
            }
          </h1>
          {step === 0 && (
            <>
              <p className="demo-lede">
                One photo. Thirty seconds of your voice. Then back to living.
              </p>
              <div className="demo-capture">
                <div>
                  <div className="demo-photo">
                    <img src={memory.photo} alt="Selected memory photograph" />
                    <span>
                      {upload.current ? "YOUR PHOTO" : "EXAMPLE PHOTO"}
                    </span>
                  </div>
                  <div className="demo-photo-options">
                    <button
                      type="button"
                      aria-pressed={memory.photo === "/images/hero.jpg"}
                      onClick={() => choose("/images/hero.jpg")}
                    >
                      Riverside
                    </button>
                    <button
                      type="button"
                      aria-pressed={memory.photo === "/images/people.jpg"}
                      onClick={() => choose("/images/people.jpg")}
                    >
                      Good company
                    </button>
                    <label className="demo-upload">
                      Upload a photo
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => void pick(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                  <p className="demo-hint">
                    Choose an example or your own photo. JPG, PNG or WebP · up
                    to 10 MB.
                  </p>
                  <p role="status" className="demo-error">
                    {error}
                  </p>
                </div>
                <VoiceCapture
                  audio={memory.audio}
                  sample={memory.sample}
                  disabled={busy}
                  onBusyChange={setVoiceBusy}
                  onChange={(audio, sample) => {
                    setMemory((m) => ({ ...m, audio, sample, originalTranscript: "", transcript: "", analyzed: false, person: "", place: "", song: "", artist: "", context: "", connection: "", destination: "", connector: "", travelStatus: "unknown", clarificationSkipped: false }));
                    setYes(false); setAnalysisError("");
                  }}
                />
              </div>
              <p className="demo-hint">Organize my memory sends your recording to Google Gemini for transcription and suggested details. On the free tier, Google may use it to improve its products. Please use a test memory without private information. Check the result before keeping it.</p>
              <p role="status" aria-live="polite" className="demo-error">{busy ? "Finding the people, places and connections in your words…" : analysisError}</p>
              <div className="demo-footer-actions">
                {memory.audio && !busy && <button className="demo-text" disabled={voiceBusy} onClick={next}>Continue without AI</button>}
                <button className="button" disabled={busy || voiceBusy} onClick={() => void analyze()}>
                  {busy ? "LISTENING & ORGANIZING…" : memory.audio ? "ORGANIZE MY MEMORY" : memory.sample ? "EXPLORE THE EXAMPLE" : "KEEP THIS MOMENT"} <span aria-hidden="true">→</span>
                </button>
                {!memory.audio && !memory.sample && (
                  <button className="demo-text" disabled={voiceBusy || busy} onClick={next}>
                    Skip voice for now
                  </button>
                )}
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <p className="demo-lede">
                {memory.analyzed ? "Suggested from your voice. Check names and dates, change anything, and leave the rest blank." : memory.sample ? "Prepared example details — this example does not call AI." : "A name, a place, a song. Keep only what matters to you."}
              </p>
              <TranscriptEditor memory={memory} onChange={value => update("transcript", value)} />
              <div className="demo-fields">
                <label>
                  Memory date <span>{memory.analyzed ? "check this date" : "defaults to today"}</span>
                  <input
                    type="date"
                    value={memory.date}
                    onChange={(e) => update("date", e.target.value)}
                    onInput={(e) => update("date", e.currentTarget.value)}
                    onBlur={(e) => update("date", e.currentTarget.value)}
                    aria-describedby="memory-date-help"
                  />
                  <p id="memory-date-help" className="demo-hint">
                    Remembering another day? Change it here. This is not read
                    from your photo.
                  </p>
                </label>
                <label>
                  Person <span>optional</span>
                  <input
                    maxLength={100}
                    value={memory.person}
                    onChange={(e) => update("person", e.target.value)}
                    placeholder="Who was there?"
                    autoComplete="off"
                  />
                </label>
                <label>
                  Place <span>optional</span>
                  <input
                    maxLength={120}
                    value={memory.place}
                    onChange={(e) => update("place", e.target.value)}
                    placeholder="Where were you?"
                    autoComplete="off"
                  />
                </label>
                <fieldset>
                  <legend>
                    The song from this memory. <span>optional</span>
                  </legend>
                  <div className="demo-song">
                    <label>
                      Song title
                      <input
                        maxLength={120}
                        value={memory.song}
                        onChange={(e) => update("song", e.target.value)}
                        placeholder="The one you still hear"
                      />
                    </label>
                    <label>
                      Artist
                      <input
                        maxLength={100}
                        value={memory.artist}
                        onChange={(e) => update("artist", e.target.value)}
                        placeholder="Who sang it?"
                      />
                    </label>
                  </div>
                </fieldset>
                <label>
                  A little context <span>optional</span>
                  <textarea
                    maxLength={300}
                    rows={2}
                    value={memory.context}
                    onChange={(e) => update("context", e.target.value)}
                    placeholder="Anything the photo doesn’t say?"
                  />
                </label>
              </div>
              <div className="demo-footer-actions">
                <button className="button" onClick={next}>
                  CONTINUE <span aria-hidden="true">→</span>
                </button>
                <button
                  className="demo-text"
                  onClick={() => {
                    setMemory((m) => ({
                      ...m,
                      person: "",
                      place: "",
                      song: "",
                      artist: "",
                      context: "",
                    }));
                    next();
                  }}
                >
                  Skip all context
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <p className="demo-lede">
                A conversation. A recommendation. A reason to take the long way
                round.
              </p>
              <div className="demo-connection-choice">
                <button
                  className={yes ? "demo-outline selected" : "demo-outline"}
                  aria-pressed={yes}
                  onClick={() => setYes(true)}
                >
                  Yes, it led somewhere <span aria-hidden="true">↗</span>
                </button>
                <button
                  className="demo-text"
                  onClick={() => {
                    setMemory(m => ({ ...m, connection: "", destination: "", connector: "", travelStatus: "unknown" }));
                    setYes(false);
                    next();
                  }}
                >
                  Skip — just keep the moment
                </button>
              </div>
              {yes && (
                <label className="demo-connection-field">
                  What happened next?
                  <textarea
                    autoFocus
                    rows={3}
                    maxLength={300}
                    placeholder="Emma told me about Laos."
                    value={memory.connection}
                    onChange={(e) => update("connection", e.target.value)}
                  />
                  <span className="demo-hint">
                    One sentence is plenty. You can also leave this blank.
                  </span>
                </label>
              )}
              {yes && <ConnectionReview memory={memory} onChange={patch => setMemory(m => ({ ...m, ...patch }))} />}
              {yes && (
                <div className="demo-footer-actions">
                  <button className="button" onClick={next}>
                    SAVE MY MEMORY <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
              <p className="demo-philosophy">
                Places show where you went.
                <br />
                <em>People explain how you got there.</em>
              </p>
            </>
          )}
          {step === 3 && (
            <>
              <p className="demo-lede">
                Kept for this demo, in your own words.
              </p>
              <MemoryCard memory={memory} />
              <p className="demo-hint">
                AI organizes. You remember. Your original voice stays with the memory. Suggested details are yours to correct.
              </p>
              <div className="demo-footer-actions">
                <button className="button" onClick={next}>
                  SEE THE CONNECTION <span aria-hidden="true">→</span>
                </button>
                <button className="demo-text" onClick={() => setStep(1)}>
                  {/[ぁ-んァ-ヶ一-龯]/.test(memory.transcript) ? "この思い出を編集" : "Edit this memory"}
                </button>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <p className="demo-lede">
                One person or moment can change where the journey goes next.
              </p>
              {memory.connection && (
                <aside className="demo-your-connection">
                  <p className="demo-mini">YOUR CONNECTION</p>
                  <p>“{memory.connection}”</p>
                </aside>
              )}
              <div className="demo-journey-grid">
                <JourneyConnection memory={memory} />
                <section className="demo-book">
                  <p className="demo-mini">
                    THE JOURNEY BOOK · CONCEPT PREVIEW
                  </p>
                  <div className="demo-book-pages">
                    <div>
                      <span>UNUKAR / FIELD NOTES</span>
                      <h3>
                        A year
                        <br />
                        of becoming.
                      </h3>
                      <p>
                        {memory.context ||
                          "The people. The places. Everything in between."}
                      </p>
                    </div>
                    <div>
                      <img
                        src={memory.photo}
                        alt="Your selected photo in a Journey Book concept"
                      />
                      <p>{memory.place || "Somewhere along the way."}</p>
                    </div>
                  </div>
                  <h2>
                    This memory could become part of your <em>Journey Book.</em>
                  </h2>
                  <p className="demo-hint">
                    A chapter of your life, ready to hold onto.
                  </p>
                </section>
              </div>
              <div className="demo-footer-actions">
                <Link className="button" href="/#founding">
                  BECOME A FOUNDING TRAVELER <span aria-hidden="true">↗</span>
                </Link>
                <button className="demo-text" onClick={() => setStep(1)}>{/[ぁ-んァ-ヶ一-龯]/.test(memory.transcript) ? "この思い出を編集" : "Edit this memory"}</button>
                <button className="demo-text" onClick={reset}>
                  Try another moment
                </button>
              </div>
            </>
          )}
        </div>
        <footer className="demo-bottom">
          {step > 0 ? (
            <button className="demo-text" onClick={() => setStep((s) => s - 1)}>
              ← Back
            </button>
          ) : (
            <span />
          )}
          <p>Less documenting. More living.</p>
        </footer>
      </main>
    </div>
  );
}
