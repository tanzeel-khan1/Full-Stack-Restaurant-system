import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../utils/api";

/* =======================
   GET all contact messages
   ======================= */
export const useContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data } = await API.get("/contact");
      return data;
    },
  });
};

/* =======================
   CREATE contact message
   ======================= */
export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactData) => {
      const { data } = await API.post("/contact", contactData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts"]);
    },
  });
};
