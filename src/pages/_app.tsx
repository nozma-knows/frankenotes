import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "@/apollo-client";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    window.gtag = function () {
      (window as any).dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  }, []);

  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Frankenotes</title>
      </Head>
      <Component {...pageProps} />
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Analytics />
    </ApolloProvider>
  );
}
