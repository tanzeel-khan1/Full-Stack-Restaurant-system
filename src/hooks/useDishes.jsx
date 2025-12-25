import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../utils/api";

export const useDishes = () => {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: async () => {
      const { data } = await API.get("/dishes");
      return data;
    },
  });
};

export const useDishById = (dishId) => {
  return useQuery({
    queryKey: ["dish", dishId],
    queryFn: async () => {
      const { data } = await API.get(`/dishes/${dishId}`);
      return data;
    },
    enabled: !!dishId,
  });
};

export const useCreateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newDish) => {
      const { data } = await API.post("/dishes", newDish);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dishes"]);
    },
  });
};

export const useUpdateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updatedDish }) => {
      const { data } = await API.put(`/dishes/${id}`, updatedDish);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dishes"]);
    },
  });
};

export const useDeleteDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await API.delete(`/dishes/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dishes"]);
    },
  });
};
