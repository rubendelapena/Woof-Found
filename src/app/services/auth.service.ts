import { Injectable } from '@angular/core';
import { AppUser } from '../models/AppUser';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { ValueTransformer } from '@angular/compiler/src/util';
import { User } from '@firebase/auth-types';

@Injectable()
export class AuthService {

  public redirect: string;

  set currentUser(value: User) {
    localStorage.setItem('currentUser', JSON.stringify(value));
  }

  get currentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) as User;
  }

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.redirect = '/home';
   }

  public aUserIsSigned(): boolean {
    if (this.currentUser) {
      return true;
    } else {
      return false;
    }
  }

  public userIsSignedWithId(postOwnerId: string): boolean {
    if (this.currentUser) {
      return this.currentUser.uid == postOwnerId;
    } else {
      return false;
    }
  }

  public signUp(user: AppUser, password: string, success: (message: string) => void, err: (message: string) => void) {
    this.auth.auth.createUserWithEmailAndPassword(user.email, password).then(
      value => {
        const userModel = {
          'birthday': user.birthday,
          'email': user.email,
          'location': user.location,
          'name': user.name,
          'phoneNumber': user.phoneNumber,
          'role': 'user'
        };

        this.afs.collection('users').doc(value.id).set(userModel).then(
          value => {
            this.currentUser = this.auth.auth.currentUser;
          }
        );
      }
    ).catch(
      error => {
        err('Error while signing up user.');
      }
    );
  }

  public signIn(email: string, password: string) {
    this.auth.auth.signInWithEmailAndPassword(email, password).then(
      value => {
        console.log('User logged in successfully.');
        this.currentUser = this.auth.auth.currentUser;
        this.router.navigate([this.redirect]);
        this.redirect = '/home';
      }
    ).catch(
      error => {
        console.error('Error while logging user: ' + error);
      }
    );
  }

  public signOut() {
    this.auth.auth.signOut().then(
      value => {
        this.currentUser = null;
        this.router.navigate(['/home']);
      }
    );
  }

  public getLoggedUser(success: (user: AppUser) => void, err: (message: string) => void) {
    const userId: string = this.currentUser.uid;

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

}
