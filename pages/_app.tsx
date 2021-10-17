import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from "next/head"
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta key="description" name="description" content="Next.js playground"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"
              crossOrigin="anonymous"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
export default MyApp
