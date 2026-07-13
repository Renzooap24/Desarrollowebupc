import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  
  private http = inject(HttpClient);
  private apiUrl = 'https://o0d71kcys2.execute-api.us-east-1.amazonaws.com/v2/desarrolloupc_v1';

  filtro = '';
  facturas: any[] = [];
  cargandoFacturas = true;

  constructor(
    private storageService: StorageService,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarFacturas();
  }

  cargarFacturas() {
    
    const facturasStorage = this.storageService.get('facturas');
    if (facturasStorage && facturasStorage.length > 0) {
      this.facturas = facturasStorage;
      this.cargandoFacturas = false; 
      console.log('✅ Datos cargados del localStorage:', this.facturas.length, 'facturas');
    } else {
      this.cargandoFacturas = true;
    }

    
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        console.log('📡 Respuesta de la API recibida');
        
        let facturasApi: any[] = [];
        
        if (res && res.body && typeof res.body === 'string') {
          try {
            const bodyParseado = JSON.parse(res.body);
            facturasApi = bodyParseado.data || [];
            console.log('📦 Datos parseados del body:', facturasApi.length, 'facturas');
          } catch (e) {
            console.error('❌ Error al parsear el body:', e);
          }
        } else if (res && res.data) {
          facturasApi = res.data;
          console.log('📦 Datos directos de data:', facturasApi.length, 'facturas');
        } else if (Array.isArray(res)) {
          facturasApi = res;
          console.log('📦 Datos como array directo:', facturasApi.length, 'facturas');
        }

        if (facturasApi.length > 0) {
          this.facturas = facturasApi;
          this.storageService.save('facturas', this.facturas);
          console.log('🔄 Datos actualizados desde la API');
        } else {
          console.warn('⚠️ La API devolvió 0 facturas');
        }
        
        this.cargandoFacturas = false;
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al obtener facturas de la API:', err);
        
        if (this.facturas.length === 0) {
          console.warn('⚠️ No hay datos ni en localStorage ni en API');
        } else {
          console.log('✅ Manteniendo datos del localStorage como respaldo');
        }
        
        this.cargandoFacturas = false;
        
        this.cdr.detectChanges();
      }
    });
  }

  get facturasFiltradas() {
    if (!this.filtro) {
      return this.facturas;
    }
    const fLower = this.filtro.toLowerCase();
    return this.facturas.filter(f =>
      (f.numero_factura && f.numero_factura.toLowerCase().includes(fLower)) ||
      (f.id_cliente && f.id_cliente.toString().includes(fLower)) ||
      (f.estado && f.estado.toLowerCase().includes(fLower))
    );
  }

  get valorTotalInventario() {
    return this.inventario.reduce((total, item) => total + item.total, 0);
  }

  get totalFacturas() {
    return this.facturas.length;
  }

  get facturasPagadas() {
    return this.facturas.filter(x => x.estado === 'Pagada').length;
  }

  get facturasPendientes() {
    return this.facturas.filter(x => x.estado === 'Pendiente').length;
  } 
  
  get facturasAnuladas() {
    return this.facturas.filter(x => x.estado === 'Anulada').length;
  }

  inventario = [
    { sku: 'PROD-001', producto: 'Producto A', stock: 50, costo: 150, total: 7500 },
    { sku: 'PROD-002', producto: 'Producto B', stock: 30, costo: 50, total: 1500 }
  ];

  facturaSeleccionada: any = null;

  verDetalle(factura: any) {
    this.facturaSeleccionada = factura;
  }
  
  mostrarNuevaFactura = false;
  nuevaFactura = {
    numero_factura: '',
    id_cliente: null,
    fecha_emision: '',
    monto_total: 0,
    estado: 'Pendiente'
  };
 
  mostrarEditarFactura = false;
  facturaEditando: any = {
    numero_factura: '',
    id_cliente: null,
    fecha_emision: '',
    monto_total: 0,
    estado: ''
  };
    
  guardarFactura() {
    if (!this.nuevaFactura.numero_factura || !this.nuevaFactura.id_cliente || !this.nuevaFactura.fecha_emision) {
      alert('Complete todos los campos principales');
      return;
    }

    this.facturas.push({ ...this.nuevaFactura });
    this.storageService.save('facturas', this.facturas);

    this.nuevaFactura = {
      numero_factura: '',
      id_cliente: null,
      fecha_emision: '',
      monto_total: 0,
      estado: 'Pendiente'
    };
    this.mostrarNuevaFactura = false;
  }

  anularFactura(factura: any) {
    const confirmar = confirm(`¿Desea anular la factura ${factura.numero_factura}?`);
    if (!confirmar) return;

    factura.estado = 'Anulada';
    this.storageService.save('facturas', this.facturas);
  }

  editarFactura(factura: any) {
    this.facturaEditando = { ...factura };
    this.mostrarEditarFactura = true;
  }
  
  guardarEdicion() {
    const index = this.facturas.findIndex(f => f.numero_factura === this.facturaEditando.numero_factura);
    if (index !== -1) {
      this.facturas[index] = { ...this.facturaEditando };
      this.storageService.save('facturas', this.facturas);
    }
    this.mostrarEditarFactura = false;
  }

  exportarExcel() {
    const datos = this.facturas.map(f => ({
      'N° Factura': f.numero_factura,
      'ID Cliente': f.id_cliente,
      'Fecha Emisión': f.fecha_emision,
      'Monto (S/)': f.monto_total,
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
    this.exportService.exportToExcel(datos, 'reporte_financiero_inventario', 'Inventario');
  }
  
  generarPDF(factura: any) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('FACTURA', 90, 20);

    doc.setFontSize(12);
    doc.text(`Número: ${factura.numero_factura}`, 20, 40);
    doc.text(`ID Cliente: ${factura.id_cliente}`, 20, 50);
    doc.text(`Fecha Emisión: ${factura.fecha_emision}`, 20, 60);
    doc.text(`Monto: S/ ${factura.monto_total}`, 20, 70);
    doc.text(`Estado: ${factura.estado}`, 20, 80);

    doc.save(`${factura.numero_factura}.pdf`);
  }
}
