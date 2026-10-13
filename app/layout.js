import "./globals.css";

export const metadata = {
  title: "Blue · Ruleta de premios",
  description: "Girá la ruleta de Blue y llevate un premio para tu bebé.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
