import { GeistSans } from "geist/font/sans";

import Sidebar from "../../components/Sidebar"
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
        <main className="flex flex-row min-h-screen w-full">
          <Sidebar></Sidebar>
          {children}
        </main>
     
  );
}
