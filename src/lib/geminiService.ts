import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CISControl } from "@/data/cisControls";
import type { Risk, Asset } from "@/data/mockData";

export interface AISecurityPlanItem {
    id: string;
    safeguardId: string;
    safeguardTitle: string;
    controlTitle: string;
    priority: "Critical" | "High" | "Medium" | "Low";
    recommendation: string;
    actionSteps: string[];
    estimatedEffort: string;
    relatedRiskCount: number;
}

export interface AIComplianceAnalysis {
    summary: string;
    topRisk: string;
    securityPlan: AISecurityPlanItem[];
    overallRecommendation: string;
}

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
const preferredModel = (import.meta.env.VITE_GEMINI_MODEL as string | undefined)?.trim();

const MODEL_CANDIDATES = [
    preferredModel,
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-8b-latest",
].filter((modelName, index, arr): modelName is string => {
    return Boolean(modelName) && arr.indexOf(modelName) === index;
});

function sanitizeJSONResponse(rawText: string): string {
    return rawText.trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
}

function formatModelError(lastError: unknown, triedModels: string[]): Error {
    const details = lastError instanceof Error ? lastError.message : String(lastError);

    if (details.includes("[429")) {
        return new Error(
            `Gemini quota exceeded for tried models (${triedModels.join(", ")}). ` +
            "Check Google AI Studio quota/billing, or set VITE_GEMINI_MODEL in .env to a model available in your account."
        );
    }

    if (details.includes("[404")) {
        return new Error(
            `No compatible Gemini model found for generateContent. Tried: ${triedModels.join(", ")}. ` +
            "Set VITE_GEMINI_MODEL in .env to a valid model from your account (List Models in AI Studio)."
        );
    }

    return new Error(`Gemini request failed: ${details}`);
}

async function generateWithModelFallback(genAI: GoogleGenerativeAI, prompt: string): Promise<string> {
    let lastError: unknown;

    for (const modelName of MODEL_CANDIDATES) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            lastError = error;
            const message = error instanceof Error ? error.message : String(error);

            // Keep trying when model is unavailable or throttled/quota-limited.
            if (message.includes("[404") || message.includes("[429")) {
                continue;
            }

            throw formatModelError(error, [modelName]);
        }
    }

    throw formatModelError(lastError, MODEL_CANDIDATES);
}

function getPriorityScore(level: Risk["level"]): number {
    if (level === "Critical") return 4;
    if (level === "High") return 3;
    if (level === "Medium") return 2;
    return 1;
}

function estimateEffort(ig: number, relatedRiskCount: number): string {
    if (ig <= 1 && relatedRiskCount > 0) return "1-2 weeks";
    if (ig <= 2) return "2-4 weeks";
    return "1-2 months";
}

function buildLocalFallbackAnalysis(
    controls: CISControl[],
    risks: Risk[],
    compliancePercentage: number
): AIComplianceAnalysis {
    const nonCompliantSafeguards = controls.flatMap((control) =>
        control.safeguards
            .filter((safeguard) => safeguard.status === "non-compliant")
            .map((safeguard) => ({ control, safeguard }))
    );

    const openRisks = risks.filter((risk) => risk.status === "Open");
    const topOpenRisk = openRisks
        .slice()
        .sort((a, b) => getPriorityScore(b.level) - getPriorityScore(a.level))[0];

    const securityPlan = nonCompliantSafeguards
        .map(({ control, safeguard }) => {
            const controlPrefix = `${safeguard.id.split(".")[0]}.`;
            const relatedRisks = openRisks.filter((risk) =>
                risk.cisControlId?.startsWith(controlPrefix)
            );
            const maxRiskScore = relatedRisks.reduce((max, risk) => {
                return Math.max(max, getPriorityScore(risk.level));
            }, 1);
            const priority: AISecurityPlanItem["priority"] =
                maxRiskScore >= 4 ? "Critical" : maxRiskScore === 3 ? "High" : maxRiskScore === 2 ? "Medium" : "Low";

            return {
                id: `local-${safeguard.id}`,
                safeguardId: safeguard.id,
                safeguardTitle: safeguard.title,
                controlTitle: control.title,
                priority,
                recommendation: `Implement ${safeguard.title.toLowerCase()} with documented ownership, timeline, and validation evidence.`,
                actionSteps: [
                    "Assign control owner and target completion date.",
                    "Implement technical and process controls for this safeguard.",
                    "Validate implementation and collect audit evidence.",
                ],
                estimatedEffort: estimateEffort(safeguard.implementationGroup, relatedRisks.length),
                relatedRiskCount: relatedRisks.length,
            };
        })
        .sort((a, b) => {
            const priorityWeight = { Critical: 0, High: 1, Medium: 2, Low: 3 };
            return priorityWeight[a.priority] - priorityWeight[b.priority] || b.relatedRiskCount - a.relatedRiskCount;
        })
        .slice(0, 10);

    const highAndCriticalCount = openRisks.filter((risk) => risk.level === "High" || risk.level === "Critical").length;

    return {
        summary:
            `Local analysis generated because Gemini API model access is unavailable. ` +
            `Current compliance is ${compliancePercentage}% with ${nonCompliantSafeguards.length} non-compliant safeguards and ${openRisks.length} open risks.`,
        topRisk: topOpenRisk
            ? `${topOpenRisk.title} is currently the highest-priority open risk and should be addressed first.`
            : "No open risks are currently recorded, but non-compliant safeguards still require remediation.",
        overallRecommendation:
            `Prioritize IG1 safeguards that map to open high/critical risks, then complete remaining gaps in descending risk order. ` +
            `Track each remediation with owner, due date, and evidence to improve audit readiness. ` +
            `${highAndCriticalCount > 0 ? `Focus immediate effort on ${highAndCriticalCount} high/critical open risks.` : "Continue continuous monitoring for emerging risks."}`,
        securityPlan,
    };
}

export async function generateAIComplianceAnalysis(
    controls: CISControl[],
    risks: Risk[],
    assets: Asset[],
    compliancePercentage: number
): Promise<AIComplianceAnalysis> {
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
        throw new Error("VITE_GEMINI_API_KEY is not configured in the .env file.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const nonCompliantSafeguards = controls.flatMap((c) =>
        c.safeguards
            .filter((s) => s.status === "non-compliant")
            .map((s) => ({ controlId: c.id, controlTitle: c.title, safeguard: s }))
    );

    const openRisks = risks.filter((r) => r.status === "Open");

    const prompt = `You are a GRC (Governance, Risk and Compliance) expert AI assistant. 
Analyze the following security posture data and generate a prioritized security improvement plan.

## Current Compliance Status
Overall Compliance: ${compliancePercentage}%

## Non-Compliant CIS Controls (${nonCompliantSafeguards.length} items)
${nonCompliantSafeguards
            .map(
                (item) =>
                    `- [${item.safeguard.id}] ${item.safeguard.title} (Control: ${item.controlTitle}, IG${item.safeguard.implementationGroup})`
            )
            .join("\n")}

## Active Open Risks (${openRisks.length} risks)
${openRisks
            .map(
                (r) =>
                    `- ${r.title}: Likelihood=${r.likelihood}/5, Impact=${r.impact}/5, Level=${r.level}, CIS=${r.cisControlId ?? "N/A"}`
            )
            .join("\n")}

## Assets (${assets.length} total)
${assets
            .filter((a) => a.status === "Active")
            .map((a) => `- ${a.name} (${a.category}) owned by ${a.owner}`)
            .join("\n")}

## Instructions
Return a JSON object (no markdown, no code block) with this exact structure:
{
  "summary": "2-3 sentence executive summary of the current security posture",
  "topRisk": "One sentence describing the single most critical risk",
  "overallRecommendation": "2-3 sentence strategic recommendation",
  "securityPlan": [
    {
      "id": "unique-id",
      "safeguardId": "CIS safeguard id e.g. 1.3",
      "safeguardTitle": "Title of the safeguard",
      "controlTitle": "Parent CIS control title",
      "priority": "Critical|High|Medium|Low",
      "recommendation": "Specific actionable recommendation sentence",
      "actionSteps": ["Step 1", "Step 2", "Step 3"],
      "estimatedEffort": "e.g. 1-2 weeks, 1 month, 3 months",
      "relatedRiskCount": 0
    }
  ]
}

Prioritize based on: related open risks, implementation group (IG1 first), and potential impact.
Include only the top 10 most important non-compliant safeguards.
Return ONLY valid JSON, no explanation text outside the JSON.`;

    try {
        const text = await generateWithModelFallback(genAI, prompt);
        const jsonText = sanitizeJSONResponse(text);
        const parsed: AIComplianceAnalysis = JSON.parse(jsonText);
        return parsed;
    } catch {
        // Keep the compliance screen usable even when API model access is unavailable.
        return buildLocalFallbackAnalysis(controls, risks, compliancePercentage);
    }
}
