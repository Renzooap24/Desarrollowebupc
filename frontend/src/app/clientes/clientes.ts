import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})

export class Clientes {

  filtro = '';

  clientes: any[] = [];

  constructor() {

    const datosGuardados =
      localStorage.getItem('clientes');

    if (datosGuardados) {

      this.clientes =
        JSON.parse(datosGuardados);

    } else {

      this.clientes = [

        {
          codigo: 'CLI-001',
          nombre: 'Juan Carlos Pérez Guzmán',
          dni: '12345678',
          email: 'juan@email.com',
          telefono: '999999999',
          empresa: 'Tecnología Avanzada SAC',
          ciudad: 'Lima',
          estado: 'Activo'
        },

        {
          codigo: 'CLI-002',
          nombre: 'María García Tovar',
          dni: '87654321',
          email: 'maria@email.com',
          telefono: '988888888',
          empresa: 'Innovación Digital',
          ciudad: 'Arequipa',
          estado: 'Activo'
        },

        {
          codigo: 'CLI-003',
          nombre: 'Carlos Ruiz González',
          dni: '76543210',
          email: 'carlos@email.com',
          telefono: '977777777',
          empresa: 'StartupTech',
          ciudad: 'Trujillo',
          estado: 'Inactivo'
        }

      ];

      this.guardarLocalStorage();

    }

  }

  guardarLocalStorage() {

    localStorage.setItem(
      'clientes',
      JSON.stringify(this.clientes)
    );

  }

  get clientesFiltrados() {

    console.log('Filtro:', this.filtro);

    if (!this.filtro) {
      return this.clientes;
    }

    return this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      c.codigo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      c.email.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  get totalClientes() {
    return this.clientes.length;
  }

  get clientesActivos() {
    return this.clientes.filter(
      x => x.estado === 'Activo'
    ).length;
  }

  get clientesEmpresa() {
    return this.clientes.filter(
      x => x.empresa
    ).length;
  }

  get nuevosClientes() {
    return 3;
  }

  clienteSeleccionado: any = null;

  mostrarEditarCliente = false;

  mostrarNuevoCliente = false;

  nuevoCliente = {
    codigo: '',
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
    empresa: '',
    ciudad: '',
    estado: 'Activo'
  };

  guardarCliente() {

    if (
      !this.nuevoCliente.codigo ||
      !this.nuevoCliente.nombre ||
      !this.nuevoCliente.email
    ) {

      alert(
        'Complete los campos obligatorios'
      );

      return;
    }

    this.clientes.push({
      ...this.nuevoCliente
    });

    this.guardarLocalStorage();

    this.nuevoCliente = {
      codigo: '',
      nombre: '',
      dni: '',
      email: '',
      telefono: '',
      empresa: '',
      ciudad: '',
      estado: 'Activo'
    };

    this.mostrarNuevoCliente = false;

  }

  clienteEditando: any = {
    codigo: '',
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
    empresa: '',
    ciudad: '',
    estado: 'Activo'
  };

  editarCliente(cliente: any) {

    this.clienteEditando = {
      ...cliente
    };

    this.mostrarEditarCliente = true;

  }
  
  guardarEdicion() {

    const clienteOriginal =
      this.clientes.find(
        c => c.codigo === this.clienteEditando.codigo
      );

    if (clienteOriginal) {

      clienteOriginal.nombre =
        this.clienteEditando.nombre;

      clienteOriginal.dni =
        this.clienteEditando.dni;

      clienteOriginal.email =
        this.clienteEditando.email;

      clienteOriginal.telefono =
        this.clienteEditando.telefono;

      clienteOriginal.empresa =
        this.clienteEditando.empresa;

      clienteOriginal.ciudad =
        this.clienteEditando.ciudad;

      clienteOriginal.estado =
        this.clienteEditando.estado;

    }

    this.guardarLocalStorage();
    this.mostrarEditarCliente = false;

  }

  verCliente(cliente: any) {
    this.clienteSeleccionado = cliente;
  } 

  eliminarCliente(codigo: string) {

    const confirmar = confirm(
      '¿Desea eliminar este cliente?'
    );

    if (!confirmar) {
      return;
    }

    this.clientes = this.clientes.filter(
      cliente => cliente.codigo !== codigo
    );

    this.guardarLocalStorage();
    
  }

  exportarExcel() {

    const datos = this.clientes.map(cliente => ({

      Codigo: cliente.codigo,

      Nombre: cliente.nombre,

      DNI: cliente.dni,

      Email: cliente.email,

      Telefono: cliente.telefono,

      Empresa: cliente.empresa,

      Ciudad: cliente.ciudad,

      Estado: cliente.estado

    }));

    const hoja =
      XLSX.utils.json_to_sheet(datos);

    const libro =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      libro,
      hoja,
      'Clientes'
    );

    XLSX.writeFile(
      libro,
      'clientes.xlsx'
    );

  }

}