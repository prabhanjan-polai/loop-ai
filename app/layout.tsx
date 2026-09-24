import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LOOP AI – Customer Feedback Intelligence Platform',
  description: 'Turn multi-channel customer feedback into prioritized product decisions with AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
