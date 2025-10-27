'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Upload, X, MapPin, DollarSign, User, FileText, Folder } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import AnimatedButton from '../ui/AnimatedButton';

interface DonationFormData {
  donor: string;
  recipient: string;
  amount: string;
  description: string;
  campaign: string;
  geo_lat: string;
  geo_lng: string;
}

interface DonationFormProps {
  onSubmit: (data: DonationFormData, files: File[]) => void;
  loading?: boolean;
}

export default function DonationForm({ onSubmit, loading = false }: DonationFormProps) {
  const [formData, setFormData] = useState<DonationFormData>({
    donor: '',
    recipient: '',
    amount: '',
    description: '',
    campaign: 'General',
    geo_lat: '',
    geo_lng: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, files);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          geo_lat: position.coords.latitude.toString(),
          geo_lng: position.coords.longitude.toString(),
        });
      });
    }
  };

  return (
    <GlassCard className="p-8" gradient>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Submit Donation</h2>
          <p className="text-gray-300">Provide evidence and let AI verify your impact</p>
        </div>

        {/* Donor Address */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Donor Wallet Address
          </label>
          <input
            type="text"
            name="donor"
            value={formData.donor}
            onChange={handleChange}
            required
            placeholder="0x..."
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </motion.div>

        {/* Recipient Address */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Recipient Address
          </label>
          <input
            type="text"
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            required
            placeholder="School, hospital, NGO address..."
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </motion.div>

        {/* Amount & Campaign */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <DollarSign className="inline w-4 h-4 mr-2" />
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
              placeholder="1000"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Folder className="inline w-4 h-4 mr-2" />
              Campaign
            </label>
            <select
              name="campaign"
              value={formData.campaign}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="General">General</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Disaster Relief">Disaster Relief</option>
              <option value="Environment">Environment</option>
              <option value="Animal Welfare">Animal Welfare</option>
            </select>
          </motion.div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <FileText className="inline w-4 h-4 mr-2" />
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe your donation, what it was used for, and any details that can help verification..."
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
          />
        </motion.div>

        {/* Geo Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MapPin className="inline w-4 h-4 mr-2" />
            Location (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="geo_lat"
              value={formData.geo_lat}
              onChange={handleChange}
              placeholder="Latitude"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              name="geo_lng"
              value={formData.geo_lng}
              onChange={handleChange}
              placeholder="Longitude"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <AnimatedButton
              type="button"
              onClick={getLocation}
              variant="glass"
              size="md"
            >
              <MapPin className="w-5 h-5" />
            </AnimatedButton>
          </div>
        </motion.div>

        {/* File Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Upload className="inline w-4 h-4 mr-2" />
            Evidence Files (Receipt, Photos, etc.)
          </label>
          
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? 'border-green-500 bg-green-500/10'
                : 'border-white/20 bg-white/5 hover:border-white/40'
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-white mb-2">Drop files here or click to upload</p>
            <p className="text-sm text-gray-400">Supports: Images, PDFs (Max 10MB each)</p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-2"
            >
              {files.map((file, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between bg-white/5 border border-white/20 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white text-sm font-medium">{file.name}</p>
                      <p className="text-gray-400 text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <AnimatedButton
            type="submit"
            variant="success"
            size="lg"
            loading={loading}
            disabled={loading}
            glow
            className="w-full"
          >
            {loading ? 'Submitting...' : 'Submit Donation'}
          </AnimatedButton>
        </motion.div>
      </form>
    </GlassCard>
  );
}
