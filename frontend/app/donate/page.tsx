'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ethers } from 'ethers';
import { API_BASE_URL } from '@/lib/contract';

export default function DonatePage() {
  const { address, contract, connect, connecting } = useWallet();
  const [formData, setFormData] = useState({
    amount: '',
    campaign: '',
    description: '',
    geo_lat: '',
    geo_lng: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState<'form' | 'uploading' | 'blockchain' | 'complete'>('form');
  const [donationId, setDonationId] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast.error('Please connect your wallet first');
      await connect();
      return;
    }

    if (files.length === 0) {
      toast.error('Please upload at least one evidence file');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    if (!formData.campaign) {
      toast.error('Please select a campaign');
      return;
    }

    try {
      setStep('uploading');
      
      // Prepare form data
      const uploadData = new FormData();
      uploadData.append('donor', address);
      uploadData.append('amount', formData.amount);
      uploadData.append('campaign', formData.campaign);
      if (formData.description) uploadData.append('description', formData.description);
      if (formData.geo_lat) uploadData.append('geo_lat', formData.geo_lat);
      if (formData.geo_lng) uploadData.append('geo_lng', formData.geo_lng);
      
      files.forEach((file) => {
        uploadData.append('files', file);
      });

      // Upload to backend
      toast.loading('Uploading evidence to IPFS...', { id: 'upload' });
      
      const response = await axios.post(`${API_BASE_URL}/api/donations`, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Evidence uploaded to IPFS!', { id: 'upload' });

      const { donationId: id, ipfsCID, txHash: backendTxHash } = response.data;
      
      setDonationId(id);
      
      // If backend already registered on blockchain, we're done
      if (backendTxHash) {
        setTxHash(backendTxHash);
        setStep('complete');
        toast.success('Donation registered on blockchain!');
        
        // Trigger verification
        await axios.post(`${API_BASE_URL}/api/donations/${id}/verify`);
        toast.success('Verification started!');
        
        return;
      }

      // Otherwise, client registers on blockchain
      if (contract) {
        setStep('blockchain');
        toast.loading('Confirming blockchain transaction...', { id: 'blockchain' });

        const amountWei = ethers.parseEther(formData.amount);
        
        const tx = await contract.registerDonation(
          address,
          amountWei,
          ipfsCID,
          formData.campaign
        );

        toast.loading('Waiting for confirmation...', { id: 'blockchain' });
        const receipt = await tx.wait();
        
        setTxHash(receipt.hash);
        toast.success('Donation confirmed on blockchain!', { id: 'blockchain' });

        setStep('complete');

        // Trigger verification
        await axios.post(`${API_BASE_URL}/api/verify`, {
          donationId: id,
          reportText: formData.description,
        });
        
        toast.success('AI verification started! Check your dashboard for updates.');
      }

    } catch (error: any) {
      console.error('Donation error:', error);
      toast.error(error.response?.data?.detail || error.message || 'Failed to submit donation');
      setStep('form');
    } finally {
      setUploading(false);
    }
  };

  const campaigns = [
    'Clean Water Project',
    'Education for All',
    'Medical Relief',
    'Food Security',
    'Disaster Relief',
    'Climate Action',
    'Community Development',
  ];

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Success Animation */}
            <div className="text-center mb-12 animate-fadeIn">
              <div className="relative inline-block mb-6">
                {/* Glowing Circle Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-full blur-2xl opacity-30 animate-pulse" />
                
                {/* Success Icon */}
                <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-cyber-cyan to-cyber-blue rounded-full flex items-center justify-center shadow-glass">
                  <CheckCircle className="w-20 h-20 text-white animate-scaleIn" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                  Donation Submitted! 🎉
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Your charitable work has been uploaded to IPFS and registered on the Polygon blockchain.
              </p>
            </div>

            {/* Details Card */}
            <div className="relative">
              {/* Glowing Background Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-3xl blur-lg opacity-20" />
              
              {/* Card Container */}
              <div className="relative bg-navy-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-glass space-y-6">
                
                {/* Detail Items */}
                <div className="space-y-4">
                  {/* Donation ID */}
                  <div className="p-5 bg-navy-900/50 border border-cyber-cyan/20 rounded-2xl backdrop-blur-sm hover:border-cyber-cyan/40 transition-all duration-300">
                    <p className="text-sm font-semibold text-cyber-cyan mb-2 uppercase tracking-wide">
                      Donation ID
                    </p>
                    <p className="text-white font-mono text-lg">
                      #{donationId}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="p-5 bg-navy-900/50 border border-cyber-cyan/20 rounded-2xl backdrop-blur-sm hover:border-cyber-cyan/40 transition-all duration-300">
                    <p className="text-sm font-semibold text-cyber-cyan mb-2 uppercase tracking-wide">
                      Amount
                    </p>
                    <p className="text-white text-2xl font-bold">
                      {formData.amount} <span className="text-gray-400 text-lg">MATIC</span>
                    </p>
                  </div>

                  {/* Campaign */}
                  <div className="p-5 bg-navy-900/50 border border-cyber-cyan/20 rounded-2xl backdrop-blur-sm hover:border-cyber-cyan/40 transition-all duration-300">
                    <p className="text-sm font-semibold text-cyber-cyan mb-2 uppercase tracking-wide">
                      Campaign
                    </p>
                    <p className="text-white text-lg font-medium">
                      {formData.campaign}
                    </p>
                  </div>

                  {/* Transaction Hash */}
                  {txHash && (
                    <div className="p-5 bg-navy-900/50 border border-cyber-cyan/20 rounded-2xl backdrop-blur-sm hover:border-cyber-cyan/40 transition-all duration-300">
                      <p className="text-sm font-semibold text-cyber-cyan mb-2 uppercase tracking-wide">
                        Transaction Hash
                      </p>
                      <a
                        href={`https://mumbai.polygonscan.com/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-cyber-cyan transition-colors duration-300 break-all font-mono text-sm"
                      >
                        {txHash}
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                  {/* View Dashboard Button */}
                  <a
                    href="/dashboard"
                    className="relative group overflow-hidden rounded-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    <div className="relative flex items-center justify-center gap-3 py-4 px-6">
                      <span className="font-bold text-white">View Dashboard</span>
                    </div>
                  </a>

                  {/* Make Another Donation Button */}
                  <button
                    onClick={() => {
                      setStep('form');
                      setFormData({ amount: '', campaign: '', description: '', geo_lat: '', geo_lng: '' });
                      setFiles([]);
                      setDonationId(null);
                      setTxHash(null);
                    }}
                    className="relative group overflow-hidden rounded-xl bg-navy-900/50 border-2 border-cyber-cyan/30 hover:border-cyber-cyan/50 transition-all duration-300"
                  >
                    <div className="relative flex items-center justify-center gap-3 py-4 px-6 text-cyber-cyan font-bold group-hover:text-white transition-colors duration-300">
                      Make Another Donation
                    </div>
                  </button>
                </div>

                {/* AI Verification Notice */}
                <div className="mt-6 p-5 bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/30 rounded-xl">
                  <p className="text-sm text-gray-300 text-center">
                    ✨ <span className="text-cyber-cyan font-semibold">AI Verification in Progress</span> • Your donation evidence is being analyzed by our AI system for transparency verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                Make a Donation
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Upload evidence of your charitable work and register it on the blockchain for AI verification.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            {/* Glowing Background Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-3xl blur-lg opacity-20" />
            
            {/* Form Container */}
            <div className="relative bg-navy-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-glass space-y-8">
              
              {/* Campaign Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-cyber-cyan mb-3 tracking-wide uppercase">
                  Campaign *
                </label>
                <div className="relative">
                  <select
                    value={formData.campaign}
                    onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                    className="w-full px-6 py-4 bg-navy-900/50 border-2 border-cyber-cyan/30 rounded-2xl 
                             text-white font-medium text-lg
                             focus:ring-2 focus:ring-cyber-cyan focus:border-cyber-cyan 
                             hover:border-cyber-cyan/50 transition-all duration-300
                             appearance-none cursor-pointer backdrop-blur-sm
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={step !== 'form'}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300FFFF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.5em 1.5em',
                    }}
                  >
                    <option value="" className="bg-navy-950 text-gray-400">Select a campaign</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign} value={campaign} className="bg-navy-950 text-white py-2">
                        {campaign}
                      </option>
                    ))}
                  </select>
                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-cyber-cyan mb-3 tracking-wide uppercase">
                  Donation Amount (MATIC) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-6 py-4 bg-navy-900/50 border-2 border-cyber-cyan/30 rounded-2xl 
                             text-white font-medium text-lg placeholder-gray-500
                             focus:ring-2 focus:ring-cyber-cyan focus:border-cyber-cyan 
                             hover:border-cyber-cyan/50 transition-all duration-300 backdrop-blur-sm
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="0.1 MATIC"
                    required
                    disabled={step !== 'form'}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-cyber-cyan/50 font-semibold pointer-events-none">
                    MATIC
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-cyber-cyan mb-3 tracking-wide uppercase">
                  Description <span className="text-gray-500 normal-case">(Optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-4 bg-navy-900/50 border-2 border-cyber-cyan/30 rounded-2xl 
                           text-white font-medium placeholder-gray-500
                           focus:ring-2 focus:ring-cyber-cyan focus:border-cyber-cyan 
                           hover:border-cyber-cyan/50 transition-all duration-300 backdrop-blur-sm
                           resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={5}
                  placeholder="Describe the impact of this donation and how it will help the community..."
                  disabled={step !== 'form'}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-cyber-cyan mb-3 tracking-wide uppercase">
                  Evidence Files * <span className="text-gray-500 normal-case">(Photos, Receipts, Documents)</span>
                </label>
                <div
                  {...getRootProps()}
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer 
                            transition-all duration-300 group
                            ${isDragActive
                              ? 'border-cyber-cyan bg-cyber-cyan/10 scale-[1.02]'
                              : 'border-cyber-cyan/30 hover:border-cyber-cyan/60 hover:bg-cyber-cyan/5'
                            } 
                            ${step !== 'form' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input {...getInputProps()} disabled={step !== 'form'} />
                  
                  {/* Upload Icon with Animation */}
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-cyber-cyan/20 rounded-full blur-xl group-hover:bg-cyber-cyan/30 transition-all" />
                    <Upload className="relative w-16 h-16 text-cyber-cyan mx-auto group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  {isDragActive ? (
                    <div className="space-y-2">
                      <p className="text-cyber-cyan font-bold text-xl">Drop files here!</p>
                      <p className="text-gray-400">Release to upload</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-white font-semibold text-lg group-hover:text-cyber-cyan transition-colors">
                        Drag & drop files here, or click to browse
                      </p>
                      <p className="text-gray-400 text-sm">
                        Supports: <span className="text-cyber-cyan">JPG, PNG, PDF</span> • Max 10MB per file
                      </p>
                    </div>
                  )}
                  
                  {/* Animated Gradient Border on Hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                      Uploaded Files ({files.length})
                    </p>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-navy-900/50 border border-cyber-cyan/20 p-4 rounded-xl backdrop-blur-sm hover:border-cyber-cyan/40 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-cyber-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-cyber-cyan" />
                          </div>
                          <span className="text-white font-medium truncate">{file.name}</span>
                          <span className="text-gray-500 text-sm flex-shrink-0">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-4 p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-300 flex-shrink-0"
                          disabled={step !== 'form'}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={step !== 'form' || connecting}
                className="relative w-full group mt-8 overflow-hidden"
              >
                {/* Button Background with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Animated Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                
                {/* Button Content */}
                <div className="relative flex items-center justify-center gap-3 py-5 px-8">
                  {step === 'uploading' && (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="font-bold text-lg text-white">Uploading to IPFS...</span>
                    </>
                  )}
                  {step === 'blockchain' && (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="font-bold text-lg text-white">Confirming Transaction...</span>
                    </>
                  )}
                  {step === 'form' && (
                    <>
                      <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-lg text-white">
                        {address ? 'Submit Donation' : 'Connect Wallet to Continue'}
                      </span>
                    </>
                  )}
                </div>
                
                {/* Disabled Overlay */}
                {(step !== 'form' || connecting) && (
                  <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-[1px]" />
                )}
              </button>
              
              {/* Security Notice */}
              <div className="mt-6 p-4 bg-cyber-blue/10 border border-cyber-blue/30 rounded-xl">
                <p className="text-sm text-gray-300 text-center">
                  🔒 <span className="text-cyber-cyan font-semibold">Secured by Blockchain</span> • Your donation will be verified by AI and stored on IPFS
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
