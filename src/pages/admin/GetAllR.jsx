// import React from "react";
// import { useAllReviews, useDeleteReview } from "../../hooks/useReview";

// const GetAllR = () => {
//   const { data: reviews, isLoading, error } = useAllReviews();
//   const deleteReview = useDeleteReview();

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading reviews</div>;

//   return (
//     <div>
//       {reviews.map((review) => (
//         <div
//           key={review._id}
//           style={{
//             marginBottom: "15px",
//             border: "1px solid #ccc",
//             padding: "10px",
//           }}
//         >
//           <p><strong>User:</strong> {review.userName}</p>
//           <p><strong>Rating:</strong> {review.rating} ⭐</p>
//           <p><strong>Comment:</strong> {review.comment}</p>
//           <button
//             onClick={() => deleteReview.mutate(review._id)}
//             disabled={!review._id}
//           >
//             Delete
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default GetAllR;
import React from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useAllReviews, useDeleteReview } from "../../hooks/useReview";

const GetAllReviews = () => {
  const { data: reviews = [], isLoading, isError } = useAllReviews();
  const deleteReview = useDeleteReview();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview.mutate(id, {
        onSuccess: () => toast.success("Review deleted successfully"),
        onError: () => toast.error("Failed to delete review"),
      });
    }
  };

  if (isLoading)
    return (
      <p className="text-center mt-10 text-amber-400">
        Loading reviews...
      </p>
    );

  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load reviews.
      </p>
    );

  return (
    <div className="min-h-screen bg-[#181C14] text-amber-400 p-6">
      <Toaster />

      {/* 🔙 Back Button */}
      <Link
        to="/admin"
        className="flex items-center gap-2 w-fit bg-transparent border border-amber-400 mb-5
        rounded-md px-3 py-2 cursor-pointer text-amber-400 text-sm md:text-base 
        shadow-md transition-all duration-300 ease-in-out
        hover:-translate-y-0.5 hover:shadow-[0_0_20px_4px_rgba(251,191,36,0.8)]"
      >
        <FaLongArrowAltLeft />
        <span>Go Back</span>
      </Link>

      <h1 className="text-2xl font-bold mb-6">
        All Reviews (Admin)
      </h1>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-[#20251C] border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-[#2B3224] text-amber-400">
            <tr>
              <th className="py-3 px-4 border-b border-gray-700">#</th>
              <th className="py-3 px-4 border-b border-gray-700">User</th>
              <th className="py-3 px-4 border-b border-gray-700">Rating</th>
              <th className="py-3 px-4 border-b border-gray-700">Comment</th>
              <th className="py-3 px-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <motion.tr
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-[#2B3224] transition"
                >
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    {index + 1}
                  </td>

                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    {review.userName || "Unknown"}
                  </td>

                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    <span className="px-2 py-1 rounded-full bg-yellow-900 text-yellow-400 text-sm">
                      {review.rating} ⭐
                    </span>
                  </td>

                  <td className="py-3 px-4 border-b border-gray-700 text-center max-w-xs truncate">
                    {review.comment}
                  </td>

                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    <button
                      onClick={() => handleDelete(review._id)}
                      disabled={deleteReview.isLoading}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition cursor-pointer"
                    >
                      {deleteReview.isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-400 font-medium"
                >
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllReviews;
