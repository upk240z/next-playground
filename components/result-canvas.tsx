import React, {useRef, useState} from "react";

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Snackbar from '@mui/material/Snackbar';

import Util from "../lib/util";
import styles from '../styles/ResultCanvas.module.css'

const ResultCanvas = ({title, text}: any) => {
  const [sbOpen, setSnackBar] = useState<boolean>(false)
  const [sbMsg, setSbMsg] = useState<string>('')
  const preRef = useRef(null)
  const expandRef = useRef(null)
  const shrinkRef = useRef(null)

  const handleCopy = () => {
    Util.copyClip(text)
    setSbMsg('Copied!!')
    setSnackBar(true)
  }

  const handleSbClose = () => setSnackBar(false)

  const handleExpand = () => {
    if (!preRef.current || !expandRef.current || !shrinkRef.current) { return }
    (preRef.current as HTMLElement).style.maxHeight = 'none';
    (expandRef.current as HTMLElement).style.display = 'none';
    (shrinkRef.current as HTMLElement).style.display = 'inline';
  }

  const handleShrink = () => {
    if (!preRef.current || !expandRef.current || !shrinkRef.current) { return }
    (preRef.current as HTMLElement).style.maxHeight = '300px';
    (expandRef.current as HTMLElement).style.display = 'inline';
    (shrinkRef.current as HTMLElement).style.display = 'none';
  }

  if (text.length == 0) { return null }

  return (
    <>
      <Card className="mt-5">
        <CardHeader
          title={title}
          action={
            <>
              <button onClick={handleCopy} className="ml-2 px-3 pt-1 rounded bg-yellow-500 text-white">
                <i className="material-icons left text-lg">content_copy</i>
              </button>
              <button ref={expandRef} onClick={handleExpand} className="ml-2 px-3 pt-1 rounded bg-blue-500 text-white">
                <i className="material-icons left text-lg">expand</i>
              </button>
              <button ref={shrinkRef} onClick={handleShrink} className="ml-2 px-3 pt-1 rounded bg-red-500 text-white" style={{display: 'none'}}>
                <i className="material-icons left text-lg">unfold_less</i>
              </button>
            </>
          }
        >
        </CardHeader>
        <CardContent>
          <pre ref={preRef} className={styles.result}>{text}</pre>
        </CardContent>
      </Card>

      <Snackbar
        open={sbOpen}
        autoHideDuration={3000}
        message={sbMsg}
        onClose={handleSbClose}
      />
    </>
  )
}

export default ResultCanvas
