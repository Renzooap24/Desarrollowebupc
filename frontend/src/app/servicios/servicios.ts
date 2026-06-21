import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioService } from './servicio';
import { Servicio } from './servicio.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.css']
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  filtro = '';

  constructor(private servicioService: ServicioService) {}

  ngOnInit() {
    this.servicios = this.servicioService.getServicios();
  }
// Agrega esto:
  verDetalle(index: number) {
    const servicio = this.servicios[index];
    console.log('Viendo detalles de:', servicio);
    alert('Detalle del servicio: ' + servicio.motivo);
  }

  get serviciosFiltrados() {
    return this.servicios.filter(s => 
      s.cliente.toLowerCase().includes(this.filtro.toLowerCase()) || 
      s.maquina.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
}