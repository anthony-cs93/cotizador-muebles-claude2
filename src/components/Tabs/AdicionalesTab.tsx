import { useProject } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CONSTANTS } from "@/lib/calculations";
import { formatCurrency } from "@/lib/formatters";
import { AccesorioCounter, MaterialAccesorio } from "@/lib/types";
import { Minus, Plus } from "lucide-react";

type AccesorioKey = "canastillas" | "condimentero" | "escurridor";

const ACCESORIOS: { key: AccesorioKey; label: string }[] = [
  { key: "canastillas", label: "Canastillas" },
  { key: "condimentero", label: "Condimentero" },
  { key: "escurridor", label: "Escurridor de plato" }
];

export function AdicionalesTab() {
  const { state, dispatch, costs } = useProject();
  const ad = state.adicionales;

  const update = (payload: Partial<typeof ad>) => {
    dispatch({ type: "UPDATE_ADICIONALES", payload });
  };

  const updateAccesorio = (key: AccesorioKey, patch: Partial<AccesorioCounter>) => {
    update({ [key]: { ...ad[key], ...patch } } as Partial<typeof ad>);
  };

  const changeCantidad = (key: AccesorioKey, delta: number) => {
    const next = Math.max(0, ad[key].cantidad + delta);
    updateAccesorio(key, { cantidad: next });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-primary mb-1">Adicionales</h2>
        <p className="text-sm text-muted-foreground">
          Costos extra que se suman al total del proyecto.
        </p>
      </div>

      {/* Iluminación LED */}
      <div className="space-y-4 bg-white p-6 rounded-xl border border-border shadow-sm">
        <h3 className="font-semibold text-gray-900 border-b pb-2">Iluminación LED</h3>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <Label className="text-base font-normal">Metraje lineal</Label>
            <p className="text-xs text-muted-foreground">
              S/ {CONSTANTS.PRECIO_LED_ML} por metro lineal
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
            <Input
              type="number"
              className="w-24 bg-white text-right"
              value={ad.metrosLED}
              onChange={(e) => update({ metrosLED: Math.max(0, Number(e.target.value) || 0) })}
              min={0}
              step={0.1}
            />
            <span className="text-sm text-muted-foreground">m</span>
          </div>
        </div>

        {ad.metrosLED > 0 && (
          <div className="text-sm text-right text-gray-700">
            Subtotal LED:{" "}
            <span className="font-medium">{formatCurrency(costs.costoLED)}</span>
          </div>
        )}
      </div>

      {/* Accesorios */}
      <div className="space-y-5 bg-white p-6 rounded-xl border border-border shadow-sm">
        <h3 className="font-semibold text-gray-900 border-b pb-2">Accesorios</h3>

        {ACCESORIOS.map(({ key, label }) => {
          const item = ad[key];
          const precioUnit =
            key === "canastillas"
              ? item.material === "Cromado"
                ? CONSTANTS.CANASTILLA_CROMADO
                : CONSTANTS.CANASTILLA_INOX
              : key === "condimentero"
                ? item.material === "Cromado"
                  ? CONSTANTS.CONDIMENTERO_CROMADO
                  : CONSTANTS.CONDIMENTERO_INOX
                : item.material === "Cromado"
                  ? CONSTANTS.ESCURRIDOR_CROMADO
                  : CONSTANTS.ESCURRIDOR_INOX;

          return (
            <div key={key} className="border rounded-lg p-4 space-y-3 bg-gray-50/40">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <Label className="text-base font-normal">{label}</Label>
                <div className="flex items-center gap-3 bg-white p-1 rounded-lg border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => changeCantidad(key, -1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-6 text-center font-medium">{item.cantidad}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => changeCantidad(key, 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <RadioGroup
                value={item.material}
                onValueChange={(v) =>
                  updateAccesorio(key, { material: v as MaterialAccesorio })
                }
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {(["Cromado", "Acero Inoxidable"] as MaterialAccesorio[]).map((mat) => (
                  <label
                    key={mat}
                    htmlFor={`acc-${key}-${mat}`}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border cursor-pointer bg-white ${
                      item.material === mat
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value={mat} id={`acc-${key}-${mat}`} />
                      <span className="text-sm">{mat}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      S/ {
                        key === "canastillas"
                          ? mat === "Cromado"
                            ? CONSTANTS.CANASTILLA_CROMADO
                            : CONSTANTS.CANASTILLA_INOX
                          : key === "condimentero"
                            ? mat === "Cromado"
                              ? CONSTANTS.CONDIMENTERO_CROMADO
                              : CONSTANTS.CONDIMENTERO_INOX
                            : mat === "Cromado"
                              ? CONSTANTS.ESCURRIDOR_CROMADO
                              : CONSTANTS.ESCURRIDOR_INOX
                      } c/u
                    </span>
                  </label>
                ))}
              </RadioGroup>

              {item.cantidad > 0 && (
                <div className="text-sm text-right text-gray-700">
                  Subtotal:{" "}
                  <span className="font-medium">
                    {formatCurrency(item.cantidad * precioUnit)}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {costs.costoAccesorios > 0 && (
          <div className="text-sm text-right text-gray-700 pt-2 border-t">
            Total accesorios:{" "}
            <span className="font-semibold">{formatCurrency(costs.costoAccesorios)}</span>
          </div>
        )}
      </div>

      {/* Recargos al proyecto */}
      <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-border">
        <h3 className="font-semibold text-gray-900 border-b pb-2 mb-2">
          Recargos al total del proyecto
        </h3>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label className="text-base font-normal">Recargo por urgencia</Label>
            <p className="text-xs text-muted-foreground">
              +{Math.round(CONSTANTS.RECARGO_URGENCIA * 100)}% sobre la sumatoria del proyecto
            </p>
          </div>
          <Switch
            checked={ad.recargoUrgencia}
            onCheckedChange={(v) => update({ recargoUrgencia: v })}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label className="text-base font-normal">Trabajo en altura o zona difícil</Label>
            <p className="text-xs text-muted-foreground">
              +S/ {CONSTANTS.TRABAJO_ALTURA_FIJO} fijo al total del proyecto
            </p>
          </div>
          <Switch
            checked={ad.trabajoAltura}
            onCheckedChange={(v) => update({ trabajoAltura: v })}
          />
        </div>
      </div>
    </div>
  );
}
