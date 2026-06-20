import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})

export class Reportes {

  pestanaActiva = 'inventario';
  textoBusqueda = '';

  mostrarModal = false;
  reporteSeleccionado: any = null;

  cambiarPestana(pestana: string) {
    this.pestanaActiva = pestana;
  }

  reportesInventario = [
    {
      id: 1,
      nombre: 'Stock General de Almacén',
      fecha: '2026-06-01',
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'Productos con Bajo Stock',
      fecha: '2026-06-15',
      estado: 'Activo'
    },
    {
      id: 3,
      nombre: 'Inventario Mensual',
      fecha: '2026-05-30',
      estado: 'Archivado'
    }
  ];

  get reportesFiltrados() {

    if (!this.textoBusqueda) {
      return this.reportesInventario;
    }

    return this.reportesInventario.filter(reporte =>
      reporte.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      reporte.fecha.includes(this.textoBusqueda)
    );
  }  

  eliminarReporte(id: number) {

    const confirmar = confirm(
      '¿Desea eliminar el reporte?'
    );

    if (confirmar) {

      this.reportesInventario =
        this.reportesInventario.filter(
          reporte => reporte.id !== id
        );

    }
  }

  get totalReportes() {
    return this.reportesInventario.length;
  }

  get reportesActivos() {
    return this.reportesInventario.filter(
      x => x.estado === 'Activo'
    ).length;
  }

  get reportesArchivados() {
    return this.reportesInventario.filter(
      x => x.estado === 'Archivado'
    ).length;
  }

  agregarReporte() {

    const nuevoReporte = {
      id: this.reportesInventario.length + 1,
      nombre: 'Nuevo Reporte',
      fecha: new Date().toISOString().split('T')[0],
      estado: 'Activo'
    };

    this.reportesInventario.push(nuevoReporte);
  }

  verReporte(reporte: any) {

    alert(
      `Reporte: ${reporte.nombre}
  Fecha: ${reporte.fecha}
  Estado: ${reporte.estado}`
    );

  }

  editarReporte(reporte: any) {

    this.reporteSeleccionado = {
      ...reporte
    };

    this.mostrarModal = true;

  }

  cerrarModal() {

    this.mostrarModal = false;

  }
  
  guardarCambios() {

    const indice = this.reportesInventario.findIndex(
      x => x.id === this.reporteSeleccionado.id
    );

    if (indice !== -1) {

      this.reportesInventario[indice] = {
        ...this.reporteSeleccionado
      };

    }

    this.mostrarModal = false;

  }

  exportarExcel() {

    const datos = this.reportesInventario.map(reporte => ({
      nombre: reporte.nombre,
      fecha: reporte.fecha,
      estado: reporte.estado
    }));

    const worksheet = XLSX.utils.json_to_sheet(datos);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Reportes'
    );

    XLSX.writeFile(
      workbook,
      'reportes_inventario.xlsx'
    );
  }

  mostrarDetalle = false;
  vendedorSeleccionado: any = null;

  vendedores = [
    {
      id: 1,
      nombre: 'Ana López',
      ventas: 7100.75,
      facturas: 3,
      cotizaciones: 3,
      nivel: 'Medio'
    },
    {
      id: 2,
      nombre: 'Carlos Ruiz',
      ventas: 6650.75,
      facturas: 3,
      cotizaciones: 2,
      nivel: 'Medio'
    },
    {
      id: 3,
      nombre: 'Juan Pérez',
      ventas: 7700.50,
      facturas: 2,
      cotizaciones: 2,
      nivel: 'Bajo'
    }
  ];

  verDetalle(vendedor: any) {
    this.vendedorSeleccionado = vendedor;
    this.mostrarDetalle = true;

  }

  cerrarDetalle() {
    this.mostrarDetalle = false;
  }    

  facturasRecientes = [
    {
      id: 'FAC-001',
      cliente: 'Empresa A',
      monto: 2500,
      fecha: '2024-02-20'
    },
    {
      id: 'FAC-002',
      cliente: 'Empresa B',
      monto: 1800.50,
      fecha: '2024-02-18'
    },
    {
      id: 'FAC-006',
      cliente: 'Empresa F',
      monto: 2800.25,
      fecha: '2024-02-15'
    }
  ];

  cotizacionesRecientes = [
    {
      id: 'COT-001',
      cliente: 'CLI-001 - Juan Carlos Pérez',
      total: 1500,
      estado: 'Pendiente'
    },
    {
      id: 'COT-003',
      cliente: 'CLI-004 - María González',
      total: 2200,
      estado: 'Pendiente'
    },
    {
      id: 'COT-006',
      cliente: 'CLI-007 - Luis Morales',
      total: 950.25,
      estado: 'Pendiente'
    }
  ]; 

  exportarRendimiento() {

    const datos = this.vendedores.map(v => ({
      Vendedor: v.nombre,
      'Monto Vendido': v.ventas,
      Facturas: v.facturas,
      'Cotizaciones Enviadas': v.cotizaciones
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(

      wb,
      ws,
      'Rendimiento'
    );

    XLSX.writeFile(
      wb,
      'rendimiento_comercial.xlsx'
    );

  }
}

