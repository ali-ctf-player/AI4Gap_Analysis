import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Laptop, Terminal, Download, Copy, Check } from "lucide-react";

type AgentOS = "windows" | "macos" | "linux";

interface AgentOption {
    key: AgentOS;
    title: string;
    description: string;
    version: string;
    downloadUrl: string;
    installCommand: string;
}

const agentOptions: AgentOption[] = [
    {
        key: "windows",
        title: "Windows Agent",
        description: "Windows 10/11 and Windows Server environments.",
        version: "v1.0.0",
        downloadUrl: "/downloads/agents/windows/atlas-agent-x64.msi",
        installCommand: "msiexec /i atlas-agent-x64.msi /qn",
    },
    {
        key: "macos",
        title: "macOS Agent",
        description: "macOS Monterey and newer (Intel + Apple Silicon).",
        version: "v1.0.0",
        downloadUrl: "/downloads/agents/macos/atlas-agent.pkg",
        installCommand: "sudo installer -pkg atlas-agent.pkg -target /",
    },
    {
        key: "linux",
        title: "Linux Agent",
        description: "Ubuntu, Debian, RHEL, and compatible Linux distros.",
        version: "v1.0.0",
        downloadUrl: "/downloads/agents/linux/atlas-agent-amd64.deb",
        installCommand: "sudo dpkg -i atlas-agent-amd64.deb",
    },
];

function detectOS(): AgentOS {
    const platform = window.navigator.platform.toLowerCase();
    if (platform.includes("win")) return "windows";
    if (platform.includes("mac")) return "macos";
    return "linux";
}

export default function AssetAgents() {
    const detectedOS = useMemo(() => detectOS(), []);
    const [selectedOS, setSelectedOS] = useState<AgentOS>(detectedOS);
    const [copied, setCopied] = useState(false);

    const selectedAgent = agentOptions.find((item) => item.key === selectedOS) ?? agentOptions[0];

    const onCopy = async () => {
        await navigator.clipboard.writeText(selectedAgent.installCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const iconByOS = {
        windows: Monitor,
        macos: Laptop,
        linux: Terminal,
    } as const;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Asset Agents</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Select your OS and install the matching agent package.
                </p>
            </div>

            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-sm text-muted-foreground">Detected operating system</p>
                        <p className="text-base font-semibold text-foreground capitalize">{detectedOS}</p>
                    </div>
                    <Badge variant="secondary">3 Agent Types Available</Badge>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                {agentOptions.map((item) => {
                    const Icon = iconByOS[item.key];
                    const isSelected = selectedOS === item.key;
                    return (
                        <Card
                            key={item.key}
                            className={isSelected ? "border-primary ring-1 ring-primary/30" : "border-border"}
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-primary" />
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline">{item.version}</Badge>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={isSelected ? "default" : "outline"}
                                        onClick={() => setSelectedOS(item.key)}
                                    >
                                        {isSelected ? "Selected" : "Select"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Install: {selectedAgent.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                        <Button asChild>
                            <a href={selectedAgent.downloadUrl}>
                                <Download className="h-4 w-4" />
                                Download Agent
                            </a>
                        </Button>
                        <Button type="button" variant="outline" onClick={onCopy}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? "Copied" : "Copy Install Command"}
                        </Button>
                    </div>

                    <div className="rounded-md border bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground mb-2">Install command</p>
                        <code className="text-sm text-foreground break-all">{selectedAgent.installCommand}</code>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
