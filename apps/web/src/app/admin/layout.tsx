export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-secondary">Sidebar Content</div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
