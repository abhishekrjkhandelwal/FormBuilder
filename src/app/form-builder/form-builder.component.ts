import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
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

  names : String[] = [];
  public emailList: string[] = [];
  public formBuilderForm!: FormGroup;
  public submitted = false;
  public formData: any = [];
  public countries: string[] = ['USA', 'UK', 'Canada', 'India'];
  default = 'UK';
  public userName!: string;
  public imagePreview!: any;
  emailPattern = "[a-zA-Z0-9_.+-,;]+@(?:(?:[a-zA-Z0-9-]+\.,;)?[a-zA-Z]+\.,;)?(gmail)\.com";
  adhhaarNumber = /^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/;
  
  // @Output() emitter:EventEmitter<string>
  //      = new EventEmitter<string>()

  constructor(
    private formBuilder: FormBuilder,
    private formBuilderService: FormBuilderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.formBuilderForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(1), Validators.pattern(/^\S+[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)]],
      email: ['', Validators.compose([
        Validators.required, Validators.pattern(this.emailPattern),this.commaSepEmail
      ]) ],
      gender: new  FormControl('male'),
      adhaarNumber: ['', [Validators.required, Validators.pattern(this.adhhaarNumber)]],
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

  commaSepEmail = (control: AbstractControl): { [key: string]: any } | any => {
    console.log("This is value:" + control.value);
    try {
    if (control.value){
        var emails= control.value.split(',');
        const forbidden = emails.some((email:any) => Validators.email(new FormControl(email)));
    console.log(forbidden);
    return forbidden ? { 'email': { value: control.value.trim() } } : null;
    }
    } catch(error) {
        console.log(error);
    }
  };

//  uniqueValidator(control: AbstractControl): string | null {
//     try { 
//       const formGroup = control["_parent"].controls; 
//       return Object.keys(formGroup).find(name => control === formGroup[name]) || null;
//     } catch(e) {
//       return null;
//     }
//  }

  postFormData(): void {
    // tslint:disable-next-line: deprecation
    for(this.formBuilderForm.value.name in this.names) {
        if(this.formBuilderForm.value.name !== this.names) {
          console.log('name is already exists please try another name'); 
          return;
        } else {
          this.formBuilderService.postFormData(this.formBuilderForm.value, this.formBuilderForm.value.image).subscribe(data => {
            console.log(data);
        });
      }
    } 
  }

  getData(): void {
     // tslint:disable-next-line: deprecation
      this.formBuilderService.getFormData().subscribe(data => {
        this.formData = data.formdata;
        for(var name of data.formdata) {
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