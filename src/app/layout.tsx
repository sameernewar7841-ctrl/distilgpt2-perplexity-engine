import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/SmoothScroll';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#09090B] text-[#F4F4F5] font-sans selection:bg-[#FF7A1A]/20 selection:text-[#FFFFFF]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
