import { ACCESS_TOKEN_KEY, USER_KEY } from "@/constants";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";

interface Folder {
  id?: number;
  name?: string;
  fileCount?: number;
  userId?: number;
  parentFolderId?: number;
  isPinned?: boolean;
  files?: File[];
  childFolders?: Folder[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: null;
}

export interface StorageQuota {
  quotaDetails: {
    isPassingQuota: boolean;
    quotaLimit: number;
    quotaUsed: number;
    quotaRemaining: number;
  };
}

export interface FolderProps {
  folders: Folder[];
}

interface File {
  id?: number;
  originalFileName?: string;
  size?: number;
  type?: string;
  url?: string;
  secureUrl?: string;
  publicId?: string;
  userId?: number;
  folderId?: number | null;
  resourceType?: string;
  format?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: null;
}

export interface CustomFile {
  size: number;
}
export interface FileProps {
  files: File[];
}

interface ApiResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
  error: null | string;
}

interface GlobalContextType {
  folders: Folder[];
  files: File[];
  trashFolders: Folder[];
  trashFiles: File[];
  setTrashFolders: (folders: Folder[]) => void;
  setTrashFiles: (files: File[]) => void;
  setFolders: (folders: Folder[]) => void;
  setFiles: (files: File[]) => void;
  refreshData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  trashFolderMessage: string;
  setTrashFolderMessage: (message: string) => void;
  trashFileMessage: string;
  setTrashFileMessage: (message: string) => void;
  refreshFileData: () => Promise<void>;
  refreshFolderData: () => Promise<void>;
  refreshTrashData: () => Promise<void>;
  refreshTrashFolders: () => Promise<void>;
  refreshTrashFiles: () => Promise<void>;
  quota: StorageQuota;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const BASE_URL = "https://parkteletech-storage-backend-gzba.onrender.com/api/v1";

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [trashFolders, setTrashFolders] = useState<Folder[]>([]);
  const [trashFiles, setTrashFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trashFolderMessage, setTrashFolderMessage] = useState("");
  const [trashFileMessage, setTrashFileMessage] = useState("");
  const [quota, setQuota] = useState<StorageQuota>({
    quotaDetails: {
      isPassingQuota: false,
      quotaLimit: 0,
      quotaUsed: 0,
      quotaRemaining: 0,
    },
  });

  const user = JSON.parse(localStorage.getItem(USER_KEY) || "{}");
  const userId = user.id;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  const fetchData = useCallback(
    async <T,>(endpoint: string): Promise<T | null> => {
      if (!userId || !token) {
        setError("User not authenticated");
        return null;
      }

      try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse<T> = await response.json();

        if (result.status !== "success") {
          throw new Error(result.message || "API request failed");
        }

        return result.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        return null;
      }
    },
    [userId, token]
  );

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch folders data
      const folderData = await fetchData<FolderProps>(
        `/folders/user/${userId}`
      );
      if (folderData) {
        setFolders(folderData.folders);
      }

      // Fetch files data
      const fileData = await fetchData<FileProps>(`/files/${userId}`);
      if (fileData) {
        setFiles(fileData.files);
      }

      // Fetch trash data
      const trashedFolders = await fetchData<FolderProps>(
        `/folders/user/${userId}/deleted`
      );
      if (trashedFolders) {
        setTrashFolders(trashedFolders.folders);
      }

      const trashedFiles = await fetchData<FileProps>(`/files/soft/${userId}`);
      if (trashedFiles) {
        setTrashFiles(trashedFiles.files);
      }

      // Fetch storage quota
      const quota = await fetchData<StorageQuota>(`/users/${userId}/quota`);
      if (quota) {
        setQuota(quota);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchData]);

  const refreshFileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch files data
      const fileData = await fetchData<FileProps>(`/files/${userId}`);
      if (fileData) {
        setFiles(fileData.files);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchData]);

  const refreshFolderData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch folders data
      const folderData = await fetchData<FolderProps>(
        `/folders/user/${userId}`
      );
      if (folderData) {
        setFolders(folderData.folders);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchData]);

  const refreshTrashFolders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch trash data
      const trashedFolders = await fetchData<FolderProps>(
        `/folders/user/${userId}/deleted`
      );
      if (trashedFolders) {
        setTrashFolders(trashedFolders.folders);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchData]);
  const refreshTrashFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch trash data
      const trashedFiles = await fetchData<FileProps>(`/files/soft/${userId}`);
      if (trashedFiles) {
        setTrashFiles(trashedFiles.files);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchData]);

  // Initial data fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const refreshTrashData = useCallback(async () => {
    refreshTrashFiles();
    refreshTrashFolders();
  }, [refreshTrashFiles, refreshTrashFolders]);

  const contextValue: GlobalContextType = {
    folders,
    files,
    trashFolders,
    trashFiles,
    setTrashFolders,
    setTrashFiles,
    setFolders,
    setFiles,
    refreshData,
    isLoading,
    error,
    trashFolderMessage,
    setTrashFolderMessage,
    trashFileMessage,
    setTrashFileMessage,
    refreshFileData,
    refreshFolderData,
    refreshTrashData,
    refreshTrashFolders,
    refreshTrashFiles,
    quota,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
