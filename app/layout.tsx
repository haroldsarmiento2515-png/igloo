import "./globals.css";

export const metadata = {
  title: "Igloo — Arctic Manifesto",
  description: "A minimal, cinematic 3D landing page inspired by igloo.inc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
