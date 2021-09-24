import {IncomingMessage, ServerResponse} from "http"
import Cookies from "cookies"
import {v4 as uuidv4} from "uuid"

export default class Session {
  private readonly expire = 1800
  private readonly cookies: Cookies
  private readonly sessionId: string
  private sessionData: { [index: string]: any } = {}

  constructor(req: IncomingMessage, res: ServerResponse) {
    this.cookies = new Cookies(req, res)
    const id = this.cookies.get('sessionId')

    if (id !== undefined) {
      this.sessionId = id
      this.load()
    } else {
      this.sessionId = uuidv4()
    }

    this.cookies.set('sessionId', this.sessionId, {
      expires: new Date(Date.now() + this.expire * 1000)
    })
    this.save()
  }

  private load(): void {
    this.sessionData = JSON.parse(this.cookies.get('sessionData') || '{}')
  }

  private save(): void {
    this.cookies.set('sessionData', JSON.stringify(this.sessionData), {
      expires: new Date(Date.now() + this.expire * 1000)
    })
  }

  public get(key: string | null = null): any {
    if (key !== null) {
      return key in this.sessionData ? this.sessionData[key] : null
    } else {
      return this.sessionData
    }
  }

  public set(key: string, value: any): any {
    this.sessionData[key] = value
    this.save()
  }
}
