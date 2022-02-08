import React from 'react'
import type {NextPage} from 'next'
import Head from "next/head"
import Link from "next/link"

import * as QRCode from 'qrcode'
import {Box} from '@mui/material'

import styles from '../styles/Home.module.css'
import Footer from "../layouts/footer"
import Nav from "../layouts/nav"

const drawQr = (canvas: HTMLCanvasElement) => {
  QRCode.toCanvas(canvas, window.location.href, err => {
    if (err) { console.log(err) }
  })
}

const Home: NextPage = () => {
  const refCanvas = React.useRef(null)

  React.useEffect(() => {
    if (refCanvas.current) {
      drawQr(refCanvas.current as HTMLCanvasElement)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Top page</title>
      </Head>

      <div className="container">
        <Nav/>

        <main>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Box>
              <h1 className={styles.title}>
                <a href="https://nextjs.org">Next.js</a>
              </h1>
            </Box>
            <Box sx={{ ml: 1 }}>
              <canvas ref={refCanvas}></canvas>
            </Box>
          </Box>

          <h2 className="pb-2 border-b border-black font-bold">Examples</h2>
          <ul className="list-group mt-5">
            <li><Link href="/form-function"><a>Form(Function component)</a></Link></li>
            <li><Link href="/form-class"><a>Form(Class component)</a></Link></li>
            <li><Link href="/posts"><a>Posts</a></Link></li>
          </ul>

          <h2 className="mt-3 pb-2 border-b border-black font-bold">Tools</h2>
          <ul className="list-group mt-5">
            <li><Link href="/tools/json"><a>JSON</a></Link></li>
            <li><Link href="/tools/yaml"><a>YAML</a></Link></li>
            <li><Link href="/tools/datetime"><a>Datetime</a></Link></li>
            <li><Link href="/tools/regex"><a>RegEx</a></Link></li>
            <li><Link href="/tools/holidays"><a>Holidays</a></Link></li>
            <li><Link href="/tools/qrcode"><a>QRCode</a></Link></li>
          </ul>
        </main>

        <Footer/>
      </div>
    </>
  )
}

export default Home
