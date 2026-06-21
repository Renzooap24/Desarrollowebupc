import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaquinasService } from './maquina';
import { Maquinas } from './maquinas.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-maquinas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './maquinas.html',
  styleUrls: ['./maquinas.css']
})
export class MaquinasComponent implements OnInit {
  maquinas: Maquinas[] = [];
  filtro = '';

  constructor(private maqinaService: MaquinasService) {}

  ngOnInit() {
    this.maquinas = this.maqinaService.getMaqinas();
  }
// Agrega esto:
  verDetalle(index: number) {
    const maquina = this.maquinas[index];
    console.log('Viendo detalles de:', maquina);
    alert('Detalle de Maquina: ' + maquina.estado);
  }

  get maquinasFiltrados() {
    return this.maquinas.filter(s => 
      s.nombre.toLowerCase().includes(this.filtro.toLowerCase()) || 
      s.codigo.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
}