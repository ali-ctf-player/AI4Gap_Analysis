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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Server, Monitor, Database } from "lucide-react";
import type { Asset, AssetCategory } from "@/data/mockData";

const categoryIcons: Record<AssetCategory, typeof Server> = {
    Hardware: Monitor,
    Software: Server,
    Data: Database,
};

function AssetForm({ asset, onSave, onClose }: { asset?: Asset; onSave: (data: Omit<Asset, "id" | "lastUpdated">) => void; onClose: () => void }) {
    const [name, setName] = useState(asset?.name || "");
    const [category, setCategory] = useState<AssetCategory>(asset?.category || "Hardware");
    const [description, setDescription] = useState(asset?.description || "");
    const [owner, setOwner] = useState(asset?.owner || "");
    const [status, setStatus] = useState<Asset["status"]>(asset?.status || "Active");
    const [impact, setImpact] = useState<"1" | "2" | "3" | "4" | "5">("3");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Impact is captured for upcoming risk-scoring logic; currently it has no behavioral effect.
        void impact;
        onSave({ name, category, description, owner, status });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={v => setCategory(v as AssetCategory)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Data">Data</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label>Owner</Label>
                <Input value={owner} onChange={e => setOwner(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={v => setStatus(v as Asset["status"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Impact (1-5)</Label>
                <Select value={impact} onValueChange={v => setImpact(v as "1" | "2" | "3" | "4" | "5")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">{asset ? "Update" : "Add"} Asset</Button>
            </DialogFooter>
        </form>
    );
}

export default function Assets() {
    const { assets, addAsset, updateAsset, deleteAsset } = useGRC();
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [editAsset, setEditAsset] = useState<Asset | null>(null);
    const [addOpen, setAddOpen] = useState(false);

    const filtered = assets.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
        const matchesCat = categoryFilter === "all" || a.category === categoryFilter;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Asset Management</h1>
                    <p className="text-muted-foreground text-sm mt-1">{assets.length} assets tracked</p>
                </div>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" />Add Asset</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add New Asset</DialogTitle></DialogHeader>
                        <AssetForm onSave={addAsset} onClose={() => setAddOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search assets..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Hardware">Hardware</SelectItem>
                                <SelectItem value="Software">Software</SelectItem>
                                <SelectItem value="Data">Data</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(asset => {
                                const Icon = categoryIcons[asset.category];
                                return (
                                    <TableRow key={asset.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-muted">
                                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-foreground">{asset.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate max-w-[300px]">{asset.description}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><Badge variant="secondary" className="text-xs">{asset.category}</Badge></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{asset.owner}</TableCell>
                                        <TableCell>
                                            <Badge variant={asset.status === "Active" ? "default" : "secondary"} className={asset.status === "Active" ? "bg-success/10 text-success border-success/20" : ""}>
                                                {asset.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{asset.lastUpdated}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditAsset(asset)}>
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader><DialogTitle>Edit Asset</DialogTitle></DialogHeader>
                                                        {editAsset && <AssetForm asset={editAsset} onSave={(data) => updateAsset(asset.id, data)} onClose={() => setEditAsset(null)} />}
                                                    </DialogContent>
                                                </Dialog>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteAsset(asset.id)}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
