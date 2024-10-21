import { useApi } from "@/hooks/context/GlobalContext";

const ErrorHandler = () => {
  const { refreshData } = useApi();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-red-500">
        Something went wrong, try again after sometime
      </div>
      <div className="items-center justify-center">
        <button
          onClick={() => {
            refreshData();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Refresh the page
        </button>
      </div>
    </div>
  );
};

export default ErrorHandler;
