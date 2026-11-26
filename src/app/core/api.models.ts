export type Rol = 'CIUDADANO' | 'ADMINISTRADOR';
export type EstadoReporte =
  'RECIBIDO' | 'EN_EVALUACION' | 'ASIGNADO' | 'EN_PROCESO' | 'ATENDIDO' | 'RECHAZADO';
export type Severidad = 'BAJA' | 'MEDIA' | 'ALTA';
export interface Perfil {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  tipoDocumento: string;
  documentoEnmascarado: string;
  telefono: string | null;
  distritoId: number | null;
  estadoCuenta: 'ACTIVA' | 'SUSPENDIDA';
  estadoVerificacion: string;
  roles: Rol[];
}
export interface Catalogo {
  id: number;
  codigo?: string;
  nombre: string;
  descripcion?: string;
}
export interface Reporte {
  id: number;
  codigo: string;
  tipoBarreraId: number;
  distritoId: number;
  severidadDeclarada: Severidad;
  descripcion: string;
  direccionReferencia: string;
  estado: EstadoReporte;
  fechaCreacion: string;
}
export interface DetalleReporte extends Reporte {
  latitud: number;
  longitud: number;
  publicadoEnMapa: boolean;
  puedeCambiarPublicacion: boolean;
  fotos: { id: number; mimeType: string; tamanoBytes: number; enlace: string }[];
}
export interface PuntoMapa {
  tipoBarreraId: number;
  tipo: string;
  estado: EstadoReporte;
  latitud: number;
  longitud: number;
  cantidad: number;
}
export interface MapaPublico {
  puntos: PuntoMapa[];
  hayMas: boolean;
}
export interface AvisoReporte {
  id: number;
  reporteId: number;
  codigo: string;
  estado: EstadoReporte;
  fecha: string;
}
export interface EventoReporte {
  id: number;
  estadoAnterior: EstadoReporte | null;
  estadoNuevo: EstadoReporte;
  fechaCambio: string;
  motivo: string | null;
}
export interface Pagina<T> {
  elementos: T[];
  limite: number;
  hayMas: boolean;
  siguienteCursor: string | null;
}
export interface ResumenDashboard {
  total: number;
  pendientes: number;
  atendidos: number;
  rechazados: number;
  porEstado: Record<EstadoReporte, number>;
  porSeveridadDeclarada: Record<Severidad, number>;
  porTipoBarrera: { id: number; nombre: string; cantidad: number }[];
  porDistrito: { id: number; nombre: string; cantidad: number }[];
}
export interface AreaMunicipal {
  id: number;
  codigo: string;
  nombre: string;
}
export interface AsignacionMunicipal {
  reporteId: number;
  area: AreaMunicipal;
  fecha: string;
}
export interface DatosPrioridad {
  tipo: 'VEREDA_DANADA' | 'SIN_RAMPA' | 'RAMPA_DETERIORADA' | 'OBSTACULO' | 'DESNIVEL';
  zonaSensible: boolean;
  flujoPeatonal: number;
  correccion: Severidad | null;
}
export interface PrioridadPiloto {
  reporteId: number;
  codigo: string;
  datos: DatosPrioridad;
  probabilidad: number;
  nivelSugerido: Severidad;
  nivelAplicado: Severidad;
}
export interface EvaluacionPrioridad {
  reportesCercanos: number;
  diasSinAtencion: number;
  prioridad: PrioridadPiloto | null;
}
export const ESTADOS: EstadoReporte[] = [
  'RECIBIDO',
  'EN_EVALUACION',
  'ASIGNADO',
  'EN_PROCESO',
  'ATENDIDO',
  'RECHAZADO',
];
export const SIGUIENTES: Record<EstadoReporte, EstadoReporte[]> = {
  RECIBIDO: ['EN_EVALUACION'],
  EN_EVALUACION: ['EN_PROCESO', 'RECHAZADO'],
  ASIGNADO: ['EN_PROCESO'],
  EN_PROCESO: ['ATENDIDO'],
  ATENDIDO: [],
  RECHAZADO: [],
};
export const etiquetaEstado = (estado: string) => estado.replaceAll('_', ' ');
