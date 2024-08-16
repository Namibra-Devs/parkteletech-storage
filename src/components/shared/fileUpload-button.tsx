import { CloudUploadIcon } from "lucide-react";

export default function FileUpload() {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="file-upload"
        className="inline-flex cursor-pointer items-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-950 border border-gray-200"
      >
        <CloudUploadIcon className="mr-2 h-5 w-5" />
        <p className="hidden lg:block">Upload File</p>
      </label>
      <input id="file-upload" type="file" multiple className="sr-only" />
    </div>
  );
}
