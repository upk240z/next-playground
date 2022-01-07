import {sprintf} from "sprintf";
import * as Firestore from 'firebase/firestore'
import { app } from './firebase'

export type Folder = {
  id: string,
  parent_id: string,
  folder_name: string,
}

export type Doc = {
  id: string,
  folder_id: string,
  title: string,
  body?: string,
  created_at: number,
  updated_at: number
}

export default class DocReader {
  private readonly db: any

  constructor() {
    this.db = Firestore.getFirestore(app)
  }

  public async getFolders(folderId: string = '00000'): Promise<Folder[]> {
    const ref = Firestore.collection(this.db, 'folder')
    const snapShot = await Firestore.getDocs(
      Firestore.query(ref, Firestore.where('parent_id', '==', folderId), Firestore.orderBy('folder_name'))
    )
    return snapShot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        parent_id: data.parent_id,
        folder_name: data.folder_name,
      };
    });
  }

  public async getDocs(folderId: string = '00000'): Promise<Doc[]> {
    const ref = Firestore.collection(this.db, 'memo');
    const snapShot = await Firestore.getDocs(
      Firestore.query(ref, Firestore.where('folder_id', '==', folderId), Firestore.orderBy('title'))
    )
    return snapShot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        folder_id: data.folder_id,
        title: data.title,
        created_at: data.created_at._seconds,
        updated_at: data.updated_at._seconds,
      };
    });
  }

  public async getDoc(docId: string): Promise<Doc|false> {
    const snapshot = await Firestore.getDoc(Firestore.doc(this.db, 'memo', docId))
    if (snapshot.exists()) {
      const data = snapshot.data()
      return {
        id: snapshot.id,
        folder_id: data.folder_id,
        title: data.title,
        body: data.body,
        created_at: data.created_at._seconds,
        updated_at: data.updated_at._seconds
      }
    } else {
      return false;
    }
  }

  private async createId(collectionName: string = 'memo'): Promise<string> {
    const ref = Firestore.collection(this.db, collectionName)
    const snapshot = await Firestore.getDocs(
      Firestore.query(ref, Firestore.orderBy('id', 'desc'), Firestore.limit(1))
    )
    let id = 0
    if (!snapshot.empty) {
      snapshot.forEach((doc: any) => {
        id = parseInt(doc.id)
      })
    }
    return sprintf('%05d', id + 1)
  }

  public async addDoc(folderId: string, title: string, body: string): Promise<string> {
    const id = await this.createId()
    const ref = Firestore.collection(this.db, 'memo')

    await Firestore.setDoc(Firestore.doc(ref, id), {
      id: id,
      folder_id: folderId,
      title: title,
      body: body,
      created_at: Firestore.Timestamp.now(),
      updated_at: Firestore.Timestamp.now(),
    })

    return id
  }

  public async updateDoc(docId: string, title: string, body: string): Promise<void> {
    const ref = Firestore.doc(this.db, 'memo', docId)
    await Firestore.updateDoc(ref, {
      title: title,
      body: body,
      updated_at: Firestore.Timestamp.now(),
    })
  }

  public async deleteDoc(docId: string): Promise<void> {
    await Firestore.deleteDoc(Firestore.doc(this.db, 'memo', docId));
  }

  public async addFolder(parent_id: string, folderName: string): Promise<string> {
    const id = await this.createId('folder')
    const ref = Firestore.collection(this.db, 'folder')

    await Firestore.setDoc(Firestore.doc(ref, id), {
      id: id,
      parent_id: parent_id,
      folder_name: folderName,
    })

    return id
  }

  public async deleteFolder(folderId: string): Promise<void> {
    const docs = await this.getDocs(folderId)
    const folders = await this.getFolders(folderId)
    if (docs.length > 0 || folders.length > 0) {
      throw new Error('cannot delete folder')
    }
    await Firestore.deleteDoc(Firestore.doc(this.db, 'folder', folderId))
  }

  public async getFolder(folderId: string): Promise<Folder|false> {
    const snapshot = await Firestore.getDoc(Firestore.doc(this.db, 'folder', folderId))
    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        parent_id: data.parent_id,
        folder_name: data.folder_name,
      }
    } else {
      return false;
    }
  }

  public async levels(folderId: string): Promise<Folder[]> {
    const folders: Folder[] = [];
    if (folderId == '00000') { return folders; }
    let pointer = folderId;
    while (true) {
      const folder = await this.getFolder(pointer);
      if (!folder) { break; }
      folders.push(folder);
      if (!folder.parent_id || folder.parent_id == '00000') {
        break;
      }
      pointer = folder.parent_id;
    }

    return folders.reverse();
  }
}
