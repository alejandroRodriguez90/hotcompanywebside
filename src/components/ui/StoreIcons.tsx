import React from 'react';

export interface StoreIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * Silueta de Apple para el botón de App Store.
 */
export const AppStoreIcon: React.FC<StoreIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
  </svg>
);

/**
 * Triángulo tricolor de Google Play.
 */
export const GooglePlayIcon: React.FC<StoreIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M3.6 2.3C3.2 2.7 3 3.3 3 4.1v15.8c0 .8.2 1.4.6 1.8l.1.1L12.6 12v-.2L3.7 2.2l-.1.1z" fill="#4285F4" />
    <path d="M15.6 15l-3-3v-.2l3-3 .1.1 3.5 2c1 .6 1 1.5 0 2.1l-3.5 2-.1 0z" fill="#FBBC05" />
    <path d="M15.7 15l-3.1-3.1L3.6 21c.3.4.9.4 1.6 0l10.5-6z" fill="#EA4335" />
    <path d="M15.7 9L5.2 3c-.7-.4-1.3-.4-1.6 0l9 9 3.1-3z" fill="#34A853" />
  </svg>
);

/**
 * Bolsa roja distintiva de Huawei AppGallery.
 */
export const AppGalleryIcon: React.FC<StoreIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#CE0E2D" />
    <path
      d="M8.25 8.5a3.75 3.75 0 0 0 7.5 0"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
