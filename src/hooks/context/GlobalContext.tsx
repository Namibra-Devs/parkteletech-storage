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
  trashFolders: Folder[];
  trashFiles: File[];
  setTrashFolders: Dispatch<SetStateAction<Folder[]>>;
  setTrashFiles: Dispatch<SetStateAction<File[]>>;
  setFolders: Dispatch<SetStateAction<Folder[]>>;
  setFiles: Dispatch<SetStateAction<File[]>>;
  refreshFolderData: () => Promise<void>;
  refreshFileData: () => Promise<void>;
  refreshTrashFolderData: () => Promise<void>;
  refreshTrashFileData: () => Promise<void>;
  trashFolderMessage: string;
  setTrashFolderMessage: Dispatch<SetStateAction<string>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [trashFolders, setTrashFolders] = useState<Folder[]>([]);
  const [trashFiles, setTrashFiles] = useState<File[]>([]);
  const [trashFolderMessage, setTrashFolderMessage] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

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
      const data = await response.json()
      setFiles(data);
    } catch (error) {
      console.log(error);
    }
  }, [userId, token]);

  const fetchTrashFolders = useCallback(async () => {
    try {
      const response = await fetch(
        `https://www.parkteletechafrica.com/api/folders/trash?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      const data = await response.json();

      const message = data.message;
      setTrashFolderMessage(message);
      setTrashFolders(data.data);
    } catch (error) {
      console.log(error);
    }
  }, [token, userId]);

  const fetchTrashFiles = useCallback(async () => {
    try {
      const response = await fetch(
        `https://www.parkteletechafrica.com/api/files/trash}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      const data = await response.json();
      setTrashFiles(data.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    fetchFolders();
    fetchFiles();
    fetchTrashFolders();
    fetchTrashFiles();
  }, [fetchFolders, fetchFiles, fetchTrashFolders, fetchTrashFiles]);

  const refreshFolderData = useCallback(async () => {
    await fetchFolders();
  }, [fetchFolders]);

  const refreshFileData = useCallback(async () => {
    await fetchFiles();
  }, [fetchFiles]);

  const refreshTrashFolderData = useCallback(async () => {
    await fetchTrashFolders();
  }, [fetchTrashFolders]);

  const refreshTrashFileData = useCallback(async () => {
    await fetchTrashFiles();
  }, [fetchTrashFiles]);

  return (
    <GlobalContext.Provider
      value={{
        folders,
        files,
        setFolders,
        setFiles,
        refreshFileData,
        refreshFolderData,
        trashFolders,
        trashFiles,
        setTrashFolders,
        setTrashFiles,
        refreshTrashFolderData,
        refreshTrashFileData,
        trashFolderMessage,
        setTrashFolderMessage,
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
