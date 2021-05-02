import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilderService } from '../Services/form-builder.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formBuilderDialogPage } from './formBuilderDialogBox.component';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css'],
  // providers: [ {
  //   provide: MatDialogRef,
  //   useValue: {}
  //   },
  //   formBuilderDialogPage
  // ]
})

export class FormBuilderComponent implements OnInit {

  public emailList: string[] = [];
  public formBuilderForm!: FormGroup;
  public submitted = false;
  public formData: any = [];
  public countries: string[] = ['USA', 'UK', 'Canada', 'India'];
  default = 'UK';
  public userName!: string;
  public imagePreview!: any;
  // @Output() emitter:EventEmitter<string>
  //      = new EventEmitter<string>()

  constructor(
    private formBuilder: FormBuilder,
    private formBuilderService: FormBuilderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.formBuilderForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(1) , Validators.pattern(/^\S+[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)]],
      email: ['', [Validators.required, Validators.minLength(1),  Validators.pattern(/^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},?)+$/)]],
      gender: new  FormControl('male'),
      adhaarNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/)]],
      country: new FormControl(null),
       image: new FormControl(null,
        {
          validators:  [Validators.required],
          asyncValidators: [mimeType]
        }),
    });

    this.formBuilderForm.controls.country.setValue(this.default, {onlySelf: true});
    this.getData();
  }

  extractEmailList(e: string) {
    this.emailList = [];
    if (this.formBuilderForm.valid) {
       const emails = e.split(', ');
       emails.forEach(email => {
         if (email && email.length > 0) {
           this.emailList.push(email);
         }
       });
    }
    console.log('emailList', this.emailList);
  }

  postFormData(): void {
    console.log(this.formBuilderForm.value);

    // tslint:disable-next-line: deprecation
    this.formBuilderService.postFormData(this.formBuilderForm.value, this.formBuilderForm.value.image).subscribe(data => {
        console.log(data);
    });
  }

  getData(): void {
     // tslint:disable-next-line: deprecation
      this.formBuilderService.getFormData().subscribe(data => {
      this.formData = data.posts;
      this.userName = data.posts.name;
      console.log(data.posts[0].name);
     });
  }


  onImagePicked(event: any) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    console.log(typeof file);
    console.log(file);
    this.formBuilderForm.patchValue({image: file});
    this.formBuilderForm.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    if (file) {
        reader.readAsDataURL(file);
    }
  }

   openformBuilderDialog(event: Event, keyUser: string): void {
    //this.emitter.emit(keyUser);
    this.formBuilderService.setUserName(keyUser);
    let dialogRef = this.dialog.open(formBuilderDialogPage, {
        minWidth: '400px',
        minHeight: '620px'
     });
     dialogRef.afterClosed().subscribe();
   }

   deleteFormDataByName(event: Event, keyUser: string) {
      this.formBuilderService.deleteFormDataByName(keyUser).subscribe(data => {
        console.log('formData', data);
        var index = this.formData.indexOf(keyUser, 0);
        if (index > -1)
        {
           this.formData.splice(index, -1);
        }
      });
   }
}
