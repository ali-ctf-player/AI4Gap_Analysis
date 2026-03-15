import { useMemo, useState } from "react";
import { useGRC } from "@/contexts/GRCContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileCode2, PlusCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import type { AssetCategory } from "@/data/mockData";

interface ImportedAsset {
    id: string;
    name: string;
    description: string;
    owner: string;
    category: AssetCategory;
    source: string;
}

function getTextFromFirst(el: Element | null, selector: string): string {
    return el?.querySelector(selector)?.textContent?.trim() ?? "";
}

function parseNmapXML(xmlDoc: Document): ImportedAsset[] {
    const hosts = Array.from(xmlDoc.querySelectorAll("nmaprun > host"));

    return hosts.map((host, index) => {
        const ipv4 = host.querySelector("address[addrtype='ipv4']")?.getAttribute("addr") ?? "";
        const ipv6 = host.querySelector("address[addrtype='ipv6']")?.getAttribute("addr") ?? "";
        const mac = host.querySelector("address[addrtype='mac']")?.getAttribute("addr") ?? "";
        const hostname = host.querySelector("hostnames > hostname")?.getAttribute("name") ?? "";
        const os = host.querySelector("os > osmatch")?.getAttribute("name") ?? "";

        const primaryAddress = ipv4 || ipv6 || mac || `host-${index + 1}`;
        const displayName = hostname || primaryAddress;

        return {
            id: `nmap-${index}-${displayName}`,
            name: displayName,
            description: `Imported from Nmap XML. Address: ${primaryAddress}${os ? `, OS: ${os}` : ""}`,
            owner: "IT Operations",
            category: "Hardware" as AssetCategory,
            source: "Nmap XML",
        };
    });
}

function parseGenericScannerXML(xmlDoc: Document): ImportedAsset[] {
    const reportHosts = Array.from(xmlDoc.querySelectorAll("ReportHost, reportHost, host"));

    return reportHosts.map((node, index) => {
        const attrName = node.getAttribute("name")?.trim() ?? "";
        const dns = getTextFromFirst(node, "tag[name='host-fqdn'], host-fqdn, fqdn");
        const ip = getTextFromFirst(node, "tag[name='host-ip'], host-ip, ip");
        const os = getTextFromFirst(node, "tag[name='operating-system'], operating-system, os");
        const displayName = attrName || dns || ip || `scanner-host-${index + 1}`;
        const sourceName = xmlDoc.documentElement.tagName || "Scanner XML";

        return {
            id: `generic-${index}-${displayName}`,
            name: displayName,
            description: `Imported from ${sourceName}. ${ip ? `IP: ${ip}. ` : ""}${os ? `OS: ${os}.` : ""}`.trim(),
            owner: "Security Team",
            category: "Hardware" as AssetCategory,
            source: sourceName,
        };
    });
}

function parseXMLToAssets(xmlText: string): ImportedAsset[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const parseError = xmlDoc.querySelector("parsererror");
    if (parseError) {
        throw new Error("Invalid XML format. Please upload a valid scanner XML file.");
    }

    if (xmlDoc.querySelector("nmaprun")) {
        return parseNmapXML(xmlDoc);
    }

    return parseGenericScannerXML(xmlDoc);
}

export default function AssetImport() {
    const { assets, addAsset } = useGRC();
    const [fileName, setFileName] = useState("");
    const [importedRows, setImportedRows] = useState<ImportedAsset[]>([]);
    const [statusMessage, setStatusMessage] = useState("Upload XML file from scanner tools (e.g., Nmap). ");
    const [errorMessage, setErrorMessage] = useState("");

    const existingNames = useMemo(
        () => new Set(assets.map((asset) => asset.name.trim().toLowerCase())),
        [assets]
    );

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setErrorMessage("");
        setFileName(file.name);

        try {
            const xml = await file.text();
            const parsed = parseXMLToAssets(xml);
            setImportedRows(parsed);
            setStatusMessage(`Parsed ${parsed.length} asset(s) from ${file.name}.`);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to parse XML file.";
            setImportedRows([]);
            setErrorMessage(message);
            setStatusMessage("Upload failed.");
        }
    };

    const addSingleAsset = (item: ImportedAsset) => {
        const normalized = item.name.trim().toLowerCase();
        if (existingNames.has(normalized)) {
            setStatusMessage(`Skipped "${item.name}" because it already exists.`);
            return;
        }

        addAsset({
            name: item.name,
            category: item.category,
            description: item.description,
            owner: item.owner,
            status: "Active",
        });
        setStatusMessage(`Added "${item.name}" to assets.`);
    };

    const addAllAssets = () => {
        let added = 0;
        let skipped = 0;
        const seen = new Set(existingNames);

        for (const item of importedRows) {
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
            added += 1;
        }

        setStatusMessage(`Import finished. Added ${added}, skipped ${skipped} duplicate(s).`);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Asset Import</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    API support olmayan şirkətlər üçün scanner XML fayllarını (məs: Nmap) upload edib asset-ləri birbaşa əlavə edin.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Upload className="h-4 w-4 text-primary" />
                        XML Upload
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex">
                            <input
                                type="file"
                                accept=".xml,text/xml,application/xml"
                                className="hidden"
                                onChange={onFileChange}
                            />
                            <span className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground cursor-pointer hover:bg-primary/90">
                                <FileCode2 className="h-4 w-4" />
                                Select XML File
                            </span>
                        </label>

                        <Button variant="outline" disabled={importedRows.length === 0} onClick={addAllAssets}>
                            <PlusCircle className="h-4 w-4" />
                            Add All to Assets
                        </Button>

                        {fileName ? <Badge variant="secondary">{fileName}</Badge> : null}
                    </div>

                    <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">{statusMessage}</div>

                    {errorMessage ? (
                        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            {errorMessage}
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Discovered Assets Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {importedRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No assets parsed yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                importedRows.map((item) => {
                                    const exists = existingNames.has(item.name.trim().toLowerCase());
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <p className="font-medium text-sm text-foreground">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.description}</p>
                                            </TableCell>
                                            <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                                            <TableCell>{item.owner}</TableCell>
                                            <TableCell>{item.source}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant={exists ? "outline" : "default"}
                                                    disabled={exists}
                                                    onClick={() => addSingleAsset(item)}
                                                >
                                                    {exists ? (
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
