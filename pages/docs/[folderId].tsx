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
    },
    revalidate: 60
  }
}

const Page: NextPage = ({folderId}: any) => {
  const router = useRouter()

  const [folders, setFolders] = useState<Folder[]>([])
  const [docs, setDocs] = useState<Doc[]>([])
  const [levels, setLevels] = useState<Folder[]>([])
  const [message, setMessage] = useState<string|null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)

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
    if (typeof folderId !== 'string') { return }
    await readLevels(folderId)
    await readFolder(folderId)
    await readDoc(folderId)
    setLoaded(true)
  }

  useEffect(() => {
    setLoaded(false)
    readAll().catch(err => {
      if (err.response.status == 403) {
        router.replace('/login').catch(e => console.log(e))
      } else {
        setMessage(err.response.data)
      }
    })
  }, [folderId])

  const levelElems = levels.map((folder, index) => {
    if ((levels.length - 1) == index) {
      return (
        <li key={index}>{ folder.folder_name }</li>
      )
    } else {
      return (
        <li key={index}>
          <Link href={`/docs/${folder.id}`}>
            <a>{ folder.folder_name }</a>
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
          <a className="flex">
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
            <span className="mr-3 px-2 py-1 bg-green-900 rounded-lg text-white text-xs">
              {Util.dateFormat('%Y-%m-%d %H:%M:%S', doc.updated_at)}
            </span>
          </a>
        </Link>
      </li>
    )
  })

  const foldersElement = (
    <div>
      <ul className="levels">
        <li>
          <Link href="/docs/00000">
            <a>Top</a>
          </Link>
          <span>&gt;</span>
        </li>
        { levelElems }
      </ul>

      <ul className="list-group mt-5">
        {folderElems}
        {docElems}
      </ul>
    </div>
  )

  return (
    <div className="container mx-auto">
      <Head><title>Documents</title></Head>
      <Nav/>

      <main>
        <h1>Documents</h1>

        <Message message={message} className="alert-danger"/>

        { loaded ? foldersElement : <Message message="Loading..." className="alert-success"/>  }
      </main>

      <Footer/>
    </div>
  )
}

export default Page
