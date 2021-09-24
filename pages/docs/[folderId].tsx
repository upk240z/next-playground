import {NextPage} from "next";
import {useRouter} from "next/router"
import React, {useEffect, useState} from "react"
import {Doc, Folder} from "../../lib/doc-reader"
import axios from "axios"
import Link from "next/link"
import Util from "../../lib/util"
import Head from "next/head"
import Nav from "../../layouts/nav"
import Message from "../../components/message"
import Footer from "../../layouts/footer"

const Page: NextPage = () => {
  const router = useRouter()
  const {folderId} = router.query

  let initialFolderId: string = '00000'
  if (folderId !== undefined) {
    if (Array.isArray(folderId)) {
      // @ts-ignore
      initialFolderId = folderId.pop().toString()
    } else {
      initialFolderId = folderId
    }
  }

  const [currentFolderId, setFolderId] = useState<string>(initialFolderId)
  const [folders, setFolders] = useState<Folder[]>([])
  const [docs, setDocs] = useState<Doc[]>([])
  const [levels, setLevels] = useState<Folder[]>([])
  const [message, setMessage] = useState<string|null>(null)

  const readLevels = async (pFolderId: string): Promise<void> => {
    const res = await axios.get('/api/levels?id=' + pFolderId)
    if (!res.data) { return }
    setLevels(res.data)
  }

  const readFolder = async (pFolderId: string): Promise<void> => {
    const res = await axios.get('/api/folders?id=' + pFolderId)
    setFolders(res.data)
  }

  const readDoc = async (pFolderId: string): Promise<void> => {
    const res = await axios.get('/api/docs?id=' + pFolderId)
    setDocs(res.data)
  }

  const readAll = async () => {
    await readLevels(currentFolderId)
    await readFolder(currentFolderId)
    await readDoc(currentFolderId)
  }

  useEffect(() => {
    readAll().catch(err => {
      if (err.response.status == 403) {
        router.replace('/login').catch(e => console.log(e))
      } else {
        setMessage(err.response.data)
      }
    })
  }, [currentFolderId])

  const levelElems = levels.map((folder, index) => {
    if ((levels.length - 1) == index) {
      return (
        <li key={index}>{ folder.folder_name }</li>
      )
    } else {
      return (
        <li key={index}>
          <Link href={`/docs/${folder.id}`}>
            <a onClick={e => setFolderId(folder.id)}>{ folder.folder_name }</a>
          </Link>
          <span>&gt;</span>
        </li>
      )
    }
  })

  const folderElems = folders.map((folder: Folder, index: number) => {
    return (
      <li key={index} className="bg-blue-700 text-white">
        <Link href={`/docs/${folder.id}`}>
          <a className="flex" onClick={e => setFolderId(folder.id)}>
            <span className="material-icons mr-1">folder</span>
            <span>{folder.folder_name}</span>
          </a>
        </Link>
      </li>
    )
  })

  const docElems = docs.map((doc: Doc, index: number) => {
    return (
      <li key={index} className="bg-yellow-100">
        <Link href={`/docs/${doc.folder_id}/${doc.id}`}>
          <a className="flex">
            <span className="material-icons mr-1">description</span>
            <span className="flex-1">{doc.title}</span>
            <span className="mr-3 px-2 py-1 bg-green-900 rounded-lg text-white text-sm">
              {Util.dateFormat('%Y-%m-%d %H:%M:%S', doc.updated_at)}
            </span>
          </a>
        </Link>
      </li>
    )
  })

  return (
    <div className="container mx-auto">
      <Head><title>Documents</title></Head>
      <Nav/>

      <main>
        <h1>Documents</h1>

        <Message message={message} className="alert-danger"/>

        <ul className="levels">
          <li>
            <Link href="/docs/00000">
              <a onClick={e => setFolderId('00000')}>Top</a>
            </Link>
            <span>&gt;</span>
          </li>
          { levelElems }
        </ul>

        <ul className="list-group mt-5">
          {folderElems}
          {docElems}
        </ul>
      </main>

      <Footer/>
    </div>
  )
}

export default Page
