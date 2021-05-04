import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { FormBuilderService } from '../Services/form-builder.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formBuilderDialogPage } from './formBuilderDialogBox.component';
import { mimeType } from './mime-type.validator';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css'],
  providers: [ DatePipe ]
})

export class FormBuilderComponent implements OnInit {

  public birthDate: any;
  names : String[] = [];
  public emailList: string[] = [];
  public formBuilderForm!: FormGroup;
  public submitted = false;
  public formData: any = [];
  public countries: string[] = ['USA', 'UK', 'Canada', 'India'];
  default = 'UK';
  public userName!: string;
  public imagePreview!: any;
  myDate: any = new Date();
  emailPattern = "[a-zA-Z0-9_.+-,;]+@(?:(?:[a-zA-Z0-9-]+\.,;)?[a-zA-Z]+\.,;)?(gmail)\.com";
  adhhaarNumber = /^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/;
  mobileNumber = /[0-9\+\-\ ]/;
  address = /^[#.0-9a-zA-Z\s,-]+$/;

  // @Output() emitter:EventEmitter<string>
  //      = new EventEmitter<string>()

  constructor(
    private formBuilder: FormBuilder,
    private formBuilderService: FormBuilderService,
    private dialog: MatDialog,
    private datePipe:  DatePipe,
  ) { 
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.birthDate = new Date();
    this.formBuilderForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(1), Validators.pattern(/^\S+[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)]],
      email: ['', Validators.compose([
        Validators.required, this.commaSepEmail
      ]) ],
      gender: ['male', [Validators.required]],
      birthDate: [' ', [Validators.required]],
      adhaarNumber: ['', [Validators.required, Validators.pattern(this.adhhaarNumber)]],
      mobileno: ['', [Validators.required, Validators.pattern(this.mobileNumber)]],
      address: ['', [Validators.required, Validators.pattern(this.address)]],
      country: ['', [Validators.required]],
      image: [null,
        {
          validators:  [Validators.required],
          asyncValidators: [mimeType]
        }],
        createdAt: ['', [Validators.required]]
    });

    this.formBuilderForm.controls.country.setValue(this.default, {onlySelf: true});
    
    this.getData();
  }

  commaSepEmail = (control: AbstractControl): { [key: string]: String } | any => {
    console.log('control', control.value);
    if (control.value){
        var emails= control.value.split(', ');
        console.log('email', emails);
        const forbidden = emails.some((email:any) => Validators.email(new FormControl(email)));
        console.log(forbidden);
        return forbidden ? { 'email': { value: control.value.trim() } } : null;
    }
  };

  postFormData(): void {
    // tslint:disable-next-line: deprecation
    let name = this.formBuilderForm.value.name;
    this.formBuilderForm.value.createdAt = this.myDate;
      
       if(!this.names.includes(name)) {
            this.formBuilderService.postFormData(this.formBuilderForm.value, this.formBuilderForm.value.image).subscribe(data => {
        });
       } else {
         console.log("name is already registered please try another user name");
       }
  }

  getData(): void {
     // tslint:disable-next-line: deprecation
      this.formBuilderService.getFormData().subscribe(data => {
        this.formData = data.formdata;
        console.log('formData', this.formData[0]);
        for (var name of data.formdata) {
           this.names.push(name.name);   
        }
        console.log(this.names);
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