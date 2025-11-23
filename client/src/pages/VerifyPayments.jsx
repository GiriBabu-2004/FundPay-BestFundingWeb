import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiLoader, FiX } from 'react-icons/fi';
import { getPendingPayments, verifyPayment, rejectPayment } from '../services/api.js';
import { formatCurrency } from '../utils/formatCurrency';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.03, boxShadow: '0px 10px 20px rgba(0,0,0,0.12)' },
};

const buttonVariants = { tap: { scale: 0.95 } };

const VerifyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPendingPayments();
        setPayments(data);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleVerify = async (paymentId) => {
    setVerifying(paymentId);
    try {
      await verifyPayment(paymentId);
      setPayments((prev) => prev.filter((p) => p._id !== paymentId));
    } catch (error) {
      alert('Verification failed. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setVerifying(null);
    }
  };

  const handleReject = async (paymentId) => {
    setRejecting(paymentId);
    try {
      await rejectPayment(paymentId);
      setPayments((prev) => prev.filter((p) => p._id !== paymentId));
    } catch (error) {
      alert('Rejection failed. Please try again.');
      console.error('Rejection error:', error);
    } finally {
      setRejecting(null);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-8 text-gray-600 text-lg">Loading pending payments...</p>
    );
  if (payments.length === 0)
    return (
      <p className="text-center mt-8 text-gray-600 text-lg">
        No pending payments to verify.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 px-4 py-10">
       <div className="absolute top-4 left-4 flex items-center space-x-2">
        <img src="/FundLogo.png" alt="FundPay Logo" className="w-10 h-10" />
        <a href='/' className="text-2xl font-bold text-indigo-800">FundPay</a>
      </div>
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">Pending Payments</h2>

      <div className="max-w-5xl mx-auto grid gap-6">
        {payments.map((p) => {
          const imgUrl =
            p.screenshotUrl && p.screenshotUrl.startsWith('http')
              ? p.screenshotUrl
              : `http://localhost:5000${p.screenshotUrl?.trim()}`;

          return (
            <motion.div
              key={p._id}
              className="flex items-center p-4 border rounded-2xl shadow-sm space-x-6 bg-white hover:shadow-md transition"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ duration: 0.3 }}
            >
              {/* Payment Image */}
              <img
                src={imgUrl}
                alt={`Payment Screenshot for payment ID ${p._id}`}
                className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setModalImage(imgUrl)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-image.png';
                }}
              />

              {/* Payment Info */}
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-800">
                  Amount: {formatCurrency(p.amount)}
                </p>
                <p className="text-sm text-gray-500">Paid by: {p.user?.name || 'Unknown'}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => handleVerify(p._id)}
                  disabled={verifying === p._id || rejecting === p._id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                    verifying === p._id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  {verifying === p._id ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={20} />
                      Verify
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => handleReject(p._id)}
                  disabled={rejecting === p._id || verifying === p._id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                    rejecting === p._id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  {rejecting === p._id ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <FiXCircle size={20} />
                      Reject
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal for enlarged image */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setModalImage(null)}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking image
          >
            <img
              src={modalImage}
              alt="Enlarged payment screenshot"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 text-white text-2xl p-1 bg-black bg-opacity-40 rounded-full hover:bg-opacity-60 transition"
            >
              <FiX />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VerifyPayments;
