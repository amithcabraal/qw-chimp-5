import React from 'react';
import { motion } from 'framer-motion';
import { Brain, X } from 'lucide-react';

interface TutorialOverlayProps {
  onClose: () => void;
  onDismiss: () => void;
}

export default function TutorialOverlay({ onClose, onDismiss }: TutorialOverlayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold">Welcome to Chimp Memory!</h2>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-gray-600">Challenge your memory with this engaging game inspired by cognitive research. Here's how to play:</p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
              <p>Numbers will appear on the grid. Take your time to memorize their positions.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
              <p>After a few seconds, the numbers will disappear.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
              <p>Click the squares in numerical order (1, 2, 3, etc.).</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
              <p>Submit your answer when you're confident!</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Playing
          </button>
          <button
            onClick={onDismiss}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Don't Show Again
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}