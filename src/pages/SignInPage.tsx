// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useApi } from "@/hooks/context/GlobalContext";
// import {
//   ACCESS_TOKEN_KEY,
//   REFRESH_TOKEN_KEY,
//   TOKEN_EXPIRATION_KEY,
//   USER_KEY,
// } from "@/constants";
// import { getDeviceInfo } from "@/lib/utils";

// const SignInPage = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { refreshFileData, refreshFolderData } = useApi();

//   const setTokensWithExpiration = (
//     accessToken: string,
//     refreshToken: string,
//     user: string
//   ) => {
//     localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
//     localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
//     localStorage.setItem(USER_KEY, user);

//     // Set expiration time to 24 hours from now
//     const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
//     localStorage.setItem(TOKEN_EXPIRATION_KEY, expirationTime.toString());
//   };

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const deviceInfo = getDeviceInfo();

//       const response = await fetch(
//         "https://parkteletech-auth.onrender.com/api/v1/auth/authenticate",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email, password, deviceInfo }),
//         }
//       );
//       const data = await response.json();
//       const accessToken = data.data.accessToken;
//       const refreshToken = data.data.refreshToken;

//       const user = await fetch(
//         "https://parkteletech-auth.onrender.com/api/v1/auth/me",
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const userData = await user.json();
//       const storeUser = JSON.stringify(userData.data);
//       setTokensWithExpiration(accessToken, refreshToken, storeUser);

//       // Refresh data
//       await refreshFileData();
//       await refreshFolderData();

//       // Wait for 3 seconds before navigating
//       setTimeout(() => {
//         navigate("/");
//       }, 3000);

//       toast.success("Login successful!");

//     } catch (error) {
//       console.error("Login failed:", error);
//       toast.error("Login failed. Please check your credentials and try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-[#F7F7F7] w-screen h-screen">
//       <ToastContainer position="top-center" />
//       <div className="border-b-2 border-white w-full h-16 items-center flex">
//         <p className="text-sm lg:text-xl ml-10 text-blue-600 font-bold">
//           Park Teletech
//         </p>
//       </div>
//       <div className="flex items-center justify-center mt-11">
//         <div className="bg-white w-[55%] h-[370px]">
//           <div className="text-center text-xl font-semibold py-8 mt-4">
//             <p>Staff Login</p>
//           </div>
//           <form onSubmit={handleLogin}>
//             <div className="flex flex-col items-center py-10">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="border-2 border-gray-300 w-3/4 h-10 rounded-md px-2"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="border-2 border-gray-300 w-3/4 h-10 rounded-md px-2 mt-4"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white w-3/4 h-10 rounded-md mt-4"
//                 disabled={loading}
//               >
//                 {loading ? "Loading..." : "Sign In"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignInPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApi } from "@/hooks/context/GlobalContext";
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
  const { refreshData } = useApi();

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
      }, 3000);
      await refreshData();
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

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border-2 border-gray-300 h-10 rounded-md px-4 focus:border-blue-500 focus:outline-none"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
              />

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
