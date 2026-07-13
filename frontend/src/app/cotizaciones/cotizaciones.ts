import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExportService } from '../core/services/export.service';

@Component({
  selector: 'app-cotizaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cotizaciones.html',
  styleUrls: ['./cotizaciones.css']
})
export class Cotizaciones implements OnInit {
    filtro = '';
    mostrarDetalle = false;
    cotizacionSeleccionada: any = null;

    listaCotizaciones = [
    { id: 'COT-001', cliente: 'Cliente A', fecha: '2026-06-20', total: 2500, estado: 'Pendiente' },
    { id: 'COT-002', cliente: 'Cliente B', fecha: '2026-06-21', total: 4200, estado: 'Aprobada' }
  ];

    constructor(private exportService: ExportService) {}

    ngOnInit() {}

    get cotizacionesFiltradas() {
    return this.listaCotizaciones.filter(c => 
    c.cliente.toLowerCase().includes(this.filtro.toLowerCase())
    );
    }

    verDetalle(cotizacion: any) {
    this.cotizacionSeleccionada = cotizacion;
    this.mostrarDetalle = true;
  }

  cerrarDetalle() {
    this.mostrarDetalle = false;
  }

  exportarExcel() {
    this.exportService.exportToExcel(this.listaCotizaciones, 'cotizaciones', 'Cotizaciones');
  }
}