import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../core/services/storage.service';
import { ExportService } from '../core/services/export.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {

  // --- Estados de UI ---
  mostrarModalVer = false;
  pestanaActiva = 'inventario';
  textoBusqueda = '';
  mostrarModal = false;
  mostrarDetalle = false;
  reporteSeleccionado: any = null;
  modoEdicion = false;
  vendedorSeleccionado: any = null;

  reportesInventario: any[] = [];
  
  vendedores = [
    { id: 1, nombre: 'Ana López', ventas: 7100.75, facturas: 3, cotizaciones: 3, nivel: 'Medio' },
    { id: 2, nombre: 'Carlos Ruiz', ventas: 6650.75, facturas: 3, cotizaciones: 2, nivel: 'Medio' },
    { id: 3, nombre: 'Juan Pérez', ventas: 7700.50, facturas: 2, cotizaciones: 2, nivel: 'Bajo' }
  ];

  facturasRecientes = [
    { id: 'FAC-001', cliente: 'Empresa A', monto: 2500, fecha: '2024-02-20' },
    { id: 'FAC-002', cliente: 'Empresa B', monto: 1800.50, fecha: '2024-02-18' },
    { id: 'FAC-006', cliente: 'Empresa F', monto: 2800.25, fecha: '2024-02-15' }
  ];

  cotizacionesRecientes = [
    { id: 'COT-001', cliente: 'CLI-001 - Juan Carlos Pérez', total: 1500, estado: 'Pendiente' },
    { id: 'COT-003', cliente: 'CLI-004 - María González', total: 2200, estado: 'Pendiente' },
    { id: 'COT-006', cliente: 'CLI-007 - Luis Morales', total: 950.25, estado: 'Pendiente' }
  ];

  constructor(
    private storageService: StorageService,
    private exportService: ExportService
  ) {}

ngOnInit() {
  const datosGuardados = this.storageService.get('reportesInventario');
  
  if (datosGuardados && datosGuardados.length > 0) {
    this.reportesInventario = datosGuardados;
  } else {
    // Si no hay nada, cargamos estos datos de prueba
    this.reportesInventario = [
      { id: 1, nombre: 'Inventario General - Enero', fecha: '2024-01-15', estado: 'Activo' },
      { id: 2, nombre: 'Inventario General - Febrero', fecha: '2024-02-15', estado: 'Activo' },
      { id: 3, nombre: 'Auditoría Almacén Norte', fecha: '2024-02-20', estado: 'Archivado' }
    ];
    // Guardamos estos datos para que aparezcan la próxima vez
    this.guardarReportes();
  }
}


  guardarReportes() {
    this.storageService.save('reportesInventario', this.reportesInventario);
  }

  cambiarPestana(pestana: string) {
    this.pestanaActiva = pestana;
  }

  get reportesFiltrados() {
    if (!this.textoBusqueda) return this.reportesInventario;
    return this.reportesInventario.filter(r =>
      r.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      r.fecha.includes(this.textoBusqueda)
    );
  }

  verReporte(reporte: any) {
  this.reporteSeleccionado = { ...reporte };
  this.mostrarModalVer = true;
}
cerrarModalVer() {
  this.mostrarModalVer = false;
}

  agregarReporte() {
    this.modoEdicion = false;
    this.reporteSeleccionado = { id: 0, nombre: '', fecha: '', estado: 'Activo' };
    this.mostrarModal = true;
  }

  editarReporte(reporte: any) {
    this.modoEdicion = true;
    this.reporteSeleccionado = { ...reporte };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  cerrarDetalle() {
    this.mostrarDetalle = false;
  }

  verDetalle(vendedor: any) {
    this.vendedorSeleccionado = vendedor;
    this.mostrarDetalle = true;
  }

  eliminarReporte(id: number) {
    if (confirm('¿Desea eliminar el reporte?')) {
      this.reportesInventario = this.reportesInventario.filter(r => r.id !== id);
      this.guardarReportes();
    }
  }

  guardarCambios() {
    if (this.modoEdicion) {
      const indice = this.reportesInventario.findIndex(x => x.id === this.reporteSeleccionado.id);
      if (indice !== -1) this.reportesInventario[indice] = { ...this.reporteSeleccionado };
    } else {
      this.reporteSeleccionado.id = this.obtenerNuevoId();
      this.reportesInventario.push(this.reporteSeleccionado);
    }
    this.guardarReportes();
    this.mostrarModal = false;
  }

  obtenerNuevoId(): number {
    return this.reportesInventario.length === 0 ? 1 : Math.max(...this.reportesInventario.map(r => r.id)) + 1;
  }


  exportarExcel() {
    const datos = this.reportesInventario.map(r => ({ Nombre: r.nombre, Fecha: r.fecha, Estado: r.estado }));
    this.exportService.exportToExcel(datos, 'reportes_inventario', 'Reportes');
  }

  exportarRendimiento() {
    const datos = this.vendedores.map(v => ({ 
      Vendedor: v.nombre, 'Monto Vendido': v.ventas, Facturas: v.facturas, Cotizaciones: v.cotizaciones 
    }));
    this.exportService.exportToExcel(datos, 'rendimiento_comercial', 'Rendimiento');
  }


  get totalReportes() { return this.reportesInventario.length; }
  get reportesActivos() { return this.reportesInventario.filter(x => x.estado === 'Activo').length; }
  get reportesArchivados() { return this.reportesInventario.filter(x => x.estado === 'Archivado').length; }
}