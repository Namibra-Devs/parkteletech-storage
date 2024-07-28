import { Grid } from "lucide-react";

const GridComponent = () => {
  return (
    <div className="flex gap-1">
      <Grid />
      <p className="hidden lg:block">Grid</p>
    </div>
  );
};

export default GridComponent;
