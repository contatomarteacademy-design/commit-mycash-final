import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { AuthWrapper } from "@/components/AuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "mycash+ - Controle Financeiro Familiar",
  description: "Sistema de controle financeiro familiar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <FinanceProvider>
            <NavigationProvider>
              <AuthWrapper>{children}</AuthWrapper>
            </NavigationProvider>
          </FinanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

