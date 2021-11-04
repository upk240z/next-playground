import React, {useEffect, useState} from "react"
import axios from "axios";
import {Folder} from "../lib/doc-reader"
import Link from "next/link";

const Breadcrumb = ({folderId}: any) => {
  const [levels, setLevels] = useState<Folder[]>([])

  useEffect(() => {
    if (!folderId) { return }
    axios.get('/api/levels?id=' + folderId).then((res) => {
      if (!res.data) { return }
      setLevels(res.data)
    })
  }, [])

  const levelElements = levels.map((folder, index) => {
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
    <ul className="levels">
      <li>
        <Link href="/docs/00000"><a>Top</a></Link>
        <span>&gt;</span>
      </li>
      { levelElements }
    </ul>
  )
}

export default Breadcrumb
