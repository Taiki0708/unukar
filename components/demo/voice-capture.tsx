"use client";
import { useEffect, useRef, useState } from "react";
export const SAMPLE_TRANSCRIPT =
  "Met Emma by the river today. We ended up talking for hours. She told me about Laos, and now I think I’m going to change my route. I don’t want to forget how this felt.";
export function VoiceCapture({
  audio,
  sample,
  onChange,
}: {
  audio: Blob | null;
  sample: boolean;
  onChange: (audio: Blob | null, sample: boolean) => void;
}) {
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const alive = useRef(true);
  const [recording, setRecording] = useState(false);
  const [pending, setPending] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!audio) {
      setUrl("");
      return;
    }
    const u = URL.createObjectURL(audio);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [audio]);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);
  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    const limit = setTimeout(() => stop(), 30000);
    return () => {
      clearInterval(timer);
      clearTimeout(limit);
    };
  }, [recording]);
  function stop() {
    if (recorder.current?.state === "recording") recorder.current.stop();
    stream.current?.getTracks().forEach((t) => t.stop());
    setRecording(false);
  }
  async function start() {
    setError("");
    setPending(true);
    try {
      if (
        !navigator.mediaDevices?.getUserMedia ||
        typeof MediaRecorder === "undefined"
      )
        throw new Error();
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!alive.current) {
        s.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = s;
      const r = new MediaRecorder(s);
      recorder.current = r;
      const chunks: Blob[] = [];
      r.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      r.onstop = () => {
        s.getTracks().forEach((t) => t.stop());
        if (alive.current) {
          const b = new Blob(chunks, { type: r.mimeType });
          if (b.size) onChange(b, false);
          else setError("No sound was saved. Try again or use the example.");
        }
      };
      r.start();
      setSeconds(0);
      setRecording(true);
    } catch {
      stream.current?.getTracks().forEach((t) => t.stop());
      setError("Recording isn’t available. You can use the example instead.");
    } finally {
      if (alive.current) setPending(false);
    }
  }
  return (
    <div className="demo-voice">
      <div className="demo-mini">02 / A LITTLE OF YOUR VOICE</div>
      <p>Who was there? What made it matter?</p>
      <div className="demo-actions">
        <button
          className="demo-outline"
          type="button"
          disabled={pending}
          onClick={recording ? stop : start}
        >
          {pending
            ? "Opening microphone…"
            : recording
              ? `Stop recording · 0:${String(seconds).padStart(2, "0")}`
              : audio
                ? "Record again"
                : "Record a voice note"}{" "}
          <span aria-hidden="true">{recording ? "■" : "◉"}</span>
        </button>
        <button
          className="demo-text"
          type="button"
          disabled={recording || pending}
          onClick={() => onChange(null, true)}
        >
          Use an example
        </button>
      </div>
      {url && <audio controls src={url} aria-label="Your voice note" />}
      {sample && (
        <div className="demo-quote">
          <span className="demo-mini">
            EXAMPLE VOICE NOTE · SAMPLE TRANSCRIPT
          </span>
          <p>“{SAMPLE_TRANSCRIPT}”</p>
        </div>
      )}
      <p className="demo-hint">About 30 seconds. Your own words are enough.</p>
      <p role="status" className="demo-error">
        {error}
      </p>
    </div>
  );
}
