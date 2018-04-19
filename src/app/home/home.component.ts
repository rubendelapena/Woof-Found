import { Component, OnInit } from '@angular/core';
import { Filter } from '../models/Filter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private filter: Filter;

  constructor() { 
    this.filter = new Filter();
  }

  ngOnInit() {
  }

  private updateFilter(filter: Filter) {
    this.filter = filter;
  }

}
