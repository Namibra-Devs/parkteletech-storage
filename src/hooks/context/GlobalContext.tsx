// import React, { createContext, useContext, useState, ReactNode } from "react";
// import axios from "axios";

// // Define types
// type File = {
//   id: number;
//   user_id: number;
//   folder_id: number | null;
//   name: string;
//   path: string;
//   created_at: string;
//   updated_at: string;
// };

// type Folder = {
//   id: number;
//   user_id: number;
//   name: string;
//   parent_id: number | null;
//   created_at: string;
//   updated_at: string;
// };

// type Staff = {
//   id: number;
//   fullname: string;
//   email: string;
//   api_token: string;
// };

// type ApiContextType = {
//   // File operations
//   listFiles: (params?: {
//     search?: string;
//     folder_id?: number;
//     sort_by?: string;
//     sort_order?: "asc" | "desc";
//     per_page?: number;
//   }) => Promise<File[]>;
//   uploadFiles: (
//     files: File[],
//     folder_id: File["folder_id"],
//     user_id: File["user_id"]
//   ) => Promise<{ name: string; path: string }[]>;
//   renameFile: (id: number, newName: string) => Promise<File>;
//   deleteFile: (id: number) => Promise<void>;
//   bulkDeleteFiles: (ids: number[]) => Promise<void>;

//   // Folder operations
//   listFolders: (user_id?: number) => Promise<Folder[]>;
//   createFolder: (
//     name: string,
//     parent_id: number | null,
//     user_id: number
//   ) => Promise<Folder>;
//   renameFolder: (id: number, newName: string) => Promise<Folder>;
//   deleteFolder: (id: number) => Promise<void>;
//   bulkDeleteFolders: (ids: number[]) => Promise<void>;

//   // Staff authentication
//   registerStaff: (
//     fullname: string,
//     email: string,
//     password: string
//   ) => Promise<{ staff: Staff; token: string }>;
//   loginStaff: (
//     email: string,
//     password: string
//   ) => Promise<{ staff: Staff; token: string }>;
//   logoutStaff: () => Promise<void>;

//   // Token management
//   token: string | null;
//   setToken: (token: string | null) => void;
// };

// const ApiContext = createContext<ApiContextType | undefined>(undefined);

// const BASE_URL = "https://parkteletechafrica.com/api";

// export const ApiProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [token, setToken] = useState<string | null>(null);

//   const api = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const listFiles = async (params?: {
//     search?: string;
//     folder_id?: number;
//     sort_by?: string;
//     sort_order?: "asc" | "desc";
//     per_page?: number;
//   }) => {
//     const response = await api.get<File[]>("/files", { params });
//     return response.data;
//   };

//   const uploadFiles = async (
//     files: File[],
//     folder_id: File["folder_id"],
//     user_id: File["user_id"]
//   ) => {
//     const formData = new FormData();
//     files.forEach((file) => formData.append("files[]", file));
//     if (folder_id) formData.append("folder_id", folder_id.toString());
//     formData.append("user_id", user_id.toString());

//     const response = await api.post<{ name: string; path: string }[]>(
//       "/files/upload",
//       formData,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );
//     return response.data;
//   };

//   const renameFile = async (id: number, newName: string) => {
//     const response = await api.put<File>(`/files/${id}/rename`, {
//       name: newName,
//     });
//     return response.data;
//   };

//   const deleteFile = async (id: number) => {
//     await api.delete(`/files/${id}`);
//   };

//   const bulkDeleteFiles = async (ids: number[]) => {
//     await api.delete("/files/delete", { data: { ids } });
//   };

//   const listFolders = async (user_id?: number) => {
//     const response = await api.get<Folder[]>("/folders", {
//       params: { user_id },
//     });
//     return response.data;
//   };

//   const createFolder = async (
//     name: string,
//     parent_id: number | null,
//     user_id: number
//   ) => {
//     const response = await api.post<Folder>("/folders", {
//       name,
//       parent_id,
//       user_id,
//     });
//     return response.data;
//   };

//   const renameFolder = async (id: number, newName: string) => {
//     const response = await api.put<Folder>(`/folders/${id}/rename`, {
//       name: newName,
//     });
//     return response.data;
//   };

//   const deleteFolder = async (id: number) => {
//     await api.delete(`/folders/${id}`);
//   };

//   const bulkDeleteFolders = async (ids: number[]) => {
//     await api.delete("/folders/delete", { data: { ids } });
//   };

//   const registerStaff = async (
//     fullname: string,
//     email: string,
//     password: string
//   ) => {
//     const response = await api.post<{
//       message: string;
//       staff: Staff;
//       token: string;
//     }>("/staff/register", {
//       fullname,
//       email,
//       password,
//       password_confirmation: password,
//     });
//     setToken(response.data.token);
//     return { staff: response.data.staff, token: response.data.token };
//   };

//   const loginStaff = async (email: string, password: string) => {
//     const response = await api.post<{
//       message: string;
//       staff: Staff;
//       token: string;
//     }>("/staff/login", {
//       email,
//       password,
//     });
//     setToken(response.data.token);
//     return { staff: response.data.staff, token: response.data.token };
//   };

//   const logoutStaff = async () => {
//     await api.post("/staff/logout");
//     setToken(null);
//   };

//   const contextValue: ApiContextType = {
//     listFiles,
//     uploadFiles,
//     renameFile,
//     deleteFile,
//     bulkDeleteFiles,
//     listFolders,
//     createFolder,
//     renameFolder,
//     deleteFolder,
//     bulkDeleteFolders,
//     registerStaff,
//     loginStaff,
//     logoutStaff,
//     token,
//     setToken,
//   };

//   return (
//     <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
//   );
// };

// export const useApi = () => {
//   const context = useContext(ApiContext);
//   if (context === undefined) {
//     throw new Error("useApi must be used within an ApiProvider");
//   }
//   return context;
// };

import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

// Define types
type File = {
  id: number;
  user_id: number;
  folder_id: number | null;
  name: string;
  path: string;
  created_at: string;
  updated_at: string;
};

type Folder = {
  id: number;
  user_id: number;
  name: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
};

type Staff = {
  id: number;
  fullname: string;
  email: string;
  api_token: string;
};

type ApiContextType = {
  // File operations
  listFiles: (params?: {
    search?: string;
    folder_id?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    per_page?: number;
  }) => Promise<File[]>;
  uploadFiles: (
    files: File[],
    folder_id: number,
    user_id: number
  ) => Promise<{ name: string; path: string }[]>;
  renameFile: (id: number, newName: string) => Promise<File>;
  deleteFile: (id: number) => Promise<void>;
  bulkDeleteFiles: (ids: number[]) => Promise<void>;

  // Folder operations
  listFolders: (user_id?: number) => Promise<Folder[]>;
  createFolder: (
    name: string,
    parent_id: number | null,
    user_id: number
  ) => Promise<Folder>;
  renameFolder: (id: number, newName: string) => Promise<Folder>;
  deleteFolder: (id: number) => Promise<void>;
  bulkDeleteFolders: (ids: number[]) => Promise<void>;

  // Staff authentication
  registerStaff: (
    fullname: string,
    email: string,
    password: string
  ) => Promise<{ staff: Staff; token: string }>;
  loginStaff: (
    email: string,
    password: string
  ) => Promise<{ staff: Staff; token: string }>;
  logoutStaff: () => Promise<void>;

  // Token management
  token: string | null;
  setToken: (token: string | null) => void;

  // Staff information
  staff: Staff | null;
  setStaff: (staff: Staff | null) => void;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const BASE_URL = "https://parkteletechafrica.com/api";

export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [staff, setStaff] = useState<Staff | null>(null);

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const listFiles = async (params?: {
    search?: string;
    folder_id?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    per_page?: number;
  }) => {
    const response = await api.get<File[]>("/files", { params });
    return response.data;
  };

  const uploadFiles = async (
    files: File[],
    folder_id: number,
    user_id: number
  ) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file.name);
    });
    if (folder_id) formData.append("folder_id", folder_id.toString());
    formData.append("user_id", user_id.toString());

    const response = await api.post<{ name: string; path: string }[]>(
      "/files/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  };

  const renameFile = async (id: number, newName: string) => {
    const response = await api.put<File>(`/files/${id}/rename`, {
      name: newName,
    });
    return response.data;
  };

  const deleteFile = async (id: number) => {
    await api.delete(`/files/${id}`);
  };

  const bulkDeleteFiles = async (ids: number[]) => {
    await api.delete("/files/delete", { data: { ids } });
  };

  const listFolders = async () => {
    const response = await api.get<Folder[]>("/folders", {
      params: { user_id: 3 },
    });
    return response.data;
  };

  const createFolder = async (
    name: string,
    parent_id: number | null,
    user_id: number
  ) => {
    const response = await api.post<Folder>("/folders", {
      name,
      parent_id,
      user_id,
    });
    return response.data;
  };

  const renameFolder = async (id: number, newName: string) => {
    const response = await api.put<Folder>(`/folders/${id}/rename`, {
      name: newName,
    });
    return response.data;
  };

  const deleteFolder = async (id: number) => {
    await api.delete(`/folders/${id}`);
  };

  const bulkDeleteFolders = async (ids: number[]) => {
    await api.delete("/folders/delete", { data: { ids } });
  };

  const registerStaff = async (
    fullname: string,
    email: string,
    password: string
  ) => {
    const response = await api.post<{
      message: string;
      staff: Staff;
      token: string;
    }>("/staff/register", {
      fullname,
      email,
      password,
      password_confirmation: password,
    });
    setToken(response.data.token);
    return { staff: response.data.staff, token: response.data.token };
  };

  const loginStaff = async (email: string, password: string) => {
    const response = await api.post<{
      message: string;
      staff: Staff;
      token: string;
    }>("/staff/login", {
      email,
      password,
    });
    setToken(response.data.token);
    setStaff(response.data.staff);
    return { staff: response.data.staff, token: response.data.token };
  };

  const logoutStaff = async () => {
    await api.post("/staff/logout");
    setToken(null);
  };

  const contextValue: ApiContextType = {
    listFiles,
    uploadFiles,
    renameFile,
    deleteFile,
    bulkDeleteFiles,
    listFolders,
    createFolder,
    renameFolder,
    deleteFolder,
    bulkDeleteFolders,
    registerStaff,
    loginStaff,
    logoutStaff,
    token,
    setToken,
    staff,
    setStaff,
  };

  return (
    <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
