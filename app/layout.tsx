import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IFTS24 - Análisis y exploración de datos",
  description: "Análisis del impacto socioeconómico de la pandemia de COVID-19 en América Latina y el Caribe."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
