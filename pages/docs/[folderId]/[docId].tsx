import {NextPage} from "next"
import Link from "next/link"
import Head from "next/head"
import Footer from "../../../layouts/footer"
import Nav from "../../../layouts/nav"
import {useRouter} from "next/router"
import {Doc, Folder} from "../../../lib/doc-reader";
import axios from "axios";
import React, {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Message from "../../../components/message"
import Util from "../../../lib/util";

const Page: NextPage = () => {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const {docId} = router.query
  const [doc, setDoc] = useState<Doc>({
    id: '',
    folder_id: '',
    title: '',
    body: '',
    created_at: 0,
    updated_at: 0
  })
  const [levels, setLevels] = useState<Folder[]>([])

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
    if (typeof docId == 'string') {
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
  }

  useEffect(() => {
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

  return (
    <div className="container mx-auto">
      <Head>
        <title>Document</title>
      </Head>
      <Nav/>

      <main>
        <h1>Document</h1>

        <Message message={message} className="alert-danger"/>

        <ul className="levels">
          <li>
            <Link href="/docs/00000"><a>Top</a></Link>
            <span>&gt;</span>
          </li>
          { levelElems }
        </ul>

        <div className="card mt-5">
          <h2 className="pb-3 px-2 border-b border-gray-700 text-3xl font-bold">{ doc.title }</h2>
          <div className="p-2 markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{ doc.body! }</ReactMarkdown>
          </div>
        </div>

        <div className="mt-1 text-right text-gray-600">Updated: { Util.dateFormat('%Y-%m-%d %H:%M:%S', doc.updated_at) }</div>

      </main>

      <Footer/>
    </div>
  )
}

export default Page
