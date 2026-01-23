import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
            <AuthForm />
        </div>
    );
};

export default Login;
