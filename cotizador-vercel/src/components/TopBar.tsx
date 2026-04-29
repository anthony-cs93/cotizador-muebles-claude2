import { useState, useEffect } from "react";
import { useProject, defaultState } from "@/lib/store";
import { SavedProject } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateId, formatDate, formatCurrency } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";
import { FileDown, Save, Copy, FilePlus, FolderOpen } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

// JS PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function TopBar() {
  const { state, dispatch, costs } = useProject();
  const { toast } = useToast();
  
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(state.name);
  const [showNewDialog, setShowNewDialog] = useState(false);

  useEffect(() => {
    loadSavedProjects();
  }, []);

  useEffect(() => {
    setTempName(state.name);
  }, [state.name]);

  const loadSavedProjects = () => {
    try {
      const saved = localStorage.getItem("cotizador_proyectos");
      if (saved) {
        setSavedProjects(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error loading projects", e);
    }
  };

  const handleSave = () => {
    try {
      const existing = localStorage.getItem("cotizador_proyectos");
      let projects: SavedProject[] = existing ? JSON.parse(existing) : [];
      
      const idx = projects.findIndex(p => p.id === state.id);
      const newSaved: SavedProject = {
        id: state.id,
        name: state.name,
        savedAt: Date.now(),
        state: state
      };
      
      if (idx >= 0) {
        projects[idx] = newSaved;
      } else {
        projects.push(newSaved);
      }
      
      localStorage.setItem("cotizador_proyectos", JSON.stringify(projects));
      setSavedProjects(projects);
      toast({ title: "Proyecto guardado", description: "El proyecto se ha guardado localmente." });
    } catch (e) {
      toast({ title: "Error", description: "No se pudo guardar el proyecto.", variant: "destructive" });
    }
  };

  const handleLoad = (p: SavedProject) => {
    dispatch({ type: "SET_STATE", payload: p.state });
    toast({ title: "Proyecto cargado", description: p.name });
  };

  const handleDuplicate = () => {
    const newState = { ...state, id: generateId(), name: `${state.name} (copia)` };
    dispatch({ type: "SET_STATE", payload: newState });
    toast({ title: "Proyecto duplicado", description: "Se ha creado una copia." });
  };

  const handleNew = () => {
    dispatch({ type: "RESET_STATE" });
    setShowNewDialog(false);
    toast({ title: "Nuevo proyecto", description: "Se ha iniciado un proyecto en blanco." });
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      dispatch({ type: "UPDATE_PROJECT_NAME", payload: tempName.trim() });
    } else {
      setTempName(state.name);
    }
    setIsEditingName(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(state.name, 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Fecha: ${formatDate(Date.now())}`, 14, 30);
    
    // Modulos table
    const tableData = state.modulos.map(m => [
      m.detalle || m.tipo,
      `${m.ancho}x${m.alto}x${state.medidas.profundidad}mm`,
      m.cantidad.toString(),
      `${m.cantidadCajones} caj. / ${m.cantidadPuertas} ptas.`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Módulo', 'Dimensiones', 'Cant.', 'Distribución']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] }
    });

    let finalY = (doc as any).lastAutoTable?.finalY || 40;
    
    // Cost breakdown
    doc.setFontSize(14);
    doc.text("Resumen de Costos", 14, finalY + 15);
    
    const costData = [
      ['Tableros y Cantos', formatCurrency(costs.costoTableros + costs.costoCantos)],
      ['Accesorios y Herrajes', formatCurrency(costs.costoHerrajes)],
      ['Mano de Obra e Instalación', formatCurrency(costs.costoManoObra)],
      ['Transporte e Imprevistos', formatCurrency(costs.costoTransporte + costs.costoImprevistos)],
      ['Precio Sugerido', formatCurrency(costs.precioVenta)]
    ];

    autoTable(doc, {
      startY: finalY + 20,
      body: costData,
      theme: 'plain',
      styles: { fontSize: 11 },
      columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
      willDrawCell: function(data: any) {
        if (data.row.index === costData.length - 1) {
          doc.setTextColor(22, 163, 74); // Green
        }
      }
    });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Cotización generada con Cotizador Melamina", 14, doc.internal.pageSize.height - 10);

    doc.save(`${state.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-primary text-primary-foreground h-14 flex items-center justify-between px-4 z-40 shadow-md">
        
        <div className="flex items-center gap-4 flex-1">
          <div className="font-bold tracking-tight hidden sm:block">CM</div>
          <div className="h-6 w-[1px] bg-primary-foreground/20 hidden sm:block" />
          
          {isEditingName ? (
            <Input 
              className="h-8 max-w-[250px] bg-primary-foreground text-primary border-0" 
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              autoFocus
            />
          ) : (
            <div 
              className="font-medium truncate max-w-[250px] cursor-pointer hover:bg-primary-foreground/10 px-2 py-1 rounded transition-colors"
              onClick={() => setIsEditingName(true)}
              title="Clic para editar"
            >
              {state.name}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground hidden sm:flex gap-2">
                <FolderOpen className="w-4 h-4" /> Abrir
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Proyectos guardados</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {savedProjects.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground text-center">No hay proyectos guardados</div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {savedProjects.sort((a,b) => b.savedAt - a.savedAt).map(p => (
                    <DropdownMenuItem key={p.id} onClick={() => handleLoad(p)} className="flex flex-col items-start gap-1 cursor-pointer">
                      <span className="font-medium truncate w-full">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(p.savedAt)}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={() => setShowNewDialog(true)} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" title="Nuevo proyecto">
            <FilePlus className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleDuplicate} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" title="Duplicar">
            <Copy className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={handleSave} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" title="Guardar">
            <Save className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={exportPDF} className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 ml-2 hidden sm:flex gap-2">
            <FileDown className="w-4 h-4" /> PDF
          </Button>

          <Button variant="ghost" size="icon" onClick={exportPDF} className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 ml-1 sm:hidden">
            <FileDown className="w-4 h-4" />
          </Button>

        </div>
      </div>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Crear nuevo proyecto?</DialogTitle>
            <DialogDescription>
              Se perderán los cambios no guardados. Asegúrate de guardar el proyecto actual si deseas conservarlo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Cancelar</Button>
            <Button onClick={handleNew} variant="default">Sí, crear nuevo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
