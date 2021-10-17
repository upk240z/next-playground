import Util from "../lib/util";
import React, {useRef} from "react";
import styles from '../styles/ResultCanvas.module.css'

const ResultCanvas = ({title, text}: any) => {
  const preRef = useRef(null)
  const expandRef = useRef(null)
  const shrinkRef = useRef(null)

  const handleCopy = () => {
    Util.copyClip(text)
  }

  const handleExpand = () => {
    if (!preRef.current || !expandRef.current || !shrinkRef.current) { return }
    (preRef.current as HTMLElement).style.maxHeight = 'none';
    (expandRef.current as HTMLElement).style.display = 'none';
    (shrinkRef.current as HTMLElement).style.display = 'inline';
  }

  const handleShrink = (event: any) => {
    if (!preRef.current || !expandRef.current || !shrinkRef.current) { return }
    (preRef.current as HTMLElement).style.maxHeight = '300px';
    (expandRef.current as HTMLElement).style.display = 'inline';
    (shrinkRef.current as HTMLElement).style.display = 'none';
  }

  return (
    text.length > 0 ?
      <div className="card mt-5">
        <div className="card-title">
          {title}
          <button onClick={handleCopy} className="ml-2 px-3 pt-1 rounded bg-yellow-500 text-white">
            <i className="material-icons left text-lg">content_copy</i>
          </button>
          <button ref={expandRef} onClick={handleExpand} className="ml-2 px-3 pt-1 rounded bg-blue-500 text-white">
            <i className="material-icons left text-lg">expand</i>
          </button>
          <button ref={shrinkRef} onClick={handleShrink} className="ml-2 px-3 pt-1 rounded bg-red-500 text-white" style={{display: 'none'}}>
            <i className="material-icons left text-lg">unfold_less</i>
          </button>
        </div>
        <div className="card-body">
          <pre  ref={preRef} className={styles.result}>{text}</pre>
        </div>
      </div> : null
  )
}

export default ResultCanvas
