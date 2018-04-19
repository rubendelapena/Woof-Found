import { Injectable } from '@angular/core';
import { AppUser } from '../models/AppUser';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class AuthService {

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth
  ) { }

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
          'role': user.role
        };

        this.afs.collection('users').doc(value.id).set(userModel);
      }
    ).catch(
      error => {
        err('Error while signing up user.');
      }
    );
  }

  public signIn(email: string, password: string, success: (message: string) => void, err: (message: string) => void) {
    this.auth.auth.signInWithEmailAndPassword(email, password).then(
      value => {
        success('User logged in successfully.');
      }
    ).catch(
      error => {
        err('Error while logging user.');
      }
    );
  }

  public signOut() {
    this.auth.auth.signOut();
  }

}
