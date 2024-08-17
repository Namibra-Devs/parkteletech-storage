import React from "react";
import { Button } from "../ui/button";

interface ImageCardProps {
  name: string;
  size: number;
  url: string;
}
const ImageCard: React.FC<ImageCardProps> = ({name, size, url}) => {
  return (
    <div className="flex items-center h-[40px] w-full rounded-sm ">
      <div className="h-[40px] w-[40px]">
        <img
          src={`${url}` || "https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
          alt="image"
          className="h-full w-full object-cover rounded-sm"
        />
      </div>
      <div className="flex items-center justify-between">
      <div className="flex flex-col flex-1 ml-2">
        <p className="text-[12px] font-medium">{name || "IMG_4985.HEIC"}</p>
        <p className="text-[8px] font-medium text-gray-600">{size || "1.2 MB"}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button className="text-[8px] font-medium text-gray-600">Download</Button>
        <Button className="text-[8px] font-medium text-gray-600">Delete</Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
