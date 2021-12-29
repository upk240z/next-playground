import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {NextPage} from "next";
import Head from "next/head";

import {Fab} from '@mui/material/'

import Nav from "../../../layouts/nav";
import Footer from "../../../layouts/footer";
import Message from "../../../components/message";
import MemoForm from "../../../components/memo-form"
import Breadcrumb from "../../../components/breadcrumb"
import DocReader from "../../../lib/doc-reader"
import FirebaseAuth from "../../../lib/firebase-auth"

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

  const fa = new FirebaseAuth()

  useEffect(() => {
    if (!fa.loggedIn()) {
      router.replace('/login').catch(e => console.log(e))
      return
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent|null) => {
    if (event) { event.preventDefault() }
    if (!titleRef.current || !bodyRef.current) {
      return
    }

    try {
      const docReader = new DocReader()
      const createdId = await docReader.addDoc(folderId, (titleRef.current as HTMLInputElement).value, (bodyRef.current as HTMLInputElement).value)
      router.replace(`/docs/` + folderId + '/' + createdId).catch(e => console.log(e))
    } catch (err: any) {
      setMessage(err.toString())
    }
  }

  const handleClickBack = (event: React.MouseEvent) => {
    event.preventDefault()
    router.replace(`/docs/` + folderId).catch(e => console.log(e))
  }

  return (
    <div className="container mx-auto">
      <Head>
        <title>Document</title>
      </Head>

      <Nav loggedIn={true}/>

      <main>
        <h1>New Document</h1>

        <Message message={message} className="alert-danger"/>

        <Breadcrumb folderId={folderId}/>

        <MemoForm
          handleSubmit={handleSubmit}
          titleRef={titleRef}
          bodyRef={bodyRef}
          buttonName="Add"
        />

      </main>

      <Footer/>

      <div className="fab-buttons grid grid-cols-1 gap-2">
        <Fab color="secondary" onClick={handleClickBack}>
          <i className="material-icons left">reply</i>
        </Fab>
      </div>

    </div>

  )
}

export default Page
