import React from 'react';

export interface WhatsAppIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Globo de conversación */}
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.75 7.36L3.5 20.5l1.64-4.25A8.5 8.5 0 1 1 20.5 11.5z" />
      {/* Auricular telefónico interior */}
      <path d="M9.2 8.8a1.2 1.2 0 0 1 1.3-.2l1.1.7a1.2 1.2 0 0 1 .4 1.4l-.4.8a5.5 5.5 0 0 0 2.6 2.6l.8-.4a1.2 1.2 0 0 1 1.4.4l.7 1.1a1.2 1.2 0 0 1-.2 1.3c-.9.9-2.1 1-3.1.5-2.8-1.4-4.8-3.4-6.2-6.2-.5-1-.4-2.2.5-3.1z" />
    </svg>
  );
};

