import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  
  private router = inject(Router);
  private http = inject(HttpClient); 

  iniciarSesion() {
    const body = { 
        email: this.email, 
        password: this.password 
    };

    const url = 'https://y8xzfn96e3.execute-api.us-east-1.amazonaws.com/prod/login';

this.http.post(url, body).subscribe({
  next: (res: any) => {
    console.log("Respuesta del servidor:", res); 

    if (res && res.status === 'success') {
        this.router.navigate(['/dashboard']);
    } else {
        alert('Credenciales incorrectas.');
    }
  },
  error: (err) => {
    console.error("Error completo:", err);
    alert('Error al conectar con el servidor.');
  }
});
  }
}