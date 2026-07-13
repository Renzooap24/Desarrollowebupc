import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SistemaService } from '../services/sistema-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  constructor(
    private readonly sis: SistemaService
  ){}

  totales = signal<any>({});

   _mostrar_totales(){
    this.sis.obtener_totales_sistema().subscribe((rest: any) => {
      this.totales.set(rest.data[0]);
    })
   }

   ngOnInit(): void {
    this._mostrar_totales();
   }
}