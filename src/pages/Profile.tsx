import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, KeyRound, Mail, Building2, Smartphone } from "lucide-react";

export default function Profile() {
    const [mfaEnabled, setMfaEnabled] = useState(true);

    const user = {
        name: "Ayla Hasanli",
        role: "GRC Manager",
        email: "ayla.hasanli@securegrc.local",
        department: "Risk Management",
        lastLogin: "2026-03-15 14:20",
        authMethod: "Authenticator App",
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Profile</h1>
                <p className="text-muted-foreground text-sm mt-1">User profile information and MFA settings.</p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14 border border-border">
                            <AvatarFallback className="text-sm font-semibold">AH</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-lg font-semibold text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.role}</p>
                            <div className="flex items-center gap-2 pt-1">
                                <Badge variant="secondary">Synthetic Data</Badge>
                                <Badge variant="outline">Active</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            Profile Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Department: {user.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <KeyRound className="h-4 w-4" />
                            <span>Last Login: {user.lastLogin}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-primary" />
                            MFA Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <div>
                                <p className="text-sm font-medium text-foreground">Multi-Factor Authentication</p>
                                <p className="text-xs text-muted-foreground">Protect your account with a second verification step.</p>
                            </div>
                            <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
                        </div>

                        <div className="rounded-md border bg-muted/30 p-3">
                            <p className="text-xs text-muted-foreground">Current Method</p>
                            <p className="text-sm font-medium text-foreground mt-1">{user.authMethod}</p>
                        </div>

                        <div className="rounded-md border bg-muted/30 p-3">
                            <p className="text-xs text-muted-foreground">Recovery Channels</p>
                            <p className="text-sm text-foreground mt-1">Backup Codes, Email OTP</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
