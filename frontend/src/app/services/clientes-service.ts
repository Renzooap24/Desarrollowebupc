import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  constructor(
    private http: HttpClient
  ){}

  obtener_totales_clientes(){
    return this.http.get("https://01ihsy0q3e.execute-api.us-east-1.amazonaws.com/v1/clientes",{responseType: 'json'}); 
  }
  
  obtener_lista_clientes(){
    return this.http.get("https://01ihsy0q3e.execute-api.us-east-1.amazonaws.com/v1/clientes/lista",{responseType: 'json'}); 
  }  
  
  obtener_vista_cliente(param: string){
    return this.http.get("https://q1yhc7uosb.execute-api.us-east-1.amazonaws.com/v1/clientes/vista" + param, {responseType: 'json'});
  }
  
  crear_clientes(data: any){
    return this.http.post("https://01ihsy0q3e.execute-api.us-east-1.amazonaws.com/v1/clientes/crear", data, {responseType: 'json'});
  }

  editar_clientes(data: any){
    return this.http.post("https://01ihsy0q3e.execute-api.us-east-1.amazonaws.com/v1/clientes/editar", data, {responseType: 'json'});
  }
  
  eliminar_clientes(codigo: string){
    return this.http.post(
      'https://01ihsy0q3e.execute-api.us-east-1.amazonaws.com/v1/clientes/eliminar',
      { codigo },
      { responseType: 'json' }
    );
  }
}
