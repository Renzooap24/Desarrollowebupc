export interface Cotizacion {
    id: string;
    cliente: string;
    fecha: string;
    total: number;
    estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
}