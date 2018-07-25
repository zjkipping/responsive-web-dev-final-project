import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Product, Rating, User } from '../../types';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  @Input() product: Product;
  @Input() comments: Comment[];
  @Input() rating: number;
  @Input() rated: boolean;
  @Input() user: User;

  @Output() rate = new EventEmitter<{ rating: Rating, product: Product }>();
  @Output() addToCart = new EventEmitter<Product>();

  stars = [1, 2, 3, 4, 5];

  rateClick(value: number) {
    if (!this.rated && this.user) {
      this.rate.emit({ rating: { value, userID: this.user.uid }, product: this.product });
    }
  }

  constructor() { }
}
