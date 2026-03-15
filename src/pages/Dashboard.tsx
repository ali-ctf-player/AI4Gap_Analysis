import { useGRC } from "@/contexts/GRCContext";
import { StatCard } from "@/components/StatCard";
import { Shield, AlertTriangle, Server, FileCheck, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const { assets, risks, controls, getCompliancePercentage, getActiveRisksCount } = useGRC();
  const compliance = getCompliancePercentage();
  const activeRisks = getActiveRisksCount();

  const allSafeguards = controls.flatMap(c => c.safeguards);
  const statusData = [
    { name: "Compliant", value: allSafeguards.filter(s => s.status === "compliant").length, color: "hsl(142, 71%, 45%)" },
    { name: "In Progress", value: allSafeguards.filter(s => s.status === "in-progress").length, color: "hsl(38, 92%, 50%)" },
    { name: "Non-Compliant", value: allSafeguards.filter(s => s.status === "non-compliant").length, color: "hsl(0, 84%, 60%)" },
  ];

  const riskByLevel = [
    { name: "Critical", count: risks.filter(r => r.level === "Critical").length, fill: "hsl(0, 72%, 45%)" },
    { name: "High", count: risks.filter(r => r.level === "High").length, fill: "hsl(0, 84%, 60%)" },
    { name: "Medium", count: risks.filter(r => r.level === "Medium").length, fill: "hsl(38, 92%, 50%)" },
    { name: "Low", count: risks.filter(r => r.level === "Low").length, fill: "hsl(142, 71%, 45%)" },
  ];

  const pendingTasks = allSafeguards.filter(s => s.status !== "compliant").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">GRC overview for your organization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Compliance Score" value={`${compliance}%`} subtitle="CIS Controls v8" icon={Shield} variant="primary" />
        <StatCard title="Active Risks" value={activeRisks} subtitle={`${risks.length} total risks`} icon={AlertTriangle} variant="destructive" />
        <StatCard title="Managed Assets" value={assets.length} subtitle={`${assets.filter(a => a.status === "Active").length} active`} icon={Server} variant="success" />
        <StatCard title="Pending Tasks" value={pendingTasks} subtitle="Controls to address" icon={FileCheck} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Control Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-success" /> {statusData[0].value} Compliant
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 text-warning" /> {statusData[1].value} In Progress
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <XCircle className="h-3 w-3 text-destructive" /> {statusData[2].value} Non-Compliant
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskByLevel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={60} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
