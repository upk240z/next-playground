import type {NextPage} from 'next'
import Head from "next/head"
import Footer from "../../layouts/footer"
import Nav from "../../layouts/nav"
import Link from "next/link"
import axios from "axios";
import useSWR from 'swr'
import Message from "../../components/message";

type Post = {
  userId: number,
  id: number,
  title: string,
  body: string
}

const FetchResults = () => {
  const fetcher = (url: string) => axios.get(url).then((res) => {
    return res.data
  })
  const { data, error } = useSWR('https://jsonplaceholder.typicode.com/posts', fetcher)

  if (error) {
    return <Message message={error.toString()} className="alert-danger"></Message>
  }

  if (!data) {
    return <Message message="Loading..." className="alert-success"></Message>
  }

  const list = data.map((post: Post) => {
    return (
      <li key={ post.id }>
        <Link href={`/posts/${post.id}`}><a>{ post.title }</a></Link>
      </li>
    )
  })

  return (
    <ul className="list-group mt-5">
      { list }
    </ul>
  )
}

const Page: NextPage = () => {

  return (
    <div className="container">
      <Head>
        <title>Posts</title>
      </Head>

      <Nav/>

      <main>
        <h1>Posts</h1>

        <FetchResults/>
      </main>

      <Footer/>
    </div>
  )
}

export default Page
