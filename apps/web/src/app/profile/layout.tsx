import type { Metadata } from 'next';
import SidebarProfile from '@/components/SidebarProfile';

export const metadata: Metadata = {
  title: {
    template: '%s | Groceria',
    default: 'Profile',
  },
  description: 'Groceria - Your online grocery store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="p-12 max-w-screen-xl mx-auto items-center">
      <div className="grid grid-cols-1 md:grid-cols-4">
        <SidebarProfile />
        <div className="col-span-3">{children}</div>
      </div>
    </section>
  );
}
