import {NextPage} from "next";
import React, {useRef, useState} from "react";
import Head from "next/head";
import Nav from "../../../layouts/nav";
import axios from "axios";
import {useRouter} from "next/router";
import Footer from "../../../layouts/footer";
import Message from "../../../components/message";

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export function getStaticProps({params}: any) {
  return {
    props: {
      folderId: params.folderId
    }
  }
}

const Page: NextPage = ({folderId}: any) => {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const titleRef = useRef(null)
  const bodyRef = useRef(null)

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!titleRef.current || !bodyRef.current) {
      return
    }
    const response = await axios.post('/api/doc', {
      folder_id: folderId,
      title: (titleRef.current as HTMLInputElement).value,
      body: (bodyRef.current as HTMLInputElement).value
    })

    if (!response.data['result']) {
      setMessage(response.data['message'])
      return
    }

    router.replace(`/docs/` + folderId).catch(e => console.log(e))
  }

  return (
    <div className="container mx-auto">
      <Head>
        <title>Document</title>
      </Head>
      <Nav/>

      <main>
        <h1>New Document</h1>

        <Message message={message} className="alert-danger"/>

        <div className="card mt-5">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <input ref={titleRef}  name="title" type="text" placeholder="Title"/>
                <textarea ref={bodyRef} name="body" placeholder="Body" rows={10}></textarea>
                <button className="btn-primary w-full">Add</button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer/>
    </div>

  )
}

export default Page
