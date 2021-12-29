import React, {useEffect, useState} from "react"
import DocReader, {Folder} from "../lib/doc-reader"
import Link from "next/link"

const Breadcrumb = ({folderId}: any) => {
  const [levels, setLevels] = useState<Folder[]>([])

  const docReader = new DocReader()

  const readLevels = async (fId: string) => {
    if (!fId) {
      return
    }
    setLevels(await docReader.levels(fId))
  }

  useEffect(() => {
    readLevels(folderId).catch(e => console.log(e))
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
