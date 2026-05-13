import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MessageSquare, Send, Trash2, ShieldCheck, 
  User as UserIcon, Clock, Sparkles, MessageCircle
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react';

interface Suggestion {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: any;
  likesCount?: number;
}

interface SuggestionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommentItem: React.FC<{ 
  comment: Suggestion; 
  onDelete: (id: string) => void;
  isReply?: boolean;
  parentId?: string;
}> = ({ comment, onDelete, isReply, parentId }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [replies, setReplies] = useState<Suggestion[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    if (!user || isReply) return;

    const likeDocPath = `suggestions/${comment.id}/likes/${user.uid}`;
    const unsubscribe = onSnapshot(doc(db, likeDocPath), (snapshot) => {
      setIsLiked(snapshot.exists());
    });

    const repliesPath = `suggestions/${comment.id}/replies`;
    const q = query(collection(db, repliesPath), orderBy('timestamp', 'asc'));
    const unsubscribeReplies = onSnapshot(q, (snapshot) => {
      const data: Suggestion[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Suggestion);
      });
      setReplies(data);
    });

    return () => {
      unsubscribe();
      unsubscribeReplies();
    };
  }, [comment.id, user, isReply]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like');
      return;
    }

    const likeDocRef = doc(db, `suggestions/${comment.id}/likes/${user.uid}`);
    const suggestionRef = doc(db, 'suggestions', comment.id);

    try {
      if (isLiked) {
        await deleteDoc(likeDocRef);
        await updateDoc(suggestionRef, { likesCount: increment(-1) });
      } else {
        await setDoc(likeDocRef, { timestamp: serverTimestamp() });
        await updateDoc(suggestionRef, { likesCount: increment(1) });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `suggestions/${comment.id}`);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyText.trim()) return;

    setIsSubmittingReply(true);
    const path = `suggestions/${comment.id}/replies`;
    try {
      await addDoc(collection(db, path), {
        userId: user.uid,
        userName: user.name || user.email.split('@')[0],
        content: replyText.trim(),
        timestamp: serverTimestamp()
      });
      setReplyText('');
      setIsReplyInputOpen(false);
      setShowReplies(true);
      toast.success('Reply sent!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex gap-4 group">
      <div className={`${isReply ? 'w-6 h-6' : 'w-10 h-10'} rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white/40 flex-shrink-0 mt-0.5`}>
        <span className={`${isReply ? 'text-[8px]' : 'text-xs'} font-black uppercase tracking-tighter`}>
          {comment.userName?.charAt(0) || 'Z'}
        </span>
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-black tracking-tight text-white/90">
            @{comment.userName?.toLowerCase().replace(/\s+/g, '')}
          </span>
          <span className="text-[10px] font-medium text-white/20 whitespace-nowrap">
            {formatTime(comment.timestamp)}
          </span>
          {comment.userId === user?.uid && (
            <span className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] font-bold text-white/40 uppercase tracking-widest">You</span>
          )}
        </div>
        
        <div className="text-xs text-white/70 leading-relaxed break-words font-medium">
          {comment.content}
        </div>

        <div className="flex items-center gap-5 mt-3">
           <button 
             onClick={handleLike}
             className={`flex items-center gap-1.5 text-[10px] font-black transition-colors uppercase tracking-widest italic ${
               isLiked ? 'text-brand' : 'text-white/20 hover:text-white'
             }`}
           >
             <ThumbsUp size={12} className={isLiked ? 'fill-current' : ''} />
             {comment.likesCount || 0}
           </button>
           {!isReply && (
             <button 
               onClick={() => setIsReplyInputOpen(!isReplyInputOpen)}
               className="flex items-center gap-1.5 text-[10px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-widest italic"
             >
               Reply
             </button>
           )}
           {comment.userId === user?.uid && (
            <button 
              onClick={() => onDelete(comment.id)}
              className="ml-auto p-1.5 text-white/20 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest italic flex items-center gap-2"
            >
              Delete
            </button>
           )}
        </div>

        {/* Reply Input */}
        <AnimatePresence>
          {isReplyInputOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <form onSubmit={handleReply} className="flex gap-3">
                <input
                  autoFocus
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Add a reply..."
                  className="flex-grow bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-brand transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={isSubmittingReply || !replyText.trim()}
                  className="px-4 bg-brand text-white text-[10px] font-black uppercase tracking-widest italic rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Replies List */}
        {!isReply && replies.length > 0 && (
          <div className="mt-4">
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-2 text-[10px] font-black text-brand uppercase tracking-widest italic hover:opacity-80 transition-all mb-4"
            >
              {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
            </button>
            
            <AnimatePresence>
              {showReplies && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 border-l border-white/5 pl-4 ml-2"
                >
                  {replies.map((reply) => (
                    <CommentItem 
                      key={reply.id} 
                      comment={reply} 
                      onDelete={async (id) => {
                        const replyPath = `suggestions/${comment.id}/replies/${id}`;
                        try {
                          await deleteDoc(doc(db, replyPath));
                          toast.success('Reply deleted');
                        } catch (error) {
                          handleFirestoreError(error, OperationType.DELETE, replyPath);
                        }
                      }} 
                      isReply 
                      parentId={comment.id}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export const Suggestions: React.FC<SuggestionsProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [newSuggestion, setNewSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const path = 'suggestions';
    const q = query(collection(db, path), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Suggestion[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Suggestion);
      });
      setSuggestions(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to send suggestions');
      return;
    }
    if (!newSuggestion.trim()) return;

    setIsSubmitting(true);
    const path = 'suggestions';
    try {
      await addDoc(collection(db, path), {
        userId: user.uid,
        userName: user.name || user.email.split('@')[0],
        content: newSuggestion.trim(),
        timestamp: serverTimestamp(),
        likesCount: 0
      });
      setNewSuggestion('');
      toast.success('Suggestion sent to the engine!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (suggestionId: string) => {
    const path = `suggestions/${suggestionId}`;
    try {
      await deleteDoc(doc(db, 'suggestions', suggestionId));
      toast.success('Message deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full max-w-md bg-[#050505] border-l border-white/5 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Community Engine</h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Suggestion & Comments</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Suggestions List */}
            <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {suggestions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <MessageCircle size={48} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic">No transmissions yet...</p>
                </div>
              ) : (
                suggestions.map((suggestion) => (
                  <CommentItem 
                    key={suggestion.id} 
                    comment={suggestion} 
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>

            {/* Input Footer */}
            <div className="p-8 border-t border-white/5 bg-white/[0.01]">
              {user ? (
                <form onSubmit={handleSubmit} className="relative">
                  <textarea
                    value={newSuggestion}
                    onChange={(e) => setNewSuggestion(e.target.value)}
                    placeholder="Suggest a game..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 pb-14 text-xs text-white placeholder:text-white/20 outline-none focus:border-brand transition-all resize-none min-h-[100px] font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 italic">Zenith Channel</span>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !newSuggestion.trim()}
                      className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-brand/20"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center p-6 bg-brand/5 border border-dashed border-brand/20 rounded-2xl">
                  <ShieldCheck size={24} className="text-brand mx-auto mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Transmission authentication required</p>
                  <button 
                    onClick={() => {
                      onClose();
                      window.location.href = '/login';
                    }}
                    className="text-[10px] font-black italic uppercase tracking-widest text-brand hover:underline"
                  >
                    Login to Zenith
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
