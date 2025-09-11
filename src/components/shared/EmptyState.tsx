
import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode; // icon kustom
  title: string;
  message: string;
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="text-center text-gray-500 py-12">
      {icon || <i className="fas fa-box-open text-4xl mb-4 text-gray-400"></i>}
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}