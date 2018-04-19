import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { AddPostComponent } from './add-post/add-post.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'post/:postId', component: PostDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'posts/:actionToPerform', component: AddPostComponent, canActivate: [AuthGuardService] },
  { path: 'post/:postId/:actionToPerform', component: AddPostComponent, canActivate: [AuthGuardService] },
  { path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuardService] },
  { path: 'about-us', component: AboutUsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
