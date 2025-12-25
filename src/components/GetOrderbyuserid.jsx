import { useAuth } from "../context/AuthContext";
import { useOrdersByUser } from "../hooks/useOrders";
import { RotatingLines } from "react-loader-spinner";

function GetOrderByUserId() {
  const { user } = useAuth();
  const userId = user?._id;

  const { data: orders, isLoading, isError } = useOrdersByUser(userId);

  
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <RotatingLines strokeColor="gold" width="50" />
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500 py-6">
        Error fetching your orders.
      </div>
    );
  if (!orders || orders.length === 0)
    return (
      <div className="text-center text-gray-400 py-6">
        No Orders Found For You
      </div>
    );

  return (
    <div className="max-w-full mx-auto p-10 bg-[#181C14] ">
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-400">
        Your Recent Orders
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orders.slice(0, 3).map((order) => (
          <div
            key={order._id}
            className=" bg-slate-800/40 rounded-2xl shadow-lg p-6 transition hover:scale-[1.03] hover:shadow-amber-500"
          >
            <div className="flex justify-between items-center mb-4">
              {/* <p className="text-sm text-gray-300">
                ID:{" "}
                <span className="font-mono text-amber-400">
                  {order._id.slice(-6)}
                </span>
              </p> */}
              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <h2 className="font-semibold text-amber-400">Dishes:</h2>
              {order.dishes.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-[#09122C] px-3 py-2 rounded-lg text-gray-200"
                >
                  <span>
                    {item.dish?.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-amber-400">
                    $.{item.dish?.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-amber-400">
                Total: $.{order.totalPrice}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetOrderByUserId;
