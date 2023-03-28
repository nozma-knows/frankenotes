import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "@/apollo-client";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "nextjs-google-analytics";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Frankenotes</title>
      </Head>
      <GoogleAnalytics trackPageViews />
      <Component {...pageProps} />
      <Analytics />
    </ApolloProvider>
  );
}
