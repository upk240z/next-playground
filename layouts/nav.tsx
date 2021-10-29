import {SyntheticEvent, useRef, useState} from "react"
import Link from "next/link"

import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import MenuIcon from '@mui/icons-material/Menu'

import Util from "../lib/util"

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
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleClickMenu}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link href="/">Next.js</Link>
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      <ul className="sidenav" ref={navRef}>
        <li>
          <Link href="/">
            <a className="text-blue-800 hover:text-red-500">
              <i className="material-icons">home</i>TOP
            </a>
          </Link>
        </li>
        <li><div className="subheader">Examples</div></li>
        <li><NavLink href="/form-function">Form(Function component)</NavLink></li>
        <li><NavLink href="/form-class">Form(Class component)</NavLink></li>
        <li><NavLink href="/posts">Posts</NavLink></li>
        <li><div className="subheader">Tools</div></li>
        <li><NavLink href="/tools/json">JSON</NavLink></li>
        <li><NavLink href="/tools/yaml">YAML</NavLink></li>
        <li><NavLink href="/tools/datetime">Datetime</NavLink></li>
        <li><NavLink href="/tools/regex">RegEx</NavLink></li>
        <li><NavLink href="/tools/holidays">Holidays</NavLink></li>
      </ul>
      { showOverlay && <div className="sidenav-overlay" onClick={sideMenuOut}/> }

    </>
  )
}

export default Nav
