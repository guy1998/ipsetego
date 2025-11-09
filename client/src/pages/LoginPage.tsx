import { Api } from "@/api/api";
import "../assets/styles/LoginPage.css";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const api = Api.getInstance();

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            api.post('/auth/login', { email, password }).then(response => {
                if (response.status === 200) {
                    alert("Login");
                } else {
                    toast({
                        title: "Error!",
                        description: response.data.message,
                    });
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <header className="login-header">
                        <h1 className="login-title">Login</h1>
                    </header>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="text-input"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-input"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="forgot-password">
                            <p>
                                Forgot <a href="#" className="forgot-link">password?</a>
                            </p>
                        </div>

                        <button
                            type="submit"
                            className={`login-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="btn-loading">
                                    <span className="spinner"></span>
                                    Logging in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                        <div className="login-redirect">
                            <p>
                                Don't have an account? <a href="/sign-up" className="forgot-link">Hop in now</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;