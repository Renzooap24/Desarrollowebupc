import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SistemaService {
  constructor(
    private http: HttpClient
  ){}

  obtener_totales_sistema(){
    return this.http.get("https://q1yhc7uosb.execute-api.us-east-1.amazonaws.com/v1/sistema",{responseType: 'json'}); 
  }
}
