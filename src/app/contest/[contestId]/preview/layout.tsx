export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="contest-preview">
      {children}
    </div>
  );
}