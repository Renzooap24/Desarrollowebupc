import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';

  constructor(private router: Router) {}

  iniciarSesion() {
    if (this.email === 'admin' && this.password === '12345678') {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  }
}