import { ThemeProvider } from '@/lib/ThemeContext';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata = {
  title: 'AI Chat App',
  description: 'Modern AI chat application with conversation intelligence',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navigation />
          <main className="bg-gray-50 dark:bg-gray-800 min-h-[calc(100vh-64px)]">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
