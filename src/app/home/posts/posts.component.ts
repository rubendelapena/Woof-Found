import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Post } from '../../models/Post';
import { PostService } from '../../services/post.service';
import { Filter } from '../../models/Filter';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  private posts: Post[];
  @Input() filter: Filter;

  constructor(
    private postService: PostService
  ) {
    this.posts = new Array<Post>();
  }

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

  ngOnChanges(changes: SimpleChanges) {
    this.postService.getAllPosts(
      posts => {
        this.posts = posts;
        this.updateFilter();
      },
      errorMessage => {
        console.error(errorMessage);
      }
    );
  }

  private updateFilter() {
    if (this.filter.animal) {
      this.posts = this.posts.filter(post => post.animal == this.filter.animal);
    }

    if (this.filter.breed) {
      this.posts = this.posts.filter(post => post.breed == this.filter.breed);
    }

    if (this.filter.reward) {
      this.posts = this.posts.filter(post => (post.reward >= this.filter.reward.min) && (post.reward <= this.filter.reward.max));
    }

    if (this.filter.country) {
      this.posts = this.posts.filter(post => post.lostPlace.country == this.filter.country);
    }

    if (this.filter.state) {
      this.posts = this.posts.filter(post => post.lostPlace.state == this.filter.state);
    }

    if (this.filter.city) {
      this.posts = this.posts.filter(post => post.lostPlace.city == this.filter.city);
    }
  }

  private sortPosts(event: Event) {
    const sortId = (event.target as HTMLSelectElement).value;

    switch (sortId) {
      case 'latest-first':
        this.posts = this.posts.sort((a, b) => { return b.createdAt - a.createdAt });
        break;
      case 'oldest-first':
        this.posts = this.posts.sort((a, b) => { return a.createdAt - b.createdAt });
        break;
      case 'largest-reward-first':
        this.posts = this.posts.sort((a, b) => { return b.reward - a.reward });
        break;
      case 'smallest-reward-first':
        this.posts = this.posts.sort((a, b) => { return a.reward - b.reward });
        break;
    }
  }

}
