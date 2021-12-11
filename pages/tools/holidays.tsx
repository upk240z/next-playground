import React, {useEffect, useState} from "react"
import {NextPage} from "next"
import Head from "next/head"

import axios from "axios"
import {Box, Grid, Paper, Chip, Typography} from '@mui/material'
import Snackbar from '@mui/material/Snackbar';

import Nav from "../../layouts/nav"
import Footer from "../../layouts/footer"
import Message from "../../components/message"
import Util from "../../lib/util";

const Page: NextPage = () => {
  const [holidays, setHolidays] = useState([])
  const [sbOpen, setSnackBar] = useState<boolean>(false)
  const [sbMsg, setSbMsg] = useState<string>('')

  useEffect(() => {
    axios.get('/api/holidays').then((response) => {
      setHolidays(response.data)
    })
  }, [])

  const handleClick = (event: any) => {
    const element = event.target as HTMLElement
    Util.copyClip(element.innerText)
    setSbMsg('Copied!!')
    setSnackBar(true)
  }

  const handleSbClose = () => setSnackBar(false)

  const holidayElements = holidays.map((value: any, index: number) => {
    return (
      <Grid item key={index} xs={12} md={4}>
        <Paper sx={{p: 2}}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Chip label={value['date']} variant="outlined" color="success" onClick={handleClick}/>
            <Typography sx={{ml: 1}} component="div">
              {value['name']}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    )
  })

  return (
    <div className="container">
      <Head><title>Holidays</title></Head>
      <Nav/>
      <main>
        <h1 className="mb-3">Holidays</h1>

        {
          holidayElements.length > 0 ?
            <Grid container spacing={2}>{ holidayElements }</Grid> : <Message message="Loading..." className="alert-success"></Message>
        }

      </main>

      <Footer/>

      <Snackbar
        open={sbOpen}
        autoHideDuration={3000}
        message={sbMsg}
        onClose={handleSbClose}
      />
    </div>
  )
}

export default Page
