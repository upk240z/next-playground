import React, {useEffect, useRef, useState} from "react"
import {useRouter} from "next/router"
import {NextPage} from "next"
import Head from "next/head"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {Card, CardHeader, CardContent, Fab} from '@mui/material/'

import Footer from "../../../layouts/footer"
import Nav from "../../../layouts/nav"
import Message from "../../../components/message"
import Util from "../../../lib/util"
import MemoForm from "../../../components/memo-form"
import Breadcrumb from "../../../components/breadcrumb"
import DocReader, {Doc} from "../../../lib/doc-reader"
import FirebaseAuth from '../../../lib/firebase-auth'

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export function getStaticProps({params}: any) {
  return {
    props: {
      docId: params.docId
    },
    revalidate: 60
  }
}

const initialDoc = {
  id: '',
  folder_id: '',
  title: '',
  body: '',
  created_at: 0,
  updated_at: 0
}

const Page: NextPage = ({docId}: any) => {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const [doc, setDoc] = useState<Doc>(initialDoc)
  const [mode, setMode] = useState<string>('read')
  const titleRef = useRef(null)
  const bodyRef = useRef(null)

  const docReader = new DocReader()
  const fa = new FirebaseAuth()

  const readDoc = async () => {
    if (typeof docId !== 'string') {
      return
    }
    const _doc = await docReader.getDoc(docId)
    if (_doc) { setDoc(_doc) }
  }

  useEffect(() => {
    if (!fa.loggedIn()) {
      router.replace('/login').catch(e => console.log(e))
      return
    }
    setDoc(initialDoc)
    readDoc().catch(err => {
      router.replace('/login').catch(e => console.log(e))
    })
  }, [docId])

  const handleClickEdit = (event: React.MouseEvent) => {
    event.preventDefault()
    setMode('edit')
    if (!titleRef.current || !bodyRef.current) { return }
    (titleRef.current as HTMLInputElement).value = doc.title;
    (bodyRef.current as HTMLTextAreaElement).value = doc.body!;
  }

  const handleClickBack = (event: React.MouseEvent) => {
    event.preventDefault()
    setMode('read')
  }

  const handleSubmit = async (event: React.FormEvent|null) => {
    if (event) { event.preventDefault() }
    if (!titleRef.current || !bodyRef.current) {
      setMessage('error')
      return
    }

    const title = (titleRef.current as HTMLInputElement).value;
    const body = (bodyRef.current as HTMLInputElement).value;

    try {
      await docReader.updateDoc(docId, title, body)
      doc.title = title
      doc.body = body
      setDoc(doc)
      setMode('read')
    } catch (e: any) {
      setMessage(e.toString())
    }
  }

  const handleClickDelete = async (event: React.MouseEvent) => {
    event.preventDefault()

    if (!confirm('Are you sure?')) { return }

    try {
      await docReader.deleteDoc(docId)
      router.replace(`/docs/` + doc.folder_id).catch(e => console.log(e))
    } catch (e: any) {
      setMessage(e.toString())
    }
  }

  const textView =
    <Card className="mt-5">
      <CardHeader title={doc.title} className="border-b-2 border-gray-500 border-dotted"/>
      <CardContent className="markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{ doc.body! }</ReactMarkdown>
      </CardContent>
    </Card>

  const formView = <MemoForm
    title={doc.title}
    body={doc.body}
    handleSubmit={handleSubmit}
    titleRef={titleRef}
    bodyRef={bodyRef}
    buttonName="Edit"
  />

  const docBody = (
    <div>
      <Breadcrumb folderId={doc.folder_id}/>
      { mode == 'read' ? textView : formView }

      {
        doc.updated_at ?
          <div className="mt-1 text-right text-gray-600">
            Updated: { Util.dateFormat('%Y-%m-%d %H:%M:%S', doc.updated_at) }
          </div> : <></>
      }
    </div>
  )

  return (
    <div className="container mx-auto">
      <Head>
        <title>Document</title>
      </Head>

      <Nav loggedIn={true}/>

      <main>
        <h1>Document</h1>

        <Message message={message} className="alert-danger"/>

        { doc && doc.id ? docBody : <Message message="Loading..." className="alert-success"/> }

      </main>

      <Footer/>

      <div className="fab-buttons grid grid-cols-1 gap-2">
        {
          mode == 'read' ?
            <>
              <Fab onClick={handleClickDelete} sx={{ bgcolor: 'error.main' }}>
                <i className="material-icons left text-white">delete</i>
              </Fab>
              <Fab color="primary" onClick={handleClickEdit}>
                <i className="material-icons left">edit</i>
              </Fab>
            </> : <>
              <Fab onClick={handleClickBack} sx={{ bgcolor: 'warning.main' }}>
                <i className="material-icons left text-white">reply</i>
              </Fab>
            </>
        }
      </div>

    </div>
  )
}

export default Page
