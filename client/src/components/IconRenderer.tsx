import React from 'react';
import * as LucideIcons from 'lucide-react';

type IconRendererProps = {
  icon: any;
  className?: string;
};

export default function IconRenderer({ icon, className }: IconRendererProps) {
  const Icon = icon;
  return <Icon className={className} />;
}