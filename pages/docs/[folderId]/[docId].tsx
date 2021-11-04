import React, {useEffect, useRef, useState} from "react"
import {useRouter} from "next/router"
import {NextPage} from "next"
import Link from "next/link"
import Head from "next/head"

import axios from "axios"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import Footer from "../../../layouts/footer"
import Nav from "../../../layouts/nav"
import {Doc, Folder} from "../../../lib/doc-reader"
import Message from "../../../components/message"
import Util from "../../../lib/util"
import MemoForm from "../../../components/memo-form"

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
  const [levels, setLevels] = useState<Folder[]>([])
  const [mode, setMode] = useState<string>('read')
  const titleRef = useRef(null)
  const bodyRef = useRef(null)

  const readLevels = (folderId: string) => {
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
  }

  const readDoc = async () => {
    if (typeof docId !== 'string') {
      return
    }

    axios.get('/api/doc?id=' + docId).then((res) => {
      if (!res.data) { return }
      setDoc(res.data)
      readLevels(res.data.folder_id)
    }).catch(err => {
      if (err.response.status == 403) {
        router.replace('/login').catch(e => console.log(e))
      } else {
        setMessage(err.response.data)
      }
    })
  }

  useEffect(() => {
    setDoc(initialDoc)
    readDoc()
      .catch(err => console.log(err))
  }, [docId])

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
      const response = await axios.put('/api/doc', {
        id: docId,
        title: title,
        body: body
      })

      if (!response.data['result']) {
        setMessage(response.data['message'])
        return
      }

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
      const response = await axios.delete('/api/doc', {
        params: { id: docId }
      })

      if (!response.data['result']) {
        setMessage(response.data['message'])
        return
      }

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
      <ul className="levels">
        <li>
          <Link href="/docs/00000"><a>Top</a></Link>
          <span>&gt;</span>
        </li>
        { levelElems }
      </ul>

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

      <div className="fixed-action-btn grid grid-cols-1 gap-2">
        {
          mode == 'read' ?
            <>
              <a href="#" className="btn-floating bg-red-500" onClick={handleClickDelete}>
                <i className="material-icons left">delete</i>
              </a>
              <a href="#" className="btn-floating bg-blue-500" onClick={handleClickEdit}>
                <i className="material-icons left">edit</i>
              </a>
            </> : <>
              <a href="#" className="btn-floating bg-yellow-500" onClick={handleClickBack}>
                <i className="material-icons left">reply</i>
              </a>
            </>
        }
      </div>

    </div>
  )
}

export default Page
