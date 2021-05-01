import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Form } from '../Modals/form.modal';
import { tap, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FormBuilderService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:3000/api';

  // API for get form data by form builder
  getFormData(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/get-form-data')
    .pipe(catchError(this.errorHandler));
  }

  // API for post data from formbuilder
  postFormData(formData: Form): Observable<Form[]> {
    console.log('----->', formData);
    return this.http.post<Form[]>(this.baseUrl + '/post-form-data', formData)
       .pipe(catchError(this.errorHandler));
   }

    // http client api for update user
   updateFormDataByName(formData: Form): Observable<Form> {
      return this.http.put<Form>(this.baseUrl + '/update-form-data' , formData)
      .pipe(tap(data => JSON.stringify(Form), catchError(this.errorHandler)));
   }

   // http client api for delete user by id
   deleteFormDataByName(id: number) {
      return this.http.delete(this.baseUrl + '/delete-form-data?id=' + id)
      .pipe(tap(data => JSON.stringify(id), catchError(this.errorHandler)));
    }

  // error handler
  errorHandler(error: HttpErrorResponse): Observable<any>{
      return observableThrowError(error.message || 'serviceError');
  }
}
