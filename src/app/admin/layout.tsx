import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Panel - Quantalyze',
  description: 'Admin dashboard for managing Quantalyze website',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} bg-gray-50 min-h-screen`}>
      {children}
    </div>
  );
}
