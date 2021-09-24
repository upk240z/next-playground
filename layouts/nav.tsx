import Link from "next/link"
import Util from "../lib/util"
import {SyntheticEvent, useRef, useState} from "react"

const Nav = () => {
  const navRef = useRef(null)
  const [showOverlay, setShowOverlay] = useState<boolean>(false)

  const sideMenuIn = () => {
    setShowOverlay(true)
    Util.transform(navRef.current, ['translateX(-100%)', 'translateX(0)']).catch((err) => {
      console.log(err);
    })
  }

  const sideMenuOut = () => {
    Util.transform(navRef.current, ['translateX(0)', 'translateX(-100%)']).then(() => {
      setShowOverlay(false)
    }).catch((err) => {
      console.log(err)
    })
  }

  const handleClickMenu = (event: SyntheticEvent) => {
    event.preventDefault()
    sideMenuIn()
  }

  const NavLink = ({href, target, children}: any) => {
    return (
      <Link href={href}>
        <a className="text-blue-700" target={target} onClick={sideMenuOut}>{children}</a>
      </Link>
    )
  }

  return (
    <div>
      <ul className="flex pl-5 py-2 bg-blue-300">
        <li>
          <a id="side-menu-btn" href="#" className="text-white" onClick={handleClickMenu}>
            <i className="material-icons left">menu</i>
          </a>
        </li>
        <li className="ml-5">
          <Link href="/">
            <a className="text-blue-800 hover:text-red-500 font-bold">Next.js</a>
          </Link>
        </li>
      </ul>

      <ul className="sidenav" ref={navRef}>
        <li>
          <Link href="/">
            <a className="text-blue-800 hover:text-red-500">
              <i className="material-icons">home</i>TOP
            </a>
          </Link>
        </li>
        <li>
          <div className="divider"/>
        </li>
        <li><NavLink href="/form-function">Form(Function component)</NavLink></li>
        <li><NavLink href="/form-class">Form(Class component)</NavLink></li>
      </ul>
      { showOverlay && <div className="sidenav-overlay" onClick={sideMenuOut}/> }
    </div>
  )
}

export default Nav
