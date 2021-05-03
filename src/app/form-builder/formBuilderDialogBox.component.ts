import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { FormBuilderService } from '../Services/form-builder.service';
import { DatePipe } from '@angular/common';


@Component ({
    // tslint:disable-next-line: component-selector
    selector: 'formBuilderDialogPage',
    templateUrl: './formBuilderDialogBox.component.html',
    styleUrls: ['./formBuilderDialogBox.component.css'],
    providers: [ DatePipe ]
})


export class formBuilderDialogPage implements OnInit {

      public keyUser!: any;
      public submitted = false;
      public formData: any = [];
      public countries: string[] = ['USA', 'UK', 'Canada', 'India'];
      default = 'UK';
      public userName!: string;
      mobileNumber = /[0-9\+\-\ ]/;
      emailPattern = "[a-zA-Z0-9_.+-,;]+@(?:(?:[a-zA-Z0-9-]+\.,;)?[a-zA-Z]+\.,;)?(gmail)\.com";
      adhhaarNumber = /^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/;
      myDate: any = new Date();
      public address!: string;
      public adhaarNumber!: string;
      public country!: string;
      public email!: string;
      public gender!: string;
      public mobileno!: string;
  
      
      commaSepEmail = (control: AbstractControl): { [key: string]: any } | any => {
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

      formBuilderForm = new FormGroup({
        name: new FormControl(['', [Validators.required, Validators.maxLength(20),  Validators.pattern(/^\S+[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)]]),
        email: new FormControl(['', Validators.compose([
            Validators.required, Validators.pattern(this.emailPattern), this.commaSepEmail
          ]) ]),
        gender: new  FormControl('male'),
        adhaarNumber: new FormControl (['', [Validators.required]]),
        country: new FormControl(null),
        dob: new FormControl(['', [Validators.required]]),
        mobileno: new FormControl(['', [Validators.required, Validators.pattern(this.mobileNumber)]]),
        address: new FormControl(['', [Validators.required]]),
      });

      
     constructor(
          private dialogRef: MatDialogRef<formBuilderDialogPage>,
          private formBuilderService: FormBuilderService,
          private datePipe:  DatePipe,
          
      ) {
        this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
       }

      ngOnInit(): void {
           this.keyUser = this.formBuilderService.getUserName();
           console.log('keyuser', this.keyUser);
           this.getData();
      }
      
        onCloseDialog(): void {
                this.dialogRef.close();
            }

        updateFormBuilderByName(): void {
                this.formBuilderService.updateFormBuilderServiceByName(this.keyUser, this.formBuilderForm.value).subscribe(data => {
                    console.log(data);
                });
            }

        getData(): void {
                 this.formBuilderService.getFormData().subscribe(data => {
                    console.log(data); 
                    this.adhaarNumber = data.formdata[0].adhaarNumber;
                    this.country = data.formdata[0].country,
                    this.email = data.formdata[0].email,
                    this.gender = data.formdata[0].gender
                    this.mobileNumber = data.formdata[0].mobileNumber,
                    this.address = data.formdata[0].address,
                    this.mobileno = data.formdata[0].mobileno
                });
        }
}
