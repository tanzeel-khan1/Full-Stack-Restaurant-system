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


// export const useOrdersByUser = (userId) => {
//   return useQuery({
//     queryKey: ["ordersByUser", userId],
//     queryFn: async () => {
//       const { data } = await API.get(`/orders/user/${userId}`);
//       return data;
//     },
//     enabled: !!userId,
//   });
// };
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
