// import { Progress } from "@/components/ui/progress";
// import { HardDrive } from "lucide-react";

// interface StorageUsageProps {
//   usedBytes: number;
//   totalBytes?: number;
// }

// const StorageUsage = ({
//   usedBytes,
//   totalBytes = 20 * 1024 * 1024 * 1024,
// }: StorageUsageProps) => {
//   const formatFileSize = (bytes: number) => {
//     if (!bytes) return "Unknown size";
//     const sizes = ["B", "KB", "MB", "GB", "TB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(1024));
//     return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
//   };

//   const usagePercentage = (usedBytes / totalBytes) * 100;
//   const isLowStorage = usagePercentage > 90;

//   return (
//     <div className="w-full p-4 rounded-lg bg-background/95 border shadow-sm">
//       <div className="flex items-center gap-2 mb-2">
//         <HardDrive className="size-4 text-blue-600" />
//         <h3 className="text-sm font-medium">Storage Usage</h3>
//       </div>

//       <Progress
//         value={usagePercentage}
//         className={`h-2 ${isLowStorage ? "bg-red-100" : "bg-blue-100"}`}
//       />

//       <div className="mt-2 flex flex-col gap-1">
//         <div className="flex justify-between items-center text-xs text-muted-foreground">
//           <span>{formatFileSize(usedBytes)}</span>
//           <span>{formatFileSize(totalBytes)}</span>
//         </div>

//         <div className="text-xs text-center">
//           {isLowStorage ? (
//             <span className="text-red-600 font-medium">Low storage space!</span>
//           ) : (
//             <span className="text-muted-foreground">
//               {(100 - usagePercentage).toFixed(1)}% available
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StorageUsage;

import { Progress } from "@/components/ui/progress";
import { HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomFile } from "@/hooks/context/GlobalContext";

interface StorageUsageProps {
  files: CustomFile[];
  isMinimized?: boolean;
  totalBytes?: number;
}

const StorageUsage = ({
  files,
  isMinimized = false,
  totalBytes = 20 * 1024 * 1024 * 1024, // 20GB default
}: StorageUsageProps) => {
  // Calculate total storage by converting string sizes to numbers
  const calculateUsedStorage = (files: CustomFile[]) => {
    return files.reduce((total, file) => {
      const fileSize =
        typeof file.size === "string" ? parseInt(file.size, 10) : file.size;
      return total + (isNaN(fileSize) ? 0 : fileSize);
    }, 0);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const usedBytes = calculateUsedStorage(files);
  const usagePercentage = (usedBytes / totalBytes) * 100;
  const isLowStorage = usagePercentage > 90;

  return (
    <div
      className={cn(
        "rounded-lg bg-background/95 border shadow-sm",
        isMinimized ? "w-[70px]" : "p-2 w-64"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-2 mb-2",
          isMinimized && "justify-center"
        )}
      >
        <HardDrive className="size-2 md:size-4 text-blue-600" />
        {!isMinimized && <h3 className="text-sm font-medium">Storage Usage</h3>}
      </div>

      {/* Progress Bar */}
      <Progress
        value={usagePercentage}
        className={cn("h-2", isLowStorage ? "bg-red-100" : "bg-blue-100")}
      />

      {/* Storage Details */}
      {!isMinimized && (
        <div className="mt-2 flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{formatFileSize(usedBytes)}</span>
            <span>{formatFileSize(totalBytes)}</span>
          </div>

          <div className="text-xs text-center">
            {isLowStorage ? (
              <span className="text-red-600 font-medium">
                Low storage space!
              </span>
            ) : (
              <span className="text-muted-foreground">
                {(100 - usagePercentage).toFixed(1)}% available
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageUsage;
