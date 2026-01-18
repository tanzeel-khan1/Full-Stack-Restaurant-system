import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../utils/api";

/* =======================
   GET all restaurant reviews (ADMIN / PUBLIC)
   ======================= */
// export const useAllReviews = () => {
//   return useQuery({
//     queryKey: ["reviews"],
//     queryFn: async () => {
//       const { data } = await API.get("/reviews");
//       return data;
//     },
//   });
// };
export const useAllReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await API.get("/reviews");
      // Har review mein id add kar do
      return data.map(r => ({ ...r, id: r._id || r.id }));
    },
  });
};

/* =======================
   GET logged-in user's reviews
   ======================= */
export const useMyReviews = () => {
  return useQuery({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      const { data } = await API.get("/reviews/my");
      return data;
    },
  });
};

/* =======================
   CREATE restaurant review
   ======================= */
export const useCreateReview = () => {
  return useMutation({
    mutationFn: async ({ orderId, rating, comment }) => {
      const { data } = await API.post(
        `/reviews/${orderId}`,
        { rating, comment }
      );
      return data;
    },
  });
};


/* =======================
   DELETE restaurant review
   ======================= */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId) => {
      const { data } = await API.delete(`/reviews/${reviewId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      queryClient.invalidateQueries(["my-reviews"]);
    },
  });
};

