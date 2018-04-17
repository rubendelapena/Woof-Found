import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PostComment } from '../models/PostComment';
import { Post } from '../models/Post';

@Injectable()
export class PostService {

  constructor(private afs: AngularFirestore) { }

  public getAllPosts(success: (posts: Post[]) => void, error: (message: string) => void) {
    this.afs.collection('posts', ref => {
      return ref.orderBy('createdAt', 'desc');
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
          error("Error while fetching all posts.");
        }
      );
  }

  public getPost(postId: string, success: (post: Post) => void, error: (message: string) => void) {
    this.afs.collection('posts').doc(postId).snapshotChanges().map(
      changes => {
        let data = changes.payload.data() as Post;
        data.id = changes.payload.id;
        return data;
      }).subscribe(
        data => {
          success(data);
        },
        error => {
          error("Error while fetching post.");
        }
      );
  }

  public getAllComments(postId: string, success: (comments: PostComment[]) => void, error: (message: string) => void) {
    this.afs.collection('posts').doc(postId).collection('comments', ref => {
      return ref.orderBy('createdAt', 'desc')
    }).snapshotChanges().map(
      changes => {
        return changes.map(
          a => {
            const data = a.payload.doc.data() as PostComment;
            data.id = a.payload.doc.id;
            return data;
          });
      }).subscribe(
        data => {
          success(data);
        },
        error => {
          error("Error while fetching all posts.");
        }
      );
  }

  public addComment(postId: string, comment: PostComment, success: (message: string) => void, error: (message: string) => void) {

    const model = {
      createdAt: Date.now(),
      text: comment.text,
      userId: comment.userId,
      userName: comment.userName
    };

    this.afs.collection('posts').doc(postId).collection('comments').add(model).then(
      docRef => {
        success("Comment " + docRef.id + " was added successfully.")
      }
    ).catch(
      error => {
        error("Error while adding comment" + comment.text);
      }
    );
  }

  public addPost(post: Post, success: (message: string) => void, error: (message: string) => void) {
    
  }
}
