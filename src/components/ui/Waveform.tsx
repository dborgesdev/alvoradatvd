export function Waveform() {
  return (
    <div className="waveform" aria-hidden="true">
      {Array.from({ length: 35 }, (_, i) => (
        <i key={i} style={{ height: `${12 + ((i * 19) % 35)}px` }} />
      ))}
    </div>
  );
}
