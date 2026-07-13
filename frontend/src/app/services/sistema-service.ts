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
    return this.http.get("https://01ihsy0q3e.execute-api.us-east-1.amazonaws.com/v1/sistema",{responseType: 'json'}); 
  }
}
