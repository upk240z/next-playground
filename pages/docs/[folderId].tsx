import {NextPage} from "next";
import {useRouter} from "next/router"
import React, {useEffect, useRef, useState} from "react"
import Link from "next/link"
import Head from "next/head"

import {
  Fab, TextField, Button,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material/'
import {Add as AddIcon} from '@mui/icons-material/'

import DocReader, {Doc, Folder} from "../../lib/doc-reader"
import Util from "../../lib/util"
import Nav from "../../layouts/nav"
import Message from "../../components/message"
import Footer from "../../layouts/footer"
import FirebaseAuth from '../../lib/firebase-auth'

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
  const docReader = new DocReader()
  const fa = new FirebaseAuth()

  const [folders, setFolders] = useState<Folder[]>([])
  const [docs, setDocs] = useState<Doc[]>([])
  const [levels, setLevels] = useState<Folder[]>([])
  const [message, setMessage] = useState<string|null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [dialogOpened, setDialogOpen] = useState<boolean>(false)
  const folderNameRef = useRef(null)

  const readAll = async () => {
    if (folderId == undefined) { return }
    setLevels(await docReader.levels(folderId))
    setFolders(await docReader.getFolders(folderId))
    setDocs(await docReader.getDocs(folderId))
    setLoaded(true)
  }

  useEffect(() => {
    if (!fa.loggedIn()) {
      router.replace('/login').catch(e => console.log(e))
      return
    }
    readAll().catch(err => {
      router.replace('/login').catch(e => console.log(e))
    })
  }, [folderId])

  const handleClickAddFolder = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleClickSaveFolder = () => {
    setMessage(null)
    if (!folderNameRef.current) {
      return
    }

    const folderName = (folderNameRef.current as HTMLInputElement).value
    if (folderName.length == 0) {
      setDialogOpen(false)
      setMessage('input folder name')
      return
    }
    docReader.addFolder(folderId, folderName).then(newId => {
      router.replace('/docs/' + newId).catch(e => console.log(e))
      setDialogOpen(false)
    })
  }

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
        <li>
          <span onClick={handleClickAddFolder}>[+]</span>
        </li>
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
      <Nav loggedIn={true}/>

      <main>
        <h1>Documents</h1>

        <Message message={message} className="alert-danger"/>

        { loaded ? foldersElement : <Message message="Loading..." className="alert-success"/>  }

      </main>

      <Footer/>

      <div className="fab-buttons">
        <Link href={`/docs/` + folderId + '/new'}>
          <Fab color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </Link>
      </div>

      <Dialog
        open={dialogOpened}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Folder</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={folderNameRef}
            label="Folder name"
            type="text"
            variant="standard"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
          <Button onClick={handleClickSaveFolder}>Save</Button>
        </DialogActions>
      </Dialog>

    </div>
  )
}

export default Page
