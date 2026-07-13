import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

import { ReportesService } from '../services/reportes-service';

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
export class Reportes implements OnInit {

  constructor(
    private readonly rep: ReportesService
  ) {}

  pestanaActiva = 'inventario';

  textoBusqueda = '';

  mostrarModal = false;

  reporteSeleccionado: any = null;

  modoEdicion = false;

  totalesReportes = signal<any>({
    totalgenerados: 0,
    totalactivos: 0,
    totalarchivados: 0
  });

  reportesInventario: any[] = [];

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

  ngOnInit(): void {
    this._mostrar_totales_reportes();
    this._mostrar_lista_reportes();
  }

  private _mostrar_totales_reportes() {

    this.rep.obtener_totales_reportes()
      .subscribe((rest: any) => {

        console.log(rest);

        this.totalesReportes.set(
          rest.data[0]
        );

      });

  }

  private _mostrar_lista_reportes() {

    this.rep.obtener_lista_reportes()
      .subscribe((rest: any) => {

        console.log(rest);

        this.reportesInventario =
          rest.data;

      });

  }

  cambiarPestana(
    pestana: string
  ) {

    this.pestanaActiva =
      pestana;

  }

  get reportesFiltrados() {

    if (!this.textoBusqueda) {
      return this.reportesInventario;
    }

    return this.reportesInventario.filter(
      reporte =>

        reporte.nombre
          .toLowerCase()
          .includes(
            this.textoBusqueda.toLowerCase()
          )

        ||

        reporte.fecha
          .includes(
            this.textoBusqueda
          )
    );

  }

  agregarReporte() {

    this.modoEdicion = false;

    this.reporteSeleccionado = {
      id_reporte: 0,
      nombre: '',
      fecha: '',
      estado: 'Activo'
    };

    this.mostrarModal = true;

  }

  editarReporte(
    reporte: any
  ) {

    this.modoEdicion = true;

    this.reporteSeleccionado = {
      ...reporte
    };

    this.mostrarModal = true;

  }

  guardarCambios() {

    if (this.modoEdicion) {

      this.rep.editar_reportes(
        this.reporteSeleccionado
      )
      .subscribe({

        next: () => {

          alert(
            'Reporte actualizado correctamente.'
          );

          this._mostrar_lista_reportes();
          this._mostrar_totales_reportes();

          this.mostrarModal = false;

        },

        error: () => {

          alert(
            'Error al actualizar el reporte.'
          );

        }

      });

      return;
    }

    this.rep.crear_reportes(
      this.reporteSeleccionado
    )
    .subscribe({

      next: () => {

        alert(
          'Reporte registrado correctamente.'
        );

        this._mostrar_lista_reportes();
        this._mostrar_totales_reportes();

        this.mostrarModal = false;

      },

      error: () => {

        alert(
          'Error al registrar el reporte.'
        );

      }

    });

  }

  eliminarReporte(
    id_reporte: number
  ) {

    const confirmar =
      confirm(
        '¿Desea eliminar el reporte?'
      );

    if (!confirmar) {
      return;
    }

    this.rep.eliminar_reportes(
      id_reporte.toString()
    )
    .subscribe({

      next: () => {

        alert(
          'Reporte eliminado correctamente.'
        );

        this._mostrar_lista_reportes();

        this._mostrar_totales_reportes();

      },

      error: () => {

        alert(
          'Error al eliminar el reporte.'
        );

      }

    });

  }

  verReporte(
    reporte: any
  ) {

    alert(
`Reporte: ${reporte.nombre}
Fecha: ${reporte.fecha}
Estado: ${reporte.estado}`
    );

  }

  verDetalle(
    vendedor: any
  ) {

    this.vendedorSeleccionado =
      vendedor;

    this.mostrarDetalle = true;

  }

  cerrarDetalle() {

    this.mostrarDetalle = false;

  }

  cerrarModal() {

    this.mostrarModal = false;

  }

  exportarExcel() {

    const datos =
      this.reportesInventario.map(
        reporte => ({

          Nombre: reporte.nombre,
          Fecha: reporte.fecha,
          Estado: reporte.estado

        })
      );

    const ws =
      XLSX.utils.json_to_sheet(
        datos
      );

    const wb =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      'Reportes'
    );

    XLSX.writeFile(
      wb,
      'reportes_inventario.xlsx'
    );

  }

  exportarRendimiento() {

    const datos =
      this.vendedores.map(
        v => ({

          Vendedor: v.nombre,
          'Monto Vendido': v.ventas,
          Facturas: v.facturas,
          Cotizaciones: v.cotizaciones

        })
      );

    const ws =
      XLSX.utils.json_to_sheet(
        datos
      );

    const wb =
      XLSX.utils.book_new();

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