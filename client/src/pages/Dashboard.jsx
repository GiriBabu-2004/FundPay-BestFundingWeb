import React, { useEffect, useState } from 'react';
import CampaignCard from '../components/CampaignCard';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { getAllCampaigns } from '../services/api.js';
import Footer from '../components/Footer.jsx';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllCampaigns();
        setCampaigns(res);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        setError('Failed to load campaigns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 px-6 py-10">

        {/* Header / Intro Section - Same as Admin */}
        <div className="max-w-5xl mx-auto text-center mb-12">
          <div className="backdrop-blur-md bg-white/40 p-8 rounded-2xl shadow-lg border border-white/30">
            <h1 className="text-3xl font-extrabold text-indigo-800 mb-3">
              Available Campaigns
            </h1>
            <p className="text-gray-700 leading-relaxed text-md">
              Discover inspiring fundraising campaigns created by people just like you. 
              Join hands, support dreams, and help bring meaningful ideas to life.
            </p>
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : campaigns.length === 0 ? (
          <p className="text-center text-gray-600">No campaigns available yet.</p>
        ) : (
          
          /* Campaign Cards Grid - Matching Admin */
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {campaigns.map(campaign => (
              <div key={campaign._id} className="transform hover:scale-[1.02] transition-all">
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>

        )}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
