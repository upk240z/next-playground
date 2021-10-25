import React from "react";
import type {NextPage} from 'next'
import Link from "next/link"
import Head from "next/head"
import axios from "axios";

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import Footer from "../../layouts/footer"
import Nav from "../../layouts/nav"
import withLoading from "../../components/with-loading";

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export function getStaticProps({params}: any) {
  return {
    props: {
      postId: params.postId
    },
    revalidate: 60
  }
}

const Page: NextPage = ({postId}: any) => {
  const PostDocument: React.FunctionComponent = ({title, body}: any) => {
    return (
      <Card className="mt-3">
        <CardHeader title={title}/>
        <CardContent>
          { body }
        </CardContent>
      </Card>
    )
  }

  const Wrapped = withLoading(PostDocument, () => {
    return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(res => res.data)
  })

  return (
    <div className="container">
      <Head>
        <title>Post</title>
      </Head>

      <Nav/>

      <main>
        <h1>Post</h1>

        <Wrapped/>

        <div className="mt-3 text-right text-gray-600">
          <Link href="/posts"><a>Back to List</a></Link>
        </div>
      </main>

      <Footer/>
    </div>
  )
}

export default Page
