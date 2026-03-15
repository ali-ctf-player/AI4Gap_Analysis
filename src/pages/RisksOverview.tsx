import { useState } from "react";
import { useGRC } from "@/contexts/GRCContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { RiskLevelBadge, RiskStatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import type { Risk } from "@/data/mockData";

const riskColors: Record<string, string> = {
  Critical: "hsl(0, 72%, 45%)",
  High: "hsl(0, 84%, 60%)",
  Medium: "hsl(38, 92%, 50%)",
  Low: "hsl(142, 71%, 45%)",
};

export default function RisksOverview() {
  const { risks } = useGRC();
  const [selectedCellKey, setSelectedCellKey] = useState<string | null>(null);
  const impactScale = [1, 2, 3, 4, 5];
  const likelihoodScale = [5, 4, 3, 2, 1];

  const heatMapData = risks.map(r => ({
    x: r.impact,
    y: r.likelihood,
    name: r.title,
    assetName: r.assetName,
    owner: r.owner,
    status: r.status,
    score: r.impact * r.likelihood,
    level: r.level,
  }));

  const getLevelWeight = (level: Risk["level"]) => {
    if (level === "Critical") return 4;
    if (level === "High") return 3;
    if (level === "Medium") return 2;
    return 1;
  };

  const matrixData = (() => {
    const matrix = new Map<string, { count: number; risks: Risk[] }>();

    // Pre-create all 25 cells so table is always complete and deterministic.
    for (const likelihood of likelihoodScale) {
      for (const impact of impactScale) {
        matrix.set(`${likelihood}-${impact}`, { count: 0, risks: [] });
      }
    }

    for (const risk of risks) {
      // Guard against any unexpected data outside 1..5.
      if (risk.likelihood < 1 || risk.likelihood > 5 || risk.impact < 1 || risk.impact > 5) {
        continue;
      }

      const key = `${risk.likelihood}-${risk.impact}`;
      const cell = matrix.get(key);
      if (!cell) continue;

      cell.risks.push(risk);
      cell.count += 1;
    }

    // Show highest severity risks first inside each cell.
    for (const cell of matrix.values()) {
      cell.risks.sort((a, b) => getLevelWeight(b.level) - getLevelWeight(a.level));
    }

    return matrix;
  })();

  const matrixTotal = Array.from(matrixData.values()).reduce((sum, cell) => sum + cell.count, 0);
  const matrixHasMismatch = matrixTotal !== risks.length;

  const riskSummary = [
    { label: "Critical", count: risks.filter(r => r.level === "Critical").length },
    { label: "High", count: risks.filter(r => r.level === "High").length },
    { label: "Medium", count: risks.filter(r => r.level === "Medium").length },
    { label: "Low", count: risks.filter(r => r.level === "Low").length },
  ];

  const getMatrixCellClass = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    if (score >= 16) return "bg-destructive/15 border-destructive/30";
    if (score >= 9) return "bg-orange-500/15 border-orange-500/30";
    if (score >= 4) return "bg-warning/15 border-warning/30";
    return "bg-success/15 border-success/30";
  };

  const getScoreBand = (score: number) => {
    if (score >= 16) return "Critical";
    if (score >= 9) return "High";
    if (score >= 4) return "Medium";
    return "Low";
  };

  const getPointRadius = (level: Risk["level"]) => {
    if (level === "Critical") return 16;
    if (level === "High") return 14;
    if (level === "Medium") return 12;
    return 10;
  };

  const defaultCellKey = Array.from(matrixData.entries()).find(([, cell]) => cell.count > 0)?.[0] ?? null;
  const activeCellKey = selectedCellKey ?? defaultCellKey;
  const activeCell = activeCellKey ? matrixData.get(activeCellKey) : undefined;
  const activeLikelihood = activeCellKey ? Number(activeCellKey.split("-")[0]) : null;
  const activeImpact = activeCellKey ? Number(activeCellKey.split("-")[1]) : null;
  const activeScore = activeLikelihood && activeImpact ? activeLikelihood * activeImpact : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Risk Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Risk heat map and distribution analysis</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {riskSummary.map(item => (
          <Card key={item.label}>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{item.count}</p>
              <RiskLevelBadge level={item.label} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risk Heat Map (Likelihood vs Impact)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-destructive/30 text-destructive">Critical</Badge>
            <Badge variant="outline" className="border-orange-500/40 text-orange-600">High</Badge>
            <Badge variant="outline" className="border-warning/40 text-warning">Medium</Badge>
            <Badge variant="outline" className="border-success/40 text-success">Low</Badge>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">How to read: X = Impact, Y = Likelihood. Larger points indicate higher severity.</p>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 16, right: 12, bottom: 22, left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <ReferenceLine x={3} stroke="hsl(var(--border))" strokeDasharray="4 4" />
                <ReferenceLine y={3} stroke="hsl(var(--border))" strokeDasharray="4 4" />
                <XAxis type="number" dataKey="x" name="Impact" domain={[0, 6]} ticks={[1, 2, 3, 4, 5]} label={{ value: "Impact →", position: "bottom", offset: 0 }} tick={{ fontSize: 12 }} />
                <YAxis type="number" dataKey="y" name="Likelihood" domain={[0, 6]} ticks={[1, 2, 3, 4, 5]} label={{ value: "Likelihood →", angle: -90, position: "insideLeft" }} tick={{ fontSize: 12 }} />
                <Tooltip content={({ payload }) => {
                  if (!payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[220px]">
                      <p className="text-sm font-medium text-foreground">{d.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Impact: {d.x} · Likelihood: {d.y} · Score: {d.score}</p>
                      <p className="text-xs text-muted-foreground">Asset: {d.assetName}</p>
                      <p className="text-xs text-muted-foreground">Owner: {d.owner} · Status: {d.status}</p>
                      <div className="mt-2"><RiskLevelBadge level={d.level} /></div>
                    </div>
                  );
                }} />
                <Scatter data={heatMapData}>
                  {heatMapData.map((entry, i) => (
                    <Cell key={i} fill={riskColors[entry.level]} r={getPointRadius(entry.level)} stroke="hsl(var(--background))" strokeWidth={1.5} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risk Matrix Table (5x5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-destructive/30 text-destructive">Score 16-25: Critical Zone</Badge>
            <Badge variant="outline" className="border-orange-500/40 text-orange-600">Score 9-15: High Zone</Badge>
            <Badge variant="outline" className="border-warning/40 text-warning">Score 4-8: Medium Zone</Badge>
            <Badge variant="outline" className="border-success/40 text-success">Score 1-3: Low Zone</Badge>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">Click a matrix cell to inspect all risks in that zone.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="text-xs text-muted-foreground font-medium p-2 text-left">Likelihood \ Impact</th>
                  {impactScale.map(impact => (
                    <th key={impact} className="text-xs text-muted-foreground font-medium p-2 text-center">
                      {impact}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {likelihoodScale.map(likelihood => (
                  <tr key={likelihood}>
                    <td className="text-xs text-muted-foreground font-medium p-2">{likelihood}</td>
                    {impactScale.map(impact => {
                      const key = `${likelihood}-${impact}`;
                      const cell = matrixData.get(key);
                      const count = cell?.count ?? 0;
                      const score = likelihood * impact;
                      const band = getScoreBand(score);
                      return (
                        <td key={key} className="p-1">
                          <button
                            type="button"
                            onClick={() => setSelectedCellKey(key)}
                            className={`h-24 w-full rounded-md border ${getMatrixCellClass(likelihood, impact)} p-2 text-left transition-all hover:brightness-95 ${activeCellKey === key ? "ring-2 ring-primary/50" : ""}`}
                            title={cell?.risks.map(r => r.title).join("\n") || "No risks in this cell"}
                          >
                            {count === 0 ? (
                              <div className="h-full flex items-center justify-center">
                                <span className="text-xs font-semibold text-muted-foreground">No risk</span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-foreground/80">Score {score} · {band}</p>
                                <p className="text-xl font-bold leading-none text-foreground">{count}</p>
                                <p className="text-[10px] text-foreground/70 truncate">{cell?.risks[0]?.title}</p>
                              </div>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-muted-foreground flex items-center justify-between">
            <span>Matrix total: {matrixTotal} risk(s)</span>
            <span>All risks list: {risks.length} risk(s)</span>
          </div>
          {matrixHasMismatch && (
            <p className="mt-2 text-xs text-destructive">
              Data warning: Some risks were outside the 1-5 likelihood/impact range and were skipped.
            </p>
          )}

          <Card className="mt-4 border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                Selected Cell Details
                {activeLikelihood && activeImpact && activeScore ? ` (L${activeLikelihood} x I${activeImpact} = ${activeScore})` : ""}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!activeCell || activeCell.count === 0 ? (
                <p className="text-sm text-muted-foreground">No risks in selected cell.</p>
              ) : (
                <div className="space-y-2">
                  {activeCell.risks.map((risk) => (
                    <div key={risk.id} className="rounded-md border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-foreground">{risk.title}</p>
                        <div className="flex items-center gap-2">
                          <RiskLevelBadge level={risk.level} />
                          <RiskStatusBadge status={risk.status} />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Asset: {risk.assetName} · Owner: {risk.owner}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Risks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {risks.map(risk => (
              <div key={risk.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{risk.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Asset: {risk.assetName} · Owner: {risk.owner}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <RiskLevelBadge level={risk.level} />
                  <RiskStatusBadge status={risk.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
