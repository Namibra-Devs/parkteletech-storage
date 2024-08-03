// src/pages/SignInPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "@/hooks/context/GlobalContext";

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshFileData, refreshFolderData } = useApi();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://www.parkteletechafrica.com/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();

      const user = data.user;

      localStorage.setItem("staff", JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      toast.success("Login successful!");
      // Redirect to the dashboard or home page after successful login
      navigate("/");
      refreshFileData();
      refreshFolderData();
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials and try again.");
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
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border-2 border-gray-300 w-3/4 h-10 rounded-md px-2 mt-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
