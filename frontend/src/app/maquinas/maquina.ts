import { Injectable } from '@angular/core';
import { Maquinas } from './maquinas.model';

@Injectable({ providedIn: 'root' })
export class MaquinasService {
  private key = 'maquinas';

  getMaquinas(): Maquinas[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [
      { codigo:"MAQ-001", nombre:"Compresor Atlas Copco GA22", estado:"Operativa" },
      { codigo:"MAQ-002", nombre:"Compresor Kaeser SM16", estado:"En Mantenimiento" },
      { codigo:"MAQ-003", nombre:"Secador Refrigerativo FD120", estado:"Fuera de Servicio" }
    ];
  }

  guardarMaquinas(maquinas: Maquinas[]) {
    localStorage.setItem(this.key, JSON.stringify(maquinas));
  }
}