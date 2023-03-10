import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
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

  onLogin(form: NgForm){
    if(form.invalid){
      return
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password)
  }

}
