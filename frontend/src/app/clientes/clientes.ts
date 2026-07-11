import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StorageService } from '../core/services/storage.service';
import { ExportService } from '../core/services/export.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {
  filtro = '';
  clientes: any[] = [];
  
  // Estados para los modales
  clienteSeleccionado: any = null;
  mostrarEditarCliente = false;
  mostrarNuevoCliente = false;

  // Objetos para formularios
  nuevoCliente = { codigo: '', nombre: '', dni: '', email: '', telefono: '', empresa: '', ciudad: '', estado: 'Activo' };
  clienteEditando: any = { codigo: '', nombre: '', dni: '', email: '', telefono: '', empresa: '', ciudad: '', estado: 'Activo' };

  constructor(
    private storageService: StorageService,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    const datosGuardados = this.storageService.get('clientes');
    this.clientes = datosGuardados ? datosGuardados : [
      { codigo: 'CLI-001', nombre: 'Juan Carlos Pérez', dni: '12345678', email: 'juan@email.com', telefono: '999999999', empresa: 'Tecnología SAC', ciudad: 'Lima', estado: 'Activo' }
    ];
  }

  get totalClientes() { return this.clientes.length; }
  get clientesActivos() { return this.clientes.filter(x => x.estado === 'Activo').length; }
  get clientesEmpresa() { return this.clientes.filter(x => x.empresa).length; }
  get nuevosClientes() { return 3; } // Valor estático por ahora

  get clientesFiltrados() {
    if (!this.filtro) return this.clientes;
    return this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      c.codigo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      c.email.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
  verCliente(cliente: any) { this.clienteSeleccionado = cliente; }

  editarCliente(cliente: any) {
    this.clienteEditando = { ...cliente };
    this.mostrarEditarCliente = true;
  }

  guardarEdicion() {
    const index = this.clientes.findIndex(c => c.codigo === this.clienteEditando.codigo);
    if (index !== -1) {
      this.clientes[index] = { ...this.clienteEditando };
      this.storageService.save('clientes', this.clientes);
    }
    this.mostrarEditarCliente = false;
  }

  guardarCliente() {
    if (!this.nuevoCliente.codigo || !this.nuevoCliente.nombre) {
      alert('Complete los campos obligatorios');
      return;
    }
    this.clientes.push({ ...this.nuevoCliente });
    this.storageService.save('clientes', this.clientes);
    this.mostrarNuevoCliente = false;
    this.nuevoCliente = { codigo: '', nombre: '', dni: '', email: '', telefono: '', empresa: '', ciudad: '', estado: 'Activo' };
  }

  eliminarCliente(codigo: string) {
    if (confirm('¿Desea eliminar este cliente?')) {
      this.clientes = this.clientes.filter(c => c.codigo !== codigo);
      this.storageService.save('clientes', this.clientes);
    }
  }

  exportarExcel() {
    this.exportService.exportToExcel(this.clientes, 'clientes', 'Clientes');
  }
}