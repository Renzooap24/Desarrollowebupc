import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { Modal } from 'bootstrap';

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
  productos: Producto[] = [];
  historialPrecios: HistorialPrecio[] = [];
  terminoBusqueda: string = '';

  productoActual: Producto = this.productoVacio();
  historialActual: HistorialItem[] = [];
  productoSeleccionadoParaPrecio: string = '';
  nuevoPrecio: number = 0;
  motivoCambio: string = '';
  esEdicion: boolean = false;
  indiceEdicion: number = -1;

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    const prodStorage = localStorage.getItem("productos");
    const histStorage = localStorage.getItem("historialPrecios");

    if (prodStorage) {
      this.productos = JSON.parse(prodStorage);
    } else {
      this.productos = [
        { codigo: "PROD-001", nombre: "Producto A", ubicacion: "B1", stock: 50, precio: 25.50, estado: "Disponible" },
        { codigo: "PROD-002", nombre: "Producto B", ubicacion: "C2", stock: 30, precio: 18.75, estado: "Bajo Stock" }
      ];
    }

    if (histStorage) {
      this.historialPrecios = JSON.parse(histStorage);
    } else {
      this.historialPrecios = [
        { codigo: "PROD-001", historial: [ { fecha: "2024-01-15", precio: 20.00, motivo: "Precio inicial" } ]},
        { codigo: "PROD-002", historial: [ { fecha: "2024-01-10", precio: 15.00, motivo: "Precio inicial" } ]}
      ];
    }
    this.guardarDatos();
  }

  get productosFiltrados() {
    if (!this.terminoBusqueda) return this.productos;
    const q = this.terminoBusqueda.toLowerCase();
    return this.productos.filter(p => 
      p.nombre.toLowerCase().includes(q) || 
      p.codigo.toLowerCase().includes(q)
    );
  }

  get totalProductos() { 
    return this.productos.length; 
  }
  
  get productosDisponibles() { 
    return this.productos.filter(p => p.estado === 'Disponible').length; 
  }
  
  get productosEnTransito() { 
    return this.productos.filter(p => p.estado === 'En Tránsito').length; 
  }
  
  get productosBajoStock() { 
    return this.productos.filter(p => p.estado === 'Bajo Stock').length; 
  }

  productoVacio(): Producto {
    return { 
      codigo: '', 
      nombre: '', 
      ubicacion: '', 
      stock: 0, 
      precio: 0, 
      estado: 'Disponible' 
    };
  }

  abrirModalNuevo() {
    this.esEdicion = false;
    this.productoActual = this.productoVacio();
  }

  abrirModal(id: string) {
    setTimeout(() => {
      const modalElement = document.getElementById(id);
      if (modalElement) {
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
      } else {
        console.error('No se encontró el modal con id:', id);
      }
    }, 100);
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
    if (!this.productoActual.codigo || !this.productoActual.nombre || !this.productoActual.ubicacion) {
      alert("Completa los campos obligatorios.");
      return;
    }

    if (this.esEdicion) {
      this.productos[this.indiceEdicion] = { ...this.productoActual };
    } else {
      // Verificar si el código ya existe
      const existeCodigo = this.productos.some(p => p.codigo === this.productoActual.codigo);
      if (existeCodigo) {
        alert("El código de producto ya existe.");
        return;
      }
      this.productos.push({ ...this.productoActual });
    }

    this.guardarDatos();
    this.cerrarModal('modalFormProducto');
  }

  eliminarProducto(index: number, nombre: string) {
    if (confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`)) {
      this.productos.splice(index, 1);
      this.guardarDatos();
    }
  }

  abrirHistorial(codigo: string) {
    const historial = this.historialPrecios.find(h => h.codigo === codigo);
    this.historialActual = historial ? [...historial.historial] : [];
    this.productoSeleccionadoParaPrecio = codigo;
    
    const prod = this.productos.find(p => p.codigo === codigo);
    if (prod) {
      this.productoActual = { ...prod };
    }
  }

  abrirCambioPrecio() {
    this.nuevoPrecio = 0;
    this.motivoCambio = '';
  }

  guardarNuevoPrecio() {
    if (this.nuevoPrecio < 0 || !this.motivoCambio) {
      alert("Ingresa un precio válido y un motivo.");
      return;
    }

    // Actualizar precio del producto
    const prodIndex = this.productos.findIndex(p => p.codigo === this.productoSeleccionadoParaPrecio);
    if (prodIndex > -1) {
      this.productos[prodIndex].precio = this.nuevoPrecio;
    }

    // Actualizar o crear historial
    let histObj = this.historialPrecios.find(h => h.codigo === this.productoSeleccionadoParaPrecio);
    if (!histObj) {
      histObj = { 
        codigo: this.productoSeleccionadoParaPrecio, 
        historial: [] 
      };
      this.historialPrecios.push(histObj);
    }
    
    // Agregar nuevo registro al historial
    const nuevoRegistro: HistorialItem = {
      fecha: new Date().toISOString().split('T')[0],
      precio: this.nuevoPrecio,
      motivo: this.motivoCambio
    };
    
    histObj.historial.unshift(nuevoRegistro);

    // Actualizar también el historial que se muestra
    this.historialActual = [...histObj.historial];

    this.guardarDatos();
    this.cerrarModal('modalCambiarPrecio');
    
    // Actualizar el modal de historial si está abierto
    setTimeout(() => {
      const modalElement = document.getElementById('modalHistorialPrecios');
      if (modalElement && modalElement.classList.contains('show')) {
        // Forzar actualización de la vista
        this.historialActual = [...histObj!.historial];
      }
    }, 200);
  }

  guardarDatos() {
    // Actualizar estados automáticamente
    this.productos.forEach(p => {
      if (p.stock <= 10 && p.stock > 0 && p.estado !== 'En Tránsito') {
        p.estado = 'Bajo Stock';
      } else if (p.stock > 10 && p.estado === 'Bajo Stock') {
        p.estado = 'Disponible';
      } else if (p.stock === 0) {
        p.estado = 'Agotado';
      }
    });
    
    localStorage.setItem("productos", JSON.stringify(this.productos));
    localStorage.setItem("historialPrecios", JSON.stringify(this.historialPrecios));
  }

  exportarExcel() {
    const datosExportar = this.productos.map(p => ({
      'Código': p.codigo,
      'Nombre': p.nombre,
      'Ubicación': p.ubicacion,
      'Stock': p.stock,
      'Precio': p.precio,
      'Estado': p.estado
    }));
    
    const hoja = XLSX.utils.json_to_sheet(datosExportar);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Inventario");
    XLSX.writeFile(libro, `inventario_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  cerrarModal(id: string) {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }
}