import { useProject } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function ResumenTab() {
  const { state, dispatch } = useProject();
  const m = state.manoObra;

  const update = (field: string, value: any) => {
    dispatch({ type: "UPDATE_MANO_OBRA", payload: { [field]: value } });
  };

  const totalModulos = state.modulos.reduce((acc, curr) => acc + curr.cantidad, 0);

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-6 bg-white p-6 rounded-xl border border-border shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-primary mb-1">Mano de Obra</h2>
          <p className="text-sm text-muted-foreground mb-4">Configura cómo cobrarás el trabajo</p>
        </div>

        <RadioGroup 
          value={m.tipo} 
          onValueChange={(v) => update("tipo", v)}
          className="flex flex-col gap-3"
        >
          {/* Fija */}
          <div className={`border p-4 rounded-xl transition-colors ${m.tipo === "Fija" ? 'border-primary bg-primary/5' : 'bg-white'}`}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="Fija" id="mo-fija" />
              <Label htmlFor="mo-fija" className="font-medium cursor-pointer">Tarifa Fija</Label>
            </div>
            {m.tipo === "Fija" && (
              <div className="pl-6 flex items-center gap-3">
                <Label className="text-sm text-gray-600">Monto total (S/)</Label>
                <Input 
                  type="number" 
                  className="w-32 bg-white" 
                  value={m.montoFijo} 
                  onChange={(e) => update("montoFijo", Number(e.target.value))}
                  min={0}
                />
              </div>
            )}
          </div>

          {/* Porcentaje */}
          <div className={`border p-4 rounded-xl transition-colors ${m.tipo === "Porcentaje" ? 'border-primary bg-primary/5' : 'bg-white'}`}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="Porcentaje" id="mo-porcentaje" />
              <Label htmlFor="mo-porcentaje" className="font-medium cursor-pointer">Porcentaje</Label>
            </div>
            {m.tipo === "Porcentaje" && (
              <div className="pl-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="text-sm text-gray-600">% sobre materiales y accesorios</Label>
                  <Input 
                    type="number" 
                    className="w-24 bg-white" 
                    value={m.porcentaje} 
                    onChange={(e) => update("porcentaje", Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Calculado */}
          <div className={`border p-4 rounded-xl transition-colors ${m.tipo === "Calculado" ? 'border-primary bg-primary/5' : 'bg-white'}`}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="Calculado" id="mo-calc" />
              <Label htmlFor="mo-calc" className="font-medium cursor-pointer">Calculado por detalle</Label>
            </div>
            {m.tipo === "Calculado" && (
              <div className="pl-6 space-y-4 pt-2">
                <div className="flex items-center justify-between gap-4">
                  <Label className="text-sm font-normal">Armado de módulos</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20 text-right">{totalModulos} mod. ×</span>
                    <Input type="number" className="w-20 bg-white" value={m.tarifaArmado} onChange={(e) => update("tarifaArmado", Number(e.target.value))} min={0} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Label className="text-sm font-normal">Instalación de herrajes</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20 text-right">tarifa c/u</span>
                    <Input type="number" className="w-20 bg-white" value={m.tarifaInstalacionHerrajes} onChange={(e) => update("tarifaInstalacionHerrajes", Number(e.target.value))} min={0} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-normal">Días de instalación</Label>
                    <Input type="number" className="w-16 h-7 text-xs bg-white" value={m.diasInstalacion} onChange={(e) => update("diasInstalacion", Number(e.target.value))} min={0} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20 text-right">tarifa/día</span>
                    <Input type="number" className="w-20 bg-white" value={m.tarifaDiasInstalacion} onChange={(e) => update("tarifaDiasInstalacion", Number(e.target.value))} min={0} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Label className="text-sm font-normal">Ajuste fino (puertas/cajones)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20 text-right">tarifa c/u</span>
                    <Input type="number" className="w-20 bg-white" value={m.tarifaAjusteFino} onChange={(e) => update("tarifaAjusteFino", Number(e.target.value))} min={0} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
