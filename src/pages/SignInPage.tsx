import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_EXPIRATION_KEY,
  USER_KEY,
} from "@/constants";
import { getDeviceInfo } from "@/lib/utils";

interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

interface UserResponse {
  data: Record<string, unknown>;
}

const AUTH_API_BASE = "https://parkteletech-auth.onrender.com/api/v1/auth";

const SignInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setTokensWithExpiration = (
    accessToken: string,
    refreshToken: string,
    user: string,
    expirationHours = 24
  ) => {
    const expirationTime =
      new Date().getTime() + expirationHours * 60 * 60 * 1000;

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, user);
    localStorage.setItem(TOKEN_EXPIRATION_KEY, expirationTime.toString());
  };

  const fetchWithAuth = async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const response = await fetch(`${AUTH_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Network response was not ok");
    }

    return response;
  };

  const authenticateUser = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await fetchWithAuth("/authenticate", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        deviceInfo: getDeviceInfo(),
      }),
    });
    return response.json();
  };

  const getUserProfile = async (accessToken: string): Promise<UserResponse> => {
    const response = await fetchWithAuth("/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Authenticate user
      const authResponse = await authenticateUser(
        formData.email,
        formData.password
      );
      const { accessToken, refreshToken } = authResponse.data;

      // Get user profile
      const userResponse = await getUserProfile(accessToken);
      const userData = JSON.stringify(userResponse.data);

      // Store tokens and user data
      setTokensWithExpiration(accessToken, refreshToken, userData);

      // Refresh application data

      toast.success("Login successful!");

      // Navigate after successful login
      setTimeout(() => {
        navigate("/");
      }, 2000); // 2 seconds

      // refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <ToastContainer position="top-center" />

      {/* Header */}
      <header className="border-b-2 border-white h-16 flex items-center">
        <h1 className="text-sm lg:text-xl ml-10 text-blue-600 font-bold">
          Park Teletech
        </h1>
      </header>

      {/* Login Form */}
      <main className="flex items-center justify-center mt-11">
        <div className="bg-white w-full max-w-xl p-8 rounded-lg shadow-md">
          <h2 className="text-center text-xl font-semibold mb-8">
            Staff Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border-2 border-gray-300 h-10 rounded-md px-4 focus:border-blue-500 focus:outline-none"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="border-2 border-gray-300 h-10 rounded-md px-4 w-full focus:border-blue-500 focus:outline-none pr-12"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-500" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white h-10 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
