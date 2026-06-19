import { Injectable } from '@angular/core';
import { Servicio } from './servicio.model';

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private key = 'servicios';

  getServicios(): Servicio[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [
      { fecha:"2024-02-15 14:30", tipo:"garantía", cliente:"CLI-001 - Juan Carlos Pérez", maquina:"MAC-001 - Fresadora CNC", productos:"PRD-001 (1)", motivo:"Reparación", ref:"GA-21" }
    ];
  }

  guardarServicios(servicios: Servicio[]) {
    localStorage.setItem(this.key, JSON.stringify(servicios));
  }
}