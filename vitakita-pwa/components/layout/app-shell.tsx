"use client";


import { EmergencySOS } from "@/components/feature/emergency-sos";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Book, MessageSquare, ShieldAlert, LogOut, Settings, UserPlus, Pill } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, userData, logout, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth");
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
    }

    if (!user) return null;

    const isAdmin = userData?.role === "admin";

    const navItems = [
        { href: "/dashboard", label: "Home", icon: LayoutDashboard },
        { href: "/chat", label: "AI Support", icon: MessageSquare },
        { href: "/journal", label: "Journal", icon: Book },
        { href: "/medications", label: "Meds", icon: Pill },
        // { href: "/sos", label: "SOS", icon: ShieldAlert, variant: "destructive" },
    ];

    if (isAdmin) {
        navItems.push({ href: "/admin", label: "Admin Panel", icon: UserPlus });
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:flex">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r h-screen fixed left-0 top-0 z-50">
                <div className="p-6 border-b flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span>❤️</span>
                    </div>
                    <span className="font-bold text-xl text-blue-900">VitaKita</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className={cn("w-full justify-start gap-3", pathname === item.href && "text-blue-600 bg-blue-50")}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t space-y-2">
                    {/* Admin Tag */}
                    {isAdmin && (
                        <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-md text-sm font-medium mb-2">
                            👨‍⚕️ Doctor Mode
                        </div>
                    )}

                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
                        <LogOut size={20} />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:pl-64 min-h-screen">
                <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
                    <h1 className="font-semibold text-lg capitalize">{pathname.split('/').pop()}</h1>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50" onClick={logout}>
                            <LogOut size={18} />
                            <span className="hidden md:inline">Logout</span>
                        </Button>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium border border-blue-200">
                            {userData?.name?.[0] || "U"}
                        </div>
                    </div>
                </header>
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            <div className="fixed bottom-20 right-4 z-50 md:bottom-8 md:right-8">
                <EmergencySOS />
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around z-50 px-2 safe-area-pb">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="w-full">
                        <div className={cn("flex flex-col items-center justify-center py-1 rounded-lg transition-colors", pathname === item.href ? "text-blue-600" : "text-gray-500")}>
                            <item.icon size={24} />
                            <span className="text-[10px] font-medium mt-1">{item.label}</span>
                        </div>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
