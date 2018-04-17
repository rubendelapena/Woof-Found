import { Component, OnInit } from '@angular/core';
import { Post } from '../models/Post';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PostComment } from '../models/PostComment';

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

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private postService: PostService
  ) {
    this.comment = new PostComment();
   }

  ngOnInit() {
    let postId: string = this.activatedRoute.snapshot.paramMap.get('postId');

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
        this.lostLocation = this.post.lostPlace['city'] + ', ' + this.post.lostPlace['country'];

        // Get post comments.
        this.postService.getAllComments(this.post.id, 
          comments => {
            this.post.comments = comments;
          },
          errorMessage => {
            console.error(errorMessage);
          }
        );
      }, 
      errorMessage => {
        console.error(errorMessage);
      }
    );
  }

  private goBack() {
    this.location.back();
  }

  private postComment() {
    console.log(this.comment);

    // this.postService.addComment(this.post.id, this.comment, 
    //   successMessage => {
    //     console.log(successMessage);
    //   },
    //   errorMessage => {
    //     console.error(errorMessage);
    //   }
    // );
  }
}
