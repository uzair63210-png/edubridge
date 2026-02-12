import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-sm shadow-sm border border-gray-200 border-t-4 border-t-blue-600 ${className}`} {...props}>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};