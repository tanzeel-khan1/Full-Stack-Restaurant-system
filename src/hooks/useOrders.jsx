import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../utils/api"; 

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await API.get("/orders");
      return data;
    },
  });
};

export const useOrderById = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data } = await API.get(`/orders/${orderId}`);
      return data;
    },
    enabled: !!orderId, 
  });
};

export const useOrdersByUser = (userId) => {
  return useQuery({
    queryKey: ["ordersByUser", userId],
    queryFn: async () => {
      const { data } = await API.get(`/orders/user/${userId}`);
      return data.orders; // ✅ sirf array return
    },
    enabled: !!userId,
  });
};


export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newOrder) => {
      const { data } = await API.post("/orders", newOrder);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updatedOrder }) => {
      const { data } = await API.put(`/orders/${id}`, updatedOrder);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await API.delete(`/orders/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
};

export const useIncompleteOrders = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["incompleteOrders"],
    queryFn: async () => {
      const { data } = await API.get("/orders/incomplete");
      return data.orders;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]); // refresh all orders if needed
    },
  });
};

// Add this to your hooks file along with your other useOrders hooks
export const useMarkOrderAsCompleted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId) => {
      const { data } = await API.put(`/orders/complete/${orderId}`);
      return data;
    },
    onSuccess: (data) => {
      // Refresh all orders and the specific order
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["order", data.order._id]);
      queryClient.invalidateQueries(["incompleteOrders"]);
    },
  });
};

export const useOrdersByUserNameAndDate = ({ name, date }) => {
  return useQuery({
    queryKey: ["ordersByUserAndDate", name, date],
    queryFn: async () => {
      const { data } = await API.post("/orders/getname", { name, date });
      return data.orders; // only return the orders array
    },
    enabled: !!name && !!date, // only fetch if both are provided
  });
};
