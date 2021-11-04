import admin from 'firebase-admin'
import {ServiceAccount} from "firebase-admin/lib/credential";
import {DocumentData, FieldValue, QueryDocumentSnapshot, WriteResult} from "@google-cloud/firestore";
import {sprintf} from "sprintf";

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
  private readonly db: any;

  constructor() {
    if (admin.apps.length === 0) {
      const cert: ServiceAccount = {
        projectId: process.env.projectId,
        privateKey: process.env.privateKey,
        clientEmail: process.env.clientEmail,
      };

      admin.initializeApp({
        credential: admin.credential.cert(cert),
        databaseURL: 'https://webstudio-30e6a.firebaseio.com'
      });
    }

    this.db = admin.firestore();
  }

  public async getFolders(folderId: string = '00000'): Promise<Folder[]> {
    const ref = this.db.collection('folder');
    const snapShot = await ref.where('parent_id', '==', folderId).orderBy('folder_name').get();
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
    const ref = this.db.collection('memo');
    const snapShot = await ref.where('folder_id', '==', folderId).orderBy('title').get();
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
    const snapshot: QueryDocumentSnapshot = await this.db.collection('memo').doc(docId).get();
    const data: DocumentData = snapshot.data();
    if (snapshot.exists) {
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

  private async createId(): Promise<string> {
    const snapshot = await this.db.collection('memo').orderBy('id', 'desc').limit(1).get()
    let id = 0
    if (!snapshot.empty) {
      snapshot.forEach((doc: DocumentData) => {
        id = parseInt(doc.id)
      })
    }
    return sprintf('%05d', id + 1)
  }

  public async addDoc(folderId: string, title: string, body: string): Promise<string> {
    const id = await this.createId()
    const res: WriteResult = await this.db.collection('memo').doc(id).set({
      id: id,
      folder_id: folderId,
      title: title,
      body: body,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    })
    return id
  }

  public async updateDoc(docId: string, title: string, body: string): Promise<void> {
    const res: WriteResult = await this.db.collection('memo').doc(docId).update({
      title: title,
      body: body,
      updated_at: FieldValue.serverTimestamp()
    })
  }

  public async deleteDoc(docId: string): Promise<void> {
    const res: WriteResult = await this.db.collection('memo').doc(docId).delete()
  }

  public async getFolder(folderId: string): Promise<Folder|false> {
    const snapshot: QueryDocumentSnapshot = await this.db.collection('folder').doc(folderId).get();
    const data: DocumentData = snapshot.data();
    if (snapshot.exists) {
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
