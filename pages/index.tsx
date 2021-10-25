import type {NextPage} from 'next'
import Head from "next/head"
import Link from "next/link"

import styles from '../styles/Home.module.css'
import Footer from "../layouts/footer"
import Nav from "../layouts/nav"

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Top page</title>
      </Head>

      <div className="container">
        <Nav/>

        <main>
          <h1 className={styles.title}>
            <a href="https://nextjs.org">Next.js</a> Samples
          </h1>

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
          </ul>
        </main>

        <Footer/>
      </div>
    </>
  )
}

export default Home
