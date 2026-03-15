import { useGRC } from "@/contexts/GRCContext";
import { StatusBadge } from "@/components/StatusBadge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, XCircle, Clock } from "lucide-react";
import type { ControlStatus } from "@/data/cisControls";

export default function Framework() {
  const { controls, updateControlStatus, getCompliancePercentage } = useGRC();
  const compliance = getCompliancePercentage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CIS Controls v8 Framework</h1>
          <p className="text-muted-foreground text-sm mt-1">18 controls · {controls.flatMap(c => c.safeguards).length} safeguards</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{compliance}% Compliant</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: CheckCircle, label: "Compliant", count: controls.flatMap(c => c.safeguards).filter(s => s.status === "compliant").length, cls: "text-success" },
          { icon: Clock, label: "In Progress", count: controls.flatMap(c => c.safeguards).filter(s => s.status === "in-progress").length, cls: "text-warning" },
          { icon: XCircle, label: "Non-Compliant", count: controls.flatMap(c => c.safeguards).filter(s => s.status === "non-compliant").length, cls: "text-destructive" },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <item.icon className={`h-5 w-5 ${item.cls}`} />
              <div>
                <p className="text-xl font-bold text-foreground">{item.count}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Controls & Safeguards</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Accordion type="multiple" className="divide-y divide-border">
            {controls.map(control => {
              const compliant = control.safeguards.filter(s => s.status === "compliant").length;
              return (
                <AccordionItem key={control.id} value={`control-${control.id}`} className="border-0">
                  <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline">
                    <div className="flex items-center gap-4 text-left flex-1">
                      <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                        CIS {control.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{control.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{compliant}/{control.safeguards.length} safeguards compliant</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-3 ml-12">
                      {control.safeguards.map(safeguard => (
                        <div key={safeguard.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                          <div className="flex-1 min-w-0 mr-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-muted-foreground">{safeguard.id}</span>
                              <p className="text-sm text-foreground">{safeguard.title}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{safeguard.description}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <StatusBadge status={safeguard.status} />
                            <Select
                              value={safeguard.status}
                              onValueChange={(val) => updateControlStatus(safeguard.id, val as ControlStatus)}
                            >
                              <SelectTrigger className="w-[140px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="compliant">Compliant</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
