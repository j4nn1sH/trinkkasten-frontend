import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {
  @Output() authenticated = new EventEmitter<boolean>();
  errorMessages: string[] = [];

  onRegister = false;

  firstName = new FormControl();
  lastName = new FormControl();
  email = new FormControl();
  password = new FormControl();
  new_password = new FormControl();
  confirm_password = new FormControl();

  submitRegister = false;
  submitLogin = false;

  constructor(
    private authService: AuthenticationService
  ) {}

  switchView() {
    this.authenticated.emit(true);
    this.onRegister = !this.onRegister;
  }

  register(firstName: string, lastName: string, email: string, new_password: string, confirm_password: string) {
    this.submitRegister = true;
    if(firstName == '' || lastName == '' || email == '' || new_password == '' || confirm_password == '') {
      return;
    } else if(new_password != confirm_password) {
      return;
    }

    // Validation in backend
    this.authService.register(email, new_password, firstName, lastName)
      .subscribe(data => {
        this.login(email, new_password);
      }, error => {
        this.errorMessages = error.error
      });
  }

  login(email: string, password: string) {
    this.submitLogin = true;
    if(email == '' || password == '') {
      return;
    }

    // Validation in backend
    this.authService.login(email, password)
    .subscribe(data => {
      this.authService.setToken(data);
      this.authenticated.emit(true);
    }, error => {
      this.errorMessages = error.error
    });
  }
}
