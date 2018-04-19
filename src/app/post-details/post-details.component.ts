import { Component, OnInit } from '@angular/core';
import { Post } from '../models/Post';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PostComment } from '../models/PostComment';
import { UserService } from '../services/user.service';
import { AppUser } from '../models/AppUser';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  private post: Post;
  private petAge: string;
  private lostLocation: string;
  private comment: PostComment;
  private postOwnerId: string;
  private currentUserRole: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.comment = new PostComment();
  }

  ngOnInit() {
    const postId: string = this.activatedRoute.snapshot.paramMap.get('postId');

    this.postService.getPost(postId,
      post => {
        this.post = post;

        // Format pet's age.
        if (this.post.petAge >= 12) {
          this.petAge = '' + (this.post.petAge / 12).toFixed(0) + ' years';
        } else {
          this.petAge = '' + this.post.petAge + ' months';
        }

        // Set location string.
        this.lostLocation = this.post.lostPlace['city'] + ', ' + this.post.lostPlace['state'] + ', ' + this.post.lostPlace['country'];

        // Get post comments.
        this.postService.getAllComments(this.post.id,
          comments => {
            this.post.comments = comments;
          },
          errorMessage2 => {
            console.error(errorMessage2);
          }
        );
      },
      errorMessage => {
        console.error(errorMessage);
      }
    );

    this.authService.getLoggedUser(
      user => {
        this.postOwnerId = user.id;
        this.comment.userId = user.id;
        this.comment.userName = user.name;
        this.currentUserRole = user.role;
      },
      errorMessage => {
        console.error(errorMessage);
      }
    );
  }

  private goBack() {
    this.router.navigate(['/home']);
  }

  private deletePost() {
    if (!confirm('Are you sure to delete this post?\n(This action is NOT reversible)')) {
      return;
    }

    this.postService.deletePost(this.post,
      successMessage => {
        console.log(successMessage);
        this.goBack();
      },
      errorMessage => {
        console.error(errorMessage);
      }
    );
  }

  private postComment() {
    this.comment.createdAt = Date.now();

    this.postService.addComment(this.post.id, this.comment,
      successMessage => {
        console.log(successMessage);
        this.comment.createdAt = null;
        this.comment.text = '';
      },
      errorMessage => {
        console.error(errorMessage);
      }
    );
  }
}
