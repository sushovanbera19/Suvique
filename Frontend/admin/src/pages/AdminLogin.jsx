import { useState } from "react";
import "../assets/style/AdminLogin.css";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:5000/api/admin/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            // success login
            if (data.success) {

                // save login
                localStorage.setItem("adminAuth", "true");

                localStorage.setItem(
                    "adminName",
                    data.admin.name
                );

                localStorage.setItem(
                    "adminEmail",
                    data.admin.email
                );

                // update react state
                setIsLoggedIn(true);

                // success alert
                setMessage("Login Successful");
                setMessageType("success");

                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);

                // redirect
                navigate("/dashboard");

            } else {

                setMessage(
                    data.message ||
                    "Invalid Email or Password"
                );

                setMessageType("error");
            }
        } catch (error) {

            console.log(error);

            setMessage("Something went wrong");
            setMessageType("error");
        }
    };

    return (
        <div className="admin_login_form">
            <div className="login-card">
                <div className="brand">MAXTON ADMIN</div>

                <h2>Get Started Now</h2>
                <p>Enter your credentials to login your account</p>
                {message && (
                    <div className={`custom-alert ${messageType}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>

                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <div className="options">
                        <label className="remember">
                            <input type="checkbox" />
                            <span>Remember Me</span>
                        </label>

                        <a href="#" className="forgot-password">
                            Forgot Password ?
                        </a>
                    </div>

                    <button type="submit">Login</button>
                    <p className="signup-text">
                        Don’t have an account yet? <span>Sign up here</span>
                    </p>
                    <div className="or-divider">
                        <span>OR SIGN IN WITH</span>
                    </div>

                    <div className="social-login">
                        <div className="social-icon google">
                            <FaGoogle />
                        </div>

                        <div className="social-icon facebook">
                            <FaFacebookF />
                        </div>

                        <div className="social-icon linkedin">
                            <FaLinkedinIn />
                        </div>

                        <div className="social-icon github">
                            <FaGithub />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;