import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useGRC } from "@/contexts/GRCContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  TriangleAlert,
  RefreshCw,
} from "lucide-react";
import { generateAIComplianceAnalysis, type AIComplianceAnalysis } from "@/lib/geminiService";

const COMPLIANCE_ANALYSIS_STORAGE_KEY = "securegrc.compliance.ai-analysis";

interface StoredComplianceAnalysis {
  signature: string;
  updatedAt: string;
  analysis: AIComplianceAnalysis;
}

function buildAnalysisSignature(
  controls: ReturnType<typeof useGRC>["controls"],
  risks: ReturnType<typeof useGRC>["risks"],
  assets: ReturnType<typeof useGRC>["assets"],
  compliance: number,
) {
  return JSON.stringify({
    compliance,
    assets: assets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      category: asset.category,
      owner: asset.owner,
      status: asset.status,
      lastUpdated: asset.lastUpdated,
    })),
    risks: risks.map((risk) => ({
      id: risk.id,
      title: risk.title,
      assetId: risk.assetId,
      likelihood: risk.likelihood,
      impact: risk.impact,
      level: risk.level,
      status: risk.status,
      cisControlId: risk.cisControlId ?? null,
    })),
    controls: controls.map((control) => ({
      id: control.id,
      safeguards: control.safeguards.map((safeguard) => ({
        id: safeguard.id,
        status: safeguard.status,
      })),
    })),
  });
}

function PriorityBadge({ priority }: { priority: string }) {
  const cls =
    priority === "Critical"
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : priority === "High"
        ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
        : priority === "Medium"
          ? "bg-warning/10 text-warning border-warning/20"
          : "bg-muted text-muted-foreground border-border";
  return (
    <Badge variant="outline" className={cls}>
      {priority} Priority
    </Badge>
  );
}

function EffortBadge({ effort }: { effort: string }) {
  return (
    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
      {effort}
    </span>
  );
}

export default function Compliance() {
  const { controls, risks, assets, getCompliancePercentage, getNonCompliantControls, getActiveRisksCount } = useGRC();
  const compliance = getCompliancePercentage();
  const nonCompliant = getNonCompliantControls();
  const activeRisks = getActiveRisksCount();

  const allSafeguards = controls.flatMap((c) => c.safeguards);
  const inProgress = allSafeguards.filter((s) => s.status === "in-progress").length;

  const [analysis, setAnalysis] = useState<AIComplianceAnalysis | null>(null);
  const [analysisUpdatedAt, setAnalysisUpdatedAt] = useState<string | null>(null);
  const [analysisSignature, setAnalysisSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const hasHydratedCacheRef = useRef(false);
  const lastRequestedSignatureRef = useRef<string | null>(null);

  const currentSignature = useMemo(
    () => buildAnalysisSignature(controls, risks, assets, compliance),
    [controls, risks, assets, compliance],
  );

  const persistAnalysis = useCallback((nextAnalysis: AIComplianceAnalysis, signature: string) => {
    const updatedAt = new Date().toISOString();
    const payload: StoredComplianceAnalysis = {
      signature,
      updatedAt,
      analysis: nextAnalysis,
    };

    localStorage.setItem(COMPLIANCE_ANALYSIS_STORAGE_KEY, JSON.stringify(payload));
    setAnalysis(nextAnalysis);
    setAnalysisSignature(signature);
    setAnalysisUpdatedAt(updatedAt);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const runAnalysis = useCallback(async (options?: { preserveCurrentAnalysis?: boolean }) => {
    const preserveCurrentAnalysis = options?.preserveCurrentAnalysis ?? false;

    lastRequestedSignatureRef.current = currentSignature;
    setLoading(true);
    setError(null);
    if (!preserveCurrentAnalysis) {
      setAnalysis(null);
      setAnalysisUpdatedAt(null);
      setAnalysisSignature(null);
    }

    try {
      const result = await generateAIComplianceAnalysis(controls, risks, assets, compliance);
      persistAnalysis(result, currentSignature);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [controls, risks, assets, compliance, currentSignature, persistAnalysis]);

  useEffect(() => {
    if (hasHydratedCacheRef.current) return;

    hasHydratedCacheRef.current = true;
    const storedValue = localStorage.getItem(COMPLIANCE_ANALYSIS_STORAGE_KEY);
    if (!storedValue) return;

    try {
      const parsed = JSON.parse(storedValue) as StoredComplianceAnalysis;
      setAnalysis(parsed.analysis);
      setAnalysisUpdatedAt(parsed.updatedAt);
      setAnalysisSignature(parsed.signature);
    } catch {
      localStorage.removeItem(COMPLIANCE_ANALYSIS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedCacheRef.current) return;
    if (!analysis) return;
    if (analysisSignature === currentSignature) return;
    if (loading) return;
    if (lastRequestedSignatureRef.current === currentSignature) return;

    void runAnalysis({ preserveCurrentAnalysis: true });
  }, [analysis, analysisSignature, currentSignature, loading, runAnalysis]);

  const isAnalysisStale = Boolean(analysis && analysisSignature && analysisSignature !== currentSignature);
  const formattedUpdatedAt = analysisUpdatedAt
    ? new Date(analysisUpdatedAt).toLocaleString()
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance & Security Plan</h1>
          <p className="text-muted-foreground text-sm mt-1">
            AI-powered analysis based on CIS Framework gaps
          </p>
          {formattedUpdatedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              Saved AI analysis: {formattedUpdatedAt}
              {isAnalysisStale ? " · Refreshing because assets, risks, or controls changed." : ""}
            </p>
          )}
        </div>
        <Button
          onClick={() => void runAnalysis()}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : analysis ? (
            <RefreshCw className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? "Analyzing..." : analysis ? "Re-Analyze" : "Generate AI Analysis"}
        </Button>
      </div>

      {/* Compliance Overview */}
      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <p className="text-lg font-bold text-foreground">Overall Compliance</p>
                <p className="text-sm text-muted-foreground">CIS Critical Security Controls v8</p>
              </div>
            </div>
            <span className="text-4xl font-bold text-primary">{compliance}%</span>
          </div>
          <Progress value={compliance} className="h-3" />
          <div className="flex gap-6 mt-4 text-sm text-muted-foreground">
            <span>
              <CheckCircle className="inline h-3 w-3 text-success mr-1" />
              {allSafeguards.filter((s) => s.status === "compliant").length} Compliant
            </span>
            <span className="text-warning">{inProgress} In Progress</span>
            <span className="text-destructive">{nonCompliant.length} Non-Compliant</span>
            <span>{activeRisks} Active Risks</span>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-3">
            <TriangleAlert className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Analysis Failed</p>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading skeleton */}
      {loading && !analysis && (
        <Card>
          <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div>
              <p className="font-medium text-foreground">Gemini AI is analyzing your security posture...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Evaluating {nonCompliant.length} non-compliant controls and {activeRisks} active risks
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Results */}
      {analysis && !loading && (
        <>
          {/* Executive Summary */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground leading-relaxed">{analysis.summary}</p>
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-xs font-semibold text-destructive mb-1">Top Risk Identified</p>
                <p className="text-sm text-foreground">{analysis.topRisk}</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs font-semibold text-primary mb-1">Strategic Recommendation</p>
                <p className="text-sm text-foreground">{analysis.overallRecommendation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Security Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                AI-Generated Security Plan ({analysis.securityPlan.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {analysis.securityPlan.map((item, i) => {
                  const isExpanded = expandedItems.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded mt-0.5 shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">
                              {item.safeguardId}
                            </span>
                            <PriorityBadge priority={item.priority} />
                            <EffortBadge effort={item.estimatedEffort} />
                          </div>
                          <p className="text-sm font-medium text-foreground">{item.safeguardTitle}</p>
                          <p className="text-xs text-muted-foreground">Control: {item.controlTitle}</p>
                          <p className="text-xs text-foreground/80 mt-2 leading-relaxed">
                            {item.recommendation}
                          </p>
                          {item.relatedRiskCount > 0 && (
                            <p className="text-xs text-destructive mt-1">
                              {item.relatedRiskCount} associated risk
                              {item.relatedRiskCount > 1 ? "s" : ""} identified
                            </p>
                          )}
                          {item.actionSteps.length > 0 && (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-3 w-3" /> Hide action steps
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3" /> Show {item.actionSteps.length} action steps
                                </>
                              )}
                            </button>
                          )}
                          {isExpanded && (
                            <ol className="mt-2 space-y-1 pl-4 list-decimal">
                              {item.actionSteps.map((step, si) => (
                                <li key={si} className="text-xs text-muted-foreground">
                                  {step}
                                </li>
                              ))}
                            </ol>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty state – before first analysis */}
      {!analysis && !loading && !error && (
        <Card className="border-dashed">
          <CardContent className="p-12 flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No AI Analysis Yet</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Click <strong>Generate AI Analysis</strong> to let Gemini analyze your{" "}
                {nonCompliant.length} non-compliant controls and {activeRisks} active risks and
                produce a prioritized security improvement plan.
              </p>
            </div>
            <Button onClick={() => void runAnalysis()} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate AI Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
