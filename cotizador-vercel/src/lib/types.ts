export type FurnitureType = "Módulo" | "Superficie";
export type ColorType = "Blanco" | "Diseño";
export type SlideType = "Telescópica Standard" | "Cierre suave" | "Telescópica push open";
export type HingeType = "Standard" | "Cierre suave";
export type HandleType = "Tirador barra" | "Tirador botón" | "Sin tirador (push open)" | "Tirador oculto";
export type LaborType = "Fija" | "Porcentaje" | "Calculado";
export type MaterialAccesorio = "Cromado" | "Acero Inoxidable";

export interface AccesorioCounter {
  cantidad: number;
  material: MaterialAccesorio;
}

export interface ModuleDrawer {
  id: string;
  altura: number;
}

export interface ModuleItem {
  id: string;
  tipo: FurnitureType;
  ancho: number;
  alto: number;
  cantidad: number;
  detalle: string;
  
  // Opciones
  cantidadCajones: number;
  cajones: ModuleDrawer[];
  divisionesHorizontales: number;
  divisionesVerticales: number;
  tipoCorredera: SlideType;
  
  cantidadPuertas: number;
  tipoBisagra: HingeType;
  tipoTirador: HandleType;
}

export interface GeneralMeasures {
  anchoTotal: number;
  altoTotal: number;
  profundidad: number;
  considerarTapaSuperior: boolean;
  considerarFondo: boolean;
  zocalo: boolean;
  alturaZocalo: number;
  porcentajeCanteado: number;
  tipoMobiliario: FurnitureType;
  color: ColorType;
  rh: boolean;
}

export interface LaborDetails {
  tipo: LaborType;
  montoFijo: number;
  porcentaje: number;
  tarifaArmado: number;
  tarifaInstalacionHerrajes: number;
  diasInstalacion: number;
  tarifaDiasInstalacion: number;
  tarifaAjusteFino: number;
}

export interface AdditionalCosts {
  transporte: number;
  porcentajeImprevistos: number;
  metrosLED: number;
  recargoUrgencia: boolean;
  trabajoAltura: boolean;
  canastillas: AccesorioCounter;
  condimentero: AccesorioCounter;
  escurridor: AccesorioCounter;
}

export interface ProjectState {
  id: string;
  name: string;
  medidas: GeneralMeasures;
  modulos: ModuleItem[];
  manoObra: LaborDetails;
  adicionales: AdditionalCosts;
  margen: number;
}

export interface SavedProject {
  id: string;
  name: string;
  savedAt: number;
  state: ProjectState;
}

export interface CostBreakdown {
  areaTotal: number;
  costoTableros: number;
  perimetroTotal: number;
  costoCantos: number;
  costoHerrajes: number;
  costoRH: number;
  costoManoObra: number;
  costoMateriales: number;
  costoTransporte: number;
  costoLED: number;
  costoAccesorios: number;
  costoUrgencia: number;
  costoAltura: number;
  costoImprevistos: number;
  costoTotalEst: number;
  precioVenta: number;
  pesoEstimado: number;
  diasEstimados: number;
}
