const ImageCard = () => {
  return (
    <div className="flex items-center h-[40px] w-full rounded-sm ">
      <div className="h-[40px] w-[40px]">
        <img
          src="https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="image"
          className="h-full w-full object-cover rounded-sm"
        />
      </div>
      <div className="flex flex-col flex-1 ml-2">
        <p className="text-[12px] font-medium">IMG_4985.HEIC</p>
        <p className="text-[8px] font-medium text-gray-600">1.2 MB</p>
      </div>
    </div>
  );
};

export default ImageCard;
