import { Component, OnInit } from '@angular/core';
import { AppUser } from '../models/AppUser';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  private user: AppUser;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getLoggedUser(
      user => {
        if (user) {
          this.user = user;     
          this.userService.getUserPosts(this.user.id, 
            posts => {
              this.user.posts = posts;
            },
            errorMessage => {
              console.error(errorMessage);              
            }
          );
        } else {
          // Redirect to sign in.
        }
      },
      errorMessage => {
        console.error(errorMessage);        
      }
    );
  }

  saveChanges() {
    this.user.birthday = new Date(this.user.birthday).getTime();
  }

}
