import FileUpload from "@/components/shared/fileUpload-button";
import FolderCard from "@/components/shared/folder-card";
import GridComponent from "@/components/shared/grid";
import ListComponent from "@/components/shared/list";
import FolderButton from "@/components/shared/newFolder-button";

const DashboardPage = () => {
  const pinnedList = [1, 2, 3];
  const allFolders = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className="p-4 w-full h-full">
      <div className="w-full relative">
        <div className="flex gap-4 items-center right-0 absolute">
          <ListComponent />
          <div className="hidden lg:block">
            <GridComponent />
          </div>
          <FileUpload />
          <FolderButton />
        </div>
      </div>
      <div className="mt-10">
        <p className="font-semibold">Pinned Folders</p>
      </div>
      <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
        {pinnedList.map((item) => (
          <FolderCard key={item} />
        ))}
      </div>
      <div className="">
        <p className="font-semibold">All Folders</p>
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4 my-4">
          {allFolders.map((item) => (
            <FolderCard key={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
