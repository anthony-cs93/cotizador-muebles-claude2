import { useState } from "react";
import { ProjectProvider, useProject } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedidasTab } from "@/components/Tabs/MedidasTab";
import { DistribucionTab } from "@/components/Tabs/DistribucionTab";
import { OpcionesTab } from "@/components/Tabs/OpcionesTab";
import { AdicionalesTab } from "@/components/Tabs/AdicionalesTab";
import { ResumenTab } from "@/components/Tabs/ResumenTab";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { CostPanel } from "@/components/CostPanel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

function MainLayout() {
  const { selectedModuleId, activeTab, setActiveTab } = useProject();
  const [isMobileCostPanelOpen, setIsMobileCostPanelOpen] = useState(false);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background pt-14 pb-[140px] sm:pb-24">
      <TopBar />
      <div className="flex-1 flex container mx-auto max-w-7xl relative">
        {/* Left/Main Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full sm:w-[60%] lg:w-[70%]">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full h-full flex flex-col">
            <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden bg-gray-100/50 p-1 border-b rounded-none sm:rounded-lg sticky top-14 z-20">
              <TabsTrigger value="medidas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Medidas</TabsTrigger>
              <TabsTrigger value="distribucion" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Lista de  Módulos</TabsTrigger>
              <TabsTrigger 
                value="opciones" 
                disabled={!selectedModuleId}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Opciones
              </TabsTrigger>
              <TabsTrigger value="adicionales" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Adicionales</TabsTrigger>
              <TabsTrigger value="resumen" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Mano de Obra</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 flex-1 relative">
              <TabsContent value="medidas" className="mt-0 outline-none"><MedidasTab /></TabsContent>
              <TabsContent value="distribucion" className="mt-0 outline-none"><DistribucionTab /></TabsContent>
              <TabsContent value="opciones" className="mt-0 outline-none"><OpcionesTab /></TabsContent>
              <TabsContent value="adicionales" className="mt-0 outline-none"><AdicionalesTab /></TabsContent>
              <TabsContent value="resumen" className="mt-0 outline-none"><ResumenTab /></TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Cost Panel (Desktop) */}
        <div className="hidden sm:block w-[40%] lg:w-[30%] p-6 pl-0 sticky top-14 h-[calc(100vh-140px)]">
          <CostPanel />
        </div>

        {/* Mobile floating button for Cost Panel */}
        <Sheet open={isMobileCostPanelOpen} onOpenChange={setIsMobileCostPanelOpen}>
          <SheetTrigger asChild>
            <Button 
              className="fixed bottom-[150px] right-4 rounded-full shadow-lg sm:hidden z-30 gap-2 h-12 px-6"
              size="lg"
            >
              <FileText className="w-5 h-5" />
              Ver resumen
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] p-0 sm:hidden">
            <CostPanel />
          </SheetContent>
        </Sheet>

      </div>
      <BottomBar />
    </div>
  );
}

export default function Home() {
  return (
    <ProjectProvider>
      <MainLayout />
    </ProjectProvider>
  );
}
