import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import * as XLSX from 'xlsx';

import { ReportesService }
from '../services/reportes-service';

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

  mostrarDetalle = false;

  modoEdicion = false;

  reporteSeleccionado: any = null;

  vendedorSeleccionado: any = null;

  reportesInventario: any[] = [];

  vendedores: any[] = [];

  facturasVendedor: any[] = [];

  totalesReportes = signal<any>({
    totalgenerados: 0,
    totalactivos: 0,
    totalarchivados: 0
  });

  ngOnInit(): void {

    this._mostrar_totales_reportes();

    this._mostrar_lista_reportes();

    this._mostrar_lista_vendedor_facturas();

  }

  /* =====================================
     TOTALES
     ===================================== */

  private _mostrar_totales_reportes() {

    this.rep.obtener_totales_reportes()
      .subscribe((rest: any) => {

        console.log(
          'Totales reportes:',
          rest
        );

        this.totalesReportes.set(
          rest.data[0]
        );

      });

  }

  /* =====================================
     REPORTES INVENTARIO
     ===================================== */

  private _mostrar_lista_reportes() {

    this.rep.obtener_lista_reportes()
      .subscribe((rest: any) => {

        console.log(
          'Lista reportes:',
          rest
        );

        this.reportesInventario =
          rest.data;

      });

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
            this.textoBusqueda
              .toLowerCase()
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

    /* EDITAR */

    if (this.modoEdicion) {

      this.rep.editar_reportes(
        this.reporteSeleccionado
      )
      .subscribe({

        next: (rest: any) => {

          console.log(
            'Reporte actualizado:',
            rest
          );

          alert(
            'Reporte actualizado correctamente.'
          );

          this._mostrar_lista_reportes();

          this._mostrar_totales_reportes();

          this.mostrarModal = false;

        },

        error: (err: any) => {

          console.error(err);

          alert(
            'Error al actualizar el reporte.'
          );

        }

      });

      return;

    }

    /* CREAR */

    this.rep.crear_reportes(
      this.reporteSeleccionado
    )
    .subscribe({

      next: (rest: any) => {

        console.log(
          'Reporte creado:',
          rest
        );

        alert(
          'Reporte registrado correctamente.'
        );

        this._mostrar_lista_reportes();

        this._mostrar_totales_reportes();

        this.mostrarModal = false;

      },

      error: (err: any) => {

        console.error(err);

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

      next: (rest: any) => {

        console.log(
          'Reporte eliminado:',
          rest
        );

        alert(
          'Reporte eliminado correctamente.'
        );

        this._mostrar_lista_reportes();

        this._mostrar_totales_reportes();

      },

      error: (err: any) => {

        console.error(err);

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

  cerrarModal() {

    this.mostrarModal = false;

  }

  /* =====================================
     RENDIMIENTO COMERCIAL
     ===================================== */

  private _mostrar_lista_vendedor_facturas() {

    this.rep.obtener_lista_vendedor_facturas()
      .subscribe({

        next: (rest: any) => {

          console.log(
            'Vendedores:',
            rest
          );

          this.vendedores =
            rest.data;

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

  verDetalle(
    vendedor: any
  ) {

    this.vendedorSeleccionado =
      vendedor;

    this.rep.obtener_vlista_facturas_vendedor(
      vendedor.id_vendedor
    )
    .subscribe({

      next: (rest: any) => {

        console.log(
          'Facturas vendedor:',
          rest
        );

        this.facturasVendedor =
          rest.data;

        this.mostrarDetalle =
          true;

      },

      error: (err: any) => {

        console.error(err);

        alert(
          'Error al obtener las facturas del vendedor.'
        );

      }

    });

  }

  cerrarDetalle() {

    this.mostrarDetalle = false;

    this.vendedorSeleccionado = null;

    this.facturasVendedor = [];

  }

  cambiarPestana(
    pestana: string
  ) {

    this.pestanaActiva =
      pestana;

  }

  /* =====================================
     EXPORTAR REPORTES
     ===================================== */

  exportarExcel() {

    const datos =
      this.reportesInventario.map(
        reporte => ({

          Nombre:
            reporte.nombre,

          Fecha:
            reporte.fecha,

          Estado:
            reporte.estado

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

  /* =====================================
     EXPORTAR RENDIMIENTO
     ===================================== */

  exportarRendimiento() {

    const datos =
      this.vendedores.map(
        vendedor => ({

          Vendedor:
            vendedor.nombre,

          'Monto Vendido':
            vendedor.monto_total,

          Facturas:
            vendedor.cant_factura

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
      'Rendimiento Comercial'
    );

    XLSX.writeFile(
      wb,
      'rendimiento_comercial.xlsx'
    );

  }

}