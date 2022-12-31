import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private authSubs: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authSubs = this.authService.getAuthStatus().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.authSubs.unsubscribe();
  }

  onSignup(form: NgForm){
    if(form.invalid){
      return
    }
    this.isLoading = true;
    this.authService.createNewUser(form.value.email, form.value.password)
  }
}
