import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseApiService } from '../firebase-api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  newProductForm: FormGroup;

  constructor(private api: FirebaseApiService, private router: Router, fb: FormBuilder) {
    this.newProductForm = fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: ['', [Validators.required]],
      price: [0, [Validators.required]]
    });
  }

  submit() {
    this.api.createNewProduct(
      this.newProductForm.value.name,
      this.newProductForm.value.description,
      this.newProductForm.value.image,
      this.newProductForm.value.price
    );
  }
}
