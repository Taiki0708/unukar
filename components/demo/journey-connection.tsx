import type { TravelStatus } from "../../lib/memory-analysis";

export type JourneyMemory = {
  destination: string;
  connector: string;
  travelStatus: TravelStatus;
  clarificationSkipped: boolean;
};
type ViewMemory = JourneyMemory & { place: string; connection: string; transcript: string; sample: boolean };
export function statusLabel(status: TravelStatus, ja: boolean) {
  return (ja ? { visited: "訪れた", planned: "これから行きたい・予定", recommended: "おすすめされた", unknown: "まだ確認していない" } : { visited: "Visited", planned: "Want to go / planned", recommended: "Recommended", unknown: "Not confirmed" })[status];
}
export function ConnectionReview({ memory, onChange }: { memory: ViewMemory; onChange: (patch: Partial<JourneyMemory>) => void }) {
  const ja = /[ぁ-んァ-ヶ一-龯]/.test(memory.transcript);
  const ask = memory.destination && memory.travelStatus === "unknown" && !memory.clarificationSkipped;
  return <div className="demo-connection-review">
    {ask && <fieldset className="demo-clarification">
      <legend>{ja ? `${memory.destination}には、もう行きましたか？` : `Have you been to ${memory.destination} yet?`}</legend>
      <p className="demo-hint">{ja ? "一つだけ確認。答えずに進んでも大丈夫です。" : "Just one detail. You can leave it unanswered."}</p>
      <div className="demo-actions">
        {(["visited", "planned", "recommended"] as TravelStatus[]).map(status => <button key={status} type="button" className="demo-outline" onClick={() => onChange({ travelStatus: status })}>{statusLabel(status, ja)}</button>)}
        <button type="button" className="demo-text" onClick={() => onChange({ clarificationSkipped: true })}>{ja ? "スキップ" : "Skip this question"}</button>
      </div>
    </fieldset>}
    <details>
      <summary>{ja ? "行き先・つながりを確認／修正" : "Check or edit the connection"}</summary>
      <div className="demo-fields">
        <label>{ja ? "次の行き先（任意）" : "Next destination (optional)"}<input maxLength={120} value={memory.destination} onChange={e => onChange({ destination: e.target.value, travelStatus: "unknown", clarificationSkipped: false })} /></label>
        <label>{ja ? "きっかけになった人（任意）" : "Person behind this connection (optional)"}<input maxLength={100} value={memory.connector} onChange={e => onChange({ connector: e.target.value })} /></label>
        <label>{ja ? "旅の状況" : "Travel status"}<select value={memory.travelStatus} onChange={e => onChange({ travelStatus: e.target.value as TravelStatus })}>{(["unknown", "recommended", "planned", "visited"] as TravelStatus[]).map(status => <option key={status} value={status}>{statusLabel(status, ja)}</option>)}</select></label>
      </div>
    </details>
    {memory.destination && <JourneyConnection memory={memory} compact />}
  </div>;
}
export function JourneyConnection({ memory, compact = false }: { memory: ViewMemory; compact?: boolean }) {
  const ja = /[ぁ-んァ-ヶ一-龯]/.test(memory.transcript);
  return <section className={`demo-route demo-personal-route ${compact ? "compact" : ""}`} aria-label={ja ? "この思い出のつながり" : "Your memory connection"}>
    <p className="demo-mini">{memory.sample ? "PREPARED EXAMPLE" : ja ? "あなたの言葉から生まれたつながり" : "A CONNECTION FROM YOUR WORDS"}</p>
    <ol>
      <li><span>{ja ? "この思い出の場所" : "Where this moment happened"}</span><h2>{memory.place || (ja ? "場所はまだ未記入" : "Place not added yet")}</h2></li>
      {memory.connection && <li><span aria-hidden="true">↓</span><h2>{memory.connector || (ja ? "旅を動かしたきっかけ" : "A moment that changed something")}</h2><p className="demo-connection-quote">“{memory.connection}”</p></li>}
      {memory.destination && <li className={`demo-destination ${memory.travelStatus === "visited" ? "visited" : "open"}`}><span aria-hidden="true">↓</span><h2>{memory.destination}</h2><span className="demo-travel-status">{statusLabel(memory.travelStatus, ja)}</span></li>}
    </ol>
    {!memory.destination && <p className="demo-hint">{ja ? "次の行き先がなくても、この瞬間には価値があります。" : "A moment matters even when it doesn’t lead to another place."}</p>}
    {memory.destination && memory.travelStatus !== "visited" && <p className="demo-hint">{ja ? "訪問済みの旅程ではなく、この出会いが開いた可能性です。" : "A possibility this moment opened — not a confirmed visit."}</p>}
  </section>;
}
