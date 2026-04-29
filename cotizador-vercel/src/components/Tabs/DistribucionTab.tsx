import { useProject, createNewModule } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit2, Plus } from "lucide-react";

export function DistribucionTab() {
  const { state, dispatch, selectedModuleId, setSelectedModuleId, setActiveTab } = useProject();

  const handleEdit = (id: string) => {
    setSelectedModuleId(id);
    setActiveTab("opciones");
  };

  const handleAdd = () => {
    const newMod = createNewModule();
    newMod.tipo = state.medidas.tipoMobiliario;
    dispatch({ type: "ADD_MODULE", payload: newMod });
    setSelectedModuleId(newMod.id);
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    dispatch({ type: "UPDATE_MODULE", payload: { id, module: { [field]: value } } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary">Lista de Módulos</h2>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Agregar módulo
        </Button>
      </div>

      {state.modulos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border border-dashed rounded-xl">
          <p className="text-muted-foreground mb-4">Aún no has agregado módulos.</p>
          <Button onClick={handleAdd} variant="outline" className="gap-2 bg-white">
            <Plus className="w-4 h-4" /> Empezar a agregar
          </Button>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[150px]">Tipo</TableHead>
                <TableHead>Ancho (mm)</TableHead>
                <TableHead>Alto (mm)</TableHead>
                <TableHead>Cant.</TableHead>
                <TableHead className="w-[200px]">Detalle</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.modulos.map((m) => (
                <TableRow 
                  key={m.id} 
                  className={selectedModuleId === m.id ? "bg-blue-50/50" : ""}
                >
                  <TableCell>
                    <Select value={m.tipo} onValueChange={(v) => handleUpdate(m.id, "tipo", v)}>
                      <SelectTrigger className="h-8 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Módulo">Módulo</SelectItem>
                        <SelectItem value="Superficie">Superficie</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      className="h-8 w-20" 
                      value={m.ancho} 
                      onChange={(e) => handleUpdate(m.id, "ancho", Number(e.target.value))}
                      min={0}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      className="h-8 w-20" 
                      value={m.alto} 
                      onChange={(e) => handleUpdate(m.id, "alto", Number(e.target.value))}
                      min={0}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      className="h-8 w-16" 
                      value={m.cantidad} 
                      onChange={(e) => handleUpdate(m.id, "cantidad", Number(e.target.value))}
                      min={1}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      className="h-8" 
                      value={m.detalle} 
                      onChange={(e) => handleUpdate(m.id, "detalle", e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant={selectedModuleId === m.id ? "default" : "ghost"} 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleEdit(m.id)}
                        title="Editar opciones"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => dispatch({ type: "REMOVE_MODULE", payload: m.id })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
