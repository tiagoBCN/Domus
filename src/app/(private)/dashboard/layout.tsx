import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../../globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Domus.ai — Painel de Monitoramento Clínico",
  description: "Plataforma de inteligência clínica e triagem territorial domiciliar da Atenção Primária à Saúde.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col bg-[#f8fafc] text-[#09090b]">
        {children}
      </body>
    </html>
  );
}
