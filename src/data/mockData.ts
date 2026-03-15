export type AssetCategory = "Hardware" | "Software" | "Data";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type RiskLikelihood = 1 | 2 | 3 | 4 | 5;
export type RiskImpact = 1 | 2 | 3 | 4 | 5;

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  description: string;
  owner: string;
  status: "Active" | "Inactive" | "Decommissioned";
  lastUpdated: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  assetId: string;
  assetName: string;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  level: RiskLevel;
  owner: string;
  mitigation: string;
  status: "Open" | "Mitigated" | "Accepted";
  cisControlId?: string;
}

export const initialAssets: Asset[] = [
  { id: "a1", name: "Production Web Server", category: "Hardware", description: "Primary web application server hosting customer-facing services", owner: "IT Operations", status: "Active", lastUpdated: "2024-12-01" },
  { id: "a2", name: "Customer Database", category: "Data", description: "PostgreSQL database containing customer PII and transaction records", owner: "Data Engineering", status: "Active", lastUpdated: "2024-12-15" },
  { id: "a3", name: "ERP System", category: "Software", description: "Enterprise resource planning application (SAP S/4HANA)", owner: "Finance", status: "Active", lastUpdated: "2024-11-20" },
  { id: "a4", name: "Employee Laptops", category: "Hardware", description: "Company-issued MacBook Pro laptops for engineering team", owner: "IT Operations", status: "Active", lastUpdated: "2024-12-10" },
  { id: "a5", name: "Backup Storage Array", category: "Hardware", description: "NetApp storage array for disaster recovery backups", owner: "IT Operations", status: "Active", lastUpdated: "2024-10-05" },
  { id: "a6", name: "HR Management System", category: "Software", description: "Workday HCM platform for employee lifecycle management", owner: "Human Resources", status: "Active", lastUpdated: "2024-12-12" },
  { id: "a7", name: "API Gateway", category: "Software", description: "Kong API gateway managing external API traffic", owner: "Platform Engineering", status: "Active", lastUpdated: "2024-12-18" },
  { id: "a8", name: "Legacy CRM", category: "Software", description: "Deprecated Salesforce Classic instance", owner: "Sales", status: "Inactive", lastUpdated: "2024-06-01" },
];

export const initialRisks: Risk[] = [
  { id: "r1", title: "Unpatched Server Vulnerabilities", description: "Production web server missing critical security patches", assetId: "a1", assetName: "Production Web Server", likelihood: 4, impact: 5, level: "Critical", owner: "James Wilson", mitigation: "Implement automated patch management", status: "Open", cisControlId: "7.3" },
  { id: "r2", title: "Database Encryption at Rest", description: "Customer database lacks encryption at rest for sensitive PII data", assetId: "a2", assetName: "Customer Database", likelihood: 3, impact: 5, level: "High", owner: "Sarah Chen", mitigation: "Enable TDE on PostgreSQL instance", status: "Open", cisControlId: "3.3" },
  { id: "r3", title: "Insufficient Access Controls", description: "ERP system has overly permissive role assignments", assetId: "a3", assetName: "ERP System", likelihood: 3, impact: 4, level: "High", owner: "Michael Brown", mitigation: "Conduct access review and implement RBAC", status: "Open", cisControlId: "6.1" },
  { id: "r4", title: "Missing Endpoint Protection", description: "Some employee laptops lack up-to-date endpoint detection and response", assetId: "a4", assetName: "Employee Laptops", likelihood: 3, impact: 3, level: "Medium", owner: "Lisa Park", mitigation: "Deploy CrowdStrike Falcon on all endpoints", status: "Mitigated", cisControlId: "10.1" },
  { id: "r5", title: "Backup Integrity Validation", description: "No automated testing of backup restoration processes", assetId: "a5", assetName: "Backup Storage Array", likelihood: 2, impact: 5, level: "High", owner: "James Wilson", mitigation: "Implement quarterly DR testing", status: "Open", cisControlId: "11.3" },
  { id: "r6", title: "Legacy System End-of-Life", description: "Legacy CRM running unsupported software version", assetId: "a8", assetName: "Legacy CRM", likelihood: 4, impact: 3, level: "High", owner: "David Kim", mitigation: "Migrate to new CRM platform and decommission", status: "Accepted", cisControlId: "2.2" },
  { id: "r7", title: "API Rate Limiting", description: "API gateway lacks proper rate limiting allowing potential DDoS", assetId: "a7", assetName: "API Gateway", likelihood: 3, impact: 4, level: "High", owner: "Sarah Chen", mitigation: "Configure rate limiting policies in Kong", status: "Open", cisControlId: "13.1" },
  { id: "r8", title: "HR Data Access Logging", description: "Insufficient audit logging for HR data access", assetId: "a6", assetName: "HR Management System", likelihood: 2, impact: 3, level: "Medium", owner: "Lisa Park", mitigation: "Enable comprehensive audit logging", status: "Open", cisControlId: "8.1" },
];

export function getRiskLevel(likelihood: number, impact: number): RiskLevel {
  const score = likelihood * impact;
  if (score >= 16) return "Critical";
  if (score >= 9) return "High";
  if (score >= 4) return "Medium";
  return "Low";
}
