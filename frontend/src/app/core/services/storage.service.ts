import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }

    save(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
    }

    get(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
    }

    remove(key: string): void {
    localStorage.removeItem(key);
    }
}