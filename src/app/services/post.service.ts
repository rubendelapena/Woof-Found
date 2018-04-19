import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PostComment } from '../models/PostComment';
import { Post } from '../models/Post';

@Injectable()
export class PostService {

  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) { }

  public getAllPosts(success: (posts: Post[]) => void, err: (message: string) => void) {
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
          err("Error while fetching all posts.");
        }
      );
  }

  public getPost(postId: string, success: (post: Post) => void, err: (message: string) => void) {
    this.afs.collection('posts').doc(postId).snapshotChanges().map(
      changes => {
        const data = changes.payload.data() as Post;
        data.id = changes.payload.id;
        return data;
      }).subscribe(
        data => {
          success(data);
        },
        error => {
          err("Error while fetching post.");
        }
      );
  }

  public getAllComments(postId: string, success: (comments: PostComment[]) => void, err: (message: string) => void) {
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
          err("Error while fetching all posts.");
        }
      );
  }

  public addComment(postId: string, comment: PostComment, success: (message: string) => void, err: (message: string) => void) {

    const model = {
      createdAt: comment.createdAt,
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
        err("Error while adding comment" + comment.text);
      }
    );
  }

  public addPost(post: Post, localPictureUrl: string, success: (message: string) => void, err: (message: string) => void) {
    const postModel = {
      'animal': post.animal,
      'breed': post.breed,
      'createdAt': post.createdAt,
      'description': post.description,
      'lostDate': post.lostDate,
      'lostPlace': post.lostPlace,
      'ownerContactInfo': post.ownerContactInfo,
      'petAge': post.petAge,
      'petName': post.petName,
      'reward': post.reward,
      'userId': post.userId
    };

    this.afs.collection('posts').add(postModel).then(
      docRef => {
        this.afStorage.upload('posts/' + docRef.id + '/', localPictureUrl).then(
          value => {
            this.afs.collection('posts').doc(docRef.id).update({ 'pictureUrl': value.downloadURL }).then(
              value => {
                success(docRef.id);
              }
            ).catch(
              error => {
                err('Error while adding post.');
              }
            );
          }
        ).catch(
          value => {
            err('Error while uploading post picture.');
          }
        );
      }
    ).catch(
      error => {
        err('Error while adding post.');
      }
    );
  }

  public updatePost(post: Post, success: (message: string) => void, err: (message: string) => void) {
    const postModel = {
      'animal': post.animal,
      'breed': post.breed,
      'createdAt': post.createdAt,
      'description': post.description,
      'lostDate': post.lostDate,
      'lostPlace': post.lostPlace,
      'ownerContactInfo': post.ownerContactInfo,
      'petAge': post.petAge,
      'petName': post.petName,
      'reward': post.reward,
      'userId': post.userId
    };

    this.afs.collection('posts').doc(post.id).update(postModel).then(
      docRef => {
        success(post.id);
      }
    ).catch(
      error => {
        err('Error while updating post ' + post.id + '.');
      }
    );
  }

  public deletePost(post: Post, success: (message: string) => void, err: (message: string) => void) {
    this.afs.collection('posts').doc(post.id).delete().then(
      docRef => {
        success("Post deleted successfully.");
      }
    ).catch(
      error => {
        err("Error while deleting the post.");
      }
    );
  }
}
