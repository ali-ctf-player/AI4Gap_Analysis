import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Minus, Sparkles, Layers, BarChart3, Cloud, LifeBuoy, Plug } from "lucide-react";

const comparisonRows = [
    {
        feature: "Core GRC modules (Dashboard, Framework, Assets, Risks, Compliance)",
        openSource: true,
        enterprise: true,
        note: "All core capabilities stay open-source.",
    },
    {
        feature: "Multi-framework support",
        openSource: false,
        enterprise: true,
        note: "Work with many compliance/control frameworks in one workspace.",
    },
    {
        feature: "SaaS deployment model",
        openSource: false,
        enterprise: true,
        note: "Managed cloud environment with tenant setup.",
    },
    {
        feature: "Extended reporting",
        openSource: false,
        enterprise: true,
        note: "Executive-grade and audit-ready advanced reports.",
    },
    {
        feature: "REST API support",
        openSource: false,
        enterprise: true,
        note: "Integrate GRC data with SIEM, ticketing, and BI tools.",
    },
    {
        feature: "Dedicated support service",
        openSource: false,
        enterprise: true,
        note: "SLA-backed technical support and onboarding.",
    },
];

const enterpriseHighlights = [
    { title: "Framework at Scale", description: "ISO 27001, NIST, SOC 2, PCI-DSS and more in one model.", icon: Layers },
    { title: "SaaS Ready", description: "Fast go-live with managed infrastructure and environment controls.", icon: Cloud },
    { title: "Reporting Depth", description: "Board-level dashboards, trend intelligence, and control narratives.", icon: BarChart3 },
    { title: "Integration Layer", description: "REST API endpoints for asset, risk, and control automation.", icon: Plug },
    { title: "Enterprise Care", description: "Priority support, implementation guidance, and response commitments.", icon: LifeBuoy },
];

function AvailabilityCell({ active }: { active: boolean }) {
    if (active) {
        return (
            <span className="inline-flex items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-700">
                <Check className="h-4 w-4" />
            </span>
        );
    }

    return (
        <span className="inline-flex items-center justify-center rounded-md border border-muted bg-muted/50 px-2 py-1 text-muted-foreground">
            <Minus className="h-4 w-4" />
        </span>
    );
}

export default function Pricing() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Pricing</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Open-source model keeps all core GRC features free. Enterprise adds scale, integrations, and managed services.
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border-emerald-500/30 bg-emerald-500/5">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">
                                Open-source
                            </Badge>
                        </div>
                        <CardTitle className="text-xl">Community Core</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Ideal for teams that want transparent, self-hosted GRC with full core modules included.
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-700" />Core modules included</li>
                            <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-700" />Self-managed deployment</li>
                            <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-700" />Community-driven improvements</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-primary/40 bg-primary/5 relative overflow-hidden">
                    <div className="absolute right-3 top-3">
                        <Badge className="gap-1"><Sparkles className="h-3 w-3" />Enterprise</Badge>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-xl">Enterprise Plus</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Built for organizations that need multi-framework operations, APIs, advanced reports, and support SLAs.
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" />Everything in Open-source</li>
                            <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" />Multi-framework and SaaS model</li>
                            <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" />Extended reports, REST API, and support</li>
                        </ul>
                        <Button className="mt-2">Contact Sales</Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Open-source vs Enterprise Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] border-separate border-spacing-y-2">
                            <thead>
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Capability</th>
                                    <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Open-source</th>
                                    <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Enterprise</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row) => (
                                    <tr key={row.feature} className="rounded-md bg-muted/30">
                                        <td className="px-3 py-3 text-sm font-medium text-foreground">{row.feature}</td>
                                        <td className="px-3 py-3 text-center"><AvailabilityCell active={row.openSource} /></td>
                                        <td className="px-3 py-3 text-center"><AvailabilityCell active={row.enterprise} /></td>
                                        <td className="px-3 py-3 text-sm text-muted-foreground">{row.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Enterprise Add-on Schema</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {enterpriseHighlights.map((item) => (
                            <div key={item.title} className="rounded-md border bg-card p-4">
                                <div className="mb-2 inline-flex rounded-md bg-primary/10 p-2 text-primary">
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
