import {IncomingMessage, ServerResponse} from "http";
import Session from "./session";
import Util from "./util";

export default class Auth {
  private readonly session: Session;

  constructor(req: IncomingMessage, res: ServerResponse) {
    this.session = new Session(req, res)
  }

  public loggedIn(): boolean {
    const token = this.session.get('token')
    if (!token) {
      return false
    }

    try {
      const expire = parseInt(Util.decrypt(token))
      // update token
      this.session.set('token', Util.token())
      return expire > Date.now()
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
