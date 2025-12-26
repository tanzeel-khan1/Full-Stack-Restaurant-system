// // src/hooks/useTables.js
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import API from "../utils/api";

// export const useTables = () => {
//   return useQuery({
//     queryKey: ["tables"],
//     queryFn: async () => {
//       const { data } = await API.get("/tables");
//       return data;
//     },
//   });
// };


// export const useTablesByUserId = (userId) => {
//   return useQuery({
//     queryKey: ["tables", userId],
//     queryFn: async () => {
//       const { data } = await API.get(`/tables/user/${userId}`);
//       return data.tables; // ✅ sirf array return
//     },
//     enabled: !!userId, // 🔥 important
//   });
// };

// export const useTableById = (id) => {
//   return useQuery({
//     queryKey: ["table", id],
//     queryFn: async () => {
//       const { data } = await API.get(`/tables/${id}`);
//       return data;
//     },
//     enabled: !!id,
//   });
// };

// export const useTableMutations = () => {
//   const queryClient = useQueryClient();

//   const createTable = useMutation({
//     mutationFn: async (newTable) => {
//       const { data } = await API.post("/tables", newTable);
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["tables"]);
//     },
//   });

//   const updateTable = useMutation({
//     mutationFn: async ({ id, payload }) => {
//       const { data } = await API.put(`/tables/${id}`, payload);
//       return data;
//     },
//     onSuccess: (_, { id }) => {
//       queryClient.invalidateQueries(["tables"]);
//       queryClient.invalidateQueries(["table", id]);
//     },
//   });

//   const deleteTable = useMutation({
//     mutationFn: async (id) => {
//       await API.delete(`/tables/${id}`);
//       return id;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["tables"]);
//     },
//   });

//   return { createTable, updateTable, deleteTable };
// };
// src/hooks/useTables.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../utils/api";

export const useTables = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data } = await API.get("/tables");
      return data;
    },
  });
};

export const useTablesByUserId = (userId) => {
  return useQuery({
    queryKey: ["tables", userId],
    queryFn: async () => {
      const { data } = await API.get(`/tables/user/${userId}`);
      return data.tables; // sirf array return
    },
    enabled: !!userId,
  });
};

export const useTableById = (id) => {
  return useQuery({
    queryKey: ["table", id],
    queryFn: async () => {
      const { data } = await API.get(`/tables/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useTableMutations = () => {
  const queryClient = useQueryClient();

  const createTable = useMutation({
    mutationFn: async (newTable) => {
      const { data } = await API.post("/tables", newTable);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tables"]);
    },
  });

  const updateTable = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await API.put(`/tables/${id}`, payload);
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["tables"]);
      queryClient.invalidateQueries(["table", id]);
    },
  });

  const deleteTable = useMutation({
    mutationFn: async (id) => {
      await API.delete(`/tables/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tables"]);
    },
  });

  // ✅ New mutation for processing payment
  const processPayment = useMutation({
    mutationFn: async ({ tableId, paymentMethod, transactionId }) => {
      const { data } = await API.post(`/tables/${tableId}/payment`, {
        paymentMethod,
        transactionId,
      });
      return data;
    },
    onSuccess: (_, { tableId }) => {
      queryClient.invalidateQueries(["tables"]);
      queryClient.invalidateQueries(["table", tableId]);
    },
  });

  return { createTable, updateTable, deleteTable, processPayment };
};
