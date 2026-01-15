// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useTableMutations } from "../hooks/useTables";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Navbar from "../components/Navbar";

// const Payment = () => {
//   const navigate = useNavigate();
//   const { tableId } = useParams();
//   const { processPayment } = useTableMutations();

//   const [cardNumber, setCardNumber] = useState("");
//   const [cardName, setCardName] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvc, setCvc] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ===============================
//      🔐 BLOCK BACK / FORWARD / REFRESH
//   =============================== */
//   useEffect(() => {
//     const paymentDone = localStorage.getItem("paymentDone");

//     // agar payment already ho chuki ho
//     if (paymentDone) {
//       navigate("/orders", { replace: true });
//     }

//     // back button block
//     const handlePopState = () => {
//       toast.error("Please complete payment first!");
//       window.history.pushState(null, "", window.location.href);
//     };

//     window.history.pushState(null, "", window.location.href);
//     window.addEventListener("popstate", handlePopState);

//     // refresh / tab close warning
//     const handleBeforeUnload = (e) => {
//       e.preventDefault();
//       e.returnValue = "";
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("popstate", handlePopState);
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [navigate]);

//   /* ===============================
//      ❌ NO TABLE ID
//   =============================== */
//   if (!tableId) {
//     return <p className="text-red-500 text-center mt-10">No table selected!</p>;
//   }

//   /* ===============================
//      💳 PAYMENT HANDLER
//   =============================== */
//   const handlePayNow = () => {
//     if (!cardNumber || !cardName || !expiry || !cvc) {
//       toast.error("Please fill all payment fields");
//       return;
//     }

//     setLoading(true);

//     processPayment.mutate(
//       {
//         tableId,
//         paymentMethod: "card",
//         transactionId: Math.random().toString(36).substring(2, 12),
//       },
//       {
//         onSuccess: (data) => {
//           toast.success(data.message || "Payment Successful!");

//           // 🔐 payment lock
//           localStorage.setItem("paymentDone", "true");

//           // history se payment page remove
//           navigate("/orders", {
//             replace: true,
//             state: { tableId },
//           });
//         },
//         onError: (err) => {
//           toast.error(
//             err.response?.data?.message || err.message || "Payment Failed!"
//           );
//         },
//         onSettled: () => setLoading(false),
//       }
//     );
//   };

//   /* ===============================
//      🖥️ UI
//   =============================== */
//   return (
//     <>
//       <Navbar />

//       <div className="min-h-screen flex items-center justify-center bg-[#181C14] p-6">
//         <ToastContainer position="top-right" autoClose={3000} />

//         <div className="bg-black/30 shadow-amber-400 backdrop-blur-md rounded-xl p-8 max-w-md w-full flex flex-col gap-4">
//           <h1 className="text-2xl font-bold text-[#D4AF37] text-center">
//             💳 Payment
//           </h1>

//           <input
//             type="text"
//             placeholder="Card Number"
//             value={cardNumber}
//             onChange={(e) => setCardNumber(e.target.value)}
//             className="border border-[#D4AF37] bg-transparent text-[#D4AF37] p-3 rounded focus:outline-none"
//           />

//           <input
//             type="text"
//             placeholder="Cardholder Name"
//             value={cardName}
//             onChange={(e) => setCardName(e.target.value)}
//             className="border border-[#D4AF37] bg-transparent text-[#D4AF37] p-3 rounded focus:outline-none"
//           />

//           <div className="flex gap-3">
//             <input
//               type="text"
//               placeholder="MM/YY"
//               value={expiry}
//               onChange={(e) => setExpiry(e.target.value)}
//               className="flex-1 border border-[#D4AF37] bg-transparent text-[#D4AF37] p-3 rounded focus:outline-none"
//             />
//             <input
//               type="text"
//               placeholder="CVC"
//               value={cvc}
//               onChange={(e) => setCvc(e.target.value)}
//               className="w-24 border border-[#D4AF37] bg-transparent text-[#D4AF37] p-3 rounded focus:outline-none"
//             />
//           </div>

//           <button
//             onClick={handlePayNow}
//             disabled={loading}
//             className="bg-[#D4AF37] cursor-pointer text-black font-semibold rounded-lg p-3 hover:bg-yellow-500 transition disabled:opacity-50"
//           >
//             {loading ? "Processing..." : "Pay Now"}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Payment;
import React from 'react'

const Payment = () => {
  return (
    <div>
      c
    </div>
  )
}

export default Payment
