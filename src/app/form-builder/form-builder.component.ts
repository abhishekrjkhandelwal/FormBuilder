import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBuilderService } from '../Services/form-builder.service';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})

export class FormBuilderComponent implements OnInit {

  public formBuilderForm!: FormGroup;
  public submitted = false;
  public formData: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private formBuilderService: FormBuilderService
  ) { }

  ngOnInit(): void {
    this.formBuilderForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20),  Validators.pattern(/^\S+[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)]],
      email: ['', [Validators.required,   Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,63})$/)]],
    });
    this.getData();
  }

  postFormData(): void {

    console.log(this.formBuilderForm.value);

    if (this.formBuilderForm.invalid) {
      console.log('Enter valid credentials');
      return;
    }
    // tslint:disable-next-line: deprecation
    this.formBuilderService.postFormData(this.formBuilderForm.value).subscribe(data => {
        console.log(data);
    });
  }

  getData(): void {
     // tslint:disable-next-line: deprecation
     this.formBuilderService.getFormData().subscribe(data => {
      this.formData = data.posts;
      console.log('------>', this.formData);
      console.log(data);
     });
  }
}
