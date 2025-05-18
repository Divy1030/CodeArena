export default function ChallengesPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="contest-challenges-preview">
      {children}
    </div>
  );
}