import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { StorageService } from '../core/services/storage.service';
import { ExportService } from '../core/services/export.service';

import { MaquinasService } from './maquina';
import { Maquinas } from './maquinas.model';

@Component({
  selector: 'app-maquinas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './maquinas.html',
  styleUrls: ['./maquinas.css']
})
export class MaquinasComponent implements OnInit {
  maquinas: Maquinas[] = [];
  filtro = '';

  mostrarModalDetalle = false;
  maquinaSeleccionada: Maquinas | null = null;

  constructor(
    private maqinaService: MaquinasService,
    private storageService: StorageService,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    const datosGuardados = this.storageService.get('maquinas');
    
    if (datosGuardados) {
      this.maquinas = datosGuardados;
    } else {
      this.maquinas = this.maqinaService.getMaquinas();
      this.storageService.save('maquinas', this.maquinas);
    }
  }

  verDetalle(index: number) {
    this.maquinaSeleccionada = this.maquinasFiltrados[index];
    this.mostrarModalDetalle = true;
  }

  exportarExcel() {
    const datosExportar = this.maquinas.map(m => ({
      'Código': m.codigo,
      'Nombre': m.nombre,
      'Estado': m.estado
    }));
    this.exportService.exportToExcel(datosExportar, 'reporte_maquinas', 'Máquinas');
  }

  get maquinasFiltrados() {
    if (!this.filtro) return this.maquinas;
    return this.maquinas.filter(s => 
      s.nombre.toLowerCase().includes(this.filtro.toLowerCase()) || 
      s.codigo.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
}