import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../../models/Post';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  petAge: string;
  lostDate: Date;
  lostLocation: string;

  constructor() { }

  ngOnInit() {
    if (this.post.petAge >= 12) {
      this.petAge = '' + (this.post.petAge / 12).toFixed(0) + ' years';
    } else {
      this.petAge = '' + this.post.petAge + ' months';
    }

    this.lostDate = new Date(this.post.lostDate);

    this.lostLocation = this.post.lostPlace['city'] + ', ' + this.post.lostPlace['country'];
  }

}
