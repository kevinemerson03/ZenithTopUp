import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, ShieldCheck, User as UserIcon, LifeBuoy, 
  MessageCircle, Clock, Trash2, ArrowLeft, Search,
  Filter, CheckCircle2, AlertCircle
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
  isAdmin?: boolean;
}

interface ChatSession {
  userId: string;
  userName: string;
  lastMessage?: string;
  lastTimestamp?: any;
}

export const SupportPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatSession | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = (instant = false) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: instant ? 'auto' : 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle window resize to keep scroll at bottom
  useEffect(() => {
    window.addEventListener('resize', () => scrollToBottom(true));
    return () => window.removeEventListener('resize', () => scrollToBottom(true));
  }, []);

  // Load chat sessions for Admin
  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'support_chats'), orderBy('lastTimestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        userId: doc.id,
        ...doc.data()
      } as ChatSession));
      setChatSessions(sessions);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'support_chats');
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // Load messages for specific chat
  useEffect(() => {
    if (!user) return;

    const chatUserId = isAdmin ? selectedUser?.userId : user.uid;
    if (!chatUserId) {
      setMessages([]);
      return;
    }

    const messagesPath = `support_chats/${chatUserId}/messages`;
    const q = query(collection(db, messagesPath), orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, messagesPath);
    });

    return () => unsubscribe();
  }, [user, isAdmin, selectedUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inputText.trim()) return;

    const chatUserId = isAdmin ? selectedUser?.userId : user.uid;
    if (!chatUserId) return;

    setIsSubmitting(true);
    const messagesPath = `support_chats/${chatUserId}/messages`;
    
    try {
      // 1. Add message
      await addDoc(collection(db, messagesPath), {
        senderId: user.uid,
        text: inputText.trim(),
        timestamp: serverTimestamp(),
        isAdmin: isAdmin
      });

      // 2. Update session info
      await setDoc(doc(db, 'support_chats', chatUserId), {
        userName: isAdmin ? selectedUser?.userName : (user.name || user.email),
        lastMessage: inputText.trim(),
        lastTimestamp: serverTimestamp()
      }, { merge: true });

      setInputText('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, messagesPath);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;
    const chatUserId = isAdmin ? selectedUser?.userId : user.uid;
    if (!chatUserId) return;

    const messagePath = `support_chats/${chatUserId}/messages/${messageId}`;
    try {
      await deleteDoc(doc(db, 'support_chats', chatUserId, 'messages', messageId));
      toast.success('Transmission redacted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, messagePath);
    }
  };

  const formatTime = (ts: any) => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="h-screen pt-32 px-4 bg-slate-950 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="w-20 h-20 rounded-3xl bg-brand/10 flex items-center justify-center text-brand mb-8">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">Authentication Required</h1>
        <p className="text-white/40 text-sm max-w-sm mb-8">Please login to access the secure support channel.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-brand text-white px-10 py-4 rounded-2xl font-black italic uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all"
        >
          Login to Zenith
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pt-24 pb-12 bg-slate-950 flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex-grow flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white border border-white/5 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Zenith Support</h1>
                <div className="px-2 py-1 bg-brand/10 border border-brand/20 rounded text-[10px] font-black text-brand uppercase tracking-widest italic flex items-center gap-1">
                  <ShieldCheck size={10} /> Secure Channel
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Private Messaging System</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
             <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Active Operative: {isAdmin ? 'Administrator' : 'User'}</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex gap-8 min-h-0">
          {/* Admin Chat List */}
          {isAdmin && (
            <div className="w-80 flex-shrink-0 bg-white/[0.02] border border-white/5 rounded-[2rem] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <div className="relative">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search transmissions..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[10px] text-white font-bold uppercase tracking-widest outline-none focus:border-brand/40 transition-all"
                  />
                </div>
              </div>
              <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-2">
                {chatSessions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-6">
                    <Filter size={32} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No active sessions</p>
                  </div>
                ) : (
                  chatSessions.map((session) => (
                    <button
                      key={session.userId}
                      onClick={() => setSelectedUser(session)}
                      className={`w-full text-left p-4 rounded-2xl transition-all group ${
                        selectedUser?.userId === session.userId 
                          ? 'bg-brand text-white' 
                          : 'bg-white/5 hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-black uppercase tracking-tight truncate flex-grow mr-2">
                          {session.userName}
                        </span>
                        <span className={`text-[9px] font-bold opacity-30 ${selectedUser?.userId === session.userId ? 'text-white' : 'text-white'}`}>
                          {formatTime(session.lastTimestamp)}
                        </span>
                      </div>
                      <p className={`text-[10px] font-medium truncate ${
                        selectedUser?.userId === session.userId ? 'text-white/70' : 'text-white/20'
                      }`}>
                        {session.lastMessage || 'Open transmission...'}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Chat Window */}
          <div className="flex-grow bg-white/[0.02] border border-white/5 rounded-[2rem] flex flex-col overflow-hidden relative shadow-2xl">
            {/* Window Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-brand/5 blur-[120px] rounded-full -z-10" />

            {(!isAdmin || selectedUser) ? (
              <>
                {/* Chat Header */}
                <div className="p-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                      {isAdmin ? <UserIcon size={24} /> : <LifeBuoy size={24} />}
                    </div>
                    <div>
                      <h3 className="text-sm font-black italic uppercase tracking-[0.1em] text-white">
                        {isAdmin ? selectedUser?.userName : 'Zenith Support Agent'}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 italic">Online & Connected</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages Panel */}
                <div 
                  ref={scrollContainerRef}
                  className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar"
                >
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                      <MessageCircle size={48} className="mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest italic">Initialize transmission by sending a message...</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = isAdmin ? msg.isAdmin : !msg.isAdmin;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">
                                {isOwn ? 'You' : (isAdmin ? selectedUser?.userName : 'Zenith Agent')}
                              </span>
                              <span className="text-[9px] font-medium text-white/10 uppercase italic">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                            <div className={`px-6 py-4 rounded-3xl text-sm font-medium leading-relaxed group relative ${
                              isOwn 
                                ? 'bg-brand text-white rounded-tr-none shadow-lg shadow-brand/10' 
                                : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                            }`}>
                              {msg.text}
                              {(msg.senderId === user.uid || isAdmin) && (
                                <button 
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className={`absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900 border border-white/10 text-white/40 hover:text-red-500 transition-all ${
                                    isOwn ? '-left-12' : '-right-12'
                                  }`}
                                  title="Delete message"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Input Area */}
                <div className="p-8 bg-white/[0.03] border-t border-white/5">
                  <form onSubmit={handleSendMessage} className="relative flex items-end gap-4">
                    <div className="flex-grow relative">
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        placeholder="Encrypted message transmission..."
                        className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-xs text-white placeholder:text-white/20 outline-none focus:border-brand/40 transition-all resize-none min-h-[60px] max-h-[200px] font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !inputText.trim()}
                      className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 shadow-xl shadow-brand/20 flex-shrink-0"
                    >
                      <Send size={24} />
                    </button>
                  </form>
                  <p className="mt-4 text-[8px] font-black uppercase tracking-[0.4em] text-center text-white/10 italic">Secure Zero-Knowledge Channel</p>
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-12 text-center opacity-30">
                <LifeBuoy size={64} className="mb-6 text-brand" />
                <h4 className="text-xl font-black italic uppercase tracking-widest text-white mb-2">Selection Required</h4>
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-xs italic">Select a user transmission from the left operative panel to begin support intervention.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
