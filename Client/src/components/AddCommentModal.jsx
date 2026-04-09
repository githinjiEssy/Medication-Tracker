import React, { useState } from 'react';
import { X, MessageSquare, TrendingUp, HelpCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { commentService } from '../services/commentService';


const AddCommentModal = ({ isOpen, onClose, medication, onSuccess }) => {
  const [commentType, setCommentType] = useState('NOTE');
  const [content, setContent] = useState('');
  const [severity, setSeverity] = useState(5);
  const [effectiveness, setEffectiveness] = useState(5);
  const [loading, setLoading] = useState(false);

  const commentTypes = [
    { value: 'NOTE', label: 'General Note', icon: MessageSquare, color: 'text-slate-600 bg-slate-50' },
    { value: 'EFFECTIVENESS', label: 'Effectiveness', icon: TrendingUp, color: 'text-teal-600 bg-teal-50' },
    { value: 'QUESTION', label: 'Question for Doctor', icon: HelpCircle, color: 'text-blue-600 bg-blue-50' },
    { value: 'CONCERN', label: 'Concern', icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
  ];

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('Please enter a comment');
      return;
    }

    setLoading(true);
    try {
      const data = {
        comment_type: commentType,
        content: content,
      };

      if (commentType === 'EFFECTIVENESS') {
        data.effectiveness = effectiveness;
      }

      await commentService.addMedicationComment(medication.id, data);
      
      if (onSuccess) onSuccess();
      setContent('');
      setCommentType('NOTE');
      onClose();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedType = commentTypes.find(t => t.value === commentType);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${selectedType?.color} rounded-xl flex items-center justify-center`}>
                {selectedType && <selectedType.icon size={20} />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Add Note</h2>
                <p className="text-xs text-slate-500">{medication?.name}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Comment Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {commentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setCommentType(type.value)}
                    className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                      commentType === type.value
                        ? `${type.color} border-2 border-current`
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <type.icon size={16} />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Notes</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={commentType === 'QUESTION' ? "What would you like to ask your doctor?" : 
                            commentType === 'CONCERN' ? "What's concerning you?" :
                            commentType === 'EFFECTIVENESS' ? "How well is this medication working?" :
                            "Add your notes here..."}
                rows={4}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-teal-500 resize-none"
              />
            </div>

            {/* Effectiveness Rating (only for EFFECTIVENESS type) */}
            {commentType === 'EFFECTIVENESS' && (
              <div className="space-y-3 p-4 bg-teal-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-teal-700">Effectiveness Rating</label>
                  <span className="text-sm font-black text-teal-700">{effectiveness}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={effectiveness}
                  onChange={(e) => setEffectiveness(e.target.value)}
                  className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-teal-600 font-bold">
                  <span>Not Effective</span>
                  <span>Very Effective</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-50 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Note'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddCommentModal;