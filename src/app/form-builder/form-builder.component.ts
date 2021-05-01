import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilderService } from '../Services/form-builder.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formBuilderDialogPage } from './formBuilderDialogBox.component';


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

  public formBuilderForm!: FormGroup;
  public submitted = false;
  public formData: any = [];
  public countries: string[] = ['USA', 'UK', 'Canada', 'India'];
  default = 'UK';
  public userName!: string;
  @Output() emitter:EventEmitter<string>
       = new EventEmitter<string>()

  constructor(
    private formBuilder: FormBuilder,
    private formBuilderService: FormBuilderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.formBuilderForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20),  Validators.pattern(/^\S+[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)]],
      email: ['', [Validators.required,   Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,63})$/)]],
      gender: new  FormControl('male'),
      adhaarNumber: ['', [Validators.required]],
      country: new FormControl(null),
    });
    this.formBuilderForm.controls.country.setValue(this.default, {onlySelf: true});
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
      this.userName = data.posts.name;
      console.log(data.posts[0].name);
     });
  }
   openformBuilderDialog(event: Event, keyUser: string): void {
    this.emitter.emit(keyUser);
    console.log('keyUser', keyUser);
    let dialogRef = this.dialog.open(formBuilderDialogPage, {
        minWidth: '400px',
        minHeight: '620px'
     });
     dialogRef.afterClosed().subscribe();
   }
}
