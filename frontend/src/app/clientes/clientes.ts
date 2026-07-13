import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';

import { ClientesService } from '../services/clientes-service';

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
export class Clientes implements OnInit {

  filtro = '';

  clientes: any[] = [];

  clienteSeleccionado: any = null;

  mostrarEditarCliente = false;

  mostrarNuevoCliente = false;

  totalesClientes = signal<any>({
    totalclientes: 0,
    totalactivos: 0,
    totalempresa: 0,
    totalnuevos: 0
  });

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

  constructor(
    private readonly cli: ClientesService
  ) { }

  ngOnInit(): void {

    this._mostrar_totales_clientes();

    this._mostrar_lista_clientes();

  }

private _mostrar_totales_clientes() {
    this.cli.obtener_totales_clientes()
      .subscribe((rest: any) => {
        console.log('Totales clientes:', rest);

        if (rest && rest.data && rest.data.length > 0) {
          this.totalesClientes.set(rest.data[0]);
        } else {
          this.totalesClientes.set({
            totalclientes: 0,
            totalactivos: 0,
            totalempresa: 0,
            totalnuevos: 0
          });
        }
      });
  }

  private _mostrar_lista_clientes() {
    this.cli.obtener_lista_clientes()
      .subscribe((rest: any) => {
        console.log('Lista clientes:', rest);

        if (rest && rest.data) {
          this.clientes = rest.data;
        } else {
          this.clientes = [];
        }
      });
  }

  get clientesFiltrados() {

    if (!this.filtro) {
      return this.clientes;
    }

    return this.clientes.filter(
      cliente =>

        cliente.nombre
          .toLowerCase()
          .includes(
            this.filtro.toLowerCase()
          )

        ||

        cliente.codigo
          .toLowerCase()
          .includes(
            this.filtro.toLowerCase()
          )

        ||

        cliente.email
          .toLowerCase()
          .includes(
            this.filtro.toLowerCase()
          )

        ||

        cliente.telefono
          .includes(
            this.filtro
          )

        ||

        cliente.empresa
          ?.toLowerCase()
          .includes(
            this.filtro.toLowerCase()
          )

    );

  }

  verCliente(
    cliente: any
  ) {

    this.clienteSeleccionado =
      cliente;

  }

  editarCliente(
    cliente: any
  ) {

    this.clienteEditando = {
      ...cliente
    };

    this.mostrarEditarCliente =
      true;

  }

  guardarEdicion() {

    this.cli.editar_clientes(
      this.clienteEditando
    )
    .subscribe({

      next: (rest: any) => {

        console.log(
          'Cliente actualizado:',
          rest
        );

        alert(
          'Cliente actualizado correctamente.'
        );

        this._mostrar_lista_clientes();

        this._mostrar_totales_clientes();

        this.mostrarEditarCliente =
          false;

      },

      error: (err) => {

        console.error(err);

        alert(
          'Error al actualizar el cliente.'
        );

      }

    });

  }

  guardarCliente() {

    if (
      !this.nuevoCliente.codigo ||
      !this.nuevoCliente.nombre ||
      !this.nuevoCliente.email
    ) {

      alert(
        'Complete los campos obligatorios.'
      );

      return;

    }

    this.cli.crear_clientes(
      this.nuevoCliente
    )
    .subscribe({

      next: (rest: any) => {

        console.log(
          'Cliente creado:',
          rest
        );

        alert(
          'Cliente registrado correctamente.'
        );

        this._mostrar_lista_clientes();

        this._mostrar_totales_clientes();

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

        this.mostrarNuevoCliente =
          false;

      },

      error: (err) => {

        console.error(err);

        alert(
          'Error al registrar el cliente.'
        );

      }

    });

  }

  eliminarCliente(
    codigo: string
  ) {

    const confirmar =
      confirm(
        '¿Desea eliminar este cliente?'
      );

    if (!confirmar) {
      return;
    }

    this.cli.eliminar_clientes(
      codigo
    )
    .subscribe({

      next: (rest: any) => {

        console.log(
          'Cliente eliminado:',
          rest
        );

        alert(
          'Cliente eliminado correctamente.'
        );

        this._mostrar_lista_clientes();

        this._mostrar_totales_clientes();

      },

      error: (err) => {

        console.error(err);

        alert(
          'Error al eliminar el cliente.'
        );

      }

    });

  }

  exportarExcel() {

    const datos =
      this.clientes.map(
        cliente => ({

          Codigo:
            cliente.codigo,

          Nombre:
            cliente.nombre,

          DNI:
            cliente.dni,

          Email:
            cliente.email,

          Telefono:
            cliente.telefono,

          Empresa:
            cliente.empresa,

          Ciudad:
            cliente.ciudad,

          Estado:
            cliente.estado

        })
      );

    const hoja =
      XLSX.utils.json_to_sheet(
        datos
      );

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