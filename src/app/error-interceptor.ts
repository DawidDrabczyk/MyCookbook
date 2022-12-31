import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = 'Wystąpił nieznany błąd!';
        console.log(err, 'err');
        if (err.error.error.message) {
          errorMessage = err.error.error.message;
        }
        console.log(err.error.message);
        this.dialog.open(ErrorComponent);
        return throwError(err);
      })
    );
  }
}
