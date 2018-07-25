import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User, Comment } from '../../types';
import { FirebaseApiService } from '../../firebase-api.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent {
  @Input() comments: Comment[] = [];
  @Input() user: User;
  @Input() users: User[];
  @Input() productID: string;
  @Output() commentPost = new EventEmitter<Comment>();

  commentForm: FormGroup;

  constructor(private api: FirebaseApiService, fb: FormBuilder) {
    this.commentForm = fb.group({
      text: ['', [Validators.required]]
    });
  }

  submit(event) {
    event.preventDefault();
    if (this.commentForm.value.text !== '') {
      this.commentPost.emit({
        productID: this.productID,
        userID: this.user.uid,
        text: this.commentForm.value.text,
        date: (new Date).getTime()
      });
      this.commentForm.reset();
    }
  }

  getUser(comment: Comment) {
    return this.users.find(u => u.uid === comment.userID);
  }
}
