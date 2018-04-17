import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/Post';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  private posts: Post[];

  constructor(
    private postService: PostService
  ) { }

  ngOnInit() {
    this.postService.getAllPosts(
      posts => {
        this.posts = posts;
      }, 
      errorMessage => {
        console.error(errorMessage);
        
      }
    );
  }

}
