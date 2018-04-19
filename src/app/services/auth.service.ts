import { Injectable } from '@angular/core';
import { AppUser } from '../models/AppUser';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  public redirect: string;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.redirect = '/home';
   }

  public aUserIsSigned(): boolean {
    if (this.auth.auth.currentUser) {
      return true;
    } else {
      return false;
    }
  }

  public userIsSignedWithId(postOwnerId: string): boolean {
    if (this.auth.auth.currentUser) {
      return this.auth.auth.currentUser.uid == postOwnerId;
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

        this.afs.collection('users').doc(value.id).set(userModel);
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
    this.auth.auth.signOut();
  }

  public getLoggedUser(success: (user: AppUser) => void, err: (message: string) => void) {
    const userId: string = this.auth.auth.currentUser.uid;

    this.afs.collection('users').doc(userId).snapshotChanges().map(
      changes => {
        const data = changes.payload.data() as AppUser;
        data.id = changes.payload.id;
        return data;
      }).subscribe(
        data => {
          success(data);
        },
        err => {
          //err("Error while fetching user.");
        }
      );
  }

}
