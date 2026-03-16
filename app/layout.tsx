import { DM_Sans, JetBrains_Mono } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-[#080b0f] font-body antialiased transition-colors duration-300">
        <Navbar />
        <main>{children}</main>
        <CommandPalette />
      </body>
    </html>
  );
}
