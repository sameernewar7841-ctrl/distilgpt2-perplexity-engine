import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/SmoothScroll';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Perplexity & Next-Token Prediction Engine | In-Browser DistilGPT-2',
  description:
    'Client-side causal language model evaluator running Xenova/distilgpt2 ONNX q8 in-browser. Token-by-token conditional probabilities, numerically stable log-softmax, log-space perplexity breakdown, next-token ranking, and offline simulator.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
