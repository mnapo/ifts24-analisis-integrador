import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Latam Insights | IFTS 24",
  description: "Comparación de indicadores de conectividad y desempeño estadístico en América Latina con datos de World Bank Open Data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es-AR"><body>{children}</body></html>;
}
