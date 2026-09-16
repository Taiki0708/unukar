import { useEffect, useState } from "react";
import type { Memory } from "./memory-card";

export function TranscriptEditor({ memory, onChange }: { memory: Memory; onChange: (value: string) => void }) {
  const [audioUrl, setAudioUrl] = useState("");
  useEffect(() => {
    if (!memory.audio) { setAudioUrl(""); return; }
    const url = URL.createObjectURL(memory.audio);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [memory.audio]);
  const ja = /[ぁ-んァ-ヶ一-龯]/.test(memory.originalTranscript || memory.transcript);
  const edited = memory.transcript !== memory.originalTranscript;
  return <section className="demo-transcript-editor">
    <p className="demo-mini">{memory.sample ? "EXAMPLE · EDITABLE" : ja ? "あなたの言葉を、そのままに" : "YOUR WORDS, YOUR WAY"}</p>
    {audioUrl && <audio controls src={audioUrl} aria-label={ja ? "元の音声を聞く" : "Listen to your original recording"} />}
    <label>{ja ? "文字起こしを編集" : "Edit your words"}
      <textarea rows={5} maxLength={12000} value={memory.transcript} onChange={e => onChange(e.target.value)} placeholder={ja ? "聞き間違いを直したり、言い忘れたことを追加できます。" : "Correct a name, add something you missed, or write your memory here."} aria-describedby="transcript-edit-help" />
    </label>
    <p id="transcript-edit-help" className="demo-hint">{ja ? "編集内容はこのデモ内に反映されます。元の音声は変わりません。人・場所・つながりは自動で再分析されないので、下の項目も必要に応じて修正してください。ページを閉じると内容は失われます。" : "Edits stay in this demo; your original audio stays unchanged. People, places and connections are not re-analyzed automatically — check those fields too. Closing this page clears your memory."}</p>
    {edited && memory.originalTranscript && <details className="demo-original"><summary>{ja ? "元の文字起こしを見る" : "View original transcript"}</summary><p>{memory.originalTranscript}</p></details>}
  </section>;
}
