import './globals.css';
import React, { ReactNode } from 'react';

interface MyComponentProps {
  children: ReactNode;
}

export const metadata = {
  title: 'LUDO',
  description:
    'Immerse yourself in this digital rendition of classic board game - LUDO. Roll the dice, strategize your moves, and race against opponents.',
};

export default function RootLayout({ children }: MyComponentProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
