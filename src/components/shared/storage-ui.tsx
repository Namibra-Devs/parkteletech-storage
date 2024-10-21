import { Progress } from "@/components/ui/progress";
import { HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

interface StorageUsageProps {
  isPassingQuota: boolean;
  quotaLimit: number;
  quotaUsed: number;
  quotaRemaining: number;
  isMinimized?: boolean;
  totalBytes?: number;
}

const StorageUsage = ({
  isPassingQuota,
  quotaLimit,
  quotaUsed,
  quotaRemaining,
  isMinimized = false,
}: StorageUsageProps) => {
  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const usagePercentage = (quotaUsed / quotaLimit) * 100;
  const isLowStorage = isPassingQuota;

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
        <HardDrive className="size-4 text-blue-600" />
        {!isMinimized && <h3 className="text-sm font-medium">Storage Usage</h3>}
      </div>

      {/* Progress Bar */}
      <Progress
        value={usagePercentage}
        className={cn("h-2", !isLowStorage ? "bg-red-100" : "bg-blue-100")}
      />

      {/* Storage Details */}
      {!isMinimized && (
        <div className="mt-2 flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{formatFileSize(quotaUsed)}</span>
            <span>{formatFileSize(quotaLimit)}</span>
          </div>

          <div className="text-xs text-center flex flex-col">
            {!isLowStorage ? (
              <span className="text-red-600 font-medium">
                Low storage space!
              </span>
            ) : (
              <span className="text-muted-foreground">
                {(100 - usagePercentage).toFixed(1)}% available
              </span>
            )}

            <span className="text-muted-foreground">
              {formatFileSize(quotaRemaining)} remaining
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageUsage;
