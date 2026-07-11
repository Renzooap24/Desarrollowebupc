import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor() { }

    exportToExcel(data: any[], fileName: string, sheetName: string = 'Hoja1'): void {
    // Convertir datos JSON a hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}