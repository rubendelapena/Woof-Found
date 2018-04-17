import { Component, OnInit, Input } from '@angular/core';
import { PostComment } from '../../models/PostComment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() comment: PostComment;

  constructor() { }

  ngOnInit() {
  }

}
