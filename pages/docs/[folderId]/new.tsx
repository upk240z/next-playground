import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {NextPage} from "next";
import Head from "next/head";
import Link from "next/link";

import axios from "axios";
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import Nav from "../../../layouts/nav";
import Footer from "../../../layouts/footer";
import Message from "../../../components/message";
import {Folder} from "../../../lib/doc-reader";

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
  const [levels, setLevels] = useState<Folder[]>([])
  const titleRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    axios.get('/api/levels?id=' + folderId).then((res) => {
      if (!res.data) { return }
      setLevels(res.data)
    }).catch(err => {
      if (err.response.status == 403) {
        router.replace('/login').catch(e => console.log(e))
      } else {
        setMessage(err.response.data)
      }
    })
  }, [])

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

    router.replace(`/docs/` + folderId + '/' + response.data['id']).catch(e => console.log(e))
  }

  const handleClickBack = (event: any) => {
    event.preventDefault()
    router.replace(`/docs/` + folderId).catch(e => console.log(e))
  }

  const levelElems = levels.map((folder, index) => {
    return (
      <li key={index}>
        <Link href={`/docs/${folder.id}`}>
          <a>{ folder.folder_name }</a>
        </Link>
        { (levels.length - 1) != index ? <span>&gt;</span> : null }
      </li>
    )
  })

  return (
    <div className="container mx-auto">
      <Head>
        <title>Document</title>
      </Head>

      <Nav loggedIn={true}/>

      <main>
        <h1>New Document</h1>

        <Message message={message} className="alert-danger"/>

        <ul className="levels">
          <li>
            <Link href="/docs/00000"><a>Top</a></Link>
            <span>&gt;</span>
          </li>
          { levelElems }
        </ul>

        <form onSubmit={handleSubmit}>
          <Card className="mt-5">
            <CardContent className="grid grid-cols-1 gap-4">
              <TextField
                name="title"
                label="Title"
                type="text"
                required={true}
                className="w-full"
                inputRef={titleRef}
              />
              <TextField
                name="body"
                label="Body"
                type="text"
                required={true}
                className="w-full"
                multiline
                rows={10}
                inputRef={bodyRef}
              />
              <Button type="submit" variant="contained" className="w-full">Add</Button>
            </CardContent>
          </Card>
        </form>
      </main>

      <Footer/>

      <div className="fixed-action-btn grid grid-cols-1 gap-2">
        <a href="#" className="btn-floating bg-yellow-500" onClick={handleClickBack}>
          <i className="material-icons left">reply</i>
        </a>
      </div>

    </div>

  )
}

export default Page
