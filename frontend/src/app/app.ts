import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  mostrarNavbar = true;

  constructor(private router: Router) {
    this.checkUrl(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkUrl(event.url);
      }
    });
  }
  private checkUrl(url: string) {
    this.mostrarNavbar = !url.includes('/login') && url !== '/';
  }
}