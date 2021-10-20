import {NextPage} from "next"
import Link from "next/link"
import Head from "next/head"
import Footer from "../../../layouts/footer"
import Nav from "../../../layouts/nav"
import {useRouter} from "next/router"
import {Doc, Folder} from "../../../lib/doc-reader";
import axios, {AxiosResponse} from "axios";
import React, {useEffect, useRef, useState} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Message from "../../../components/message"
import Util from "../../../lib/util";

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

  const handleClickEdit = (event: any) => {
    event.preventDefault()
    setMode('edit')
    if (!titleRef.current || !bodyRef.current) { return }
    (titleRef.current as HTMLInputElement).value = doc.title;
    (bodyRef.current as HTMLTextAreaElement).value = doc.body!;
  }

  const handleClickBack = (event: any) => {
    event.preventDefault()
    setMode('read')
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!titleRef.current || !bodyRef.current) {
      setMessage('error')
      return
    }

    try {
      const response = await axios.put('/api/doc', {
        id: docId,
        title: (titleRef.current as HTMLInputElement).value,
        body: (bodyRef.current as HTMLInputElement).value
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

  const handleClickDelete = async (event: any) => {
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

  const textView = <div className="card mt-5">
    <div className="card-title">
      <h2 className="text-3xl font-bold">{ doc.title }</h2>
    </div>
    <div className="card-body markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{ doc.body! }</ReactMarkdown>
    </div>
  </div>

  const formView =  <div className="card mt-5">
    <div className="card-body">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <input ref={titleRef}  name="title" type="text" placeholder="Title" defaultValue={doc.title}/>
          <textarea ref={bodyRef} name="body" placeholder="Body" rows={10}>{ doc.body }</textarea>
          <button className="btn-primary w-full">Edit</button>
        </div>
      </form>
    </div>
  </div>

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
      <Nav/>

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
              <a href="#" className="btn-floating bg-red-800" onClick={handleClickDelete}>
                <i className="material-icons left">delete</i>
              </a>
              <a href="#" className="btn-floating bg-blue-800" onClick={handleClickEdit}>
                <i className="material-icons left">edit</i>
              </a>
            </> : <>
              <a href="#" className="btn-floating bg-yellow-800" onClick={handleClickBack}>
                <i className="material-icons left">replay</i>
              </a>
            </>
        }
      </div>

    </div>
  )
}

export default Page
