import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StorageService } from '../core/services/storage.service';
import { ExportService } from '../core/services/export.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-finanzas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './finanzas.html',
  styleUrl: './finanzas.css'
})
export class Finanzas implements OnInit { 
  
  filtro = '';

  facturas: any[] = [];

  constructor(
    private storageService: StorageService,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    const datosGuardados = this.storageService.get('facturas');

    if (datosGuardados) {
      this.facturas = datosGuardados;
    } else {
      this.facturas = [
        { numero: 'FAC-001', cliente: 'Empresa A', fecha: '2024-02-20', monto: 2500, estado: 'Pagada' },
        { numero: 'FAC-002', cliente: 'Empresa B', fecha: '2024-02-18', monto: 1800.50, estado: 'Pendiente' },
        { numero: 'FAC-003', cliente: 'Empresa C', fecha: '2024-02-19', monto: 3200, estado: 'Pagada' }
      ];
      this.storageService.save('facturas', this.facturas);
    }
  }
  get facturasFiltradas() {

    if (!this.filtro) {
      return this.facturas;
    }

    return this.facturas.filter(f =>
      f.numero.toLowerCase().includes(this.filtro.toLowerCase()) ||
      f.cliente.toLowerCase().includes(this.filtro.toLowerCase()) ||
      f.estado.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  get valorTotalInventario() {

    return this.inventario.reduce(
      (total, item) => total + item.total,
      0
    );

  }

  get totalFacturas() {
    return this.facturas.length;
  }

  get facturasPagadas() {
    return this.facturas.filter(
      x => x.estado === 'Pagada'
    ).length;
  }

  get facturasPendientes() {
    return this.facturas.filter(
      x => x.estado === 'Pendiente'
    ).length;
  } 
  
  get facturasAnuladas() {
    return this.facturas.filter(
      x => x.estado === 'Anulada'
    ).length;
  }

  inventario = [
    {
      sku: 'PROD-001',
      producto: 'Producto A',
      stock: 50,
      costo: 150,
      total: 7500
    },
    {
      sku: 'PROD-002',
      producto: 'Producto B',
      stock: 30,
      costo: 50,
      total: 1500
    }
  ];

  facturaSeleccionada: any = null;

  verDetalle(factura: any) {
    this.facturaSeleccionada = factura;
  }
  
  mostrarNuevaFactura = false;

  nuevaFactura = {
    numero: '',
    cliente: '',
    fecha: '',
    monto: 0,
    estado: 'Pendiente'
  };
 
  mostrarEditarFactura = false;

  facturaEditando: any = {
    numero: '',
    cliente: '',
    fecha: '',
    monto: 0,
    estado: ''
  };
    
  guardarFactura() {

    if (
      !this.nuevaFactura.numero ||
      !this.nuevaFactura.cliente ||
      !this.nuevaFactura.fecha
    ) {

      alert('Complete todos los campos');
      return;

    }

    this.facturas.push({
      ...this.nuevaFactura
    });

    this.storageService.save('facturas', this.facturas);

    this.nuevaFactura = {
      numero: '',
      cliente: '',
      fecha: '',
      monto: 0,
      estado: 'Pendiente'
    };

    this.mostrarNuevaFactura = false;
  }

  anularFactura(factura: any) {

    const confirmar = confirm(
      `¿Desea anular la factura ${factura.numero}?`
    );

    if (!confirmar) {
      return;
    }

    factura.estado = 'Anulada';

    this.storageService.save('facturas', this.facturas);
  }

  editarFactura(factura: any) {

    this.facturaEditando = {
      ...factura
    };

    this.mostrarEditarFactura = true;

  }
  
  guardarEdicion() {

    const facturaOriginal =
      this.facturas.find(
        f => f.numero === this.facturaEditando.numero
      );

    if (facturaOriginal) {

      facturaOriginal.cliente =
        this.facturaEditando.cliente;

      facturaOriginal.fecha =
        this.facturaEditando.fecha;

      facturaOriginal.monto =
        this.facturaEditando.monto;

      facturaOriginal.estado =
        this.facturaEditando.estado;

      this.storageService.save('facturas', this.facturas);

    }

    this.mostrarEditarFactura = false;

  }

exportarExcel() {
  const datos = this.facturas.map(f => ({
    'N° Factura': f.numero,
    'Cliente': f.cliente,
    'Fecha Emisión': f.fecha,
    'Monto (S/)': f.monto,
    'Estado': f.estado
  }));

  this.exportService.exportToExcel(datos, 'reporte_facturas', 'Facturas');
}

exportarReporteInventario() {
  const datos = this.inventario.map(item => ({
    SKU: item.sku,
    Producto: item.producto,
    Stock: item.stock,
    'Costo Unitario': item.costo,
    'Valor Total': item.total
  }));

  this.exportService.exportToExcel(datos, 'reporte_financiero_inventario', 'Inventario');}
  

  generarPDF(factura: any) {

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('FACTURA', 90, 20);

    doc.setFontSize(12);

    doc.text(
      `Número: ${factura.numero}`,
      20,
      40
    );

    doc.text(
      `Cliente: ${factura.cliente}`,
      20,
      50
    );

    doc.text(
      `Fecha: ${factura.fecha}`,
      20,
      60
    );

    doc.text(
      `Monto: S/ ${factura.monto}`,
      20,
      70
    );

    doc.text(
      `Estado: ${factura.estado}`,
      20,
      80
    );

    doc.save(
      `${factura.numero}.pdf`
    );

  }
  

}