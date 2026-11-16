import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Indicadores de desarrollo en América Latina | IFTS 24",
  description: "Trabajo Práctico Integrador 2026. Análisis comparativo de indicadores económicos y sociales de Argentina, Brasil, Chile y Uruguay (2010–2024). Dataset sintético con fines académicos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es-AR"><body>{children}</body></html>;
}
