import { List } from "lucide-react";

const ListComponent = () => {
  return (
    <div className="flex gap-1">
      <List />
      <p className="hidden lg:block">List</p>
    </div>
  );
};

export default ListComponent;
