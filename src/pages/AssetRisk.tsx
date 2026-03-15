import { useState } from "react";
import { useGRC } from "@/contexts/GRCContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RiskLevelBadge, RiskStatusBadge } from "@/components/StatusBadge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import type { Risk, RiskLikelihood, RiskImpact } from "@/data/mockData";

function RiskForm({ risk, assets, onSave, onClose }: {
  risk?: Risk;
  assets: { id: string; name: string }[];
  onSave: (data: Omit<Risk, "id" | "level">) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(risk?.title || "");
  const [description, setDescription] = useState(risk?.description || "");
  const [assetId, setAssetId] = useState(risk?.assetId || assets[0]?.id || "");
  const [likelihood, setLikelihood] = useState<RiskLikelihood>(risk?.likelihood || 3);
  const [impact, setImpact] = useState<RiskImpact>(risk?.impact || 3);
  const [owner, setOwner] = useState(risk?.owner || "");
  const [mitigation, setMitigation] = useState(risk?.mitigation || "");
  const [status, setStatus] = useState<Risk["status"]>(risk?.status || "Open");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAsset = assets.find(a => a.id === assetId);
    onSave({ title, description, assetId, assetName: selectedAsset?.name || "", likelihood, impact, owner, mitigation, status });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} required /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} required /></div>
      <div className="space-y-2">
        <Label>Asset</Label>
        <Select value={assetId} onValueChange={setAssetId}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{assets.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Likelihood (1-5)</Label>
          <Select value={String(likelihood)} onValueChange={v => setLikelihood(Number(v) as RiskLikelihood)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Impact (1-5)</Label>
          <Select value={String(impact)} onValueChange={v => setImpact(Number(v) as RiskImpact)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2"><Label>Risk Owner</Label><Input value={owner} onChange={e => setOwner(e.target.value)} required /></div>
      <div className="space-y-2"><Label>Mitigation</Label><Textarea value={mitigation} onChange={e => setMitigation(e.target.value)} /></div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={v => setStatus(v as Risk["status"])}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Mitigated">Mitigated</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
        <Button type="submit">{risk ? "Update" : "Add"} Risk</Button>
      </DialogFooter>
    </form>
  );
}

export default function AssetRisk() {
  const { assets, risks, addRisk, updateRisk, deleteRisk } = useGRC();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editRisk, setEditRisk] = useState<Risk | null>(null);

  const filtered = risks.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.assetName.toLowerCase().includes(search.toLowerCase()) ||
    r.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Asset Risk Register</h1>
          <p className="text-muted-foreground text-sm mt-1">Risks mapped to organizational assets</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Risk</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add New Risk</DialogTitle></DialogHeader>
            <RiskForm assets={assets} onSave={addRisk} onClose={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search risks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>L × I</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(risk => (
                <TableRow key={risk.id}>
                  <TableCell>
                    <p className="text-sm font-medium text-foreground">{risk.title}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[250px]">{risk.description}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{risk.assetName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{risk.owner}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{risk.likelihood} × {risk.impact}</TableCell>
                  <TableCell><RiskLevelBadge level={risk.level} /></TableCell>
                  <TableCell><RiskStatusBadge status={risk.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditRisk(risk)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                          <DialogHeader><DialogTitle>Edit Risk</DialogTitle></DialogHeader>
                          {editRisk && <RiskForm risk={editRisk} assets={assets} onSave={(data) => updateRisk(risk.id, data)} onClose={() => setEditRisk(null)} />}
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteRisk(risk.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
