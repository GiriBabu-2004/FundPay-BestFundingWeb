import React, { useState } from 'react';
import { createCampaign } from '../services/api.js';
import { motion } from 'framer-motion';
import { FaImage, FaRupeeSign, FaUniversity, FaQrcode } from 'react-icons/fa';

const AddCampaign = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    targetAmount: '',
    upi: '',
    bank: '',
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (thumbnailFile) data.append('thumbnail', thumbnailFile);
      if (qrFile) data.append('qrCode', qrFile);

      await createCampaign(data);
      alert('✅ Campaign added successfully!');

      setForm({ title: '', description: '', targetAmount: '', upi: '', bank: '' });
      setThumbnailFile(null);
      setQrFile(null);
      e.target.reset();
    } catch (error) {
      console.error(error);
      alert('❌ Failed to add campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 px-6 py-10">
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <img src="/FundLogo.png" alt="FundPay Logo" className="w-10 h-10" />
        <a href='/' className="text-2xl font-bold text-indigo-800">FundPay</a>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="backdrop-blur-md bg-white/40 p-6 rounded-2xl shadow-lg border border-white/30 mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-indigo-800 mb-2">Create New Campaign</h1>
          <p className="text-gray-700 text-md leading-relaxed">
            Launch your fundraising campaign and reach supporters to make your vision a reality.
          </p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="backdrop-blur-md bg-white/60 p-8 rounded-2xl shadow-lg border border-white/30 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Title */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Campaign Title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the purpose of this campaign"
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-1 font-medium">
                <FaImage /> Thumbnail Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setThumbnailFile(e.target.files[0])}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-1 font-medium">
                <FaQrcode /> QR Code (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setQrFile(e.target.files[0])}
                className="w-full "
              />
            </div>
          </div>

          {/* Target Amount */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-1 font-medium">
              <FaRupeeSign /> Target Amount
            </label>
            <input
              type="number"
              name="targetAmount"
              value={form.targetAmount}
              onChange={handleChange}
              required
              min={1}
              placeholder="5000"
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* UPI ID */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">UPI ID</label>
            <input
              name="upi"
              value={form.upi}
              onChange={handleChange}
              placeholder="someone@upi"
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Bank Details */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-1 font-medium">
              <FaUniversity /> Bank Details
            </label>
            <input
              name="bank"
              value={form.bank}
              onChange={handleChange}
              placeholder="IFSC, Account No., etc."
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? 'Adding...' : 'Add Campaign'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AddCampaign;
