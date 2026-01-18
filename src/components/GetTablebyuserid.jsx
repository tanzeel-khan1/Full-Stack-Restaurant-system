import { useAuth } from "../context/AuthContext";
import { useTablesByUserId } from "../hooks/useTables";
import { RotatingLines } from "react-loader-spinner";

function GetTablebyuserid() {
  const { user } = useAuth();
  const userId = user?._id;

  const { data: tables, isLoading, isError } = useTablesByUserId(userId);

  if (isLoading)
    return (
      <div className="flex justify-center  items-center h-screen">
        <RotatingLines strokeColor="gold" width="50" />
      </div>
    );
  

  if (isError)
    return (
      <div className="text-center text-red-500 py-6">
        Error fetching your tables.
      </div>
    );

  if (!tables || tables.length === 0)
    return (
      <div className="text-center  bg-[#181C14] text-gray-400 py-6">
        No Tables Found For You
      </div>
    );

  return (
    <div className="max-w-full mx-auto p-10 bg-[#181C14] ">
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-400">
        Your Recent Tables
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tables.slice(0, 3).map((table) => (
          <div
            key={table._id}
            className="bg-slate-800/40 rounded-2xl shadow-lg p-6 transition hover:scale-[1.03] hover:shadow-amber-500"
          >
            <div className="flex justify-between items-center mb-4">
              {/* <p className="text-sm text-gray-300">
                ID:{" "}
                <span className="font-mono text-amber-400">
                  {table._id.slice(-6)}
                </span>
              </p> */}
              {table.reservationDateTime && (
                <p className="text-xs text-gray-400">
                  {new Date(table.reservationDateTime).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <h2 className="font-semibold text-amber-400">Details:</h2>
              <div className="flex justify-between bg-[#09122C] px-3 py-2 rounded-lg text-gray-200">
                <span>Capacity</span>
                <span className="font-medium text-amber-400">
                  {table.capacity}
                </span>
              </div>
              <div className="flex justify-between bg-[#09122C] px-3 py-2 rounded-lg text-gray-200">
                <span>Category</span>
                <span className="font-medium text-amber-400">
                  {table.category}
                </span>
                
              </div>
            </div>
             <div className="flex justify-between bg-[#09122C] px-3 py-2 rounded-lg text-gray-200">
                <span>Total</span>
                <span className="font-medium text-amber-400">
                  {table.price}
                </span>
                
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetTablebyuserid;
