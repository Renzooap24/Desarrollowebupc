import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  constructor(
    private http: HttpClient
  ){}

  obtener_totales_reportes(){
    return this.http.get("https://q1yhc7uosb.execute-api.us-east-1.amazonaws.com/v1/reportes",{responseType: 'json'}); 
  }

  obtener_lista_reportes(){
    return this.http.get("https://q1yhc7uosb.execute-api.us-east-1.amazonaws.com/v1/reportes/lista",{responseType: 'json'}); 
  }  

  crear_reportes(data: any){
    return this.http.post("https://q1yhc7uosb.execute-api.us-east-1.amazonaws.com/v1/reportes/crear", data, {responseType: 'json'});
  }

  editar_reportes(data: any){
    return this.http.post("https://q1yhc7uosb.execute-api.us-east-1.amazonaws.com/v1/reportes/editar", data, {responseType: 'json'});
  }

  eliminar_reportes(id_reporte: string){
    return this.http.post(
      'https://q1yhc7uosb.execute-api.us-east-1.amazonaws.com/v1/reportes/eliminar',
      { id_reporte },
      { responseType: 'json' }
    );
  }

}