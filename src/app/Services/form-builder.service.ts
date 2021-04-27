import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Form } from '../Modals/form.modal';
import { catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FormBuilderService {

  constructor(private http: HttpClient) { }

  baseUrl = '/api';

  // API for get form data by form builder
  getFormData(): Observable<Form[]> {
    return this.http.get<Form[]>(this.baseUrl + '/get-form-data')
    .pipe(catchError(this.errorHandler));
  }

  // API for post data from formbuilder
  postFormData(formData: Form): Observable<Form[]> {
    return this.http.post<Form[]>(this.baseUrl + '/post-form-data', formData)
       .pipe(catchError(this.errorHandler));
   }

  // error handler
  errorHandler(error: HttpErrorResponse): Observable<any>{
      return observableThrowError(error.message || 'serviceError');
  }
}
