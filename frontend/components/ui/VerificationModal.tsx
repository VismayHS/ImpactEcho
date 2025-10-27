'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { CheckCircle, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';

interface VerificationResult {
  score: number;
  status: 'verified' | 'manual_review' | 'rejected';
  reason: string;
  details: {
    vision_analysis: { score: number; detected_features: string[] };
    nlp_analysis: { score: number; authenticity: string };
    metadata_analysis: { score: number; validation: string };
  };
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: VerificationResult | null;
  loading: boolean;
}

export default function VerificationModal({ isOpen, onClose, result, loading }: VerificationModalProps) {
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  // Animate score count-up
  useEffect(() => {
    if (result && !loading) {
      let current = 0;
      const target = result.score;
      const increment = target / 50;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setScore(target);
          clearInterval(timer);
          
          // Show confetti for verified donations
          if (result.status === 'verified') {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        } else {
          setScore(Math.floor(current));
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [result, loading]);

  if (!isOpen) return null;

  const getStatusIcon = () => {
    if (!result) return null;
    switch (result.status) {
      case 'verified':
        return <CheckCircle className="w-20 h-20 text-green-400" />;
      case 'manual_review':
        return <AlertCircle className="w-20 h-20 text-yellow-400" />;
      case 'rejected':
        return <XCircle className="w-20 h-20 text-red-400" />;
    }
  };

  const getScoreColor = () => {
    if (!result) return 'text-gray-400';
    if (result.score >= 70) return 'text-green-400';
    if (result.score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          {showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={500}
              colors={['#00ff88', '#00d4ff', '#9d00ff', '#ff006e', '#ffd000']}
            />
          )}

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <GlassCard className="p-8" gradient glow={result?.status === 'verified'}>
                {loading ? (
                  // Loading State
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="mx-auto mb-6"
                    >
                      <Sparkles className="w-20 h-20 text-blue-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Analyzing Evidence...</h3>
                    <p className="text-gray-300">AI is processing your donation proof</p>
                    <div className="mt-6 space-y-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-2 bg-gradient-to-r from-green-400 to-blue-600 rounded-full mx-auto max-w-md"
                      />
                      <p className="text-sm text-gray-400">Vision Analysis • NLP Processing • Metadata Validation</p>
                    </div>
                  </div>
                ) : result ? (
                  // Result State
                  <div>
                    {/* Header */}
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="mx-auto mb-4"
                      >
                        {getStatusIcon()}
                      </motion.div>
                      
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {result.status === 'verified' && '🎉 Verification Successful!'}
                        {result.status === 'manual_review' && '⚠️ Manual Review Required'}
                        {result.status === 'rejected' && '❌ Verification Failed'}
                      </h3>
                      
                      {/* Score */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="mt-6"
                      >
                        <div className={`text-7xl font-bold ${getScoreColor()} mb-2`}>
                          {score}%
                        </div>
                        <p className="text-gray-300">{result.reason}</p>
                      </motion.div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="space-y-4 mb-6">
                      {/* Vision Analysis */}
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-semibold">🖼️ Vision Analysis</span>
                          <span className="text-green-400 font-bold">{result.details.vision_analysis.score.toFixed(1)}%</span>
                        </div>
                        <div className="bg-white/5 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.details.vision_analysis.score}%` }}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {result.details.vision_analysis.detected_features.map((feature, idx) => (
                            <span key={idx} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </motion.div>

                      {/* NLP Analysis */}
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-semibold">📝 NLP Analysis</span>
                          <span className="text-blue-400 font-bold">{result.details.nlp_analysis.score.toFixed(1)}%</span>
                        </div>
                        <div className="bg-white/5 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.details.nlp_analysis.score}%` }}
                            transition={{ delay: 0.7, duration: 1 }}
                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                          />
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                          Authenticity: <span className="text-blue-300 capitalize">{result.details.nlp_analysis.authenticity}</span>
                        </p>
                      </motion.div>

                      {/* Metadata Analysis */}
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-semibold">🔍 Metadata Validation</span>
                          <span className="text-indigo-400 font-bold">{result.details.metadata_analysis.score.toFixed(1)}%</span>
                        </div>
                        <div className="bg-white/5 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.details.metadata_analysis.score}%` }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="h-full bg-gradient-to-r from-indigo-400 to-purple-500"
                          />
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                          Validation: <span className="text-indigo-300 capitalize">{result.details.metadata_analysis.validation}</span>
                        </p>
                      </motion.div>
                    </div>

                    {/* Close Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all"
                    >
                      Close
                    </motion.button>
                  </div>
                ) : null}
              </GlassCard>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
