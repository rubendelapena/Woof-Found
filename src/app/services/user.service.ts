import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PostComment } from '../models/PostComment';
import { AppUser } from '../models/AppUser';
import { Post } from '../models/Post';

@Injectable()
export class UserService {

  constructor(private afs: AngularFirestore) { }

  public getUser(userId: string, success: (user: AppUser) => void, error: (message: string) => void) {
    this.afs.collection('users').doc(userId).snapshotChanges().map(
      changes => {
        let data = changes.payload.data() as AppUser;
        data.id = changes.payload.id;
        return data;
      }).subscribe(
        data => {
          success(data);
        },
        error => {
          error("Error while fetching user.");
        }
      );
  }

  public getLoggedUser(success: (user: AppUser) => void, error: (message: string) => void) {
    const userId: string = 'bTBujWqK6kvoMUB52L79';

    this.afs.collection('users').doc(userId).snapshotChanges().map(
      changes => {
        let data = changes.payload.data() as AppUser;
        data.id = changes.payload.id;
        return data;
      }).subscribe(
        data => {
          success(data);
        },
        error => {
          //error("Error while fetching user.");
        }
      );
  }

  public getUserPosts(userId: string, success: (posts: Post[]) => void, error: (message: string) => void) {
    this.afs.collection('posts', ref => {
      return ref.where('userId', '==', userId);
    }).snapshotChanges().map(
      changes => {
        return changes.map(
          a => {
            const data = a.payload.doc.data() as Post;
            data.id = a.payload.doc.id;
            return data;
          });
      }).subscribe(
        data => {
          success(data);
        },
        error => {
          error("Error while fetching user's posts.");
        }
      );
  }

}
