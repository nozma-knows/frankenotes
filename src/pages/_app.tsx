import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "@/apollo-client";
import { Analytics } from "@vercel/analytics/react";
import * as gtag from "@/components/utils/gtag";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Frankenotes</title>
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </ApolloProvider>
  );
}
