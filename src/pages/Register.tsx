import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, UserPlus, Building2, Users, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const departments = [
    "IT Operations",
    "Security",
    "Compliance",
    "Risk Management",
    "Finance",
    "Human Resources",
    "Engineering",
];

export default function Register() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void fullName;
        void email;
        void department;
        void password;
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_12%_8%,_hsl(var(--primary)/0.2),_transparent_28%),radial-gradient(circle_at_88%_10%,_hsl(var(--info)/0.14),_transparent_30%),linear-gradient(180deg,_hsl(var(--background)),_hsl(215_20%_96%))] px-4 py-10">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full items-stretch gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="flex items-center justify-center order-2 lg:order-1">
                        <Card className="w-full max-w-lg border-border/70 shadow-xl">
                            <CardHeader className="space-y-2 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <UserPlus className="h-5 w-5" />
                                </div>
                                <CardTitle>Register</CardTitle>
                                <p className="text-sm text-muted-foreground">Create a SecureGRC account and choose your department.</p>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={onSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="register-name">Full Name</Label>
                                        <Input id="register-name" placeholder="Your full name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-email">Email</Label>
                                        <Input id="register-email" type="email" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Department</Label>
                                        <Select value={department} onValueChange={setDepartment}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((item) => (
                                                    <SelectItem key={item} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-password">Password</Label>
                                        <Input id="register-password" type="password" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={!department}>
                                        Register
                                    </Button>
                                </form>
                                <p className="mt-6 text-center text-sm text-muted-foreground">
                                    Already registered? <Link to="/login" className="font-medium text-primary hover:underline">Login</Link>
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="order-1 rounded-3xl border border-border/20 bg-[linear-gradient(155deg,_hsl(222_47%_12%)_0%,_hsl(226_42%_14%)_55%,_hsl(236_44%_20%)_100%)] p-10 text-sidebar-foreground shadow-2xl lg:order-2">
                        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary">
                            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h1 className="max-w-md text-3xl font-bold tracking-tight text-white">Create Your Account</h1>
                        <p className="mt-4 max-w-lg text-sm leading-6 text-slate-200/85">
                            Register once, select your department, and start with the correct governance workflow from the beginning.
                        </p>

                        <div className="mt-8 space-y-3">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                <div className="flex items-start gap-3">
                                    <Building2 className="mt-0.5 h-4 w-4 text-primary-foreground" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Department Mapping</p>
                                        <p className="mt-1 text-xs text-slate-200/80">Tie each user to the correct team at registration.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                <div className="flex items-start gap-3">
                                    <Users className="mt-0.5 h-4 w-4 text-primary-foreground" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Team-Based Onboarding</p>
                                        <p className="mt-1 text-xs text-slate-200/80">Standardized onboarding flow for security and operations units.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                <div className="flex items-start gap-3">
                                    <KeyRound className="mt-0.5 h-4 w-4 text-primary-foreground" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Login Ready</p>
                                        <p className="mt-1 text-xs text-slate-200/80">After registration, users can sign in immediately.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}