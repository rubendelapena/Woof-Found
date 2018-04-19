import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PostComment } from '../models/PostComment';
import { AppUser } from '../models/AppUser';
import { Post } from '../models/Post';

@Injectable()
export class UserService {

  constructor(
    private afs: AngularFirestore
  ) { }

  public getUser(userId: string, success: (user: AppUser) => void, err: (message: string) => void) {
    this.afs.collection('users').doc(userId).snapshotChanges().map(
      changes => {
        const data = changes.payload.data() as AppUser;
        data.id = changes.payload.id;
        return data;
      }).subscribe(
        data => {
          success(data);
        },
        error => {
          err("Error while fetching user.");
        }
      );
  }

  public getUserPosts(userId: string, success: (posts: Post[]) => void, err: (message: string) => void) {
    this.afs.collection('posts', ref => {
      return ref.where('userId', '==', userId).orderBy('createdAt', 'desc');
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
          err("Error while fetching user's posts.");
        }
      );
  }

  public updateUser(user: AppUser, success: (message: string) => void, err: (message: string) => void) {
    const userModel = {
      'name': user.name,
      'birthday': user.birthday,
      'location': user.location,
      'phoneNumber': user.phoneNumber
    };

    this.afs.collection('users').doc(user.id).update(userModel).then(
      docRef => {
        success("User " + user.id + " was updated successfully.")
      }
    ).catch(
      error => {
        err("Error while updating user" + user.id);
      }
    );
  }

}
