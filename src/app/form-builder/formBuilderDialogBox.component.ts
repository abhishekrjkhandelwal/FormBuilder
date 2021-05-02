import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FormBuilderService } from '../Services/form-builder.service';

@Component ({
    // tslint:disable-next-line: component-selector
    selector: 'formBuilderDialogPage',
    templateUrl: './formBuilderDialogBox.component.html',
    styleUrls: ['./formBuilderDialogBox.component.css'],
})


export class formBuilderDialogPage implements OnInit {

      public keyUser!: any;
      public submitted = false;
      public formData: any = [];
      public countries: string[] = ['USA', 'UK', 'Canada', 'India'];
      default = 'UK';
      public userName!: string;

      formBuilderForm = new FormGroup({
        name: new FormControl(['', [Validators.required, Validators.maxLength(20),  Validators.pattern(/^\S+[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)]]),
        email: new FormControl(['', [Validators.required,   Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,63})$/)]]),
        gender: new  FormControl('male'),
        adhaarNumber: new FormControl (['', [Validators.required]]),
        country: new FormControl(null),
      });


     constructor(
          private dialogRef: MatDialogRef<formBuilderDialogPage>,
          private formBuilderService: FormBuilderService,
      ) { }

      ngOnInit(): void {
           this.keyUser = this.formBuilderService.getUserName();
           console.log('keyuser', this.keyUser);
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
                 this.formData = data.posts;
                 this.userName = data.posts.name;
                 console.log(data.posts[0].name);
                });
             }
}
