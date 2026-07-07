import { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: 'teal' | 'blue' | 'amber' | 'red';
}

const cardColorClass: Record<NonNullable<Props['color']>, string> = {
  teal: 'is-teal',
  blue: 'is-blue',
  amber: 'is-orange',
  red: 'is-pink',
};

export default function StatCard({ title, value, icon, color = 'teal' }: Props) {
  return (
    <div className={`stat-card ${cardColorClass[color]}`}>
      <div className="stat-card-icon">
        {icon}
      </div>
      <div className="stat-card-content">
        <div className="stat-card-title">{title}</div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-progress"><span /></div>
      </div>
    </div>
  );
}
