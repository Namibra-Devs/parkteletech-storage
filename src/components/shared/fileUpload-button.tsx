import { ACCESS_TOKEN_KEY } from "@/constants";
import { CloudUploadIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface FileUploadProps {
  folderId: number | null;
  refreshFileData: () => Promise<void>;
}

export default function FileUpload({
  folderId,
  refreshFileData,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("folderId", folderId ? folderId.toString() : "");
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const token = localStorage.getItem(ACCESS_TOKEN_KEY);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));

        xhr.open(
          "POST",
          "https://parkteletech-storage-backend.onrender.com/api/v1/files/multiple"
        );
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
      });

      await uploadPromise;
      toast.success("Files uploaded successfully");
      await refreshFileData();
    } catch (error) {
      toast.error("Failed to upload files");
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = ""; // Reset the file input
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="file-upload"
        className={`relative inline-flex cursor-pointer items-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-950 border border-gray-200 ${
          isUploading ? "opacity-80 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex items-center">
          {isUploading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <div className="flex flex-col">
                <p className="hidden lg:block">Uploading...</p>
                <p className="text-xs opacity-75">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <>
              <CloudUploadIcon className="mr-2 h-5 w-5" />
              <p className="hidden lg:block">Upload File</p>
            </>
          )}
        </div>
        {isUploading && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300 rounded-b-md"
            style={{ width: `${uploadProgress}%` }}
          />
        )}
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileUpload}
        multiple
        className="sr-only"
        disabled={isUploading}
      />
    </div>
  );
}
