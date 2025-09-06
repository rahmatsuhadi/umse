import React from 'react';

type PageHeaderProps = {
  title: string;
  subtitle: string;
  icon: React.ReactNode; 
};

export function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
  return (
    <section
      className="py-12 bg-gradient-to-r from-purple-600 to-purple-700 text-white"
    >
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8">
          {icon}
          
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}