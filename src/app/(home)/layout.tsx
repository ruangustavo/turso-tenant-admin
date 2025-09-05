export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto p-6">{children}</div>;
}
