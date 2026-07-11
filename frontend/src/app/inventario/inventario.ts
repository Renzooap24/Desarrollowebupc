import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../core/services/storage.service';
import { ExportService } from '../core/services/export.service';

interface Producto { 
  codigo: string; 
  nombre: string; 
  ubicacion: string; 
  stock: number; 
  precio: number; 
  estado: string; 
  categoria?: string; 
}

interface HistorialItem { 
  fecha: string; 
  precio: number; 
  motivo: string; 
}

interface HistorialPrecio { 
  codigo: string; 
  historial: HistorialItem[]; 
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.html',
  styleUrls: ['./inventario.css']
})
export class Inventario implements OnInit {
  mostrarModalProducto = false;
  mostrarModalVer = false;
  mostrarModalHistorial = false;
  mostrarModalCambioPrecio = false;

  productos: Producto[] = [];
  historialPrecios: HistorialPrecio[] = [];
  terminoBusqueda: string = '';

  productoActual!: Producto;
  historialActual: HistorialItem[] = [];
  productoSeleccionadoParaPrecio: string = '';
  nuevoPrecio: number = 0;
  motivoCambio: string = '';
  esEdicion: boolean = false;
  indiceEdicion: number = -1;

  constructor(
    private storageService: StorageService,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    this.productoActual = this.productoVacio();
    this.cargarDatos();
  }

  cargarDatos() {
    const prodStorage = this.storageService.get("productos");
    const histStorage = this.storageService.get("historialPrecios");

    this.productos = prodStorage || [
      { codigo: "PROD-001", nombre: "Producto A", ubicacion: "B1", stock: 50, precio: 25.50, estado: "Disponible" },
      { codigo: "PROD-002", nombre: "Producto B", ubicacion: "C2", stock: 30, precio: 18.75, estado: "Bajo Stock" }
    ];

    this.historialPrecios = histStorage || [
      { codigo: "PROD-001", historial: [ { fecha: "2024-01-15", precio: 20.00, motivo: "Precio inicial" } ]},
      { codigo: "PROD-002", historial: [ { fecha: "2024-01-10", precio: 15.00, motivo: "Precio inicial" } ]}
    ];
    
    this.guardarDatos();
  }

  get productosFiltrados() {
    if (!this.terminoBusqueda) return this.productos;
    const q = this.terminoBusqueda.toLowerCase();
    return this.productos.filter(p => p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q));
  }

  get totalProductos() { return this.productos.length; }
  get productosDisponibles() { return this.productos.filter(p => p.estado === 'Disponible').length; }
  get productosEnTransito() { return this.productos.filter(p => p.estado === 'En Tránsito').length; }
  get productosBajoStock() { return this.productos.filter(p => p.estado === 'Bajo Stock').length; }

  productoVacio(): Producto {
    return { codigo: '', nombre: '', ubicacion: '', stock: 0, precio: 0, estado: 'Disponible' };
  }

  abrirModalNuevo() {
    this.esEdicion = false;
    this.productoActual = this.productoVacio();
  }

  abrirModalEditar(index: number, producto: Producto) {
    this.esEdicion = true;
    this.indiceEdicion = index;
    this.productoActual = { ...producto };
  }

  verProducto(producto: Producto) {
    this.productoActual = { ...producto };
  }

  guardarProducto() {
    if (this.esEdicion) {
      this.productos[this.indiceEdicion] = { ...this.productoActual };
    } else {
      this.productos.push({ ...this.productoActual });
    }
    this.guardarDatos();
    this.mostrarModalProducto = false;
  }

  eliminarProducto(index: number, nombre: string) {
    if (confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
      this.productos.splice(index, 1);
      this.guardarDatos();
    }
  }

  abrirHistorial(codigo: string) {
    this.productoSeleccionadoParaPrecio = codigo;
    const historial = this.historialPrecios.find(h => h.codigo === codigo);
    this.historialActual = historial ? [...historial.historial] : [];
    const prod = this.productos.find(p => p.codigo === codigo);
    if (prod) this.productoActual = { ...prod };
  }

  abrirCambioPrecio() {
    this.nuevoPrecio = this.productoActual.precio;
    this.motivoCambio = '';
  }

  guardarNuevoPrecio() {
    const prodIndex = this.productos.findIndex(p => p.codigo === this.productoSeleccionadoParaPrecio);
    if (prodIndex > -1) this.productos[prodIndex].precio = this.nuevoPrecio;

    let histObj = this.historialPrecios.find(h => h.codigo === this.productoSeleccionadoParaPrecio);
    if (!histObj) {
      histObj = { codigo: this.productoSeleccionadoParaPrecio, historial: [] };
      this.historialPrecios.push(histObj);
    }
    histObj.historial.unshift({ fecha: new Date().toISOString().split('T')[0], precio: this.nuevoPrecio, motivo: this.motivoCambio });
    
    this.guardarDatos();
    this.mostrarModalCambioPrecio = false;
    this.mostrarModalHistorial = false;
  }

  guardarDatos() {
    this.productos.forEach(p => {
      if (p.stock <= 10 && p.stock > 0 && p.estado !== 'En Tránsito') p.estado = 'Bajo Stock';
      else if (p.stock > 10 && p.estado === 'Bajo Stock') p.estado = 'Disponible';
      else if (p.stock === 0) p.estado = 'Agotado';
    });
    this.storageService.save("productos", this.productos);
    this.storageService.save("historialPrecios", this.historialPrecios);
  }

  exportarExcel() {
    const datosExportar = this.productos.map(p => ({
      'Código': p.codigo, 'Nombre': p.nombre, 'Ubicación': p.ubicacion, 'Stock': p.stock, 'Precio': p.precio, 'Estado': p.estado
    }));
    this.exportService.exportToExcel(datosExportar, `inventario_${new Date().toISOString().split('T')[0]}`, "Inventario");
  }
}