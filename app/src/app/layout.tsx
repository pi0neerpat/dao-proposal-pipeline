import type { Metadata } from 'next';
import { Barlow, Open_Sans } from 'next/font/google';
import './globals.css';
import { ProposalProvider } from './contexts/ProposalsContext';
import { Web3Modal } from './contexts/Web3ModalContext';
import { ProviderProvider } from './contexts/ProviderContext';
import Navbar from './components/Navbar';
import React from 'react';
import Footer from './components/Footer';

const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Open Dollar Governance Proposals',
    template: '%s | Open Dollar Governance',
  },
  description:
    'This app allows ODG holders to submit proposals relating to Open Dollar Governance to a vote',
  openGraph: {
    title: 'Open Dollar Governance Proposals',
    description:
      'This app allows ODG holders to submit proposals relating to Open Dollar Governance to a vote',
    images: [
      {
        url: '/full-logo-open-dollar.svg',
        width: 800,
        height: 600,
        alt: 'Open Dollar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@open_dollar',
    creator: '@open_dollar',
    title: 'Open Dollar Governance Proposal App',
    description:
      'This app allows ODG holders to submit proposals relating to Open Dollar Governance to a vote',
    images: '/full-logo-open-dollar.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <Web3Modal>
      <ProviderProvider>
        <ProposalProvider>
          <html
            lang="en"
            className={`${barlow.className} ${openSans.className} ${barlow.variable} ${openSans.variable}`}
          >
            <head>
              <link rel="icon" href="./od-circle.svg" />
              <title>Open Dollar Governance Proposals</title>
            </head>
            <body>
                <Navbar />
                {children}
                <Footer />
            </body>
          </html>
        </ProposalProvider>
      </ProviderProvider>
    </Web3Modal>
  );
}
