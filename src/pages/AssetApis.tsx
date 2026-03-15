import { useMemo, useState } from "react";
import { useGRC } from "@/contexts/GRCContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, Server, Database, RefreshCw, PlusCircle, Link2, CheckCircle2, Network, Cloud, FolderTree } from "lucide-react";
import type { AssetCategory } from "@/data/mockData";

type IntegrationCategory = "vulnerability-management" | "asset-scanner" | "ldap-directory" | "cmdb-mdm";

interface IntegrationTool {
    id: string;
    name: string;
    category: IntegrationCategory;
    vendor: string;
    connected: boolean;
}

interface DiscoveredAsset {
    externalId: string;
    name: string;
    description: string;
    owner: string;
    category: AssetCategory;
    sourceTool: string;
}

const categoryLabels: Record<IntegrationCategory, string> = {
    "vulnerability-management": "Vulnerability Management",
    "asset-scanner": "Asset Scanner",
    "ldap-directory": "LDAP / Directory",
    "cmdb-mdm": "CMDB / MDM",
};

const categoryIcons = {
    "vulnerability-management": ShieldAlert,
    "asset-scanner": Server,
    "ldap-directory": Network,
    "cmdb-mdm": Cloud,
} as const;

const initialIntegrations: IntegrationTool[] = [
    { id: "tenable", name: "Tenable", vendor: "Tenable", category: "vulnerability-management", connected: false },
    { id: "qualys", name: "Qualys VMDR", vendor: "Qualys", category: "vulnerability-management", connected: false },
    { id: "rapid7", name: "Rapid7 InsightVM", vendor: "Rapid7", category: "vulnerability-management", connected: false },

    { id: "crowdstrike", name: "CrowdStrike Falcon Discover", vendor: "CrowdStrike", category: "asset-scanner", connected: false },
    { id: "lansweeper", name: "Lansweeper", vendor: "Lansweeper", category: "asset-scanner", connected: false },
    { id: "nmap", name: "Nmap Enterprise", vendor: "Nmap", category: "asset-scanner", connected: false },

    { id: "ad-ldap", name: "Active Directory LDAP", vendor: "Microsoft", category: "ldap-directory", connected: false },
    { id: "openldap", name: "OpenLDAP", vendor: "OpenLDAP", category: "ldap-directory", connected: false },
    { id: "jumpcloud", name: "JumpCloud Directory", vendor: "JumpCloud", category: "ldap-directory", connected: false },

    { id: "servicenow", name: "ServiceNow CMDB", vendor: "ServiceNow", category: "cmdb-mdm", connected: false },
    { id: "intune", name: "Microsoft Intune", vendor: "Microsoft", category: "cmdb-mdm", connected: false },
    { id: "jamf", name: "Jamf Pro", vendor: "Jamf", category: "cmdb-mdm", connected: false },
];

const mockDiscoveryByTool: Record<string, DiscoveredAsset[]> = {
    tenable: [
        {
            externalId: "tnb-001",
            name: "DMZ Reverse Proxy",
            description: "Internet-facing reverse proxy discovered from Tenable exposure scan.",
            owner: "IT Operations",
            category: "Hardware",
            sourceTool: "Tenable",
        },
    ],
    qualys: [
        {
            externalId: "qls-221",
            name: "HR Payroll Database",
            description: "Database host discovered via Qualys inventory sync.",
            owner: "HR Technology",
            category: "Data",
            sourceTool: "Qualys VMDR",
        },
    ],
    rapid7: [
        {
            externalId: "rp7-779",
            name: "Legacy Billing API",
            description: "Rapid7 InsightVM discovered exposed API workload.",
            owner: "Platform Engineering",
            category: "Software",
            sourceTool: "Rapid7 InsightVM",
        },
    ],
    crowdstrike: [
        {
            externalId: "crw-044",
            name: "Engineering Linux Workstation",
            description: "Endpoint inventory from CrowdStrike discovery agent.",
            owner: "Engineering",
            category: "Hardware",
            sourceTool: "CrowdStrike Falcon Discover",
        },
    ],
    lansweeper: [
        {
            externalId: "lsw-310",
            name: "Warehouse Barcode Scanner",
            description: "Network-discovered endpoint from Lansweeper asset scan.",
            owner: "Operations",
            category: "Hardware",
            sourceTool: "Lansweeper",
        },
    ],
    nmap: [
        {
            externalId: "nmap-081",
            name: "Public VPN Gateway",
            description: "Nmap-discovered host with open VPN ports.",
            owner: "Network Team",
            category: "Hardware",
            sourceTool: "Nmap Enterprise",
        },
    ],
    "ad-ldap": [
        {
            externalId: "ad-123",
            name: "CORP-LT-0092",
            description: "Corporate laptop record synchronized from Active Directory.",
            owner: "Workplace IT",
            category: "Hardware",
            sourceTool: "Active Directory LDAP",
        },
    ],
    openldap: [
        {
            externalId: "oldap-71",
            name: "DevOps Bastion User Directory",
            description: "Directory-backed infrastructure record imported from OpenLDAP.",
            owner: "DevOps",
            category: "Software",
            sourceTool: "OpenLDAP",
        },
    ],
    jumpcloud: [
        {
            externalId: "jc-55",
            name: "Remote Sales MacBook",
            description: "Managed endpoint discovered through JumpCloud device directory.",
            owner: "Sales IT",
            category: "Hardware",
            sourceTool: "JumpCloud Directory",
        },
    ],
    servicenow: [
        {
            externalId: "sn-889",
            name: "Core Payment Service",
            description: "Configuration item imported from ServiceNow CMDB.",
            owner: "Payments Team",
            category: "Software",
            sourceTool: "ServiceNow CMDB",
        },
    ],
    intune: [
        {
            externalId: "int-204",
            name: "Executive iPhone Fleet",
            description: "Managed mobile asset imported from Microsoft Intune.",
            owner: "IT Operations",
            category: "Hardware",
            sourceTool: "Microsoft Intune",
        },
    ],
    jamf: [
        {
            externalId: "jamf-12",
            name: "Design Team Mac Studio",
            description: "Apple device inventory synchronized from Jamf Pro.",
            owner: "Creative Ops",
            category: "Hardware",
            sourceTool: "Jamf Pro",
        },
    ],
};

export default function AssetApis() {
    const { assets, addAsset } = useGRC();
    const [integrations, setIntegrations] = useState<IntegrationTool[]>(initialIntegrations);
    const [activeCategory, setActiveCategory] = useState<IntegrationCategory>("vulnerability-management");
    const [syncing, setSyncing] = useState(false);
    const [discoveredAssets, setDiscoveredAssets] = useState<DiscoveredAsset[]>([]);
    const [importMessage, setImportMessage] = useState("No sync yet.");

    const connectedTools = integrations.filter((tool) => tool.connected);
    const existingAssetNames = useMemo(
        () => new Set(assets.map((asset) => asset.name.trim().toLowerCase())),
        [assets]
    );

    const groupedIntegrations = useMemo(() => {
        return integrations.reduce<Record<IntegrationCategory, IntegrationTool[]>>(
            (acc, tool) => {
                acc[tool.category].push(tool);
                return acc;
            },
            {
                "vulnerability-management": [],
                "asset-scanner": [],
                "ldap-directory": [],
                "cmdb-mdm": [],
            }
        );
    }, [integrations]);

    const toggleConnection = (id: string) => {
        setIntegrations((prev) =>
            prev.map((tool) =>
                tool.id === id
                    ? {
                        ...tool,
                        connected: !tool.connected,
                    }
                    : tool
            )
        );
    };

    const syncFromApis = async () => {
        setSyncing(true);
        setImportMessage("Sync in progress...");

        await new Promise((resolve) => setTimeout(resolve, 700));

        const merged = connectedTools.flatMap((tool) => mockDiscoveryByTool[tool.id] ?? []);
        setDiscoveredAssets(merged);
        setImportMessage(
            connectedTools.length === 0
                ? "No connected integrations. Connect at least one tool."
                : `Synced ${merged.length} discovered asset(s) from ${connectedTools.length} integration(s).`
        );
        setSyncing(false);
    };

    const importOne = (item: DiscoveredAsset) => {
        const normalized = item.name.trim().toLowerCase();
        if (existingAssetNames.has(normalized)) {
            setImportMessage(`Skipped "${item.name}" (already exists).`);
            return;
        }

        addAsset({
            name: item.name,
            category: item.category,
            description: item.description,
            owner: item.owner,
            status: "Active",
        });

        setImportMessage(`Imported "${item.name}" from ${item.sourceTool}.`);
    };

    const importAll = () => {
        let imported = 0;
        let skipped = 0;
        const seen = new Set(existingAssetNames);

        for (const item of discoveredAssets) {
            const normalized = item.name.trim().toLowerCase();
            if (seen.has(normalized)) {
                skipped += 1;
                continue;
            }

            addAsset({
                name: item.name,
                category: item.category,
                description: item.description,
                owner: item.owner,
                status: "Active",
            });
            seen.add(normalized);
            imported += 1;
        }

        setImportMessage(`Import completed. Added ${imported} asset(s), skipped ${skipped} duplicate(s).`);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Asset APIs</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    APIs are grouped by category so you can manage vulnerability, scanner, LDAP, and CMDB integrations separately.
                </p>
            </div>

            <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as IntegrationCategory)}>
                <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg bg-muted/60 p-1">
                    {(Object.keys(categoryLabels) as IntegrationCategory[]).map((category) => (
                        <TabsTrigger key={category} value={category} className="gap-2">
                            {categoryLabels[category]}
                            <Badge variant="outline" className="ml-1">
                                {groupedIntegrations[category].length}
                            </Badge>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {(Object.keys(categoryLabels) as IntegrationCategory[]).map((category) => {
                    const CategoryIcon = categoryIcons[category];

                    return (
                        <TabsContent key={category} value={category}>
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <CategoryIcon className="h-4 w-4 text-primary" />
                                        {categoryLabels[category]}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        {groupedIntegrations[category].map((tool) => (
                                            <Card key={tool.id} className={tool.connected ? "border-primary/40" : "border-border"}>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base flex items-center justify-between gap-3">
                                                        <span className="flex items-center gap-2">
                                                            <FolderTree className="h-4 w-4 text-muted-foreground" />
                                                            {tool.name}
                                                        </span>
                                                        <Badge variant={tool.connected ? "default" : "outline"}>
                                                            {tool.connected ? "Connected" : "Disconnected"}
                                                        </Badge>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-2 flex items-center justify-between gap-3">
                                                    <div className="text-xs text-muted-foreground">
                                                        <p>Vendor: {tool.vendor}</p>
                                                        <p>Category: {categoryLabels[tool.category]}</p>
                                                    </div>
                                                    <Button variant={tool.connected ? "outline" : "default"} size="sm" onClick={() => toggleConnection(tool.id)}>
                                                        <Link2 className="h-4 w-4" />
                                                        {tool.connected ? "Disconnect" : "Connect"}
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    );
                })}
            </Tabs>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between gap-3">
                        <span>Sync and Import</span>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={syncFromApis} disabled={syncing}>
                                <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                                Sync APIs
                            </Button>
                            <Button onClick={importAll} disabled={discoveredAssets.length === 0}>
                                <PlusCircle className="h-4 w-4" />
                                Import All to Assets
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground flex items-center justify-between gap-3">
                        <span>{importMessage}</span>
                        <Badge variant="secondary">Connected tools: {connectedTools.length}</Badge>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Source Tool</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {discoveredAssets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        No discovered assets yet. Connect tools and click Sync APIs.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                discoveredAssets.map((item) => {
                                    const isDuplicate = existingAssetNames.has(item.name.trim().toLowerCase());
                                    return (
                                        <TableRow key={item.externalId}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                                            <TableCell>{item.owner}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Database className="h-4 w-4 text-muted-foreground" />
                                                    {item.sourceTool}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant={isDuplicate ? "outline" : "default"}
                                                    disabled={isDuplicate}
                                                    onClick={() => importOne(item)}
                                                >
                                                    {isDuplicate ? (
                                                        <>
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            Exists
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PlusCircle className="h-4 w-4" />
                                                            Add Asset
                                                        </>
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
