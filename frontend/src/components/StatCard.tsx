interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  note?: string;
  color?: 'green' | 'red';
}

export default function StatCard({ icon, label, value, note, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color || ''}`}>{icon}</div>
      <div>
        <p>{label}</p>
        <h2>{value}</h2>
        {note && <span>{note}</span>}
      </div>
    </div>
  );
}
