import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, LogIn, CheckCircle2, Lock, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void email;
        void password;
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_12%_8%,_hsl(var(--primary)/0.2),_transparent_28%),radial-gradient(circle_at_88%_10%,_hsl(var(--info)/0.14),_transparent_30%),linear-gradient(180deg,_hsl(var(--background)),_hsl(215_20%_96%))] px-4 py-10">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full items-stretch gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="hidden rounded-3xl border border-border/20 bg-[linear-gradient(155deg,_hsl(222_47%_12%)_0%,_hsl(226_42%_14%)_55%,_hsl(236_44%_20%)_100%)] p-10 text-sidebar-foreground shadow-2xl lg:flex lg:flex-col lg:justify-between">
                        <div>
                            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary">
                                <Shield className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <h1 className="max-w-md text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
                            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-200/85">
                                Login to access assets, risks, and compliance dashboards in one workspace.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                <div className="flex items-start gap-3">
                                    <Gauge className="mt-0.5 h-4 w-4 text-primary-foreground" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Single Dashboard</p>
                                        <p className="mt-1 text-xs text-slate-200/80">Track posture, open risks, and compliance status from one view.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                <div className="flex items-start gap-3">
                                    <Lock className="mt-0.5 h-4 w-4 text-primary-foreground" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Secure Access</p>
                                        <p className="mt-1 text-xs text-slate-200/80">Role-oriented access flow for enterprise teams.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary-foreground" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Audit Ready</p>
                                        <p className="mt-1 text-xs text-slate-200/80">Keep governance and evidence workflows structured from day one.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <Card className="w-full max-w-md border-border/70 shadow-xl">
                            <CardHeader className="space-y-2 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <LogIn className="h-5 w-5" />
                                </div>
                                <CardTitle>Login</CardTitle>
                                <p className="text-sm text-muted-foreground">Sign in to continue to the SecureGRC platform.</p>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={onSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Email</Label>
                                        <Input id="login-email" type="email" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">Password</Label>
                                        <Input id="login-password" type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Login
                                    </Button>
                                </form>
                                <p className="mt-6 text-center text-sm text-muted-foreground">
                                    Need an account? <Link to="/register" className="font-medium text-primary hover:underline">Register</Link>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}