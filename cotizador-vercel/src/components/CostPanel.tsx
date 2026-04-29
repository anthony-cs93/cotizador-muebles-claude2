import { useProject } from "@/lib/store";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function CostPanel() {
  const { state, dispatch, costs } = useProject();

  return (
    <Card className="rounded-none border-0 sm:border sm:rounded-xl shadow-none sm:shadow-sm bg-white h-full overflow-y-auto">
      <CardHeader className="pb-3 border-b bg-gray-50/50 sticky top-0 z-10">
        <CardTitle className="text-lg font-semibold text-primary">Resumen de costos</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        
        {/* Materiales */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Materiales</h3>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Tableros ({formatNumber(costs.areaTotal, 2)} m²)</span>
            <span className="font-medium">{formatCurrency(costs.costoTableros)}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Corte y cantos</span>
            <span className="font-medium">{formatCurrency(costs.costoCantos)}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Accesorios y Herrajes</span>
            <span className="font-medium">{formatCurrency(costs.costoHerrajes)}</span>
          </div>

          {state.medidas.rh && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Recargo RH ({state.medidas.color === "Diseño" ? "20%" : "55%"})
              </span>
              <span className="font-medium">{formatCurrency(costs.costoRH)}</span>
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Mano de obra */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mano de obra</h3>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Armado e Instalación</span>
            <span className="font-medium">{formatCurrency(costs.costoManoObra)}</span>
          </div>
        </div>
        
        <Separator />
        
        {/* Costos adicionales */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Costos adicionales</h3>
          
          <div className="flex justify-between items-center text-sm gap-4">
            <Label className="text-gray-600 font-normal whitespace-nowrap">Transporte (S/)</Label>
            <Input 
              type="number" 
              className="w-24 h-8 text-right"
              value={state.adicionales.transporte}
              onChange={(e) => dispatch({ 
                type: "UPDATE_ADICIONALES", 
                payload: { transporte: Number(e.target.value) || 0 } 
              })}
              min={0}
            />
          </div>

          {costs.costoLED > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Iluminación LED ({state.adicionales.metrosLED} m)
              </span>
              <span className="font-medium">{formatCurrency(costs.costoLED)}</span>
            </div>
          )}

          {costs.costoAccesorios > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Accesorios</span>
              <span className="font-medium">{formatCurrency(costs.costoAccesorios)}</span>
            </div>
          )}

          {costs.costoUrgencia > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Recargo urgencia (+20%)</span>
              <span className="font-medium">{formatCurrency(costs.costoUrgencia)}</span>
            </div>
          )}

          {costs.costoAltura > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Trabajo en altura</span>
              <span className="font-medium">{formatCurrency(costs.costoAltura)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-gray-600 font-normal">Imprevistos %</Label>
              <Input 
                type="number" 
                className="w-16 h-8 text-right"
                value={state.adicionales.porcentajeImprevistos}
                onChange={(e) => dispatch({ 
                  type: "UPDATE_ADICIONALES", 
                  payload: { porcentajeImprevistos: Number(e.target.value) || 0 } 
                })}
                min={0}
              />
            </div>
            <span className="font-medium text-gray-500">{formatCurrency(costs.costoImprevistos)}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mt-6 border border-gray-100">
          <div className="flex justify-between items-end mb-2">
            <span className="text-gray-900 font-semibold">Total estimado</span>
            <span className="text-2xl font-bold text-green-600">{formatCurrency(costs.costoTotalEst)}</span>
          </div>
        </div>
        
        <div className="space-y-1.5 pt-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Área total:</span>
            <span className="font-medium text-gray-700">{formatNumber(costs.areaTotal, 2)} m²</span>
          </div>
          <div className="flex justify-between">
            <span>Peso estimado:</span>
            <span className="font-medium text-gray-700">{formatNumber(costs.pesoEstimado, 1)} kg</span>
          </div>
          <div className="flex justify-between">
            <span>Tiempo estimado:</span>
            <span className="font-medium text-gray-700">{costs.diasEstimados} {costs.diasEstimados === 1 ? 'día' : 'días'}</span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
