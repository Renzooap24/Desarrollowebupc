import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../core/services/storage.service';
import { ExportService } from '../core/services/export.service';

interface Producto { 
  id?: number;
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
  listaFiltrada: Producto[] = []; 
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
    private exportService: ExportService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.productoActual = this.productoVacio();
    this.cargarDatos();
  }

  cargarDatos() {
    const prodStorage = this.storageService.get("productos");
    if (prodStorage && prodStorage.length > 0) {
      this.productos = prodStorage;
      this.listaFiltrada = [...this.productos];
    }

    const apiUrl = 'https://g96duk1lm4.execute-api.us-east-1.amazonaws.com/v1/desarrollo_upc';
    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        let productosApi: Producto[] = [];
        
        if (response.body && typeof response.body === 'string') {
          const bodyParsed = JSON.parse(response.body);
          productosApi = bodyParsed.data || [];
        } else if (response.data) {
          productosApi = response.data;
        }

        this.productos = productosApi;
        this.guardarDatos();
        
        this.filtrarProductos(); 
      },
      error: (err) => {
        console.error('Pucha, falló la API:', err);
        
        this.filtrarProductos();
      }
    });

    // Cargar historial
    const histStorage = this.storageService.get("historialPrecios");
    this.historialPrecios = histStorage || [];
  }

  
  filtrarProductos() {
    if (!this.terminoBusqueda) {
      this.listaFiltrada = [...this.productos];
      return;
    }
    const q = this.terminoBusqueda.toLowerCase();
    this.listaFiltrada = this.productos.filter(p => 
      p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q)
    );
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
    this.indiceEdicion = this.productos.findIndex(p => p.codigo === producto.codigo);
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
    this.filtrarProductos(); 
    this.mostrarModalProducto = false;
  }

  eliminarProducto(index: number, nombre: string) {
    if (confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
      
      const productoAEliminar = this.listaFiltrada[index];
      const indiceReal = this.productos.findIndex(p => p.codigo === productoAEliminar.codigo);
      
      if (indiceReal > -1) {
        this.productos.splice(indiceReal, 1);
        this.guardarDatos();
        this.filtrarProductos(); 
      }
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
    this.filtrarProductos(); 
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
