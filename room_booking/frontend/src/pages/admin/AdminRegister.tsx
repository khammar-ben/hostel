import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock, Loader2, Mail, UserPlus } from "lucide-react";
import axiosClient from "../../api/axios";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const AdminRegister = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/admin"); // redirect if already logged in
        }
    }, [navigate]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (isLoading) return;

        // Validate password confirmation
        if (formData.password !== formData.password_confirmation) {
            toast.error("Le password non corrispondono");
            return;
        }

        // Validate password length
        if (formData.password.length < 8) {
            toast.error("La password deve essere di almeno 8 caratteri");
            return;
        }

        setIsLoading(true);

        try {
            // Get CSRF cookie first
            console.log("Getting CSRF cookie...");
            await axiosClient.get("/sanctum/csrf-cookie");
            console.log("CSRF cookie obtained");
            
            // Make registration request
            console.log("Making registration request...");
            const response = await axiosClient.post("/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });

            console.log("✅ Registration success:", response.data);

            // Save token and user data
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                toast.success("Registrazione completata con successo!");
                navigate("/admin");
            } else {
                throw new Error("No token received from server");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(
                    "❌ Registration failed:",
                    error.response?.data || error.message
                );
                
                // Handle validation errors
                if (error.response?.status === 422) {
                    const errors = error.response.data.errors;
                    if (errors) {
                        Object.entries(errors).forEach(([field, messages]) => {
                            if (Array.isArray(messages)) {
                                messages.forEach((message) => {
                                    toast.error(`${field}: ${message}`);
                                });
                            }
                        });
                    }
                } else {
                    toast.error(
                        error.response?.data?.message || 
                        error.response?.data?.error || 
                        "Registrazione fallita, riprova!"
                    );
                }
            } else {
                console.error("❌ Unexpected error:", error);
                toast.error("Qualcosa è andato storto. Riprova.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link
                        to="/"
                        className="text-3xl font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                        Happy Hostel
                    </Link>
                    <p className="text-muted-foreground mt-2">
                        Registrazione Admin
                    </p>
                </div>

                {/* Registration Card */}
                <Card className="p-8 shadow-elegant border-border/50">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            Crea Account Admin
                        </h1>
                        <p className="text-muted-foreground">
                            Registrati per accedere alla dashboard amministrativa
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-foreground">
                                Nome Completo
                            </Label>
                            <div className="relative">
                                <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Inserisci il tuo nome"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="pl-10 border-border/50 focus:border-primary"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">
                                Indirizzo Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Inserisci la tua email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="pl-10 border-border/50 focus:border-primary"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Crea una password (min. 8 caratteri)"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10 border-border/50 focus:border-primary"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className="text-foreground">
                                Conferma Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Conferma la tua password"
                                    value={formData.password_confirmation}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10 border-border/50 focus:border-primary"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-start space-x-2 text-sm">
                            <input
                                type="checkbox"
                                id="terms"
                                className="rounded border-border/50 text-primary focus:ring-primary/20 mt-0.5"
                                required
                            />
                            <label htmlFor="terms" className="text-muted-foreground cursor-pointer">
                                Accetto i{" "}
                                <Link
                                    to="/terms"
                                    className="text-primary hover:text-primary/80 transition-colors"
                                >
                                    Termini e Condizioni
                                </Link>{" "}
                                e la{" "}
                                <Link
                                    to="/privacy"
                                    className="text-primary hover:text-primary/80 transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Register Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registrazione...
                                </>
                            ) : (
                                "Registrati"
                            )}
                        </Button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/30" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Oppure
                                </span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Hai già un account?{" "}
                                <Link
                                    to="/login"
                                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                    Accedi qui
                                </Link>
                            </p>
                        </div>

                        {/* Back to Website */}
                        <div className="text-center">
                            <Link
                                to="/"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                ← Torna al sito Happy Hostel
                            </Link>
                        </div>
                    </form>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        Hai bisogno di aiuto? Contatta il{" "}
                        <Link
                            to="/contact"
                            className="text-primary hover:text-primary/80 transition-colors"
                        >
                            supporto
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
