import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ServicioService } from './servicio';
import { Servicio } from './servicio.model';
import { ExportService } from '../core/services/export.service';

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
  mostrarDetalle = false;
  servicioSeleccionado: Servicio | null = null;

  // 2. Inyecta el ExportService aquí
  constructor(
    private servicioService: ServicioService,
    private exportService: ExportService 
  ) {}

  ngOnInit() {
    this.servicios = this.servicioService.getServicios();
  }

  verDetalle(index: number) {
    this.servicioSeleccionado = this.serviciosFiltrados[index];
    this.mostrarDetalle = true;
  }

  cerrarDetalle() {
    this.mostrarDetalle = false;
  }

  get serviciosFiltrados() {
    return this.servicios.filter(s => 
      s.cliente.toLowerCase().includes(this.filtro.toLowerCase()) || 
      s.maquina.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  exportarExcel() {
    const datos = this.serviciosFiltrados.map(s => ({
      Fecha: s.fecha,
      Tipo: s.tipo,
      Cliente: s.cliente,
      Maquina: s.maquina,
      Motivo: s.motivo,
      Productos: s.productos,
      Referencia: s.ref
    }));
    
    this.exportService.exportToExcel(datos, 'reporte_servicios', 'Servicios');
  }
}