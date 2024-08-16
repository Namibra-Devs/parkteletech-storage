import {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
} from "react";

interface Folder {
  id: number;
  name: string;
  fileCount: number | null;
  user_id: number;
  parent_id: number | null;
}

interface File {
  id: number;
  name: string;
  size: number | null;
  user_id: number;
  folder_id: number | null;
}

interface GlobalContextType {
  folders: Folder[];
  files: File[];
  setFolders: Dispatch<SetStateAction<Folder[]>>;
  setFiles: Dispatch<SetStateAction<File[]>>;
  refreshFolderData: () => Promise<void>;
  refreshFileData: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  console.log(token)

  const fetchFolders = useCallback(async () => {
    try {
      const response = await fetch(
        `https://www.parkteletechafrica.com/api/folders?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.log(error);
    }
  }, [userId, token]);

  const fetchFiles = useCallback(async () => {
    try {
      const response = await fetch(
        `https://www.parkteletechafrica.com/api/files?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.log(error);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchFolders();
    fetchFiles();
  }, [fetchFolders, fetchFiles]);

  const refreshFolderData = useCallback(async () => {
    await fetchFolders();
  }, [fetchFolders]);

  const refreshFileData = useCallback(async () => {
    await fetchFiles();
  }, [fetchFiles]);

  return (
    <GlobalContext.Provider
      value={{
        folders,
        files,
        setFolders,
        setFiles,
        refreshFileData,
        refreshFolderData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useApi must be used within a ApiProvider");
  }
  return context;
};
