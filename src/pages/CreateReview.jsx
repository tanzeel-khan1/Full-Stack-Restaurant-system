import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCreateReview } from "../hooks/useReview";
import { toast } from "sonner";

const CreateReview = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const {
    mutate: createReview,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useCreateReview();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderId) return alert("Order ID missing");

    createReview({ orderId, rating, comment });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Review added successfully!", {
        duration: 3000,
        playSound: true,
      });
      setTimeout(() => navigate("/"), 1000);
    }

    if (isError) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        playSound: true,
      });
    }
  }, [isSuccess, isError, error, navigate]);

  return (
    <div className="bg-[#181C14] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[430px] rounded-2xl border border-amber-500/30 bg-[#1f231a] p-7 shadow-2xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="mr-3 cursor-pointer rounded-lg border  border-amber-500/40 px-4 py-1.5 text-amber-400 hover:bg-amber-500/10 transition"
          >
            ← Back
          </button>
          <h2 className="text-lg font-semibold text-amber-400">Add Review</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating */}
          <div>
            <label className="block mb-2 text-sm font-medium text-amber-300">
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full rounded-xl border border-amber-500/30 bg-[#181C14] px-3 py-2 text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value={5}>⭐⭐⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={1}>⭐</option>
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="block mb-2 text-sm font-medium text-amber-300">
              Comment
            </label>
            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full rounded-xl border border-amber-500/30 bg-[#181C14] px-3 py-2 text-amber-200 placeholder-amber-400/40 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl cursor-pointer bg-amber-500 py-2.5 font-semibold text-[#181C14] hover:bg-amber-400 transition disabled:opacity-60"
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {/* Messages */}
        {isSuccess && (
          <p className="mt-4 text-sm text-green-400">
            Review added successfully! Redirecting...
          </p>
        )}

        {isError && (
          <p className="mt-4 text-sm text-red-400">
            {error?.response?.data?.message || "Something went wrong"}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateReview;
