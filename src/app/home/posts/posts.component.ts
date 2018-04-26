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

  @Input() filter: Filter;
  public posts: Post[];
  public allPosts: Post[];
  public pageNumber: number;
  public numOfPages: number;
  private postPerPage: number;

  constructor(
    public postService: PostService
  ) {
    this.posts = new Array<Post>();
    this.allPosts = new Array<Post>();
    this.pageNumber = 1;
    this.numOfPages = 1;
    this.postPerPage = 5;
  }

  ngOnInit() {
    this.postService.getAllPosts(
      posts => {
        this.allPosts = posts;
        this.posts = this.allPosts.slice(0, this.postPerPage);
        this.numOfPages = Math.ceil(this.allPosts.length / this.postPerPage);
      },
      errorMessage => {
        console.error(errorMessage);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    this.postService.getAllPosts(
      posts => {
        this.allPosts = posts;
        this.numOfPages = Math.ceil(this.allPosts.length / this.postPerPage);
        this.updateFilter();
      },
      errorMessage => {
        console.error(errorMessage);
      }
    );
  }

  public updateFilter() {
    if (this.filter.animal) {
      this.allPosts = this.allPosts.filter(post => post.animal == this.filter.animal);
    }

    if (this.filter.breed) {
      this.allPosts = this.allPosts.filter(post => post.breed == this.filter.breed);
    }

    if (this.filter.reward) {
      this.allPosts = this.allPosts.filter(post => (post.reward >= this.filter.reward.min) && (post.reward <= this.filter.reward.max));
    }

    if (this.filter.country) {
      this.allPosts = this.allPosts.filter(post => post.lostPlace.country == this.filter.country);
    }

    if (this.filter.state) {
      this.allPosts = this.allPosts.filter(post => post.lostPlace.state == this.filter.state);
    }

    if (this.filter.city) {
      this.allPosts = this.allPosts.filter(post => post.lostPlace.city == this.filter.city);
    }

    this.posts = this.allPosts.slice(0, this.postPerPage);
    this.numOfPages = Math.ceil(this.allPosts.length / this.postPerPage);
    this.pageNumber = 1;
  }

  public sortPosts(event: Event) {
    const sortId = (event.target as HTMLSelectElement).value;

    switch (sortId) {
      case 'latest-first':
        this.allPosts = this.allPosts.sort((a, b) => { return b.createdAt - a.createdAt });
        break;
      case 'oldest-first':
        this.allPosts = this.allPosts.sort((a, b) => { return a.createdAt - b.createdAt });
        break;
      case 'largest-reward-first':
        this.allPosts = this.allPosts.sort((a, b) => { return b.reward - a.reward });
        break;
      case 'smallest-reward-first':
        this.allPosts = this.allPosts.sort((a, b) => { return a.reward - b.reward });
        break;
    }

    this.posts = this.allPosts.slice(0, this.postPerPage);
    this.numOfPages = Math.ceil(this.allPosts.length / this.postPerPage);
    this.pageNumber = 1;
  }

  public pageNext() {
    if (this.pageNumber * this.postPerPage >= this.allPosts.length) {
      return;
    }    

    const start: number = this.pageNumber * this.postPerPage;
    this.posts = this.allPosts.slice(start, start + this.postPerPage);
    this.pageNumber = this.pageNumber + 1;
  }

  public pageBack() {
    if (this.pageNumber == 1) {
      return;
    }

    this.pageNumber = this.pageNumber - 1;
    const start: number = (this.pageNumber - 1) * this.postPerPage;
    this.posts = this.allPosts.slice(start, start + this.postPerPage);
  }

}
