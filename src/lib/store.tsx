import { createContext, useContext, useReducer, useState, type ReactNode, useEffect, type Dispatch, type SetStateAction } from "react";
import { ProjectState, ModuleItem, GeneralMeasures, LaborDetails, AdditionalCosts, SavedProject } from "./types";
import { generateId } from "./formatters";
import { calculateCosts } from "./calculateCosts";

type Action = 
  | { type: "SET_STATE"; payload: ProjectState }
  | { type: "RESET_STATE" }
  | { type: "UPDATE_PROJECT_NAME"; payload: string }
  | { type: "UPDATE_MEDIDAS"; payload: Partial<GeneralMeasures> }
  | { type: "ADD_MODULE"; payload: ModuleItem }
  | { type: "UPDATE_MODULE"; payload: { id: string; module: Partial<ModuleItem> } }
  | { type: "REMOVE_MODULE"; payload: string }
  | { type: "UPDATE_MANO_OBRA"; payload: Partial<LaborDetails> }
  | { type: "UPDATE_ADICIONALES"; payload: Partial<AdditionalCosts> }
  | { type: "UPDATE_MARGEN"; payload: number };

const defaultMeasures: GeneralMeasures = {
  anchoTotal: 0,
  altoTotal: 0,
  profundidad: 0,
  considerarTapaSuperior: true,
  considerarFondo: true,
  zocalo: false,
  alturaZocalo: 100,
  porcentajeCanteado: 50,
  tipoMobiliario: "Módulo",
  color: "Blanco",
  rh: false
};

const defaultLabor: LaborDetails = {
  tipo: "Porcentaje",
  montoFijo: 0,
  porcentaje: 30,
  tarifaArmado: 50,
  tarifaInstalacionHerrajes: 5,
  diasInstalacion: 1,
  tarifaDiasInstalacion: 100,
  tarifaAjusteFino: 5
};

const defaultAdditional: AdditionalCosts = {
  transporte: 50,
  porcentajeImprevistos: 5,
  metrosLED: 0,
  recargoUrgencia: false,
  trabajoAltura: false,
  canastillas: { cantidad: 0, material: "Cromado" },
  condimentero: { cantidad: 0, material: "Cromado" },
  escurridor: { cantidad: 0, material: "Cromado" }
};

export const defaultState: ProjectState = {
  id: generateId(),
  name: "Cotización sin nombre",
  medidas: defaultMeasures,
  modulos: [],
  manoObra: defaultLabor,
  adicionales: defaultAdditional,
  margen: 30
};

export const createNewModule = (): ModuleItem => ({
  id: generateId(),
  tipo: "Módulo",
  ancho: 600,
  alto: 720,
  cantidad: 1,
  detalle: "Módulo base",
  cantidadCajones: 0,
  cajones: [],
  divisionesHorizontales: 0,
  divisionesVerticales: 0,
  tipoCorredera: "Telescópica Standard",
  cantidadPuertas: 0,
  tipoBisagra: "Standard",
  tipoTirador: "Tirador barra"
});

const reducer = (state: ProjectState, action: Action): ProjectState => {
  switch (action.type) {
    case "SET_STATE":
      return { ...action.payload };
    case "RESET_STATE":
      return { ...defaultState, id: generateId() };
    case "UPDATE_PROJECT_NAME":
      return { ...state, name: action.payload };
    case "UPDATE_MEDIDAS":
      return { ...state, medidas: { ...state.medidas, ...action.payload } };
    case "ADD_MODULE":
      return { ...state, modulos: [...state.modulos, action.payload] };
    case "UPDATE_MODULE":
      return {
        ...state,
        modulos: state.modulos.map((m) => (m.id === action.payload.id ? { ...m, ...action.payload.module } : m))
      };
    case "REMOVE_MODULE":
      return { ...state, modulos: state.modulos.filter((m) => m.id !== action.payload) };
    case "UPDATE_MANO_OBRA":
      return { ...state, manoObra: { ...state.manoObra, ...action.payload } };
    case "UPDATE_ADICIONALES":
      return { ...state, adicionales: { ...state.adicionales, ...action.payload } };
    case "UPDATE_MARGEN":
      return { ...state, margen: action.payload };
    default:
      return state;
  }
};

const ProjectContext = createContext<{
  state: ProjectState;
  dispatch: Dispatch<Action>;
  costs: ReturnType<typeof calculateCosts>;
  selectedModuleId: string | null;
  setSelectedModuleId: Dispatch<SetStateAction<string | null>>;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
} | null>(null);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("medidas");

  // Auto clear selected if removed
  useEffect(() => {
    if (selectedModuleId && !state.modulos.find((m) => m.id === selectedModuleId)) {
      setSelectedModuleId(null);
    }
  }, [state.modulos, selectedModuleId]);

  const costs = calculateCosts(state);

  return (
    <ProjectContext.Provider value={{ state, dispatch, costs, selectedModuleId, setSelectedModuleId, activeTab, setActiveTab }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProject must be used within ProjectProvider");
  return context;
};
