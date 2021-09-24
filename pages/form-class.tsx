import Footer from "../layouts/footer"
import React from "react"
import Nav from "../layouts/nav"
import Message from "../components/message"
import SampleForm from "../components/sample-form"
import Head from "next/head"

export default class Page extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      message: null,
      savedSession: {}
    }
  }

  componentDidMount() {
    this.readSession().then()
  }

  async readSession() {
    const res = await fetch('/api/session')
    const sessions = await res.json()
    this.setState({
      savedSession: sessions
    })
  }

  async handleSubmit(event: any) {
    event.preventDefault()

    this.setState({
      message: null
    })

    const params: any = {}
    params[event.target.key.value] = event.target.value.value

    const res = await fetch('/api/session', {
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const result = await res.json()

    if (result.result) {
      this.setState({
        message: 'Success'
      })
    } else {
      this.setState({
        message: 'failed'
      })
    }

    this.readSession().then()
  }

  render() {
    const lis = Object.keys(this.state.savedSession).map((key) => {
      return <li key={key} className="list-group">{key}: {this.state.savedSession[key]}</li>
    })

    return (
      <div className="container mx-auto">
        <Head><title>Form(Class base)</title></Head>
        <Nav/>
        <main>
          <h1>Form(Class base)</h1>
          <Message message={this.state.message} className="alert-success"/>
          <div className="card mt-5">
            <SampleForm handle={this.handleSubmit.bind(this)}/>
            <div className="p-3">
              <ul className="list-group">
                {lis}
              </ul>
            </div>
          </div>
        </main>

        <Footer/>
      </div>
    )
  }
}
