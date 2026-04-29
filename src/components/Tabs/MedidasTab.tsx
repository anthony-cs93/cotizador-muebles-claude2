import { useProject, createNewModule } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function MedidasTab() {
  const { state, dispatch, setSelectedModuleId, setActiveTab } = useProject();
  const m = state.medidas;
  const isSuperficie = m.tipoMobiliario === "Superficie";

  const update = (key: string, value: any) => {
    dispatch({ type: "UPDATE_MEDIDAS", payload: { [key]: value } });
  };

  const handleAgregarModulo = () => {
    const newMod = createNewModule();
    newMod.tipo = m.tipoMobiliario;
    if (m.anchoTotal > 0) newMod.ancho = m.anchoTotal;
    if (m.altoTotal > 0) newMod.alto = m.altoTotal;
    dispatch({ type: "ADD_MODULE", payload: newMod });
    setSelectedModuleId(newMod.id);
    setActiveTab("distribucion");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-primary mb-4">Configuración General</h2>

        <div className="space-y-3 mb-6">
          <Label>Tipo de mobiliario</Label>
          <RadioGroup
            value={m.tipoMobiliario}
            onValueChange={(v) => update("tipoMobiliario", v)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-primary bg-primary/5 mt-[10px] mb-[10px]">
              <RadioGroupItem value="Módulo" id="tm-mod" />
              <Label htmlFor="tm-mod" className="font-normal cursor-pointer w-full">Módulo</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border bg-white mt-[10px] mb-[10px]">
              <RadioGroupItem value="Superficie" id="tm-sup" />
              <Label htmlFor="tm-sup" className="font-normal cursor-pointer w-full">Superficie</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            {isSuperficie
              ? "Superficie: una sola pieza (ancho x alto). No requiere profundidad ni estructura."
              : "Módulo: estructura completa con tapa, fondo, laterales y profundidad."}
          </p>
        </div>

        <div className={`grid grid-cols-1 ${isSuperficie ? "md:grid-cols-2" : "md:grid-cols-3"} gap-6`}>
          <div className="space-y-2">
            <Label>Ancho total (mm)</Label>
            <Input 
              type="number" 
              value={m.anchoTotal} 
              onChange={(e) => update("anchoTotal", Number(e.target.value))}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label>Alto total (mm)</Label>
            <Input 
              type="number" 
              value={m.altoTotal} 
              onChange={(e) => update("altoTotal", Number(e.target.value))}
              min={0}
            />
          </div>
          {!isSuperficie && (
            <div className="space-y-2">
              <Label>Profundidad (mm)</Label>
              <Input
                type="number"
                value={m.profundidad}
                onChange={(e) => update("profundidad", Number(e.target.value))}
                min={0}
              />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-border">
        <h3 className="font-medium mb-2 text-[#1e3b8a] text-[17px]">Estructura global</h3>

        <div className="flex items-center justify-between mb-[10px] text-[15px]">
          <Label className="font-normal text-[15px]">Considerar tapa superior</Label>
          <Switch 
            checked={!isSuperficie && m.considerarTapaSuperior}
            onCheckedChange={(v) => update("considerarTapaSuperior", v)} 
            disabled={isSuperficie}
          />
        </div>
        
        <div className="flex items-center justify-between mb-[10px]">
          <Label className="font-normal text-[15px]">Considerar fondo</Label>
          <Switch 
            checked={!isSuperficie && m.considerarFondo}
            onCheckedChange={(v) => update("considerarFondo", v)} 
            disabled={isSuperficie}
          />
        </div>

        <div className={`flex items-center justify-between ${isSuperficie ? "opacity-50" : ""}`}>
          <div className="space-y-1 text-[15px]">
            <Label className="font-normal text-[15px]">Zócalo</Label>
          </div>
          <div className="flex items-center gap-4">
            {!isSuperficie && m.zocalo && (
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Altura (mm)</Label>
                <Input 
                  type="number" 
                  className="w-20 h-8"
                  value={m.alturaZocalo}
                  onChange={(e) => update("alturaZocalo", Number(e.target.value))}
                  min={0}
                />
              </div>
            )}
            <Switch 
              checked={!isSuperficie && m.zocalo}
              onCheckedChange={(v) => update("zocalo", v)} 
              disabled={isSuperficie}
            />
          </div>
        </div>

        {isSuperficie && (
          <p className="text-xs text-muted-foreground -mt-2">
            Estas opciones no aplican para "Superficie" (pieza única ancho x alto).
          </p>
        )}

        <div className="pt-2">
          <Button onClick={handleAgregarModulo} className="w-full gap-2" size="lg">
            <Plus className="w-4 h-4" /> Agregar
          </Button>
          <p className="text-xs text-muted-foreground text-center pt-2">Agrega esta configuración a la lista de módulos.</p>
        </div>
      </div>
    </div>
  );
}
