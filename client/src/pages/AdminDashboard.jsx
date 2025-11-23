import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllCampaigns } from '../services/api.js';
import Navbar from '../components/Navbar';
import CampaignCard from '../components/CampaignCard';
import Loader from '../components/Loader';
import Footer from '../components/Footer.jsx';

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  const fetchCampaigns = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getAllCampaigns();
      setCampaigns(data);
    } catch (error) {
      setFetchError('Failed to fetch campaigns. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCampaigns();
    }
  }, [isAdmin]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-700">
        <p>Checking authorization...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 px-6 py-10">

        {/* Header / Intro Section */}
        <div className="max-w-5xl mx-auto text-center mb-12">
          <div className="backdrop-blur-md bg-white/40 p-8 rounded-2xl shadow-lg border border-white/30">
            <h1 className="text-3xl font-extrabold text-indigo-800 mb-3">
              Admin Dashboard
            </h1>
            <p className="text-gray-700 leading-relaxed text-md">
              FundPay brings visionaries and supporters together, transforming bold ideas into 
              reality through collaborative funding, shared purpose, and the power of people 
              joining hands to build a better tomorrow.
            </p>
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : fetchError ? (
          /* Error Section */
          <div className="text-center max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md border">
            <p className="text-red-600 font-medium">{fetchError}</p>
            <button
              onClick={fetchCampaigns}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
            >
              Retry
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <p className="text-center text-gray-600">No campaigns found.</p>
        ) : (
          /* Campaign Cards Grid */
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {campaigns.map((campaign) => (
              <div className="transform hover:scale-[1.02] transition-all">
                <CampaignCard key={campaign._id} campaign={campaign} />
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
