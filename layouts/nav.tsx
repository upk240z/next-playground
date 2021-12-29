import React, {useState} from "react"
import Link from "next/link"
import {useRouter} from "next/router";

import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import FirebaseAuth from "../lib/firebase-auth"

const Nav = ({loggedIn}: any) => {
  const router = useRouter()
  const [drawerOpen, setDrawer] = useState<boolean>(false)
  const fa = new FirebaseAuth()

  const toggleDrawer =
    (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawer(open)
    }

  const handleLogout = () => {
    fa.signOut()
    router.replace('/login').catch(e => console.log(e))
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
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link href="/">Next.js</Link>
            </Typography>
            { loggedIn ? <Button color="inherit" onClick={handleLogout}>Logout</Button> : null }
          </Toolbar>
        </AppBar>
      </Box>

      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 300 }}
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem>
              <ListItemIcon><i className="material-icons">home</i></ListItemIcon>
              <Link href="/">Top</Link>
            </ListItem>
          </List>
          <Divider/>
          <List>
            <ListItem className="text-center">
              <ListItemText primary="Examples" className="text-center"/>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">info</i></ListItemIcon>
              <Link href="/form-function">Form(Function component)</Link>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">info</i></ListItemIcon>
              <Link href="/form-class">Form(Class component)</Link>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">info</i></ListItemIcon>
              <Link href="/posts">Posts</Link>
            </ListItem>
          </List>
          <Divider/>
          <List>
            <ListItem className="text-center">
              <ListItemText primary="Tools" className="text-center"/>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">build</i></ListItemIcon>
              <Link href="/tools/json">JSON</Link>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">build</i></ListItemIcon>
              <Link href="/tools/yaml">YAML</Link>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">build</i></ListItemIcon>
              <Link href="/tools/datetime">Datetime</Link>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">build</i></ListItemIcon>
              <Link href="/tools/regex">RegEx</Link>
            </ListItem>
            <ListItem>
              <ListItemIcon><i className="material-icons">build</i></ListItemIcon>
              <Link href="/tools/holidays">Holidays</Link>
            </ListItem>
          </List>
        </Box>
      </Drawer>

    </>
  )
}

export default Nav
