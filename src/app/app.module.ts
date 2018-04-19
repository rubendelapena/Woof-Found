import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { PostsComponent } from './home/posts/posts.component';
import { FiltersComponent } from './home/filters/filters.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { PostComponent } from './home/posts/post/post.component';
import { AppRoutingModule } from './/app-routing.module';
import { AddPostComponent } from './add-post/add-post.component';
import { PostService } from './services/post.service';
import { CommentComponent } from './post-details/comment/comment.component';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { SignInComponent } from './sign-in/sign-in.component';



const firebaseConfig = {
  apiKey: "AIzaSyDcd9CRiALC3atuRdg0zieC9KAJWyiWZIY",
  authDomain: "woof-and-found.firebaseapp.com",
  databaseURL: "https://woof-and-found.firebaseio.com",
  projectId: "woof-and-found",
  storageBucket: "woof-and-found.appspot.com",
  messagingSenderId: "684796228684"
};


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    PostsComponent,
    FiltersComponent,
    MyAccountComponent,
    AboutUsComponent,
    PostDetailsComponent,
    PostComponent,
    AddPostComponent,
    CommentComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule
  ],
  providers: [
    PostService, 
    UserService,
    AuthService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
