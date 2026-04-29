import { useProject } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { generateId } from "@/lib/formatters";
import { Minus, Plus } from "lucide-react";

export function OpcionesTab() {
  const { state, dispatch, selectedModuleId } = useProject();

  const module = state.modulos.find((m) => m.id === selectedModuleId);

  const updateMedidas = (key: string, value: any) => {
    dispatch({ type: "UPDATE_MEDIDAS", payload: { [key]: value } });
  };

  if (!module) {
    return (
      <div className="text-center py-12 bg-gray-50 border border-dashed rounded-xl">
        <p className="text-muted-foreground">Selecciona un módulo en la pestaña de Distribución para editar sus opciones.</p>
      </div>
    );
  }

  const update = (field: string, value: any) => {
    dispatch({ type: "UPDATE_MODULE", payload: { id: module.id, module: { [field]: value } } });
  };

  const updateCajonesCount = (newCount: number) => {
    if (newCount < 0) return;
    const currentCajones = [...module.cajones];
    if (newCount > currentCajones.length) {
      while (currentCajones.length < newCount) {
        currentCajones.push({ id: generateId(), altura: 200 });
      }
    } else {
      currentCajones.length = newCount;
    }
    dispatch({ 
      type: "UPDATE_MODULE", 
      payload: { id: module.id, module: { cantidadCajones: newCount, cajones: currentCajones } } 
    });
  };

  const updateCajon = (idx: number, altura: number) => {
    const current = [...module.cajones];
    current[idx] = { ...current[idx], altura };
    update("cajones", current);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-primary mb-1">
          Editando módulo: {module.detalle || "Sin detalle"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Dimensiones: {module.ancho}x{module.alto}mm
        </p>
      </div>

      <div className="space-y-5 bg-white p-6 rounded-xl border border-border shadow-sm">
        <h3 className="font-semibold text-gray-900 border-b pb-2">Acabado del tablero</h3>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Label className="text-base font-normal">Color</Label>
          <RadioGroup
            value={state.medidas.color}
            onValueChange={(v) => updateMedidas("color", v)}
            className="flex gap-2"
          >
            <label
              htmlFor="opc-color-blanco"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer bg-white ${
                state.medidas.color === "Blanco" ? "border-primary ring-2 ring-primary/30" : "border-border"
              }`}
            >
              <RadioGroupItem value="Blanco" id="opc-color-blanco" />
              <span className="text-sm">Blanco (S/ 35/m²)</span>
            </label>
            <label
              htmlFor="opc-color-diseno"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer bg-white ${
                state.medidas.color === "Diseño" ? "border-primary ring-2 ring-primary/30" : "border-border"
              }`}
            >
              <RadioGroupItem value="Diseño" id="opc-color-diseno" />
              <span className="text-sm">Diseño (S/ 55/m²)</span>
            </label>
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label className="text-base font-normal">RH</Label>
            <p className="text-xs text-muted-foreground">
              Resistente a la humedad (+{state.medidas.color === "Diseño" ? "20" : "50"}% sobre tableros)
            </p>
          </div>
          <Switch
            checked={state.medidas.rh}
            onCheckedChange={(v) => updateMedidas("rh", v)}
          />
        </div>

      </div>

      <div className="space-y-4 bg-white p-6 rounded-xl border border-border shadow-sm">
        <h3 className="font-semibold text-gray-900 border-b pb-2">Canteado</h3>
        <div className="space-y-2">
          <Label>% de Canteado estimado</Label>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border max-w-md">
            <Input
              type="number"
              className="w-24 bg-white"
              value={state.medidas.porcentajeCanteado}
              onChange={(e) => updateMedidas("porcentajeCanteado", Number(e.target.value))}
              min={0}
              max={100}
            />
            <span className="text-muted-foreground text-sm">% del perímetro total</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Porcentaje del perímetro que llevará canto (50% = solo caras visibles aprox).
          </p>
        </div>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-xl border border-border shadow-sm">
        <h3 className="font-semibold text-gray-900 border-b pb-2">Distribución interna</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Cantidad de cajones</Label>
              <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border">
                <Button 
                  variant="ghost" size="icon" className="h-7 w-7" 
                  onClick={() => updateCajonesCount(module.cantidadCajones - 1)}
                ><Minus className="w-3 h-3" /></Button>
                <span className="w-6 text-center font-medium">{module.cantidadCajones}</span>
                <Button 
                  variant="ghost" size="icon" className="h-7 w-7" 
                  onClick={() => updateCajonesCount(module.cantidadCajones + 1)}
                ><Plus className="w-3 h-3" /></Button>
              </div>
            </div>

            {module.cantidadCajones > 0 && (
              <div className="pl-4 border-l-2 border-primary/20 space-y-3">
                {module.cajones.map((c, idx) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <Label className="text-sm text-gray-600 w-24">Altura cajón {idx + 1}</Label>
                    <Input 
                      type="number" 
                      className="h-8 w-24" 
                      value={c.altura} 
                      onChange={(e) => updateCajon(idx, Number(e.target.value))}
                      min={0}
                    />
                    <span className="text-sm text-gray-500">mm</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Divisiones horizontales</Label>
              <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border">
                <Button 
                  variant="ghost" size="icon" className="h-7 w-7" 
                  onClick={() => update("divisionesHorizontales", Math.max(0, module.divisionesHorizontales - 1))}
                ><Minus className="w-3 h-3" /></Button>
                <span className="w-6 text-center font-medium">{module.divisionesHorizontales}</span>
                <Button 
                  variant="ghost" size="icon" className="h-7 w-7" 
                  onClick={() => update("divisionesHorizontales", module.divisionesHorizontales + 1)}
                ><Plus className="w-3 h-3" /></Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Label>Divisiones verticales</Label>
              <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border">
                <Button 
                  variant="ghost" size="icon" className="h-7 w-7" 
                  onClick={() => update("divisionesVerticales", Math.max(0, module.divisionesVerticales - 1))}
                ><Minus className="w-3 h-3" /></Button>
                <span className="w-6 text-center font-medium">{module.divisionesVerticales}</span>
                <Button 
                  variant="ghost" size="icon" className="h-7 w-7" 
                  onClick={() => update("divisionesVerticales", module.divisionesVerticales + 1)}
                ><Plus className="w-3 h-3" /></Button>
              </div>
            </div>
          </div>
        </div>

        {module.cantidadCajones > 0 && (
          <div className="pt-4 border-t space-y-3">
            <Label>Tipo de corredera</Label>
            <RadioGroup 
              value={module.tipoCorredera} 
              onValueChange={(v) => update("tipoCorredera", v)}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              {[
                { val: "Telescópica Standard", label: "Telescópica Standard", price: "+S/ 0" },
                { val: "Cierre suave", label: "Cierre suave", price: "+S/ 20" },
                { val: "Telescópica push open", label: "Telescópica push open", price: "+S/ 15" }
              ].map(opt => (
                <div key={opt.val} className={`flex items-start space-x-2 border p-3 rounded-lg cursor-pointer ${module.tipoCorredera === opt.val ? 'border-primary bg-primary/5' : 'bg-white'}`}>
                  <RadioGroupItem value={opt.val} id={`corr-${opt.val}`} className="mt-1" />
                  <Label htmlFor={`corr-${opt.val}`} className="font-normal cursor-pointer flex flex-col w-full">
                    <span>{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.price}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>

      <div className="space-y-6 bg-white p-6 rounded-xl border border-border shadow-sm">
        <h3 className="font-semibold text-gray-900 border-b pb-2">Configuración externa</h3>
        
        <div className="flex justify-between items-center max-w-sm">
          <Label>Cantidad de puertas</Label>
          <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border">
            <Button 
              variant="ghost" size="icon" className="h-7 w-7" 
              onClick={() => update("cantidadPuertas", Math.max(0, module.cantidadPuertas - 1))}
            ><Minus className="w-3 h-3" /></Button>
            <span className="w-6 text-center font-medium">{module.cantidadPuertas}</span>
            <Button 
              variant="ghost" size="icon" className="h-7 w-7" 
              onClick={() => update("cantidadPuertas", module.cantidadPuertas + 1)}
            ><Plus className="w-3 h-3" /></Button>
          </div>
        </div>

        {module.cantidadPuertas > 0 && (
          <div className="pt-2 space-y-3">
            <Label>Tipo de bisagras</Label>
            <RadioGroup 
              value={module.tipoBisagra} 
              onValueChange={(v) => update("tipoBisagra", v)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {[
                { val: "Standard", label: "Standard", price: "+S/ 0" },
                { val: "Cierre suave", label: "Cierre suave", price: "+S/ 4 c/u" }
              ].map(opt => (
                <div key={opt.val} className={`flex items-start space-x-2 border p-3 rounded-lg cursor-pointer ${module.tipoBisagra === opt.val ? 'border-primary bg-primary/5' : 'bg-white'}`}>
                  <RadioGroupItem value={opt.val} id={`bis-${opt.val}`} className="mt-1" />
                  <Label htmlFor={`bis-${opt.val}`} className="font-normal cursor-pointer flex flex-col w-full">
                    <span>{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.price}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {(module.cantidadPuertas > 0 || module.cantidadCajones > 0) && (
          <div className="pt-2 space-y-3">
            <Label>Tipo de tirador</Label>
            <RadioGroup 
              value={module.tipoTirador} 
              onValueChange={(v) => update("tipoTirador", v)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {[
                { val: "Tirador barra", label: "Tirador barra", price: "+S/ 7" },
                { val: "Tirador botón", label: "Tirador botón", price: "+S/ 6" },
                { val: "Sin tirador (push open)", label: "Sin tirador (push open)", price: "+S/ 10" },
                { val: "Tirador oculto", label: "Tirador oculto (Gola / 45°)", price: "+S/ 12" }
              ].map(opt => (
                <div key={opt.val} className={`flex items-start space-x-2 border p-3 rounded-lg cursor-pointer ${module.tipoTirador === opt.val ? 'border-primary bg-primary/5' : 'bg-white'}`}>
                  <RadioGroupItem value={opt.val} id={`tir-${opt.val}`} className="mt-1" />
                  <Label htmlFor={`tir-${opt.val}`} className="font-normal cursor-pointer flex flex-col w-full">
                    <span>{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.price}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );
}
