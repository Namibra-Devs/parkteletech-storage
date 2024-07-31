// src/pages/SignInPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/context/AuthContext";

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://parkteletechafrica.com/api/admin/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { user, token } = response.data;
        login(token, user);
        toast.success("Login successful");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Login failed. Please check your credentials.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F7F7] w-screen h-screen">
      <ToastContainer />
      <div className="border-b-2 border-white w-full h-16 items-center flex">
        <p className="text-sm lg:text-xl ml-10 text-blue-600 font-bold">
          Park Teletech
        </p>
      </div>
      <div className="flex items-center justify-center mt-11">
        <div className="bg-white w-[55%] h-[370px]">
          <div className="text-center text-xl font-semibold py-8 mt-4">
            <p>Staff Login</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col items-center py-10">
              <input
                type="email"
                placeholder="Email"
                className="border-2 border-gray-300 w-3/4 h-10 rounded-md px-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="border-2 border-gray-300 w-3/4 h-10 rounded-md px-2 mt-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white w-3/4 h-10 rounded-md mt-4"
                disabled={loading}
              >
                {loading ? "Loading..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
