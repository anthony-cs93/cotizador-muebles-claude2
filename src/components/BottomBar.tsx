import { useProject } from "@/lib/store";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Input } from "@/components/ui/input";

export function BottomBar() {
  const { state, dispatch, costs } = useProject();

  const costoPorM2 = costs.areaTotal > 0 ? costs.costoTotalEst / costs.areaTotal : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 text-sm">
        
        <div className="flex gap-6 flex-wrap">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Costo por m²</span>
            <span className="font-medium">{formatCurrency(costoPorM2)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Costo materiales</span>
            <span className="font-medium">{formatCurrency(costs.costoMateriales)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Costo mano de obra</span>
            <span className="font-medium">{formatCurrency(costs.costoManoObra)}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium">Margen %</span>
            <Input
              type="number"
              className="w-20 h-8 text-right bg-gray-50 border-gray-200"
              value={state.margen}
              onChange={(e) => dispatch({ type: "UPDATE_MARGEN", payload: Number(e.target.value) || 0 })}
              min={0}
            />
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground text-xs font-bold">Precio de venta sugerido</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(costs.precioVenta)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
