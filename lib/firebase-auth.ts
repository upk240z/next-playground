import {Auth, getAuth, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { app } from './firebase'
import Util from "./util";

export default class FirebaseAuth {
  private readonly auth: Auth
  private static STORAGE_ITEM = 'authed'
  private static EXPIRE_TIME = 3600

  constructor() {
    this.auth = getAuth(app)
  }

  public async signIn(email: string, password: string): Promise<boolean> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password)
      const result = !!credential.user
      if (result) {
        const authResult = {
          time: Util.now()
        }
        localStorage.setItem(FirebaseAuth.STORAGE_ITEM, JSON.stringify(authResult))
      }
      return result
    } catch (e) {
      console.log(e)
      return false
    }
  }

  public signOut(): void {
    signOut(this.auth).catch(e => console.log(e))
    localStorage.removeItem(FirebaseAuth.STORAGE_ITEM)
  }

  public loggedIn(): boolean {
    const json = localStorage.getItem(FirebaseAuth.STORAGE_ITEM)
    if (!json) { return false }
    const decoded = JSON.parse(json)
    if ((decoded['time'] + FirebaseAuth.EXPIRE_TIME) >= Util.now()) {
      decoded['time'] = Util.now()
      localStorage.setItem(FirebaseAuth.STORAGE_ITEM, JSON.stringify(decoded))
      return true
    } else {
      this.signOut()
      return false
    }
  }
}
