import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Search, Heart, Zap, Play, Angry, Cpu, PlusSquare, Calculator, 
  Coffee, Target, Map, XOctagon, Fish, ChevronRight, ChevronLeft, X, 
  BookOpen, RefreshCw, Languages, ArrowDown, Eye, HelpCircle, Info, 
  Shuffle, Lightbulb, EyeOff, Lock, CheckCircle2, CheckCircle, AlertCircle, Award,
  User, MessageCircle, DollarSign, Database, Cloud, Trash2, Home,
  Undo2, Volume2, ShoppingCart, LogOut, Gavel, Filter, ChevronDown,
  AlertTriangle, Flame, Activity, Wind, Music, Camera, Sparkles,
  Hammer, Book, Calendar, UserPlus, XCircle, TrendingDown, GitBranch,
  Key, Clock, Sun, Users, HardHat, Footprints, Thermometer, Droplets,
  Radio, Mic2, CloudOff, Smile, Ghost, Smartphone, Star, Package, TrendingUp, 
  Settings, PenTool, MessageSquare
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, onSnapshot } from 'firebase/firestore';

// --- Firebase Initialization ---
let app, auth, db, appId;
try {
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
  if (firebaseConfig) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  }
} catch (error) {
  console.error("Firebase init error:", error);
}

const getDocId = (pvName) => {
  if (!pvName) return 'default';
  return pvName.replace(/[^a-zA-Z0-9_]/g, '_');
};

const AnimeFrame = ({ pv, trope, storyline, storylineJP, primaryLang, customBgUrl, onUpdateBgUrl, isAdmin }) => {
  const [showStory, setShowStory] = useState(false);
  const [isStoryFlipped, setIsStoryFlipped] = useState(false);
  const [showBgInput, setShowBgInput] = useState(false);
  const [bgInputUrl, setBgInputUrl] = useState(customBgUrl || '');

  useEffect(() => {
    setIsStoryFlipped(false);
    setShowBgInput(false);
  }, [primaryLang, showStory]);

  useEffect(() => {
    setBgInputUrl(customBgUrl || '');
  }, [customBgUrl]);

  const toggleFlip = (e) => {
    e.stopPropagation();
    setIsStoryFlipped(!isStoryFlipped);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          let scaleSize = 1;
          if (img.width > MAX_WIDTH) {
            scaleSize = MAX_WIDTH / img.width;
          }
          canvas.width = img.width * scaleSize;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedUrl = canvas.toDataURL('image/jpeg', 0.7); // データを最適化（圧縮）
          setBgInputUrl(compressedUrl);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBg = (e) => {
    e.stopPropagation();
    onUpdateBgUrl(pv, bgInputUrl);
    setShowBgInput(false);
  };

  const handleResetBg = (e) => {
    e.stopPropagation();
    setBgInputUrl('');
    onUpdateBgUrl(pv, '');
    setShowBgInput(false);
  };

  const defaultBg = `https://picsum.photos/seed/${pv.replace(/\s/g, '')}/1200/800`;
  const bgImage = customBgUrl || defaultBg;

  return (
    <div className="group relative w-full aspect-video md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all bg-slate-900 flex flex-col">
      {/* 初期ステータスの背景画像（そのまま鮮明に表示） */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* 中央の白いカードを少しだけ際立たせるための薄いオーバーレイ */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        <div className="z-10 bg-white p-4 md:p-5 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] -rotate-2 max-w-[90%] md:max-w-[80%] text-black text-left">
          <h4 className="font-black text-[10px] md:text-sm border-b-2 border-black mb-1 md:mb-2 uppercase tracking-tighter">{trope}</h4>
          <div className="flex items-center justify-center py-2 md:py-3 text-black text-center">
             <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center border-4 border-black animate-pulse cursor-pointer hover:scale-110 transition-transform" onClick={() => setShowStory(true)}>
                <Play size={20} className="text-blue-600 fill-blue-600 ml-1 md:ml-1.5" />
             </div>
          </div>
          <p className="text-[8px] md:text-[10px] font-bold text-gray-500 italic text-center uppercase tracking-widest">Visualizing Story Scene...</p>
        </div>
      </div>
      
      {showStory && (
        <div 
          className="fixed inset-0 bg-black/95 z-[150] animate-in fade-in zoom-in duration-300 flex flex-col"
          onClick={(e) => { if(e.target === e.currentTarget) setShowStory(false); }}
        >
           <div className="flex justify-between items-center z-50 text-white p-4 md:p-6 shrink-0">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="bg-yellow-300 p-1.5 md:p-2 border-2 border-black"><BookOpen className="text-black" size={16} /></div>
                <h3 className="text-yellow-300 text-xs md:text-base font-black italic uppercase tracking-tighter text-left truncate max-w-[150px] md:max-w-[300px]">Scenario: {pv}</h3>
              </div>
              <div className="flex gap-2 md:gap-3">
                {isAdmin && (
                  <button onClick={(e) => { e.stopPropagation(); setShowBgInput(!showBgInput); }} className="text-white hover:text-blue-300 transition-colors bg-white/10 rounded-full p-2" title="Change Background Image (Admin)">
                    <Camera size={20} />
                  </button>
                )}
                <button onClick={toggleFlip} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase hover:bg-blue-500 transition-all border-2 border-white/20">
                  <RefreshCw size={14} /> Flip
                </button>
                <button onClick={() => setShowStory(false)} className="text-white hover:text-red-500 transition-colors bg-white/10 rounded-full p-2"><X size={24} /></button>
              </div>
           </div>

           {/* 画像アップロードフォーム (管理者のみ操作可能) */}
           {showBgInput && isAdmin && (
             <div className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 z-[200] bg-white border-4 border-black p-4 md:p-5 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col md:flex-row gap-4 items-start md:items-center text-black w-[90%] max-w-xl animate-in slide-in-from-top-4" onClick={(e) => e.stopPropagation()}>
               <div className="flex-1 w-full">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 text-left flex items-center gap-1"><Camera size={12}/> Upload Custom Background (Admin)</p>
                 <input
                   type="file"
                   accept="image/*"
                   onChange={handleFileChange}
                   className="w-full text-sm font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-colors cursor-pointer"
                 />
                 {bgInputUrl && customBgUrl && (
                   <p className="text-[10px] text-green-600 font-bold mt-2 text-left">✓ Custom image applied</p>
                 )}
               </div>
               <div className="flex flex-col gap-2 w-full md:w-auto mt-2 md:mt-0 self-end md:self-center">
                 <div className="flex gap-2 w-full">
                   <button onClick={handleSaveBg} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-black text-xs uppercase hover:bg-blue-500 transition-colors">Save</button>
                   <button onClick={(e) => { e.stopPropagation(); setShowBgInput(false); setBgInputUrl(customBgUrl || ''); }} className="flex-1 bg-gray-200 text-black px-4 py-2 rounded-lg font-black text-xs uppercase hover:bg-gray-300 transition-colors">Cancel</button>
                 </div>
                 {customBgUrl && (
                   <button onClick={handleResetBg} className="text-[10px] text-red-500 font-bold underline hover:text-red-600 text-right mt-1">Reset to Default</button>
                 )}
               </div>
             </div>
           )}
           
           <div 
             className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-hidden"
             onClick={(e) => { if(e.target === e.currentTarget) setShowStory(false); }}
           >
             <div onClick={toggleFlip} className="relative w-full max-w-4xl h-[60vh] cursor-pointer group" style={{ perspective: '1200px' }}>
                <div 
                  className="relative w-full h-full transition-transform duration-700 ease-in-out" 
                  style={{ transformStyle: 'preserve-3d', transform: isStoryFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)' }}
                >
                  {/* 表面 (Surface) */}
                  <div 
                    className="absolute inset-0 bg-slate-900 border-4 border-white/20 rounded-3xl overflow-hidden shadow-2xl" 
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    
                    <div className="relative w-full h-full p-6 md:p-12 flex flex-col justify-center overflow-y-auto">
                      <div className="flex items-center justify-between mb-6">
                        <span className="bg-white text-black px-3 py-1 text-xs md:text-sm font-black uppercase rounded-md tracking-widest shadow-sm">{primaryLang}</span>
                        <RefreshCw size={24} className="text-white/50 group-hover:rotate-180 transition-transform duration-500 drop-shadow-md" />
                      </div>
                      <p className="text-white text-xl md:text-3xl lg:text-4xl leading-relaxed italic font-medium drop-shadow-lg">
                        {primaryLang === 'EN' ? storyline : storylineJP}
                      </p>
                      <div className="mt-8 text-white/50 text-xs md:text-sm font-bold text-center uppercase tracking-widest flex items-center justify-center gap-2 drop-shadow-md">
                         <RefreshCw size={14} /> Tap to flip translation
                      </div>
                    </div>
                  </div>

                  {/* 裏面 (Back) */}
                  <div 
                    className="absolute inset-0 bg-blue-900 border-4 border-blue-400 rounded-3xl overflow-hidden shadow-2xl" 
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                    <div className="absolute inset-0 bg-blue-900/70" />
                    
                    <div className="relative w-full h-full p-6 md:p-12 flex flex-col justify-center overflow-y-auto">
                      <div className="flex items-center justify-between mb-6">
                        <span className="bg-blue-400 text-black px-3 py-1 text-xs md:text-sm font-black uppercase rounded-md tracking-widest shadow-sm">{primaryLang === 'EN' ? 'JP' : 'EN'}</span>
                        <RefreshCw size={24} className="text-blue-300 group-hover:rotate-180 transition-transform duration-500 drop-shadow-md" />
                      </div>
                      <p className="text-white text-xl md:text-3xl lg:text-4xl font-bold leading-relaxed drop-shadow-lg">
                        {primaryLang === 'EN' ? storylineJP : storyline}
                      </p>
                      <div className="mt-8 text-blue-300 text-xs md:text-sm font-bold text-center uppercase tracking-widest flex items-center justify-center gap-2 drop-shadow-md">
                         <RefreshCw size={14} /> Tap to flip back
                      </div>
                    </div>
                  </div>
                  
                </div>
             </div>
           </div>
        </div>
      )}
      <div className="bg-black text-white px-3 md:px-5 py-2 md:py-2.5 flex items-center justify-between gap-2 md:gap-4 font-bold shrink-0">
        <span className="text-[9px] md:text-xs uppercase tracking-widest leading-none truncate flex-1">{trope}</span>
        <button onClick={() => setShowStory(true)} className="bg-yellow-300 text-black px-3 md:px-4 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase hover:bg-white transition-colors shadow-[1px_1px_0_0_rgba(255,255,255,1)]">Play Story</button>
      </div>
    </div>
  );
};

const PVQuiz = ({ isOpen, onClose, pv, quiz, onCorrectAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => { 
    if (isOpen && quiz) { 
      const optionsWithIndex = quiz.options.map((text, originalIndex) => ({ text, originalIndex }));
      for (let i = optionsWithIndex.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
      }
      setShuffledOptions(optionsWithIndex);
      setSelectedOption(null); 
      setIsCorrect(null); 
    }
  }, [isOpen, quiz]);

  const handleCheck = (index) => { 
    setSelectedOption(index); 
    const correct = shuffledOptions[index].originalIndex === quiz.correctIndex; 
    setIsCorrect(correct); 
    if (correct) onCorrectAnswer(); 
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white border-4 border-black w-full max-w-lg rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0_0_rgba(255,255,255,0.1)] text-black max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-rose-500 text-white p-4 md:p-6 flex justify-between items-center border-b-4 border-black text-left sticky top-0 z-10">
          <div className="flex items-center gap-3 text-white"><AlertCircle size={20} className="md:w-6 md:h-6" /><h2 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter">Check Your Vibes</h2></div>
          <button onClick={onClose} className="text-white hover:text-black transition-colors"><X size={24} /></button>
        </div>
        <div className="p-6 md:p-8">
          <div className="mb-6 text-left"><span className="text-[8px] md:text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded-md mb-2 inline-block tracking-widest">Question</span><p className="text-base md:text-xl font-bold text-black leading-snug">{quiz.question}</p></div>
          <div className="space-y-2 md:space-y-3">
            {shuffledOptions.map((option, idx) => (
              <button key={idx} disabled={selectedOption !== null} onClick={() => handleCheck(idx)} className={`w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 md:border-4 border-black text-left text-sm md:text-base font-black transition-all flex items-center justify-between ${selectedOption === null ? 'hover:translate-x-1 hover:bg-gray-50 text-black' : selectedOption === idx ? (isCorrect ? 'bg-green-400 text-black' : 'bg-red-400 text-white') : 'bg-white opacity-50'}`}>
                <span>{option.text}</span>{selectedOption === idx && (isCorrect ? <CheckCircle2 size={18} /> : <X size={18} />)}
              </button>
            ))}
          </div>
          {selectedOption !== null && (
            <div className="mt-6 animate-in slide-in-from-bottom-2 text-left">
              <div className={`p-4 rounded-xl border-2 border-black flex items-center gap-3 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}><div className="text-xl shrink-0">{isCorrect ? '✨' : '🧐'}</div><p className="text-[10px] md:text-xs font-bold leading-tight">{isCorrect ? `Perfect! You understand "${pv}".` : `Not quite! In this context, "${pv}" means: ${quiz.explanation}`}</p></div>
              <button onClick={onClose} className="w-full mt-4 bg-black text-white py-3 md:py-4 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-yellow-300 hover:text-black transition-all text-center">Got it!</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PVExplanation = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 text-black" onClick={onClose}>
      <div className="bg-white border-4 border-black w-full max-w-2xl rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,1)]" onClick={(e) => e.stopPropagation()}>
        <div className="bg-black text-white p-4 md:p-6 flex justify-between items-center"><div className="flex items-center gap-3 text-white"><Info className="text-yellow-300" size={24} /><h2 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter">PV (句動詞) とは？</h2></div><button onClick={onClose} className="text-white hover:text-yellow-300 transition-colors"><X size={28} /></button></div>
        <div className="p-6 md:p-8 space-y-6 text-left">
          <section className="bg-blue-50 p-4 md:p-6 border-2 border-black rounded-xl md:rounded-2xl text-black">
            <h3 className="text-blue-600 font-black text-[10px] md:text-xs uppercase mb-3 tracking-widest">Basic Formula</h3>
            <div className="text-lg md:text-2xl font-black italic flex items-center gap-2 md:gap-4 flex-wrap"><span>動詞 (Verb)</span><span className="text-gray-400">+</span><span className="text-indigo-600">前置詞 / 副詞</span></div>
            <p className="mt-4 text-[11px] md:text-sm font-bold text-gray-700 leading-relaxed">「look」「go」などの動詞に前置詞が付き、全く新しい意味に変わる熟語です。日常会話の鍵となります。</p>
          </section>
          <button onClick={onClose} className="w-full bg-black text-white font-black py-3 md:py-4 rounded-xl text-[10px] md:text-xs uppercase tracking-widest hover:bg-yellow-300 hover:text-black transition-all">学習をスタート！</button>
        </div>
      </div>
    </div>
  );
};

// 🔐 パスワード入力用モーダルコンポーネント
const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [notified, setNotified] = useState(false);

  const CORRECT_PASSWORD = "maki";

  const notifyAdmin = async (wrongPassword) => {
    console.warn(`[SECURITY ALERT] Unauthorized login attempt with password: ${wrongPassword}`);
    setNotified(true);
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError(false);
      setNotified(false);
      setPassword('');
      onLoginSuccess();
    } else {
      setError(true);
      notifyAdmin(password);
      setPassword('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black w-full max-w-sm rounded-3xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2 text-black"><Lock size={24}/> Admin Login</h2>
          <button onClick={() => { onClose(); setError(false); setNotified(false); setPassword(''); }} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24}/></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter Password" 
              className="w-full border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none focus:bg-yellow-50 transition-colors"
              autoFocus
            />
          </div>
          {error && (
            <div className="text-red-600 text-xs font-bold bg-red-50 p-3 rounded-xl border-2 border-red-500 animate-in slide-in-from-top-2">
              <p className="flex items-center gap-1.5"><AlertTriangle size={16} /> Incorrect password.</p>
              {notified && <p className="mt-2 text-[10px] opacity-80 border-t border-red-200 pt-2 text-left leading-tight">⚠️ The administrator has been automatically notified of this unauthorized attempt.</p>}
            </div>
          )}
          <button type="submit" className="w-full bg-black text-white font-black py-3 md:py-4 rounded-xl uppercase tracking-widest hover:bg-yellow-300 hover:text-black transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none mt-2 text-xs">Verify & Login</button>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [episode, setEpisode] = useState(1);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVibesFlipped, setIsVibesFlipped] = useState(false);
  const [isExampleFlipped, setIsExampleFlipped] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [correctlyAnswered, setCorrectlyAnswered] = useState(new Set());
  const [promptLang, setPromptLang] = useState('EN'); 
  const [cefrFilter, setCefrFilter] = useState('ALL');
  const [isEpOpen, setIsEpOpen] = useState(false);
  const [isCefrOpen, setIsCefrOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customBgUrls, setCustomBgUrls] = useState({});
  const [isAdminMode, setIsAdminMode] = useState(false); 
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [user, setUser] = useState(null);

  // --- Firebase Auth & Data Sync ---
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const bgCollection = collection(db, 'artifacts', appId, 'public', 'data', 'pv_backgrounds');
    const unsubscribe = onSnapshot(bgCollection, (snapshot) => {
      const newBgs = {};
      snapshot.forEach(document => {
        if(document.data().url) {
          newBgs[document.id] = document.data().url;
        }
      });
      setCustomBgUrls(newBgs);
    }, (error) => {
      console.error("Snapshot error:", error);
    });
    return () => unsubscribe();
  }, [user]);

  const handleUpdateBgUrl = async (pv, url) => {
    const docId = getDocId(pv);
    setCustomBgUrls(prev => ({ ...prev, [docId]: url })); // Optimistic UI update

    if (!user || !db) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'pv_backgrounds', docId);
      await setDoc(docRef, { url: url || '' });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  
  const batches = {
    1: [
      { 
        pv: "Abide by", trope: "The Dojo Rules", cefr: "C1", icon: Shield, 
        meaning: "To follow or accept a rule, a decision, or an agreement.", 
        meaningJP: "規則や決定を遵守する、従う", 
        example: "If you want to stay in this apartment, you have to abide by the rules.", 
        exampleJP: "このアパートに住み続けたいなら、規則に従わなければならない。",
        vibes: ["Following strict honor codes", "Respecting the law without question", "Agreeing to tough terms"], 
        vibesJP: ["厳格な名誉の掟に従う", "無条件で法を重んじる", "厳しい条件に同意する"],
        storyline: "Sato joined the elite Kendo club. The captain handed him a wooden sword. 'In this dojo, we abide by ancient honor codes. Break them, and you're out.'", 
        storylineJP: "佐藤は強豪の剣道部に入部した。主将は木刀を渡し、「この道場では古来の名誉の掟に従うのだ。破れば即退部だぞ」と警告した。", 
        quiz: { question: "In a professional tournament, players must ___ the referee's final decision.", options: ["abide by", "act on", "add up"], correctIndex: 0, explanation: "to obey a rule." } 
      },
      { 
        pv: "Account for", trope: "The Mystery Detective", cefr: "B2", icon: Search, 
        meaning: "To explain the reason for something or where you were.", 
        meaningJP: "理由を説明する、～の根拠となる", 
        example: "Can you account for why you're home two hours late?", 
        exampleJP: "なぜ2時間も帰りが遅くなったのか説明できる？",
        vibes: ["Questioning a suspect's whereabouts", "Explaining missing budget items", "Finding reasons for scientific results"], 
        vibesJP: ["容疑者の所在を問いただす", "使途不明金を説明する", "科学的結果の理由を見つける"],
        storyline: "The Detective slammed his hand on the table. 'Your phone's GPS shows you were at the mall! How do you account for this huge gap in your story?!'", 
        storylineJP: "刑事は机をバンと叩いた。「スマホのGPSではショッピングモールにいたことになっている！この話の矛盾をどう説明するつもりだ？！」", 
        quiz: { question: "The manager asked the accountant to ___ the missing $500.", options: ["account for", "abide by", "agree with"], correctIndex: 0, explanation: "to explain why." } 
      },
      { 
        pv: "Ache for", trope: "The Slice of Life Longing", cefr: "C1", icon: Heart, 
        meaning: "To have a very strong feeling of wanting someone or something.", 
        meaningJP: "～を切望する、～したくてたまらない", 
        example: "After a long day of hiking, I am really aching for a hot shower.", 
        exampleJP: "長いハイキングの1日の後、熱いシャワーが本当に恋しくてたまらない。",
        vibes: ["Desperate food cravings", "Missing a distant best friend", "Deep homesickness during travel"], 
        vibesJP: ["無性に食べたくなる", "遠くの親友を恋しく思う", "旅行中の深いホームシック"],
        storyline: "After three grueling weeks of survival training in the mountains, Haru stared weakly at a blurry photo of ramen. 'I am literally aching for real food,' he whispered.", 
        storylineJP: "山での過酷なサバイバル訓練が3週間続き、ハルはラーメンの写真を力なく見つめていた。「マジで本物の温かい食べ物が恋しくてたまらない...」と彼はつぶやいた。", 
        quiz: { question: "After living in the city for a year, she was ___ the quiet of the countryside.", options: ["adding up", "aching for", "acting on"], correctIndex: 1, explanation: "to want something very much." } 
      },
      { 
        pv: "Act on", trope: "The Tactical Operation", cefr: "B2", icon: Zap, 
        meaning: "To take action according to information, advice, or a signal.", 
        meaningJP: "情報や助言に基づいて行動する、作用する", 
        example: "The manager decided to act on the customer's complaint.", 
        exampleJP: "マネージャーは顧客のクレームに基づいて行動することを決定した。",
        vibes: ["Responding to anonymous tips", "Following a doctor's serious advice", "Executing military tactics"], 
        vibesJP: ["匿名のタレコミに対応する", "医師の深刻な忠告に従う", "軍事戦術を実行する"],
        storyline: "The hacker intercepted an encrypted signal from the enemy base. 'Commander! We need to act on this intel immediately before they move their troops!'", 
        storylineJP: "ハッカーは敵基地からの暗号化された信号を傍受した。「指令官！敵が部隊を動かす前に、直ちにこの情報に基づいて行動を起こす必要があります！」", 
        quiz: { question: "The police had to ___ the anonymous tip to prevent the crime.", options: ["act on", "allow for", "angle for"], correctIndex: 0, explanation: "to take action based on info." } 
      },
      { 
        pv: "Act out", trope: "The Drama Club", cefr: "B2", icon: Play, 
        meaning: "To express feelings by performing actions or bad behavior.", 
        meaningJP: "感情を態度で示す、実演する", 
        example: "Don't just tell me the story; act it out so I can see!", 
        exampleJP: "ただ話すだけでなく、私に見えるように実演して！",
        vibes: ["Dramatic stage performances", "Toddler tantrums in a store", "Expressing intense anger physically"], 
        vibesJP: ["ドラマチックな舞台パフォーマンス", "店での幼児のかんしゃく", "激しい怒りを体で表現する"],
        storyline: "During the national theater competition, Aoi didn't just read her lines. She had to completely act out a scene of absolute, devastating heartbreak.", 
        storylineJP: "全国演劇大会で、アオイはただセリフを読むだけではなかった。彼女は絶対的で破壊的な失恋のシーンを全身で表現（実演）しなければならなかった。", 
        quiz: { question: "The child was ___ his frustration because he couldn't have the toy.", options: ["acting out", "agreeing with", "aching for"], correctIndex: 0, explanation: "to express feelings through behavior." } 
      },
      { 
        pv: "Act up", trope: "The Mecha Malfunction", cefr: "B2", icon: Cpu, 
        meaning: "To behave badly or to malfunction and not work properly.", 
        meaningJP: "機械が不調になる、わがままを言う", 
        example: "My car has been acting up lately; I think the battery is dying.", 
        exampleJP: "最近車の調子が悪くて、バッテリーが切れかかっているんだと思う。",
        vibes: ["Glitchy technology and bugs", "Kids misbehaving in public", "Old sports injuries flaring up"], 
        vibesJP: ["バグだらけのテクノロジー", "公共の場で暴れる子供", "古いスポーツの怪我が再発する"],
        storyline: "Right in the middle of the boss battle, the giant robot's left arm started glitching wildly. 'Sir! The main power core is acting up again!' the pilot screamed.", 
        storylineJP: "ボス戦の真っ只中、巨大ロボットの左腕が激しく誤作動し始めた。「閣下！メインの動力コアがまた不調です！」パイロットが叫んだ。", 
        quiz: { question: "I need to take my laptop to the shop because the keyboard is ___.", options: ["acting up", "adding on", "aiming at"], correctIndex: 0, explanation: "to malfunction." } 
      },
      { 
        pv: "Add on", trope: "The RPG Stat Boost", cefr: "B1", icon: PlusSquare, 
        meaning: "To add something extra to a total amount or existing thing.", 
        meaningJP: "合計に何かを追加する、合算する", 
        example: "Don't forget to add on the shipping cost before you pay.", 
        exampleJP: "支払う前に送料を追加するのを忘れないで。",
        vibes: ["Calculating tax and tips", "Equipping gaming stat bonuses", "Adding features to a basic plan"], 
        vibesJP: ["税金やチップを計算する", "ゲームのステータスボーナスを装備する", "基本プランに機能を追加する"],
        storyline: "After defeating the dungeon boss, Rin carefully collected the glowing gems. 'If we add on these rare artifacts, our power will be unstoppable!'", 
        storylineJP: "ダンジョンのボスを倒した後、リンは光る宝石を慎重に集めた。「このレアな遺物を合算すれば、私たちの力は無敵になるわ！」", 
        quiz: { question: "Small daily expenses can ___ a lot of money by the end of the year.", options: ["add on", "abide by", "act on"], correctIndex: 0, explanation: "to add to a total." } 
      },
      { 
        pv: "Add up", trope: "The Logic Check", cefr: "B2", icon: Calculator, 
        meaning: "To seem reasonable and logical, or the calculation is correct.", 
        meaningJP: "つじつまが合う、計算が合う", 
        example: "His story just doesn't add up. His car was seen at the mall!", 
        exampleJP: "彼の話はどうもつじつまが合わない。彼の車はモールで目撃されているんだ！",
        vibes: ["Questioning suspicious excuses", "Checking complex bill math", "Making sure evidence fits the crime"], 
        vibesJP: ["怪しい言い訳を疑う", "複雑な請求書の計算を確認する", "証拠が犯罪と一致するか確かめる"],
        storyline: "Ren narrowed his eyes at the muddy evidence on the floor. 'The suspect claims he was alone all night... but there are two sets of footprints. This just doesn't add up.'", 
        storylineJP: "レンは床に残された泥だらけの証拠に目を細めた。「容疑者は一晩中一人だったと主張しているが...ここには二組の足跡がある。これではどうもつじつまが合わない。」", 
        quiz: { question: "The detective felt something was wrong because the witness's story didn't ___.", options: ["add up", "act up", "allow for"], correctIndex: 0, explanation: "to seem logical." } 
      },
      { 
        pv: "Agree with", trope: "The Spicy Ramen Fail", cefr: "A2", icon: Coffee, 
        meaning: "To suit one's health or stomach (often about food or climate).", 
        meaningJP: "（体質・胃腸・気候などが）合う、一致する", 
        example: "I love spicy food, but it doesn't always agree with me.", 
        exampleJP: "辛い食べ物は大好きだけど、いつも胃に合うとは限らない。",
        vibes: ["Dealing with food sensitivity", "How climate affects health", "The results of a specific diet"], 
        vibesJP: ["食物過敏症に対処する", "気候が健康に与える影響", "特定の食事療法の効果"],
        storyline: "Koji bravely took on the 'Hell-Level Spicy Ramen' challenge. Ten minutes later, he was sweating in deep regret. 'I love the taste, but this definitely does not agree with me...'", 
        storylineJP: "コウジは勇敢にも「地獄級激辛ラーメン」に挑んだ。10分後、彼は汗だくになり後悔していた。「味は最高なんだが、これは間違いなく俺の胃には合わないな...」", 
        quiz: { question: "I should stop drinking so much soda; it doesn't ___ my stomach.", options: ["agree with", "account for", "abide by"], correctIndex: 0, explanation: "to suit your health." } 
      },
      { 
        pv: "Aim at", trope: "The Sniper Focus", cefr: "B1", icon: Target, 
        meaning: "To point something at a target or intend to achieve a specific goal.", 
        meaningJP: "標的を狙う、目標とする", 
        example: "I'm aiming at finishing this huge project by Friday.", 
        exampleJP: "金曜日までにこの巨大なプロジェクトを終わらせることを目標にしている。",
        vibes: ["Setting ambitious career goals", "Focusing on a marketing target audience", "Physical camera or weapon focus"], 
        vibesJP: ["野心的なキャリア目標を設定する", "マーケティングのターゲット層に集中する", "カメラや武器の物理的な照準"],
        storyline: "The young archer's hands trembled. The master placed a steady hand on her shoulder. 'Don't just look at the entire target,' he instructed. 'Aim at the very center.'", 
        storylineJP: "若い弓使いの手は震えていた。師匠は彼女の肩に静かに手を置いた。「的全体をただ見るのではない」と彼は指導した。「ど真ん中だけを狙え。」", 
        quiz: { question: "The new advertising campaign is ___ young professionals.", options: ["aimed at", "acting on", "aching for"], correctIndex: 0, explanation: "to target something." } 
      },
      { 
        pv: "Allow for", trope: "The Strategy Map", cefr: "B2", icon: Map, 
        meaning: "To include something in your calculations or plans, especially extra time.", 
        meaningJP: "～を考慮に入れる、余裕を見る", 
        example: "We need to allow for heavy traffic, so let's leave early.", 
        exampleJP: "渋滞を考慮に入れる必要があるので、早く出発しよう。",
        vibes: ["Adding GPS traffic buffers", "Padding a party budget", "Building in a performance error margin"], 
        vibesJP: ["GPSの交通渋滞の余裕を持たせる", "パーティーの予算に余裕を持たせる", "パフォーマンスの誤差の範囲を組み込む"],
        storyline: "The General pointed grimly to the snowy mountain pass on the map. 'A massive blizzard is approaching. We must allow for at least three extra days of travel.'", 
        storylineJP: "将軍は地図上の雪に覆われた山道を険しい表情で指差した。「巨大な吹雪が接近している。軍を生き延びさせたいなら、少なくとも3日分の余計な移動時間を考慮に入れておく必要がある。」", 
        quiz: { question: "When you travel, always ___ the time it takes to get through security.", options: ["allow for", "add up", "abide by"], correctIndex: 0, explanation: "to consider something in a plan." } 
      },
      { 
        pv: "Allow of", trope: "The Strict Gatekeeper", cefr: "C1", icon: XOctagon, 
        meaning: "To permit or make something possible (used in formal contexts).", 
        meaningJP: "～を可能にする、～の余地がある", 
        example: "The urgent situation doesn't allow of any further delay.", 
        exampleJP: "この緊急事態はこれ以上の遅れを許さない。",
        vibes: ["Zero tolerance rules", "Absolute deadlines", "Immediate crisis action"], 
        vibesJP: ["一切の妥協を許さないルール", "絶対的な締め切り", "即座の危機対応"],
        storyline: "The King's Guard blocked the bridge with drawn swords. 'The peace treaty is absolute,' the captain stated coldly. 'It does not allow of any exceptions.'", 
        storylineJP: "国王の近衛兵たちが剣を抜いて橋を封鎖した。「平和条約は絶対だ」と隊長は冷酷に言い放った。「いかなる例外の余地も（許可も）ない。」", 
        quiz: { question: "The strict terms of the contract do not ___ any modification.", options: ["allow of", "act up", "ache for"], correctIndex: 0, explanation: "to make possible." } 
      },
      { 
        pv: "Angle for", trope: "The Secret Quest", cefr: "C1", icon: Fish, 
        meaning: "To try to get something you want by hinting indirectly.", 
        meaningJP: "遠回しに狙う、手に入れようと画策する", 
        example: "I think he's angling for a promotion by staying late every day.", 
        exampleJP: "彼は毎日遅くまで残ることで昇進を遠回しに狙っていると思う。",
        vibes: ["Hinting for expensive gifts", "Searching for exclusive party invites", "Fishing for compliments"], 
        vibesJP: ["高価な贈り物をほのめかす", "限定パーティーの招待を探る", "お世辞を遠回しに要求する"],
        storyline: "Yumi kept pacing around the armory, loudly praising the captain's legendary new sword. 'She's not just being nice,' the rogue whispered. 'She's angling for a chance to borrow it.'", 
        storylineJP: "ユミは武器庫をうろうろしながら、主将の新しい剣がどれほど素晴らしいかを大声で話し続けていた。「ただ褒めてるだけじゃないぞ」と盗賊がささやいた。「彼女はあれを借りるチャンスを遠回しに狙ってるんだ。」", 
        quiz: { question: "She kept mentioning the concert, clearly ___ an invitation.", options: ["angling for", "adding up", "acting out"], correctIndex: 0, explanation: "to hint for something." } 
      }
    ],
    2: [
      { 
        pv: "Answer back", trope: "The Family Scolding", cefr: "B2", icon: Angry, 
        meaning: "To reply rudely to someone in authority, like a parent or teacher.", 
        meaningJP: "（親や目上に）口答えをする、反抗的な返事をする", 
        example: "I'm your mother! Don't answer back when I'm trying to help you.", 
        exampleJP: "私はあなたの母親よ！助けようとしている時に口答えしないで。",
        vibes: ["A rebellious teen getting scolded", "Classroom disrespect", "Getting defensive with a strict boss"], 
        vibesJP: ["反抗的な10代が叱られる", "教室での無礼な態度", "厳しい上司に対してムキになる"],
        storyline: "Leo was tired of his mother's endless advice about his future. When he finally snapped and answered back, the entire room went completely silent in shock.", 
        storylineJP: "レオは将来についての母親の終わりのない小言にうんざりしていた。彼がついにキレて口答えをした瞬間、部屋中がショックで完全に静まり返った。", 
        quiz: { question: "It's highly disrespectful to ___ when a teacher corrects your mistake.", options: ["answer back", "ask in", "back out"], correctIndex: 0, explanation: "to reply rudely." } 
      },
      { 
        pv: "Answer for", trope: "The Kitchen Disaster", cefr: "B2", icon: User, 
        meaning: "To be held responsible for a mistake or something bad that happened.", 
        meaningJP: "（不始末などの）責任を取る", 
        example: "You'll have to answer for the massive mess you made in the kitchen.", 
        exampleJP: "あなたがキッチンで作ったこの大惨事の責任は取ってもらうからね。",
        vibes: ["Cleaning up after a wild party", "Facing the music for a failed project", "Roommate disputes over chores"], 
        vibesJP: ["どんちゃん騒ぎの後の片付け", "失敗したプロジェクトの報いを受ける", "家事を巡るルームメイトの揉め事"],
        storyline: "The living room was an absolute wreck, with the antique vase shattered on the floor. 'Someone is going to have to answer for this disaster when Mom gets home,' Ken muttered.", 
        storylineJP: "リビングは完全に荒れ果て、アンティークの花瓶が粉々に散らばっていた。「お母さんが帰ってきたら、誰かがこの大惨事の責任を取らなきゃいけないぞ」とケンは呟いた。", 
        quiz: { question: "The project manager will have to ___ the huge financial loss.", options: ["answer for", "ask after", "back off"], correctIndex: 0, explanation: "to be responsible." } 
      },
      { 
        pv: "Answer for", trope: "The Office Delegate", cefr: "B2", icon: MessageCircle, 
        meaning: "To speak on behalf of someone else or guarantee their actions.", 
        meaningJP: "～の代理で答える、保証する", 
        example: "I can't answer for my boss, but I'm sure he'll approve your vacation request.", 
        exampleJP: "上司の代理で答えることはできないけど、君の休暇申請は承認してくれると思うよ。",
        vibes: ["Assuring nervous colleagues", "Acting as a proxy in a meeting", "Vouching for a friend's character"], 
        vibesJP: ["緊張する同僚を安心させる", "会議で代理人を務める", "友人の人柄を保証する"],
        storyline: "The client was furious about the delay. 'I can't answer for the factory's mistakes,' Kaito said smoothly, 'but I can promise our team will fix this tonight.'", 
        storylineJP: "顧客は納期の遅れに激怒していた。「工場のミスの責任を私が代理で負う（答える）ことはできませんが、私たちのチームが今夜中に解決することはお約束します」と海斗は言った。", 
        quiz: { question: "I can't ___ her honesty; I barely know her personally.", options: ["answer for", "ask around", "back away"], correctIndex: 0, explanation: "to speak on behalf of someone." } 
      },
      { 
        pv: "Argue down", trope: "The Debate Master", cefr: "C1", icon: MessageCircle, 
        meaning: "To defeat someone in a debate or logical argument using facts.", 
        meaningJP: "（議論で）論破する、言い負かす", 
        example: "She tried to defend her flawed choice, but he quickly argued her down.", 
        exampleJP: "彼女は欠陥のある選択を正当化しようとしたが、彼はすぐに彼女を論破した。",
        vibes: ["Winning points in a debate club", "Logical disputes at work", "Proving someone completely wrong"], 
        vibesJP: ["ディベート部でポイントを稼ぐ", "職場での論理的な対立", "相手が完全に間違っていると証明する"],
        storyline: "In the final round of the debate, Sora didn't just disagree; he used flawless logic to argue his opponent down until they had absolutely nothing left to say.", 
        storylineJP: "ディベートの最終ラウンドで、ソラはただ反対するだけでなく、完璧な論理を使って相手に反論の余地が全くなくなるまで見事に論破した。", 
        quiz: { question: "She ___ her rival by presenting undisputable scientific data.", options: ["argued down", "ask after", "back down"], correctIndex: 0, explanation: "to beat in a debate." } 
      },
      { 
        pv: "Argue down", trope: "The Flea Market", cefr: "C1", icon: DollarSign, 
        meaning: "To persuade someone to drop the price of an item.", 
        meaningJP: "（交渉して）値切る、値段を下げさせる", 
        example: "The used car was listed at $5,000, but I managed to argue him down to $4,500.", 
        exampleJP: "その中古車は5,000ドルで出品されていたが、私は交渉して彼に4,500ドルまで値下げさせた。",
        vibes: ["Haggling at local markets", "Buying a used car", "Tough business negotiations"], 
        vibesJP: ["地元の市場で値切る", "中古車を買う", "タフなビジネス交渉"],
        storyline: "The antique merchant demanded 200 gold coins for the mysterious map. Hina smiled, pointed out a small tear, and skillfully argued him down to a mere 150 gold.", 
        storylineJP: "骨董商は謎めいた地図に対して200ゴールドを要求した。ヒナは微笑み、小さな破れを指摘して、巧みな交渉でわずか150ゴールドまで値切ることに成功した。", 
        quiz: { question: "I managed to ___ the street vendor ___ to a much more reasonable $10.", options: ["argue / down", "ask / out", "back / into"], correctIndex: 0, explanation: "to lower price." } 
      },
      { 
        pv: "Argue down", trope: "The Boardroom Rejection", cefr: "C1", icon: Database, 
        meaning: "To persuade a group of people not to accept a proposal or plan.", 
        meaningJP: "（提案などを）説得して否決させる、退けさせる", 
        example: "The conservative board members tried to argue down the innovative new budget.", 
        exampleJP: "保守的な取締役たちは、革新的な新予算案を説得して否決させようとした。",
        vibes: ["Rejecting risky business plans", "Tense formal meetings", "Political debates over policy"], 
        vibesJP: ["リスクの高い事業計画を拒否する", "緊張感のある公式会議", "政策を巡る政治的議論"],
        storyline: "The young CEO proposed a highly risky expansion into VR. However, the veteran CFO stood up and systematically argued the plan down, citing a severe lack of funds.", 
        storylineJP: "若きCEOはVRへの非常にリスキーな事業拡大を提案した。しかし、ベテランのCFOが立ち上がり、当面の資金不足を理由に、その計画を理路整然と説得して退けさせた。", 
        quiz: { question: "The committee ___ the expensive expansion plan after a long meeting.", options: ["argued down", "asked in", "back away"], correctIndex: 0, explanation: "to persuade against a plan." } 
      },
      { 
        pv: "Argue out", trope: "The Partners' Conflict", cefr: "B2", icon: User, 
        meaning: "To find a solution to a problem by discussing it thoroughly.", 
        meaningJP: "徹底的に議論して解決する、とことん話し合う", 
        example: "We really need to argue our differences out before we sign this contract.", 
        exampleJP: "この契約にサインする前に、お互いの相違点をとことん話し合う必要がある。",
        vibes: ["Resolving deep conflicts", "Fixing a failing relationship", "Long team planning sessions"], 
        vibesJP: ["深い対立を解決する", "壊れかけた関係を修復する", "長時間のチーム計画会議"],
        storyline: "The two lead developers disagreed on every feature. They locked themselves in a room, spent all night arguing it out, and finally emerged at dawn with a perfect compromise.", 
        storylineJP: "二人のリード開発者はすべての機能において意見が対立していた。彼らは会議室にこもり、一晩中徹底的に議論し尽くし、夜明けにようやく完璧な妥協点を見出して出てきた。", 
        quiz: { question: "Instead of fighting, we need to sit down and ___ this problem.", options: ["argue out", "act out", "add on"], correctIndex: 0, explanation: "to solve by discussion." } 
      },
      { 
        pv: "Ask about", trope: "The Family Catch-up", cefr: "A1", icon: Home, 
        meaning: "To enquire about how someone is doing or what is happening.", 
        meaningJP: "（近況などを）尋ねる、聞いてくる", 
        example: "My grandmother always asks about your family whenever I call her.", 
        exampleJP: "私が電話するたびに、おばあちゃんはいつもあなたの家族の近況を聞いてくるよ。",
        vibes: ["Passing on messages from relatives", "Polite social enquiry", "Showing gentle care"], 
        vibesJP: ["親戚からの伝言を伝える", "礼儀正しい社交的な問いかけ", "優しい気遣いを示す"],
        storyline: "Sato's cheerful aunt called from the countryside. 'She always asks about your school life,' his mom smiled, handing him the phone.", 
        storylineJP: "佐藤の陽気な叔母が田舎から電話をかけてきた。「あの人、いつもあなたの学校生活について聞いてくるのよ」と母は微笑み、彼に受話器を渡した。", 
        quiz: { question: "How is your sister doing? Everyone at the party was ___ her.", options: ["asking about", "arguing down", "acting on"], correctIndex: 0, explanation: "to enquire about wellbeing." } 
      },
      { 
        pv: "Ask after", trope: "The Old Friend's Concern", cefr: "B1", icon: User, 
        meaning: "To explicitly enquire about someone's health or life, showing care.", 
        meaningJP: "（人の）安否を尋ねる、気遣う", 
        example: "I ran into Sarah today at the cafe, and she kindly asked after you.", 
        exampleJP: "今日カフェでサラにばったり会ったんだけど、親切にあなたの安否を気遣っていたよ。",
        vibes: ["Seeking health updates", "Thinking of someone far away", "Reconnecting with old friends"], 
        vibesJP: ["健康状態のアップデートを求める", "遠く離れた人を想う", "旧友との再会"],
        storyline: "While shopping, Hina bumped into her old elementary school teacher. The teacher smiled warmly and immediately asked after Hina's older brother, who had been hospitalized.", 
        storylineJP: "買い物をしている時、ヒナは昔の小学校の先生にばったり会った。先生は温かく微笑み、すぐに昨年入院していたヒナの兄の安否を気遣って尋ねた。", 
        quiz: { question: "He thoughtfully ___ your father's recovery from surgery.", options: ["asked after", "added up", "abided by"], correctIndex: 0, explanation: "to enquire about health." } 
      },
      { 
        pv: "Ask around", trope: "The Neighborhood Search", cefr: "A2", icon: Search, 
        meaning: "To ask several different people for information or help.", 
        meaningJP: "（情報を求めて）あちこち尋ね回る、聞き込みをする", 
        example: "I don't know who owns this stray dog, but I'll ask around the neighborhood.", 
        exampleJP: "この迷い犬の飼い主は分からないけど、近所で聞き込みをしてみるよ。",
        vibes: ["Finding lost items", "Getting local restaurant advice", "A mini detective search"], 
        vibesJP: ["探し物を見つける", "地元のレストランのアドバイスをもらう", "ちょっとした探偵ごっこ"],
        storyline: "Sora realized his locker keys were missing right before the big game. Panicking, he spent twenty minutes asking around the gym until a junior member found them.", 
        storylineJP: "大事な試合の直前、ソラはロッカーの鍵がないことに気づいた。パニックになりながら体育館中で聞き込みをして回り、20分後、ついに後輩が見つけてくれた。", 
        quiz: { question: "I don't have a charger, but I'll ___ the office for a spare one.", options: ["ask around", "argue out", "act up"], correctIndex: 0, explanation: "to ask multiple people." } 
      },
      { 
        pv: "Ask around", trope: "The Casual Party Planner", cefr: "A2", icon: Home, 
        meaning: "To invite someone to come to your home or a specific place.", 
        meaningJP: "（自分の家などに）招待する", 
        example: "Since we just moved in, we should ask the new neighbors around for dinner.", 
        exampleJP: "引っ越してきたばかりだから、新しいご近所さんを夕食に招待すべきだね。",
        vibes: ["Organizing a social gathering", "Inviting people to a home dinner", "Being a friendly host"], 
        vibesJP: ["社交的な集まりを企画する", "家でのディナーに人を招く", "フレンドリーなホストになる"],
        storyline: "The huge team project was finally completed. Feeling relieved, Leo decided to ask around the entire design team to his place for a spontaneous victory pizza party.", 
        storylineJP: "巨大なチームプロジェクトがようやく無事に完了した。安堵したレオは、思いつきのピザパーティのために、デザインチーム全員を自宅に招待することにした。", 
        quiz: { question: "We should ___ the new transfer students ___ for some coffee.", options: ["ask / around", "back / up", "answer / back"], correctIndex: 0, explanation: "to invite to a home." } 
      },
      { 
        pv: "Ask for", trope: "The Foolish Provocation", cefr: "A2", icon: AlertTriangle, 
        meaning: "To behave in a way that is guaranteed to provoke a negative reaction or trouble.", 
        meaningJP: "（自業自得で）災いを招く、自らトラブルを求める", 
        example: "If you drive that fast on an icy road, you're literally asking for trouble.", 
        exampleJP: "凍った道でそんなにスピードを出したら、文字通り自らトラブルを求めているようなものだぞ。",
        vibes: ["Warning someone of risky behavior", "Facing inevitable consequences", "Instant karma"], 
        vibesJP: ["危険な行動を警告する", "避けられない結果に直面する", "インスタント・カルマ（自業自得）"],
        storyline: "Leo kept ignoring the bright red warning signs and revved his engine near the cliff edge. 'Seriously, you're asking for a massive accident,' his friend yelled.", 
        storylineJP: "レオは真っ赤な警告標識を無視し続け、崖のそばでエンジンを吹かした。「マジで、お前自ら大事故を招こうとしてるぞ」と友人は恐怖で叫んだ。", 
        quiz: { question: "Ignoring all the safety rules on a construction site is just ___ trouble.", options: ["asking for", "adding on", "aiming at"], correctIndex: 0, explanation: "to provoke trouble." } 
      },
      { 
        pv: "Ask for", trope: "The Service Request", cefr: "A1", icon: ShoppingCart, 
        meaning: "To request to have or be given something.", 
        meaningJP: "（何かを）頼む、要求する", 
        example: "I asked for a quiet window seat, but the flight was already completely full.", 
        exampleJP: "静かな窓側の席を頼んだんだけど、フライトはすでに満席だった。",
        vibes: ["Making airport or hotel requests", "Ordering at a fancy restaurant", "Seeking help from customer service"], 
        vibesJP: ["空港やホテルで要望を伝える", "高級レストランでの注文", "カスタマーサービスに助けを求める"],
        storyline: "Rin walked up to the electronics store counter. The gadget was broken, so she politely but firmly asked for a full cash refund.", 
        storylineJP: "リンは家電量販店のカウンターに歩み寄った。ガジェットが壊れていたため、彼女は礼儀正しく、しかしきっぱりと全額現金での返金を頼んだ。", 
        quiz: { question: "Feeling dizzy, he immediately ___ a large glass of water.", options: ["asked for", "argued out", "acted on"], correctIndex: 0, explanation: "to request something." } 
      },
      { 
        pv: "Ask in", trope: "The Warm Hospitality", cefr: "A2", icon: Home, 
        meaning: "To invite someone to enter your house, especially from the cold or rain.", 
        meaningJP: "（家の中へ）招き入れる", 
        example: "It's freezing outside! Please, don't leave him on the porch—ask him in immediately.", 
        exampleJP: "外は凍えるほど寒いよ！彼をポーチに放置しないで、すぐに中へ招き入れて。",
        vibes: ["Welcoming guests", "Escaping bad weather", "Showing basic hospitality"], 
        vibesJP: ["ゲストを歓迎する", "悪天候から逃れる", "基本的なおもてなしを示す"],
        storyline: "A sudden, freezing rainstorm hit just as the delivery man arrived. Seeing him shivering, Grandpa immediately told Sora to ask the courier in for a hot cup of tea.", 
        storylineJP: "配達員が到着した瞬間、凍えるような暴風雨が襲った。彼が震えているのを見て、祖父はすぐにソラに、配達員を温かいお茶のために中へ招き入れるよう言った。", 
        quiz: { question: "Don't leave the poor guests out in the cold, ___!", options: ["ask them in", "back off", "act out"], correctIndex: 0, explanation: "to invite inside." } 
      },
      { 
        pv: "Ask out", trope: "The Romantic Move", cefr: "B1", icon: Heart, 
        meaning: "To invite someone for a romantic date.", 
        meaningJP: "（デートに）誘う", 
        example: "He’s been incredibly nervous all day because he’s finally going to ask her out.", 
        exampleJP: "ついに彼女をデートに誘うつもりなので、彼は一日中信じられないほど緊張している。",
        vibes: ["Teenage romance", "Gathering courage", "First dates"], 
        vibesJP: ["10代のロマンス", "勇気を振り絞る", "初めてのデート"],
        storyline: "The school cultural festival was ending, and fireworks lit up the night sky. With red cheeks, Kaito finally found the courage to approach his crush and ask her out.", 
        storylineJP: "学園祭が終わりを迎え、花火が夜空を照らした。頬を赤らめ、海斗はついに勇気を振り絞って片思いの相手に近づき、デートに彼女を誘った。", 
        quiz: { question: "After months of crushing on her, he finally ___ her ___.", options: ["asked / out", "backed / up", "added / on"], correctIndex: 0, explanation: "to invite on a date." } 
      },
      { 
        pv: "Ask over", trope: "The Casual Get-Together", cefr: "B1", icon: Home, 
        meaning: "To invite someone to your home for a casual visit.", 
        meaningJP: "（自分の家に）招待する、呼び寄せる", 
        example: "Since the weather is nice, let's ask the neighbors over for a quick backyard BBQ.", 
        exampleJP: "天気がいいから、ご近所さんを呼んで裏庭で軽くBBQをしようよ。",
        vibes: ["Neighborhood socializing", "Casual weekend plans", "Friendly invites"], 
        vibesJP: ["近所付き合い", "カジュアルな週末の計画", "フレンドリーな招待"],
        storyline: "The big soccer match was broadcasting live on TV. Kaito bought a ton of snacks and decided to ask over all his closest friends to watch the intense game together.", 
        storylineJP: "サッカーの大一番がテレビで生中継される。海斗は大量のスナックを買い込み、親友たちを家に呼んで（招待して）、一緒に白熱の試合を見ることに決めた。", 
        quiz: { question: "We should definitely ___ them ___ for some drinks this weekend.", options: ["ask / over", "argue / down", "act / up"], correctIndex: 0, explanation: "to invite to your home." } 
      },
      { 
        pv: "Auction off", trope: "The Estate Sale", cefr: "C2", icon: Gavel, 
        meaning: "To sell something to the highest bidder at an auction, often to clear space.", 
        meaningJP: "（競売で）売り払う", 
        example: "They had to auction off all their expensive old furniture before moving overseas.", 
        exampleJP: "彼らは海外に引っ越す前に、高価な古い家具をすべて競売で売り払わなければならなかった。",
        vibes: ["Moving to a new country", "Clearance sales", "Liquidating assets rapidly"], 
        vibesJP: ["新しい国への引っ越し", "在庫一掃セール", "資産を迅速に現金化する"],
        storyline: "The famous, century-old antique shop sadly had to close its doors forever. To clear the massive inventory quickly, the owner auctioned off everything to the highest bidders.", 
        storylineJP: "1世紀の歴史を持つ有名な骨董品店が、永遠に店を閉めることになった。膨大な在庫を素早く片付けるため、オーナーはすべての品を最高入札者に競売で売り払った。", 
        quiz: { question: "The bankrupt company's remaining property was entirely ___.", options: ["auctioned off", "asked around", "added up"], correctIndex: 0, explanation: "to sell at an auction." } 
      },
      { 
        pv: "Back away", trope: "The Scary Encounter", cefr: "B1", icon: AlertTriangle, 
        meaning: "To retreat or move backwards slowly from something frightening or dangerous.", 
        meaningJP: "（恐怖などでゆっくり）後ずさりする", 
        example: "The stray cat hissed aggressively, so I slowly backed away to avoid getting scratched.", 
        exampleJP: "野良猫が威嚇して鳴いたので、引っかかれないように私はゆっくり後ずさりした。",
        vibes: ["Facing sudden fear", "Avoiding physical danger", "Cautious retreat"], 
        vibesJP: ["突然の恐怖に直面する", "身体的な危険を避ける", "慎重な後退"],
        storyline: "Deep in the dark forest, a massive wolf suddenly appeared on the path. Sora's heart pounded, but he knew better than to run. Keeping eye contact, he just backed away slowly.", 
        storylineJP: "暗い森の奥深く、突然巨大な狼が道に現れた。ソラの心臓は激しく鳴ったが、彼は走って逃げてはいけないと分かっていた。目を合わせたまま、彼はただゆっくりと後ずさりした。", 
        quiz: { question: "When the unpredictable fire flared up, the crowd instinctively ___.", options: ["backed away", "asked after", "acted out"], correctIndex: 0, explanation: "to move backwards from fear." } 
      },
      { 
        pv: "Back down", trope: "The Stubborn Pride", cefr: "B2", icon: Undo2, 
        meaning: "To retract a position, admit you were wrong, or yield in a conflict.", 
        meaningJP: "（主張を）撤回する、引き下がる、屈服する", 
        example: "He realized halfway through that his facts were wrong, but he was too proud to back down.", 
        exampleJP: "彼は途中で自分の事実が間違っていることに気づいたが、プライドが高すぎて引き下がれなかった。",
        vibes: ["Stubborn arguments", "Protecting one's pride", "Refusing to admit mistakes"], 
        vibesJP: ["頑固な言い争い", "プライドを守る", "間違いを認めるのを拒む"],
        storyline: "During the bitter argument about the foul play, neither Sora nor Leo would back down, standing nose-to-nose until the head coach finally arrived to separate them.", 
        storylineJP: "反則プレイを巡る激しい口論の中、コーチが引き離しに来るまで、ソラもレオも鼻がくっつくほどの距離で睨み合い、一歩も引こうとしなかった（撤回しなかった）。", 
        quiz: { question: "After a massive public backlash, the corporation finally ___ and changed the policy.", options: ["backed down", "asked in", "added on"], correctIndex: 0, explanation: "to withdraw a claim or yield." } 
      },
      { 
        pv: "Back into", trope: "The Tight Parking Spot", cefr: "B1", icon: Map, 
        meaning: "To park or move a vehicle in reverse gear into a specific space.", 
        meaningJP: "（車を）バックで入れる", 
        example: "It’s a really tight and busy space, so you should definitely back into the parking spot.", 
        exampleJP: "本当に狭くて混雑したスペースだから、絶対にバックで駐車スペースに入れるべきだよ。",
        vibes: ["Driving lessons", "Maneuvering in tight spaces", "Parking advice"], 
        vibesJP: ["運転のレッスン", "狭いスペースでの操作", "駐車のアドバイス"],
        storyline: "Sato was nervously learning to drive in the city. 'Always back into the garage,' his dad guided him calmly. 'It makes leaving in an emergency so much easier later.'", 
        storylineJP: "佐藤は混雑した街での運転練習に緊張していた。「常にバックで車庫に入れなさい」と父が冷静に指導した。「後で緊急時に出るのがずっと楽になるんだぞ。」", 
        quiz: { question: "I wasn't looking at the rearview mirror and accidentally ___ a brick wall.", options: ["backed into", "asked for", "acted upon"], correctIndex: 0, explanation: "to enter a space in reverse." } 
      },
      { 
        pv: "Back off", trope: "The Boundary Enforcer", cefr: "B2", icon: Lock, 
        meaning: "To retreat, give someone space, or stop bothering them aggressively.", 
        meaningJP: "（干渉を）やめる、身を引く、下がる", 
        example: "I was feeling overwhelmed, so I firmly told him to back off and give me some space to think.", 
        exampleJP: "圧倒されていたので、私は彼にきっぱりと干渉をやめて、考える時間をくれるように言った。",
        vibes: ["Setting strict personal boundaries", "Dealing with pushy people", "Tense verbal confrontations"], 
        vibesJP: ["厳格な個人的境界線を設定する", "押し付けがましい人に対処する", "緊迫した口頭での対立"],
        storyline: "As soon as the idol stepped out of the van, aggressive reporters swarmed her. 'Back off right now!' her massive bodyguard shouted, physically pushing the crowd away.", 
        storylineJP: "アイドルがバンから降りた途端、攻撃的な記者たちが彼女に群がった。「今すぐ下がれ！」と彼女の巨大なボディガードが叫び、物理的に群衆を押し返して彼女のスペースを確保した。", 
        quiz: { question: "Seeing the tension escalate, the police told the angry protesters to ___.", options: ["back off", "ask after", "add up to"], correctIndex: 0, explanation: "to move away or stop bothering." } 
      },
      { 
        pv: "Back out", trope: "The Last-Minute Cancel", cefr: "B2", icon: Undo2, 
        meaning: "To fail to keep a promise, agreement, or commitment.", 
        meaningJP: "（約束や契約を）取り消す、手を引く", 
        example: "We had a solid business deal, but he backed out at the absolute last minute.", 
        exampleJP: "確固たる取引だったのに、彼は最後の最後になって手を引いた。",
        vibes: ["Canceled plans and frustration", "Broken business promises", "Flaky behavior"], 
        vibesJP: ["キャンセルされた計画と苛立ち", "破られたビジネスの約束", "当てにならない行動"],
        storyline: "The school band was totally ready for the biggest show of the year. But the lead singer, terrified of the massive crowd, backed out the night before, leaving everyone in a panic.", 
        storylineJP: "スクールバンドは今年最大のライブに向けて完全に準備が整っていた。しかし、大群衆に怯えたボーカルが前夜になって手を引いてしまい、残されたメンバーはパニックに陥った。", 
        quiz: { question: "You've already signed the papers; you can't just ___ of the contract now.", options: ["back out", "ask in", "act up"], correctIndex: 0, explanation: "to withdraw from a commitment." } 
      },
      { 
        pv: "Back out of", trope: "The Dangerous Driveway", cefr: "B1", icon: AlertTriangle, 
        meaning: "To exit a place (like a driveway or garage) in a vehicle using reverse gear.", 
        meaningJP: "（車を）バックで出す", 
        example: "Be extremely careful when you back out of the driveway; little kids are playing nearby.", 
        exampleJP: "私道からバックで車を出す時は細心の注意を払って。近くで小さな子供たちが遊んでいるから。",
        vibes: ["Driving safety warnings", "Reversing out of home driveways", "Cautious vehicle movement"], 
        vibesJP: ["運転の安全警告", "自宅の私道からバックで出る", "慎重な車両の動き"],
        storyline: "The alleyway was incredibly narrow and lined with fragile flower pots. Hina checked all her mirrors obsessively, slowly and carefully backing out of the tight space.", 
        storylineJP: "その路地は信じられないほど狭く、壊れやすい植木鉢が並んでいた。ヒナはすべての鏡を執拗に確認し、何のダメージも与えずにその狭いスペースからゆっくりと慎重に車をバックで出した。", 
        quiz: { question: "She shifted into reverse and slowly ___ the dark parking garage.", options: ["backed out of", "asked after", "added up"], correctIndex: 0, explanation: "to exit a space in reverse." } 
      },
      { 
        pv: "Back up", trope: "The Cloud Save Crisis", cefr: "B1", icon: Cloud, 
        meaning: "To make a secure digital copy of information or files.", 
        meaningJP: "（データの）控えを取る、バックアップする", 
        example: "You'll lose your entire 20-page essay if you don't back up your files to the cloud right now!", 
        exampleJP: "今すぐクラウドにファイルをバックアップ（控えを取る）しないと、20ページのエッセイを丸ごと失うことになるよ！",
        vibes: ["Tech advice and warnings", "Data safety protocols", "Preventing computer disasters"], 
        vibesJP: ["テクノロジーのアドバイスと警告", "データの安全プロトコル", "コンピュータの大惨事を防ぐ"],
        storyline: "Right in the middle of writing his final thesis, Sora's old laptop suddenly died completely. 'Oh thank god... Good thing I backed up everything to the external drive yesterday,' he sighed.", 
        storylineJP: "卒業論文を執筆している真っ最中に、ソラの古いノートPCが突然完全に沈黙した。「ああ、神様ありがとう...昨日すべてを外付けドライブにバックアップしておいて（控えを取っておいて）本当に良かった」と彼は安堵のため息をついた。", 
        quiz: { question: "Before installing the new operating system, make sure you ___ your important work.", options: ["back up", "ask about", "act on"], correctIndex: 0, explanation: "to copy data for safety." } 
      },
      { 
        pv: "Back up", trope: "The Boardroom Support", cefr: "B2", icon: Shield, 
        meaning: "To support someone or defend their statement with evidence.", 
        meaningJP: "（人を）支援する、（話を）裏付ける", 
        example: "I really appreciate you backing me up when the CEO questioned my controversial data.", 
        exampleJP: "CEOが私の物議を醸すデータを疑った時、あなたが私を支持（裏付け）してくれたことに本当に感謝しています。",
        vibes: ["Co-worker loyalty and support", "Providing proof in an argument", "Defending a friend in public"], 
        vibesJP: ["同僚の忠誠心とサポート", "議論で証拠を提供する", "公の場で友人を擁護する"],
        storyline: "Leo made a bold proposal during the board meeting. When the strict managers started to doubt him, Mika stood up and backed him up with solid, undeniable research data.", 
        storylineJP: "役員会議で、レオは大胆な提案をした。厳しいマネージャーたちが彼を疑い始めたとき、ミカが立ち上がり、確実で否定できない調査データで彼を裏付け（援護し）、見事に形勢を逆転させた。", 
        quiz: { question: "If the police ask questions, will you ___ my story about where I was?", options: ["back up", "ask around", "act out"], correctIndex: 0, explanation: "to support someone's statement." } 
      },
      { 
        pv: "Bag out", trope: "The Unfair Online Critic", cefr: "C1", icon: Angry, 
        meaning: "To criticize someone or something harshly and unfairly.", 
        meaningJP: "（不当に）酷評する、けなす", 
        example: "It's seriously not fair to bag out his hard work just because you have a personal grudge against him.", 
        exampleJP: "個人的な恨みがあるからといって、彼の努力を不当に酷評するのは本当にフェアじゃないよ。",
        vibes: ["Defending creative work", "Dealing with negative online reviews", "Calling out social bullying"], 
        vibesJP: ["クリエイティブな作品を擁護する", "ネットの否定的なレビューに対処する", "社会的なイジメを非難する"],
        storyline: "Before the highly anticipated new movie even released a full trailer, anonymous trolls on the internet started to mercilessly bag it out. Hina boldly stood up on social media to defend it.", 
        storylineJP: "期待の新作映画のフルトレーラーが公開される前から、ネット上の匿名の荒らし（トロール）たちは容赦なくそれを酷評し始めた。ヒナはそれを守るためにSNSで勇敢に立ち上がった。", 
        quiz: { question: "You should really stop ___ the new restaurant; the food was actually quite good.", options: ["bagging out", "asking for", "adding on"], correctIndex: 0, explanation: "to criticize harshly." } 
      },
      { 
        pv: "Bail out", trope: "The Startup Rescue", cefr: "B2", icon: DollarSign, 
        meaning: "To rescue someone or an organization from a difficult situation, usually with money.", 
        meaningJP: "（窮地から）救い出す、財政援助する", 
        example: "My parents had to bail me out when I stupidly ran out of money halfway through my Europe trip.", 
        exampleJP: "ヨーロッパ旅行の途中で愚かにもお金が尽きた時、両親は私を財政的に救済しなければならなかった。",
        vibes: ["Receiving vital financial help", "Rescuing friends from emergencies", "Government or business bailouts"], 
        vibesJP: ["不可欠な財政援助を受ける", "友人を緊急事態から救う", "政府や企業の救済措置"],
        storyline: "The innovative tech startup was rapidly bleeding cash. Just days before they had to declare bankruptcy, a mysterious new angel investor swooped in and bailed them out with a million-dollar check.", 
        storylineJP: "そのテック系スタートアップは急速に資金を失っていた。自己破産を宣言するわずか数日前、謎の新たなエンジェル投資家が舞い降り、100万ドルの小切手で彼らを救済した（救い出した）。", 
        quiz: { question: "During the massive economic crisis, the government successfully ___ the failing central bank.", options: ["bailed out", "asked over", "backed into"], correctIndex: 0, explanation: "to rescue from difficulty." } 
      },
      { 
        pv: "Bail out of", trope: "The Weekend Legal Crisis", cefr: "B2", icon: Gavel, 
        meaning: "To pay a legal sum of money to release someone from jail until their trial.", 
        meaningJP: "保釈金を払って（牢屋から）出す", 
        example: "After the wild misunderstanding at the club, he had to bail his foolish brother out of jail.", 
        exampleJP: "クラブでのひどい誤解の後、彼は愚かな弟を保釈金を払って牢屋から出さなければならなかった。",
        vibes: ["Dealing with legal crises", "Family members causing deep trouble", "Late nights at police stations"], 
        vibesJP: ["法的危機への対処", "深いトラブルを起こす家族", "警察署での深夜"],
        storyline: "The peaceful protest suddenly turned into a chaotic riot. By Monday morning, exhausted lawyers were working around the clock to bail dozens of innocent students out of the city jail.", 
        storylineJP: "平和的な抗議活動は、突然カオスな暴動へと発展した。月曜の朝までに、疲れ果てた弁護士たちは、何十人もの無実の学生たちを拘置所から保釈させるために24時間体制で働いていた。", 
        quiz: { question: "He desperately needed $5,000 in cash to be safely ___ the local jail.", options: ["bailed out of", "asked into", "added up to"], correctIndex: 0, explanation: "to pay for someone's release." } 
      },
      { 
        pv: "Bail out on", trope: "The Critical Team Betrayal", cefr: "B2", icon: LogOut, 
        meaning: "To stop supporting someone or to leave them in a difficult situation suddenly.", 
        meaningJP: "（土壇場で）見捨てる、逃げ出す", 
        example: "I literally can't believe she bailed out on us right before the most important presentation of the year!", 
        exampleJP: "今年最も重要なプレゼンの直前に、彼女が私たちを見捨てて逃げ出したなんて文字通り信じられない！",
        vibes: ["Extreme team frustration", "Quitting under pressure", "Flaky friends betraying trust"], 
        vibesJP: ["チームの極度のフラストレーション", "プレッシャーで辞める", "当てにならない友人の裏切り"],
        storyline: "The crucial design project was only halfway done. To everyone's absolute shock, the arrogant team leader bailed out on them to take a sudden luxury vacation, leaving them to fail.", 
        storylineJP: "極めて重要なデザインプロジェクトはまだ半分しか終わっていなかった。全員が絶対にショックを受けたことに、傲慢なチームリーダーは突然の豪華な休暇を取るために彼らを見捨てて逃げ出し、彼らを失敗の危機に陥れた。", 
        quiz: { question: "Please don't ___ me now; I desperately need your help to finish this on time!", options: ["bail out on", "ask for", "back into"], correctIndex: 0, explanation: "to abandon someone in need." } 
      },
      { 
        pv: "Bail up", trope: "The Overly Chatty Neighbor", cefr: "C1", icon: MessageCircle, 
        meaning: "To talk to someone and delay them, often when they are clearly in a hurry.", 
        meaningJP: "（人を）引き止めて長々と話す、足止めする", 
        example: "I'm so sorry I'm late; the talkative neighbor bailed me up for an hour chatting about her new garden.", 
        exampleJP: "遅れて本当にごめん。おしゃべりなご近所さんに新しい庭の話で1時間も引き止められちゃって。",
        vibes: ["Causing someone to be late", "Enduring unwanted, endless talk", "Social delays you can't escape"], 
        vibesJP: ["誰かを遅刻させる", "望まない終わりのない話に耐える", "逃れられない社交的な遅れ"],
        storyline: "Sora was sprinting down the hallway, desperate not to be late for his final exam. Suddenly, the lonely history teacher stepped out and bailed him up with a twenty-minute story about a lost book.", 
        storylineJP: "ソラは期末試験に遅れまいと必死に廊下を全速力で走っていた。突然、寂しがり屋の歴史の先生が現れ、紛失した本についての20分に及ぶ長話で彼を引き止め（足止めし）た。", 
        quiz: { question: "I tried to leave quietly, but he ___ me in the corridor to complain about the constant noise.", options: ["bailed up", "backed down", "added up"], correctIndex: 0, explanation: "to delay someone with talk." } 
      },
      { 
        pv: "Ball up", trope: "The Schedule Mess", cefr: "C1", icon: HelpCircle, 
        meaning: "To confuse someone completely or to mess a situation up badly.", 
        meaningJP: "（人を）混乱させる、状況をめちゃくちゃにする", 
        example: "The constant, unexplained changes to the new schedule have completely balled me up; I don't know where to go.", 
        exampleJP: "新しいスケジュールの絶え間ない説明のない変更が私を完全に混乱させている。どこに行けばいいか分からない。",
        vibes: ["Total mental confusion", "Dealing with overly complex systems", "Making frustrating mistakes"], 
        vibesJP: ["完全な精神的混乱", "複雑すぎるシステムへの対処", "イライラするミスをする"],
        storyline: "The tournament organizers kept shifting the match times without warning. The endless rule changes completely balled up the young players, leading to total chaos and missed games.", 
        storylineJP: "大会の主催者は予告なしに試合時間を何度も変更した。終わりのないルールの変更が若い選手たちを完全に混乱させ、大混乱を招き、いくつかのチームが重要な試合をすっぽかす事態となった。", 
        quiz: { question: "All these shifting numbers and weird formulas are starting to really ___ me ___.", options: ["ball / up", "ask / after", "act / on"], correctIndex: 0, explanation: "to confuse or mess up." } 
      },
      { 
        pv: "Balls up", trope: "The Exam Regret", cefr: "C2", icon: Trash2, 
        meaning: "To spoil or ruin an opportunity or plan through a massive, stupid mistake.", 
        meaningJP: "（せっかくの機会を）台無しにする、大失敗する", 
        example: "I really ballsed up my chances of getting that dream job by arriving thirty minutes late.", 
        exampleJP: "30分も遅刻したせいで、あの夢の仕事に就くチャンスを本当に大失敗で台無しにしてしまった。",
        vibes: ["Deep personal failure", "Ruined long-term plans", "Intense regret over an error"], 
        vibesJP: ["深い個人的な失敗", "台無しになった長期計画", "ミスに対する激しい後悔"],
        storyline: "Sora had studied endlessly for the vital entrance exam. But on the big day, he accidentally turned off his alarm. By sleeping in, he absolutely ballsed up his presentation and had to wait a full year to try again.", 
        storylineJP: "ソラは極めて重要な入学試験に向けて果てしなく勉強していた。しかし大一番の日、彼は誤ってアラームを消してしまった。寝坊したことでプレゼンを完全に台無しにしてしまい、再挑戦のために丸1年待つ羽目になった。", 
        quiz: { question: "I'm so sorry, I totally ___ the surprise party plan by texting him the location.", options: ["ballsed up", "asked around", "backed away"], correctIndex: 0, explanation: "to ruin or spoil completely." } 
      },
      { 
        pv: "Bang about", trope: "The Noisy Upstairs Neighbors", cefr: "B1", icon: Volume2, 
        meaning: "To move around a place making a lot of loud, disruptive noise.", 
        meaningJP: "（物を動かしたりして）どたばた騒ぐ、音を立てる", 
        example: "For heaven's sake, stop banging about upstairs! I'm trying to study for a test!", 
        exampleJP: "お願いだから、上の階でどたばた騒ぐのをやめて！テスト勉強をしようとしてるのよ！",
        vibes: ["Yelling at noisy siblings", "Dealing with severe sleep disruption", "Heavy, careless footsteps"], 
        vibesJP: ["うるさい兄弟に怒鳴る", "深刻な睡眠妨害への対処", "重く不注意な足音"],
        storyline: "It was 3 AM, and Kaito had a massive headache. Yet, the inconsiderate new neighbors in the apartment above him were banging about, seemingly moving heavy wooden furniture across the floor.", 
        storylineJP: "深夜3時、海斗はひどい頭痛を抱えていた。それなのに、上の階の無神経な新しい住人たちは、まるで重い木製の家具を床で引きずっているかのように、どたばたと騒ぎ（音を立てて）続けていた。", 
        quiz: { question: "The hyperactive kids were ___ in the kitchen, knocking over pots and pans.", options: ["banging about", "asking in", "adding on"], correctIndex: 0, explanation: "to make noise while moving." } 
      },
      { 
        pv: "Bang on", trope: "The Obsessive Monologue", cefr: "B2", icon: MessageCircle, 
        meaning: "To talk at great, annoying length about a single, specific topic.", 
        meaningJP: "（～について）うんざりするほどだらだらとしゃべり続ける", 
        example: "He spent the entire romantic dinner just banging on about the specs of his stupid new car.", 
        exampleJP: "彼はロマンチックなディナーの間中ずっと、彼のバカげた新車のスペックについてだらだらとしゃべり続けていた。",
        vibes: ["Boring a captive audience", "Being overly talkative about a niche topic", "An annoying monologue"], 
        vibesJP: ["逃げ場のない聴衆を退屈させる", "ニッチな話題でしゃべりすぎる", "鬱陶しい独り言"],
        storyline: "The train ride was four hours long. Unfortunately for Kaito, Mika spent the entire trip endlessly banging on about the intricate lore of her favorite new anime, until Kaito was completely exhausted.", 
        storylineJP: "電車の旅は4時間にも及んだ。海斗にとって不運なことに、ミカは道中ずっとお気に入りの新作アニメの複雑な設定について果てしなくだらだらとしゃべり続け、海斗は完全に疲れ果ててしまった。", 
        quiz: { question: "I wish she'd stop; she's always ___ about how smart her cat is.", options: ["banging on", "backing out", "asking after"], correctIndex: 0, explanation: "to talk at length annoyingly." } 
      },
      { 
        pv: "Bang up", trope: "The Parking Lot Crash", cefr: "B1", icon: AlertTriangle, 
        meaning: "To damage something badly, especially a vehicle, through a collision or rough use.", 
        meaningJP: "（車などを）ひどくぶつける、傷つける", 
        example: "She wasn't paying attention and banged her new car up pretty badly in the supermarket parking lot.", 
        exampleJP: "彼女は不注意で、スーパーの駐車場で新車をかなりひどくぶつけて傷つけてしまった。",
        vibes: ["Dealing with minor car accidents", "Physical damage to property", "Careless crashes"], 
        vibesJP: ["軽い交通事故の処理", "器物損壊", "不注意な衝突"],
        storyline: "The mountain trail was incredibly slick from the rain. During a sharp turn, Sora lost control and slid. The expensive racing bike was seriously banged up, but Sora luckily walked away unhurt.", 
        storylineJP: "山道は雨で信じられないほど滑りやすくなっていた。急カーブでソラはコントロールを失いスリップした。高価なレーシングバイクはひどくボロボロになった（傷んだ）が、ソラは幸いにも無傷で歩いて帰れた。", 
        quiz: { question: "He fell off his skateboard and completely ___ his knee on the rough concrete.", options: ["banged up", "asked for", "added up to"], correctIndex: 0, explanation: "to damage or injure badly." } 
      },
      { 
        pv: "Bank on", trope: "The High-Stakes Reliance", cefr: "B2", icon: Shield, 
        meaning: "To count on or rely heavily on someone or something happening as planned.", 
        meaningJP: "～を（強く）当てにする、頼りにする", 
        example: "The project is huge; I'm really banking on your expert help to finish this report on time.", 
        exampleJP: "このプロジェクトは巨大だ。時間通りにこのレポートを仕上げるために、君の専門的な助けを本当に当てにしているよ。",
        vibes: ["Heavy reliance on a coworker", "Stressing over strict deadlines", "Placing deep trust in someone"], 
        vibesJP: ["同僚への強い依存", "厳しい締め切りへのストレス", "誰かに深い信頼を寄せる"],
        storyline: "The outdoor spring wedding had taken a full year to plan perfectly. The anxious bride looked at the cloudy sky. 'We're really banking on the weather clearing up by noon,' she whispered.", 
        storylineJP: "屋外での春の結婚式は、完璧に計画するのに丸1年かかった。不安げな花嫁は曇り空を見上げた。「正午までに天気が回復することを、本当に切に願っている（当てにしている）わ」と彼女は囁いた。", 
        quiz: { question: "Given his terrible track record, I certainly wouldn't ___ him arriving here on time.", options: ["bank on", "ask around", "back into"], correctIndex: 0, explanation: "to rely heavily upon." } 
      },
      { 
        pv: "Bargain for", trope: "The Unexpectedly Huge Crowd", cefr: "C1", icon: AlertTriangle, 
        meaning: "To expect or be prepared for a specific (usually intense) situation to happen.", 
        meaningJP: "（事態などを）予期する、覚悟する", 
        example: "We planned a small event; we certainly didn't bargain for such a massive, chaotic crowd.", 
        exampleJP: "私たちは小さなイベントを計画した。こんなにも巨大でカオスな群衆が集まるなんて、絶対に予期していなかった。",
        vibes: ["Facing intense, surprise situations", "Underestimating a major challenge", "Realizing things are out of control"], 
        vibesJP: ["激しい予期せぬ状況に直面する", "大きな課題を過小評価する", "物事が制御不能だと気づく"],
        storyline: "Haru thought the math final would be a breeze since he studied for a whole hour. But as he looked at the complex formulas on the first page, he sweated. The test was far harder than he had bargained for.", 
        storylineJP: "ハルは丸1時間も勉強したのだから、数学の期末試験は楽勝だと思っていた。しかし1ページ目の複雑な数式を見た瞬間、彼は冷や汗をかいた。そのテストは、彼が予期していた（覚悟していた）よりも遥かに難しかったのだ。", 
        quiz: { question: "Repairing this old, rotting house is proving to be far more expensive than we ___.", options: ["bargained for", "asked after", "added up"], correctIndex: 0, explanation: "to expect or prepare for." } 
      },
      { 
        pv: "Barge in", trope: "The Sibling's Total Lack of Privacy", cefr: "B2", icon: Lock, 
        meaning: "To enter a room or conversation rudely or abruptly without knocking or asking.", 
        meaningJP: "ずかずかと割り込む、無作法に入り込む", 
        example: "Please learn to knock! Don't just arbitrarily barge into my room while I'm trying to dress.", 
        exampleJP: "ノックすることくらい覚えてよ！着替えている最中に、勝手に私の部屋にずかずかと割り込んでこないで。",
        vibes: ["Dealing with annoying sibling privacy issues", "Rude interruptions in a meeting", "A general lack of personal boundaries"], 
        vibesJP: ["イライラする兄弟のプライバシー問題", "会議中の失礼な割り込み", "全体的なパーソナルスペースの欠如"],
        storyline: "Leo was in the middle of a highly sensitive, secret video call with his project team. Suddenly, the door flew open and his oblivious little sister barged in, loudly demanding help with her math homework.", 
        storylineJP: "レオはプロジェクトチームとの非常に機密性の高い秘密のビデオ通話の真っ最中だった。突然ドアが勢いよく開き、無神経な妹がずかずかと割り込んできて、大声で算数の宿題を手伝うよう要求した。", 
        quiz: { question: "It's incredibly rude how he always ___ on our private conversations without even a polite knock.", options: ["barges in", "backs off", "asks out"], correctIndex: 0, explanation: "to enter or interrupt rudely." } 
      }
    ],
    3: [
      { 
        pv: "Bash about", trope: "The Rough Treatment", cefr: "C1", icon: Hammer, 
        meaning: "To treat something roughly, risking damage.", 
        meaningJP: "手荒に扱う", 
        example: "Don't bash your expensive new laptop about like that!", 
        exampleJP: "そんな風に高価な新しいノートPCを手荒に扱わないで！",
        vibes: ["Caring for gadgets", "Giving stern advice", "Rough physical handling"], 
        vibesJP: ["ガジェットを大切にする", "厳しい忠告をする", "乱暴な物理的扱い"],
        storyline: "Sato was furious after losing the match. He carelessly bashed his sports bag about the locker room, completely forgetting his fragile new laptop was inside.", 
        storylineJP: "試合に負けた後、佐藤は激怒していた。彼はロッカールームでスポーツバッグを不注意に手荒に扱い、中に壊れやすい新品のノートPCが入っていることを完全に忘れていた。", 
        quiz: { question: "Please be gentle and don't ___ your fragile toys ___.", options: ["bash / about", "be / after", "be / on"], correctIndex: 0, explanation: "to treat roughly." } 
      },
      { 
        pv: "Bash in", trope: "The Emergency Rescue", cefr: "B2", icon: AlertTriangle, 
        meaning: "To break something by hitting it with great force.", 
        meaningJP: "（叩いて）ぶち壊す、打ち破る", 
        example: "The desperate burglars bashed the heavy oak door in.", 
        exampleJP: "必死の空き巣たちは重いオーク材のドアを叩き壊した。",
        vibes: ["Using extreme force", "Emergency rescues", "Significant property damage"], 
        vibesJP: ["極端な力を使う", "緊急救助", "重大な器物損壊"],
        storyline: "Thick, black smoke filled the hallway, and the panicked cat was trapped. With no time for keys, the heroic firefighters used an axe to brutally bash the door in and save the animal.", 
        storylineJP: "濃く黒い煙が廊下に充満し、パニックになった猫が閉じ込められていた。鍵を探す時間はないと判断し、英雄的な消防士たちは斧を使って力任せにドアをぶち破り、動物を救出した。", 
        quiz: { question: "To escape the burning building, they completely ___ the barred window.", options: ["bashed in", "be along", "be down"], correctIndex: 0, explanation: "to break by hitting hard." } 
      },
      { 
        pv: "Bash out", trope: "The Deadline Rush", cefr: "C1", icon: Zap, 
        meaning: "To write or produce something very quickly, often without much care.", 
        meaningJP: "（大急ぎで）一気に書き上げる", 
        example: "I managed to bash the 2,000-word essay out in a panic.", 
        exampleJP: "パニックになりながら、なんとか2000語のエッセイを一気に書き上げた。",
        vibes: ["Racing against a tight deadline", "Last-minute exam panic", "Frantic typing"], 
        vibesJP: ["厳しい締め切りとの戦い", "直前の試験パニック", "狂ったようなタイピング"],
        storyline: "Rin had completely forgotten about the history assignment. Gulping down an energy drink, she miraculously managed to bash out the entire five-page report just minutes before the bell rang.", 
        storylineJP: "リンは歴史の重要な課題のことを完全に忘れていた。エナジードリンクを一気飲みし、彼女は奇跡的にも、チャイムが鳴る数分前に全5ページのレポートを一気に書き上げることに成功した。", 
        quiz: { question: "Working against the clock, she efficiently ___ the apology letter.", options: ["bashed out", "be along", "be in"], correctIndex: 0, explanation: "to write quickly." } 
      },
      { 
        pv: "Bash up", trope: "The Pub Fight", cefr: "B2", icon: Angry, 
        meaning: "To physically damage someone or something very badly.", 
        meaningJP: "（殴って）ボコボコにする、ひどく壊す", 
        example: "He got terribly bashed up in a pointless street fight.", 
        exampleJP: "彼は無意味なストリートファイトでひどくボコボコにされた。",
        vibes: ["Describing physical injury", "A violent accident", "A rough brawl"], 
        vibesJP: ["肉体的な怪我の描写", "暴力的な事故", "荒っぽい乱闘"],
        storyline: "The atmosphere after the championship game was incredibly tense. When the rival fans clashed, the losing team's luxury bus got completely bashed up, its windows shattered.", 
        storylineJP: "優勝決定戦の後の雰囲気は信じられないほど緊迫していた。ライバルファン同士が衝突した際、敗れたチームの豪華なバスは完全にボコボコにされ、窓は砕け散った。", 
        quiz: { question: "After rolling down the rocky hill, the remote-control car was totally ___.", options: ["bashed up", "be off", "be cut up"], correctIndex: 0, explanation: "to damage badly." } 
      },
      { 
        pv: "Bawl out", trope: "The Furious Coach", cefr: "C1", icon: Volume2, 
        meaning: "To shout at someone very crossly and loudly as a scolding.", 
        meaningJP: "（激しく）怒鳴りつける、大声で叱る", 
        example: "The strict coach fiercely bawled me out in front of the team.", 
        exampleJP: "厳しいコーチはチームの前で私を激しく怒鳴りつけた。",
        vibes: ["Severe scolding", "Intimidating authority figures", "Making a terrible mistake"], 
        vibesJP: ["ひどいお説教", "威圧的な権威者", "ひどいミスをする"],
        storyline: "It was the final quarter, and Sora totally missed the easiest pass. Furious, the strict head coach called a timeout and brutally bawled him out in front of the staring crowd.", 
        storylineJP: "最終クォーター、ソラは最も簡単なパスを完全に見逃した。激怒した厳格なヘッドコーチはタイムアウトを取り、静かに見つめる観衆の目の前で彼を容赦なく激しく怒鳴りつけた。", 
        quiz: { question: "For losing the crucial files, the unforgiving boss loudly ___ him ___.", options: ["bawled / out", "bash / in", "be / after"], correctIndex: 0, explanation: "to shout at crossly." } 
      },
      { 
        pv: "Be after", trope: "The Suspicious Motive", cefr: "B1", icon: Search, 
        meaning: "To search for something or try to obtain it, sometimes with a hidden motive.", 
        meaningJP: "探し求める、狙う", 
        example: "Exactly what are you after in my private office?", 
        exampleJP: "私のプライベートなオフィスで、一体何を狙っているんだ？",
        vibes: ["Hidden ambition", "Deep suspicion", "Chasing a specific goal"], 
        vibesJP: ["隠された野望", "深い疑念", "特定の目標を追いかける"],
        storyline: "The famous art gallery was dark, but a shadow slipped past the lasers. The guards knew exactly what the master thief was after: the legendary, cursed diamond.", 
        storylineJP: "有名な美術館は暗闇に包まれていたが、一つの影がレーザーをすり抜けた。警備員たちは、その大泥棒が何を狙っているのかを正確に把握していた。伝説の呪われたダイヤモンドだ。", 
        quiz: { question: "Given his sudden extreme politeness, I strongly suspect he is ___ my executive job.", options: ["after", "along", "away"], correctIndex: 0, explanation: "to try to get." } 
      },
      { 
        pv: "Be along", trope: "The Reassuring Wait", cefr: "B1", icon: Clock, 
        meaning: "To arrive at a place, usually soon.", 
        meaningJP: "やって来る、到着する", 
        example: "Don't fret; the next express bus should be along very soon.", 
        exampleJP: "心配しないで。次の急行バスがもうすぐやって来るはずだよ。",
        vibes: ["Anticipating an arrival", "Waiting patiently", "Offering reassuring certainty"], 
        vibesJP: ["到着を予測する", "忍耐強く待つ", "安心できる確実さを提供する"],
        storyline: "The young recruits were shivering in the dark forest, terrified. 'Don't worry, stay calm,' veteran Sora assured them. 'Our heavily armed backup team will be along before sunset.'", 
        storylineJP: "若い新兵たちは暗い森の中で震え、怯えていた。「心配するな、落ち着け」とベテランのソラが請け負った。「重武装の援護部隊が日没前にはやって来るはずだ。」", 
        quiz: { question: "Please take a seat in the waiting room; the head doctor will ___ shortly.", options: ["be along", "be off", "be onto"], correctIndex: 0, explanation: "to arrive soon." } 
      },
      { 
        pv: "Be away", trope: "The Long Business Trip", cefr: "A2", icon: Map, 
        meaning: "To be in another place, typically traveling or not at home.", 
        meaningJP: "不在にする、出かけている", 
        example: "I'll unfortunately be away on business for the next month.", 
        exampleJP: "残念ながら来月は出張で不在になります。",
        vibes: ["Exciting travel plans", "A temporary absence", "Updating friends on holidays"], 
        vibesJP: ["ワクワクする旅行計画", "一時的な不在", "休日の近況報告"],
        storyline: "Summer vacation was finally here, but the friend group would be incomplete. Hina cheerfully announced she would be away studying advanced English in London for two weeks.", 
        storylineJP: "ついに夏休みが来たが、いつものグループは全員揃わなかった。ヒナは、ロンドンで上級英語を学ぶため、丸2週間不在にする（出かける）と明るく発表したのだ。", 
        quiz: { question: "You can't reach the regional manager this week because he is ___ on a tropical holiday.", options: ["away", "in", "on"], correctIndex: 0, explanation: "to be elsewhere." } 
      },
      { 
        pv: "Be cut out for", trope: "The Perfect Fit", cefr: "B2", icon: CheckCircle2, 
        meaning: "To be naturally suitable for a specific job, role, or activity.", 
        meaningJP: "～に向いている、適任である", 
        example: "I honestly don't think I'm cut out for a boring desk job.", 
        exampleJP: "正直、私は退屈なデスクワークには向いていないと思う。",
        vibes: ["Discovering one's true career", "Finding a perfect fit", "Questioning personal aptitude"], 
        vibesJP: ["自分の本当の天職を見つける", "完璧な適任を見つける", "個人の適性に疑問を持つ"],
        storyline: "After a week of trying to organize tedious spreadsheets, Mika threw her pen down. She realized with absolute certainty she wasn't cut out for a quiet life; her soul craved creative adventures.", 
        storylineJP: "退屈なスプレッドシートを1週間整理しようと試みた後、ミカはペンを放り投げた。彼女は自分が静かな生活には向いていないと悟った。彼女の魂は、創造的な冒険を激しく求めていたのだ。", 
        quiz: { question: "Given his extreme shyness, is he really ___ public relations work?", options: ["cut out for", "cut down", "be off"], correctIndex: 0, explanation: "to be suitable." } 
      },
      { 
        pv: "Be cut up", trope: "The Deep Grief", cefr: "C1", icon: Heart, 
        meaning: "To be very emotionally upset or deeply saddened by something.", 
        meaningJP: "ひどく悲しむ、ひどく落ち込む", 
        example: "She was visibly cut up about failing her final exam.", 
        exampleJP: "彼女は期末試験に落ちて明らかにひどく落ち込んでいた。",
        vibes: ["Profound sadness", "Deep, lingering regret", "Emotional pain"], 
        vibesJP: ["深い悲しみ", "深く長く続く後悔", "感情的な痛み"],
        storyline: "It wasn't just a pet; it was his best friend of fifteen years. When the loyal old dog finally passed away, Leo was so completely cut up that he locked himself in his room for three days.", 
        storylineJP: "それはただのペットではなく、15年来の親友だった。その忠実な老犬が息を引き取った時、レオはあまりにもひどく悲しみ、部屋に閉じこもり、3日間一言も話すことができなかった。", 
        quiz: { question: "He was absolutely ___ when he heard the tragic news on the radio.", options: ["cut up", "cut out", "cut in"], correctIndex: 0, explanation: "to be very upset." } 
      },
      { 
        pv: "Be down", trope: "The Quiet Concern", cefr: "B1", icon: Cloud, 
        meaning: "To feel depressed, sad, or lacking in energy.", 
        meaningJP: "落ち込んでいる、元気がない", 
        example: "You've been really down lately. Do you want to talk about it?", 
        exampleJP: "最近本当に落ち込んでいるね。話してみる？",
        vibes: ["Offering gentle support", "A lingering sadness", "Worrying about a friend"], 
        vibesJP: ["優しいサポートを提供する", "長引く悲しみ", "友人を心配する"],
        storyline: "The heavy rain wouldn't stop pouring. Staring out the window, Sora was noticeably down because the championship baseball game he had trained months for was permanently canceled.", 
        storylineJP: "重い雨が降り続いていた。窓から外を見つめながら、ソラは明らかに落ち込んでいた。何ヶ月も練習してきた野球の優勝決定戦が、永久に中止になってしまったからだ。", 
        quiz: { question: "Ever since her best friend moved away, I've been feeling a bit ___.", options: ["down", "on", "out"], correctIndex: 0, explanation: "to feel sad." } 
      },
      { 
        pv: "Be down on", trope: "The Unfair Critique", cefr: "C1", icon: XOctagon, 
        meaning: "To be highly critical of someone or hold a negative attitude toward them.", 
        meaningJP: "（人に対して）批判的である、厳しく当たる", 
        example: "I feel like the senior boss is really down on me this month.", 
        exampleJP: "今月は上のボスが私に本当に厳しく当たっている気がする。",
        vibes: ["Unfair workplace strictness", "Constant negative pressure", "A biased critique"], 
        vibesJP: ["不当な職場の厳しさ", "絶え間ない否定的なプレッシャー", "偏った批判"],
        storyline: "It was a tiny, honest mistake on a minor report. But ever since that one specific error, her perfectionist aunt has been relentlessly down on Mika, criticizing her every single move.", 
        storylineJP: "それは些細で正直なミスだった。しかしその特定のミス以来、完璧主義の叔母はミカに対して容赦なく厳しく当たり、彼女の一挙手一投足を批判し続けている。", 
        quiz: { question: "Why are you so aggressively ___ him just because he made one error?", options: ["down on", "down with", "up on"], correctIndex: 0, explanation: "to be critical." } 
      },
      { 
        pv: "Be down with", trope: "The Winter Sickness", cefr: "B1", icon: Activity, 
        meaning: "To be ill in bed with a specific disease or sickness.", 
        meaningJP: "（病気で）寝込む、かかっている", 
        example: "Poor Kaito is down with a nasty strain of the flu.", 
        exampleJP: "可哀想に海斗は厄介なインフルエンザで寝込んでいる。",
        vibes: ["Feeling terribly sick", "Reporting a school absence", "Winter health issues"], 
        vibesJP: ["ひどく気分が悪い", "学校の欠席を報告する", "冬の健康問題"],
        storyline: "The classroom was half empty and eerily quiet. The teacher announced that Kaito, along with six other students, was down with a severe stomach flu and wouldn't be at the sports festival.", 
        storylineJP: "教室は半分空席で不気味なほど静かだった。先生は、カイトが他の6人の生徒と共にひどい胃腸炎で寝込んでおり、体育祭には参加できないと発表した。", 
        quiz: { question: "Unfortunately, the lead actress is ___ a terrible cold and cannot perform.", options: ["down with", "up with", "on with"], correctIndex: 0, explanation: "to be ill." } 
      },
      { 
        pv: "Be fed up", trope: "The Absolute Limit", cefr: "B1", icon: Angry, 
        meaning: "To be completely annoyed, bored, or frustrated with a continuing situation.", 
        meaningJP: "うんざりしている、愛想が尽きる", 
        example: "I am absolutely fed up with this endless, freezing rain.", 
        exampleJP: "この終わりのない凍えるような雨には絶対にうんざりだ。",
        vibes: ["Reaching one's absolute limit", "Intense boredom", "Deep, vocal annoyance"], 
        vibesJP: ["絶対的な限界に達する", "激しい退屈", "深くて声に出る苛立ち"],
        storyline: "The sirens wailed constantly, and the smog was thick. Mika was completely fed up with the noisy, toxic city life and intensely dreamed of building a quiet, solitary wooden house in the woods.", 
        storylineJP: "サイレンが絶えず鳴り響き、スモッグは濃かった。ミカは騒がしく有毒な都会の生活に完全にうんざりし、森の奥深くに静かな木の家を建てることを強烈に夢見ていた。", 
        quiz: { question: "I'm totally ___ with this dead-end, soul-crushing job.", options: ["fed up", "fed in", "fed on"], correctIndex: 0, explanation: "to be annoyed." } 
      },
      { 
        pv: "Be in", trope: "The Home Check", cefr: "A1", icon: Home, 
        meaning: "To be present at one's home or office.", 
        meaningJP: "在宅している、オフィスにいる", 
        example: "Will you actually be in later tonight?", 
        exampleJP: "今日の夜遅くには本当に家にいる？",
        vibes: ["Checking someone's availability", "Planning a quick visit", "Confirming presence"], 
        vibesJP: ["誰かの予定を確認する", "ちょっとした訪問を計画する", "いるかどうか確認する"],
        storyline: "Grandpa was expecting a highly fragile antique package to be delivered right at noon. He firmly told the family to cancel all plans because he had to make absolutely sure to be in.", 
        storylineJP: "祖父は正午きっかりに、非常に壊れやすいアンティークの荷物が届くのを待っていた。彼は、絶対に在宅しているようにしなければならないと言って、家族にすべての予定をキャンセルするよう言った。", 
        quiz: { question: "Excuse me, is the head doctor ___ his office today?", options: ["in", "on", "at"], correctIndex: 0, explanation: "to be present." } 
      },
      { 
        pv: "Be in on", trope: "The Exclusive Secret", cefr: "B2", icon: Key, 
        meaning: "To be involved in a plan or to know a shared secret.", 
        meaningJP: "仲間に加わっている、秘密を知っている", 
        example: "I felt totally left out because I wasn't in on the master plan.", 
        exampleJP: "基本計画の秘密を知らされていなかったから、完全に仲間外れにされた気分だった。",
        vibes: ["Knowing exclusive secrets", "Being part of an inside group", "Sharing confidential info"], 
        vibesJP: ["独占的な秘密を知っている", "内部グループの一員になる", "機密情報を共有する"],
        storyline: "When the strict club president was suddenly overthrown, complete chaos erupted. It turned out that only a few highly trusted, core senior members were actually in on the secret plan to replace him.", 
        storylineJP: "厳格な部長が突然引きずり降ろされた時、完全なカオスが巻き起こった。実は、彼を交代させるという秘密の計画に加わっていた（知っていた）のは、ごく少数の中核的な上級生だけだったのだ。", 
        quiz: { question: "Are you sure you are completely ___ the secret surprise arrangement?", options: ["in on", "in at", "in to"], correctIndex: 0, explanation: "to know a secret." } 
      },
      { 
        pv: "Be not on", trope: "The Unacceptable Conduct", cefr: "C1", icon: XCircle, 
        meaning: "To be considered completely unacceptable or unfair behavior.", 
        meaningJP: "（行動が）受け入れられない、許されない", 
        example: "Treating the junior staff like that is simply not on.", 
        exampleJP: "後輩のスタッフをあんな風に扱うなんて、絶対に許されないことだ。",
        vibes: ["Enforcing moral boundaries", "Strict social rules", "A stern, formal warning"], 
        vibesJP: ["道徳的な境界線を守らせる", "厳格な社会的ルール", "厳しい公式な警告"],
        storyline: "The older boys were maliciously picking on shy little Hina. Sora stepped forward, his fists clenched, and told them in a cold, icy tone, 'Talking to people like that is just not on. Apologize right now.'", 
        storylineJP: "年上の少年たちが、内気で小さなヒナを悪意を持ってからかっていた。ソラは拳を握りしめて前に進み出ると、冷たい口調で彼らに言った。「人に対してあんな風に接するのは絶対に許されないことだ。今すぐ謝れ。」", 
        quiz: { question: "Being consistently late for crucial team meetings is completely ___.", options: ["not on", "not in", "not up"], correctIndex: 0, explanation: "to be unacceptable." } 
      },
      { 
        pv: "Be off", trope: "The Spoiled Milk", cefr: "B1", icon: Trash2, 
        meaning: "To have gone bad or become rotten (usually referring to food).", 
        meaningJP: "（食べ物が）腐っている、傷んでいる", 
        example: "Ugh, don't pour that! I'm certain the milk is off.", 
        exampleJP: "うわっ、それ注がないで！その牛乳は絶対に腐ってるよ。",
        vibes: ["Disgust in the kitchen", "Warning about bad food", "A sour, ruined smell"], 
        vibesJP: ["キッチンでの嫌悪感", "腐った食べ物の警告", "酸っぱくダメになった匂い"],
        storyline: "The power had been out all weekend in the sweltering heat. When Ken finally opened the fridge, the expensive imported meat was left out and, by Monday morning, it was clearly and dangerously off.", 
        storylineJP: "猛暑の中、週末ずっと停電していた。ケンがようやく冷蔵庫を開けると、高価な輸入肉は放置され、月曜の朝には明らかに危険なほど腐っていた。", 
        quiz: { question: "Don't eat that sushi; the fish smells incredibly ___.", options: ["off", "out", "on"], correctIndex: 0, explanation: "to have gone bad." } 
      },
      { 
        pv: "Be on", trope: "The Functioning Appliance", cefr: "A1", icon: Zap, 
        meaning: "To be functioning, operating, or currently happening.", 
        meaningJP: "稼働している、（行事が）行われている", 
        example: "Check if the electric heater is actually on.", 
        exampleJP: "電気ヒーターが実際に点いているか確認して。",
        vibes: ["Checking household appliances", "Confirming an event status", "Flowing energy"], 
        vibesJP: ["家電をチェックする", "イベントの状況を確認する", "流れるエネルギー"],
        storyline: "The old, abandoned mansion at the top of the hill had been empty for a decade. Yet, as the kids walked past at midnight, they shivered; the flickering, yellow lights in the top window were definitely on.", 
        storylineJP: "丘の上にある古く見捨てられた館は、10年間誰も住んでいなかった。しかし、真夜中に子供たちが通り過ぎた時、彼らは身震いした。最上階の窓の、明滅する黄色い明かりは間違いなく点いていた（稼働していた）のだ。", 
        quiz: { question: "Is the main television screen still ___ in the lobby?", options: ["on", "off", "in"], correctIndex: 0, explanation: "to be working." } 
      },
      { 
        pv: "Be on about", trope: "The Confusing Nonsense", cefr: "B2", icon: MessageCircle, 
        meaning: "To talk continuously about something, often in a confusing or boring way.", 
        meaningJP: "（何について）言っているのか、長々と話す", 
        example: "I have absolutely no idea what on earth he is on about.", 
        exampleJP: "彼が一体何について言っているのか、私には全く分からない。",
        vibes: ["Listening to pure nonsense", "Questioning a strange logic", "Enduring a confusing talk"], 
        vibesJP: ["純粋なナンセンスを聞く", "奇妙な論理を疑う", "混乱する話に耐える"],
        storyline: "Leo rushed into the room, breathless, and started frantically talking about invisible aliens hacking the school Wi-Fi. Mika stared at him blankly, seriously wondering what crazy conspiracy theory he was on about this time.", 
        storylineJP: "レオは息を切らして部屋に駆け込み、見えない宇宙人が学校のWi-Fiをハッキングしていると狂ったように話し始めた。ミカは彼をぽかんと見つめ、今回彼がどんな陰謀論について言っているのかと真顔で不思議に思った。", 
        quiz: { question: "What in the world are you ___ with all these crazy theories?", options: ["on about", "up about", "in about"], correctIndex: 0, explanation: "to talk confusingly." } 
      }
    ],
    4: [
      { 
        pv: "Bear down on", trope: "The Unstoppable Force", cefr: "C1", icon: Clock, 
        meaning: "To move quickly and often threateningly towards someone or something.", 
        meaningJP: "勢いよく迫る、重圧としてのしかかる", 
        example: "The final project deadline is rapidly bearing down on us.", 
        exampleJP: "最終プロジェクトの締め切りが急速に私たちに重圧としてのしかかっている。",
        vibes: ["Feeling intense rush and stress", "A physical threat approaching", "The pressure of a strict deadline"], 
        vibesJP: ["強烈な焦りとストレスを感じる", "物理的な脅威が近づく", "厳しい締め切りのプレッシャー"],
        storyline: "The sky turned an eerie shade of green as the wind began to howl fiercely. Through the window, Sora could see the massive, dark hurricane bearing down on their fragile little coastal town with terrifying speed.", 
        storylineJP: "風が激しく吠え始め、空は不気味な緑色に変わった。窓越しに、ソラは巨大で暗いハリケーンが、彼らの脆く小さな海辺の町に向かって恐ろしいスピードで勢いよく迫ってくるのを見た。", 
        quiz: { question: "The massive, out-of-control truck was terrifyingly ___ our small car.", options: ["bearing down on", "backing into", "breaking out"], correctIndex: 0, explanation: "to approach threateningly." } 
      },
      { 
        pv: "Bear out", trope: "The Forensic Evidence", cefr: "C1", icon: Shield, 
        meaning: "To support the truth of something or prove that it is correct.", 
        meaningJP: "（仮説や主張を）裏付ける、証明する", 
        example: "I am confident that the scientific evidence will bear out my wild theory.", 
        exampleJP: "科学的証拠が私の突拍子もない理論を裏付けてくれると確信している。",
        vibes: ["A tense criminal investigation", "Providing concrete proof", "A dramatic legal defense"], 
        vibesJP: ["緊迫した犯罪捜査", "具体的な証拠を提供する", "ドラマチックな正当防衛"],
        storyline: "The brilliant detective stood before the skeptical police chief, holding a single, crumpled receipt. 'I know it sounds completely insane,' she said firmly, 'but the DNA evidence from this paper will bear out my entire story.'", 
        storylineJP: "優秀な探偵は、疑い深い警察署長の前に立ち、くしゃくしゃになった一枚のレシートを握りしめていた。「完全に狂っているように聞こえるのは分かっています」と彼女はきっぱりと言った。「ですが、この紙からのDNA鑑定が、私の推理のすべてを裏付けてくれるはずです。」", 
        quiz: { question: "The newly discovered historical facts clearly ___ his controversial claim.", options: ["bear out", "bash in", "be off"], correctIndex: 0, explanation: "to prove true." } 
      },
      { 
        pv: "Bear with", trope: "The Polite Delay", cefr: "B2", icon: Activity, 
        meaning: "To be patient and tolerant with someone during a difficult or slow process.", 
        meaningJP: "（少々お待ちを）辛抱強く付き合う、我慢する", 
        example: "Please bear with me for just a moment while I try to restart this ancient computer.", 
        exampleJP: "この古いコンピュータを再起動させる間、どうか少々お待ち（辛抱して）ください。",
        vibes: ["Enduring a long wait", "Asking for polite patience", "Dealing with technical delays"], 
        vibesJP: ["長い待ち時間に耐える", "礼儀正しく忍耐を求める", "技術的な遅延に対処する"],
        storyline: "The grand hotel lobby was packed with angry, tired tourists. The exhausted front desk clerk forced a polite smile as the ancient computer froze. 'Please bear with me for just a moment while the system reboots,' he begged.", 
        storylineJP: "豪華なホテルのロビーは、怒って疲れ果てた観光客でごった返していた。疲れ切ったフロント係は、古いコンピュータがフリーズする中、作り笑いを浮かべた。「システムが再起動するまで、どうかもう少々お待ち（辛抱）ください」と彼は懇願した。", 
        quiz: { question: "If you'll kindly ___ me, I will thoroughly explain the complex rules.", options: ["bear with", "be up", "belt out"], correctIndex: 0, explanation: "to be patient." } 
      },
      { 
        pv: "Beat down", trope: "The Merciless Sun", cefr: "B2", icon: Sun, 
        meaning: "To shine very strongly and hotly down on a place or person.", 
        meaningJP: "（太陽が激しく）照りつける", 
        example: "The midday sun was mercilessly beating down on the weary workers.", 
        exampleJP: "真昼の太陽が無慈悲にも疲れ果てた労働者たちに激しく照りつけていた。",
        vibes: ["A sweltering summer day", "Intense, radiating heat", "Enduring the harsh outdoors"], 
        vibesJP: ["うだるような夏の日", "強烈に放射される熱", "過酷な屋外に耐える"],
        storyline: "They had been lost in the vast, unforgiving desert for two solid days. The relentless midday sun beat down on the weary travelers, cracking the dry earth beneath their blistered, exhausted feet.", 
        storylineJP: "彼らは広大で容赦のない砂漠で丸2日間迷っていた。無慈悲な真昼の太陽が疲れ果てた旅人たちに激しく照りつけ、水膨れだらけの疲れ切った足元の乾いた大地をひび割れさせていた。", 
        quiz: { question: "The intense, suffocating heat was steadily ___ on the tin roof of the shed.", options: ["beating down", "breaking down", "backing down"], correctIndex: 0, explanation: "to shine strongly." } 
      },
      { 
        pv: "Beat down", trope: "The Master Negotiator", cefr: "C1", icon: DollarSign, 
        meaning: "To skillfully persuade someone to significantly lower the price of something.", 
        meaningJP: "（人を説得して）値を切らせる、大幅に値下げさせる", 
        example: "The seller wanted a fortune, but I managed to beat him down to a fair $1,800.", 
        exampleJP: "売り手は大金を要求したが、私はどうにか彼を適正な1,800ドルまで大幅に値切らせることに成功した。",
        vibes: ["Intense haggling at a market", "Winning a tough price battle", "Skilled business negotiation"], 
        vibesJP: ["市場での激しい値切り交渉", "厳しい価格競争に勝つ", "熟練したビジネス交渉"],
        storyline: "The sleazy car dealer smirked, demanding $2,000 for a rusty, beaten-up truck. But clever Hina crossed her arms, pointed out every single engine flaw, and ruthlessly beat him down to a mere $1,200 in cash.", 
        storylineJP: "胡散臭い車のディーラーはニヤニヤ笑いながら、錆びてボロボロのトラックに2,000ドルを要求した。しかし賢いヒナは腕を組み、エンジンの欠陥を一つ一つ指摘して、容赦なく1,200ドルの現金払いまで大幅に値切らせた。", 
        quiz: { question: "Using clever tactics, I successfully ___ the repair cost ___ by over 20%.", options: ["beat / down", "bash / up", "be / after"], correctIndex: 0, explanation: "to lower price." } 
      },
      { 
        pv: "Beat up", trope: "The Bully's Victim", cefr: "B2", icon: Angry, 
        meaning: "To hurt someone badly by repeatedly hitting or kicking them.", 
        meaningJP: "（激しく）殴る、ボコボコにする", 
        example: "Tragically, he got severely beaten up by a gang of ruthless bullies.", 
        exampleJP: "悲劇的なことに、彼は冷酷な不良グループにひどくボコボコにされた。",
        vibes: ["A brutal street fight", "Reporting a violent incident", "Sustaining a serious injury"], 
        vibesJP: ["残酷なストリートファイト", "暴力事件の報告", "重傷を負う"],
        storyline: "The lone hero bravely stepped into the dark alley to defend the weak civilian. Though he got badly beaten up in the brutal first round, he wiped the blood from his lip and slowly rose again for the epic finale.", 
        storylineJP: "孤独なヒーローは弱い市民を守るため、勇敢にも暗い路地へと足を踏み入れた。彼は残酷な第一ラウンドでひどくボコボコにされたが、唇の血を拭い、壮大な決戦に向けてゆっくりと再び立ち上がった。", 
        quiz: { question: "The ruthless gang viciously ___ the innocent shopkeeper during the robbery.", options: ["beat up", "belted out", "booked in"], correctIndex: 0, explanation: "to hit repeatedly." } 
      },
      { 
        pv: "Beaver away", trope: "The Hyper-Focused Creator", cefr: "C1", icon: HardHat, 
        meaning: "To work extremely hard and continuously at a specific task.", 
        meaningJP: "（脇目も振らず）精を出して働く、黙々と取り組む", 
        example: "She's been silently beavering away at her messy desk since dawn.", 
        exampleJP: "彼女は夜明けから散らかった机で黙々と精を出して働いている。",
        vibes: ["A quiet, focused office environment", "Intense, continuous diligence", "Deep concentration on a project"], 
        vibesJP: ["静かで集中できるオフィス環境", "強烈で継続的な勤勉さ", "プロジェクトへの深い集中"],
        storyline: "While her careless friends partied loud into the night, Mika was locked in her messy, paint-splattered studio. She had been beavering away on her masterpiece comic series for 14 straight hours, fueled only by black coffee.", 
        storylineJP: "不注意な友人たちが夜遅くまで騒いでパーティをしている間、ミカは絵の具まみれの散らかったアトリエに閉じこもっていた。彼女はブラックコーヒーだけを頼りに、14時間ぶっ通しで最高傑作の漫画シリーズの制作に黙々と精を出していた。", 
        quiz: { question: "Despite the distractions, he's been diligently ___ at the complex code.", options: ["beavering away", "backing away", "blowing up"], correctIndex: 0, explanation: "to work hard." } 
      },
      { 
        pv: "Bed down", trope: "The Stranded Traveler", cefr: "C1", icon: Home, 
        meaning: "To sleep in a place that is not your own regular bed, often out of necessity.", 
        meaningJP: "（仮の場所で）寝る、寝る準備をする", 
        example: "With all hotels booked, we had to miserably bed down on the cold airport floor.", 
        exampleJP: "ホテルがすべて予約で埋まっていたため、私たちは冷たい空港の床で惨めに寝なければならなかった。",
        vibes: ["Dealing with annoying travel trouble", "An emergency camping situation", "Making do with a temporary bed"], 
        vibesJP: ["厄介な旅行トラブルへの対処", "緊急のキャンプ状況", "仮のベッドでしのぐ"],
        storyline: "A sudden, massive avalanche completely blocked the only mountain road home. With no cell service and dropping temperatures, the freezing hikers had no choice but to bed down in a cramped, damp cave for the terrifying night.", 
        storylineJP: "突然の巨大な雪崩が、家へ帰る唯一の山道を完全に塞いだ。携帯の電波もなく気温が下がる中、凍えるハイカーたちは、恐ろしい夜を過ごすために、狭くて湿った洞窟の中で寝る（仮寝する）しかなかった。", 
        quiz: { question: "Exhausted from the hike, we finally ___ for the night in a dusty old barn.", options: ["bedded down", "broke in", "bashed out"], correctIndex: 0, explanation: "to sleep in an odd place." } 
      },
      { 
        pv: "Beef up", trope: "The Security Upgrade", cefr: "C1", icon: Shield, 
        meaning: "To make something substantially stronger, bigger, or more effective.", 
        meaningJP: "（防備や計画を）強化する、補強する", 
        example: "The tech company urgently needs to beef up its flimsy cybersecurity.", 
        exampleJP: "そのテック企業は、脆弱なサイバーセキュリティを至急強化する必要がある。",
        vibes: ["A major system upgrade", "Increasing physical safety measures", "Strengthening a team's roster"], 
        vibesJP: ["大規模なシステムアップグレード", "物理的な安全対策の強化", "チームの戦力を補強する"],
        storyline: "After the devastating hack that leaked thousands of private emails, the desperate CEO called an emergency meeting. 'We must absolutely beef up our firewall security immediately, no matter the massive cost!' he roared.", 
        storylineJP: "何千通ものプライベートなメールが流出した壊滅的なハッキングの後、絶望したCEOは緊急会議を招集した。「莫大な費用がかかろうとも、我々は直ちにファイアウォールのセキュリティを絶対に強化しなければならない！」と彼は吠えた。", 
        quiz: { question: "To prepare for the championship, the coach decided to strongly ___ the defensive line.", options: ["beef up", "bag out", "be after"], correctIndex: 0, explanation: "to make stronger." } 
      },
      { 
        pv: "Belong to", trope: "The Lost and Found", cefr: "A2", icon: Users, 
        meaning: "To be owned by someone or to be a member of a specific group.", 
        meaningJP: "～に属する、～の所有物である", 
        example: "Excuse me, does this expensive-looking umbrella belong to you?", 
        exampleJP: "すみません、この高そうな傘はあなたのもの（あなたに属するもの）ですか？",
        vibes: ["Finding a lost valuable", "Identifying true ownership", "Returning personal property"], 
        vibesJP: ["失くした貴重品を見つける", "本当の所有者を特定する", "個人の所有物を返す"],
        storyline: "While sweeping the empty school gym, honest Sato found a glittering, diamond-studded ring hidden under the bleachers. He spent his entire precious Saturday bravely asking around the wealthy neighborhoods to see who it belonged to.", 
        storylineJP: "誰もいない学校の体育館を掃除している時、正直者の佐藤は観覧席の下に隠れていた、キラキラ光るダイヤをちりばめた指輪を見つけた。彼は誰の持ち物か（誰に属するか）を確認するため、大切な土曜日を丸一日費やして裕福な地域を勇敢に聞き込みして回った。", 
        quiz: { question: "The majestic, ancient castle on the hill actually ___ the mysterious old duke.", options: ["belongs to", "be in on", "be along"], correctIndex: 0, explanation: "to be owned by." } 
      },
      { 
        pv: "Belt out", trope: "The Shower Diva", cefr: "C1", icon: Music, 
        meaning: "To sing a song or play an instrument extremely loudly and with great passion.", 
        meaningJP: "（歌などを）大声で歌う、力いっぱい歌い上げる", 
        example: "She joyfully belts out classic 80s pop songs in the shower every single morning.", 
        exampleJP: "彼女は毎朝欠かさずシャワーを浴びながら、80年代のクラシックなポップソングを力いっぱい歌い上げている。",
        vibes: ["A passionate karaoke performance", "Loud, enthusiastic music", "Singing with pure joy"], 
        vibesJP: ["情熱的なカラオケのパフォーマンス", "大音量で熱狂的な音楽", "純粋な喜びとともに歌う"],
        storyline: "The school talent show was deadly quiet until Hina grabbed the microphone. Closing her eyes, she confidently belted out a soaring, emotional power ballad that sent absolute shivers down everyone's spine and brought the house down.", 
        storylineJP: "学校の特技披露大会は、ヒナがマイクを握るまで死んだように静かだった。目を閉じ、彼女は皆の背筋に絶対的なゾクゾク感を走らせ、会場を総立ちにさせるほどの、高らかで感情的なパワーバラードを自信に満ちて力強く歌い上げた。", 
        quiz: { question: "Standing on the grand stage, the confident tenor proudly ___ the national anthem.", options: ["belted out", "bottomed out", "backed out"], correctIndex: 0, explanation: "to sing loudly." } 
      },
      { 
        pv: "Belt up", trope: "The Angry Demand for Silence", cefr: "C1", icon: XCircle, 
        meaning: "To stop talking immediately and be quiet (used in a rude or aggressive way).", 
        meaningJP: "（乱暴に）黙る、静かにする", 
        example: "I angrily told him to belt up because his constant whining was driving me crazy!", 
        exampleJP: "彼の絶え間ない愚痴に気が狂いそうだったので、私は彼に黙れと怒って言った！",
        vibes: ["A rude demand to shut up", "An aggressive call for silence", "Stopping an annoying argument"], 
        vibesJP: ["黙れという無礼な要求", "静寂への攻撃的な呼びかけ", "鬱陶しい口論を止める"],
        storyline: "The long family road trip had turned into a nightmare. The two younger brothers were screaming and fighting over a toy in the backseat. Finally, Grandpa slammed the steering wheel and roared, 'Belt up, both of you, right this instant!'", 
        storylineJP: "家族の長いドライブは悪夢と化していた。後部座席で2人の弟がおもちゃを巡って金切り声を上げ、取っ組み合いの喧嘩をしていた。ついに、祖父はハンドルをバンと叩き、「二人とも、今すぐ黙れ（静かにしろ）！」と怒号を轟かせた。", 
        quiz: { question: "I'm trying to concentrate on this complex puzzle, so just ___ and listen to the instructions!", options: ["belt up", "be up", "back off"], correctIndex: 0, explanation: "to be quiet." } 
      },
      { 
        pv: "Belt up", trope: "The Safety Check", cefr: "B1", icon: AlertTriangle, 
        meaning: "To fasten your seatbelt in a car or airplane for safety.", 
        meaningJP: "シートベルトを締める", 
        example: "Alright, everyone belt up! We're about to hit the busy highway.", 
        exampleJP: "よし、みんなシートベルトを締めて！これから混雑した高速道路に乗るぞ。",
        vibes: ["Enforcing vehicle safety", "Preparing for a long drive", "A responsible driver's command"], 
        vibesJP: ["車両の安全を徹底する", "長距離ドライブの準備", "責任ある運転手の命令"],
        storyline: "The engine of the sturdy family minivan roared to life. Before shifting out of park, Dad turned around with a stern look to check the chaotic backseat. 'Alright team, everyone belt up! We are officially ready to hit the road for the beach.'", 
        storylineJP: "頑丈なファミリー向けミニバンのエンジンが轟音とともに目覚めた。パーキングからギアを入れる前、父は厳しい顔つきで振り返り、カオスな後部座席を確認した。「よしみんな、全員シートベルトを締めて！これで正式に海へ向けて出発するぞ。」", 
        quiz: { question: "The strict driving instructor told me to firmly ___ before starting the engine.", options: ["belt up", "bash in", "be along"], correctIndex: 0, explanation: "to fasten seatbelt." } 
      },
      { 
        pv: "Bend down", trope: "The Simple Motion", cefr: "A2", icon: Footprints, 
        meaning: "To move the top part of your body forwards and downwards.", 
        meaningJP: "（腰を）かがめる、しゃがむ", 
        example: "I casually bent down to tie my loose shoelaces.", 
        exampleJP: "私はほどけた靴ひもを結ぶために、何気なく腰をかがめた。",
        vibes: ["A basic physical action", "Moving closer to the ground", "Picking something up"], 
        vibesJP: ["基本的な身体動作", "地面に近づく", "何かを拾い上げる"],
        storyline: "Walking along the windy, autumn path to school, Sora noticed a strange, glowing object half-buried in the colorful fallen leaves. He carefully bent down to pick it up, realizing it was a mysterious, ancient silver key.", 
        storylineJP: "風の強い秋の通学路を歩いていると、ソラは色鮮やかな落ち葉の中に半分埋もれた、奇妙に光る物体に気づいた。彼はそれを拾うために慎重に腰をかがめ、それが謎めいた古代の銀の鍵であることに気づいた。", 
        quiz: { question: "The tall, gentle giant slowly ___ to softly kiss the crying child on the forehead.", options: ["bent down", "ballsed up", "be in on"], correctIndex: 0, explanation: "to move body down." } 
      },
      { 
        pv: "Bend over backwards", trope: "The Ultimate Dedication", cefr: "C1", icon: Heart, 
        meaning: "To try extremely hard to help or please someone, often sacrificing one's own comfort.", 
        meaningJP: "（人のために）必死に尽力する、最大限の努力をする", 
        example: "My incredible teacher truly bent over backwards to help me finally graduate.", 
        exampleJP: "私の素晴らしい先生は、私が最終的に卒業できるよう本当に必死に尽力してくれた。",
        vibes: ["Offering extraordinary help", "Showing immense dedication", "Exceptional customer service"], 
        vibesJP: ["並外れた助けを提供する", "多大な献身を示す", "並外れたカスタマーサービス"],
        storyline: "Mika was struggling terribly with her advanced art portfolio. Seeing her despair, her strict but kind professor stayed late every single evening for a month. He truly bent over backwards to ensure she perfected her technique and passed the final review.", 
        storylineJP: "ミカは上級アートのポートフォリオ制作でひどく苦戦していた。彼女の絶望を見て、厳しくも優しい教授は1ヶ月間、毎日夜遅くまで残ってくれた。彼女が技術を完成させ、最終審査に合格できるよう、彼は本当に必死に尽力して（最大限の努力をして）くれたのだ。", 
        quiz: { question: "The dedicated hotel staff completely ___ to warmly welcome the demanding VIP guests.", options: ["bent over backwards", "beavered away", "bottomed out"], correctIndex: 0, explanation: "to try hard to help." } 
      },
      { 
        pv: "Big up", trope: "The Self-Promoter", cefr: "C2", icon: Volume2, 
        meaning: "To praise or highly advertise someone or something, often in an exaggerated way.", 
        meaningJP: "大げさに褒めちぎる、大いに宣伝する", 
        example: "It's so annoying how he is constantly bigging himself up in every meeting.", 
        exampleJP: "彼が毎回会議で常に自分自身を大げさに宣伝しているのは本当に鬱陶しい。",
        vibes: ["Aggressive self-marketing", "Exaggerated boasting", "Building an inflated ego"], 
        vibesJP: ["攻撃的な自己マーケティング", "誇張された自慢", "肥大化したエゴを築く"],
        storyline: "Leo was decent at coding, but his ego was massive. During the crucial investor pitch, instead of explaining the actual software, he spent twenty minutes arrogantly bigging up his own minor contributions, completely annoying the entire exhausted team.", 
        storylineJP: "レオはコーディングはそこそこできたが、自己顕示欲が巨大だった。重要な投資家へのプレゼンの最中、彼は実際のソフトウェアについて説明する代わりに、自分自身の些細な貢献を20分間も傲慢に大げさに宣伝し続け、疲れ切ったチーム全体を完全に苛立たせた。", 
        quiz: { question: "Please stop endlessly ___ that incredibly boring and predictable TV show.", options: ["bigging up", "bagging out", "bash about"], correctIndex: 0, explanation: "to praise highly." } 
      },
      { 
        pv: "Black out", trope: "The Heat Collapse", cefr: "B2", icon: Thermometer, 
        meaning: "To suddenly lose consciousness, often due to heat, pain, or shock.", 
        meaningJP: "（貧血や暑さなどで）意識を失う、失神する", 
        example: "It was so intensely hot in the crowded room that I nearly blacked out.", 
        exampleJP: "混雑した部屋の中はとても強烈に暑かったので、私はもう少しで意識を失うところだった。",
        vibes: ["A sudden health emergency", "Dangerous summer heat", "Losing all sensation"], 
        vibesJP: ["突然の健康上の緊急事態", "危険な夏の暑さ", "すべての感覚を失う"],
        storyline: "It was the final, brutal sprint of the summer marathon. The relentless 40-degree heat was suffocating. Just as Sora heroically crossed the white finish line, his vision blurred, his knees buckled, and he completely blacked out on the burning asphalt.", 
        storylineJP: "それは夏の長距離マラソンの、過酷な最後のスプリントだった。容赦ない40度の暑さは息が詰まるほどだった。ソラが英雄的に白いゴールラインを越えた瞬間、彼の視界はぼやけ、膝が折れ、焼けつくアスファルトの上で完全に意識を失った（失神した）。", 
        quiz: { question: "Overwhelmed by the shocking news, the fragile man ___ for a terrifying minute.", options: ["blacked out", "blew up", "backed away"], correctIndex: 0, explanation: "to lose consciousness." } 
      },
      { 
        pv: "Black out", trope: "The Stormy Darkness", cefr: "B2", icon: Zap, 
        meaning: "For lights to completely go out due to a sudden power failure.", 
        meaningJP: "停電する、真っ暗になる", 
        example: "The entire city grid blacked out during the massive winter storm.", 
        exampleJP: "大規模な冬の嵐の間、都市の送電網全体が完全に停電した。",
        vibes: ["A sudden loss of power", "Pitch-black stormy nights", "An electrical infrastructure failure"], 
        vibesJP: ["突然の電力喪失", "真っ暗な嵐の夜", "電気インフラの故障"],
        storyline: "The raging thunderstorm battered the isolated town. Suddenly, a massive bolt of purple lightning struck the main central power grid. In a split second, the screens died, the hum of machines stopped, and the entire frightened neighborhood blacked out instantly.", 
        storylineJP: "猛威を振るう雷雨が孤立した町を打ち据えていた。突然、巨大な紫色の稲妻が中央の主要な送電網を直撃した。一瞬にして画面は消え、機械の唸り声は止み、怯える近隣一帯は即座に完全に停電し（真っ暗になり）静まり返った。", 
        quiz: { question: "The vulnerable coastal city entirely ___ during the devastating hurricane.", options: ["blacked out", "bashed in", "be after"], correctIndex: 0, explanation: "to have a power failure." } 
      }
    ],

    5: [
      { 
        pv: "Blank out", trope: "The Presentation Fog", cefr: "B2", icon: CloudOff, 
        meaning: "To experience a sudden, temporary memory failure under pressure.", 
        meaningJP: "度忘れする、頭が真っ白になる", 
        example: "I lowkey blanked out during the big presentation.", 
        exampleJP: "大規模なプレゼンの最中に、ちょっと頭が真っ白になってしまった。",
        vibes: ["Embarrassing brain fog", "High-stress stage fright", "Exam panic"], 
        vibesJP: ["恥ずかしい脳の霧（ブレインフォグ）", "高ストレスな舞台恐怖症", "テスト中のパニック"],
        storyline: "Sora had memorized the entire speech perfectly. But the moment he looked at the 500 staring faces in the audience, his mind just stopped. He lowkey blanked out, stood in awkward silence for ten seconds, and literally forgot his own name.", 
        storylineJP: "ソラはスピーチを完璧に暗記していた。しかし、観客の500の顔を見た瞬間、彼の思考は停止した。彼はちょっとした度忘れを起こし（頭が真っ白になり）、10秒間気まずい沈黙の中で立ち尽くし、文字通り自分の名前すら忘れてしまった。", 
        quiz: { question: "I completely ___ during the final test and couldn't remember a single formula.", options: ["blanked out", "blissed out", "blared out"], correctIndex: 0, explanation: "memory loss." } 
      },
      { 
        pv: "Blare out", trope: "The Main Character Noise", cefr: "B2", icon: Volume2, 
        meaning: "To produce a continuous, incredibly loud, harsh sound or music.", 
        meaningJP: "（大音量で音楽などが）鳴り響く", 
        example: "My annoying neighbor was blaring out music at 2 AM.", 
        exampleJP: "厄介な隣人が深夜2時に音楽を大音量で鳴り響かせていた。",
        vibes: ["Obnoxious loud music", "Late-night noise complaints", "Ignoring everyone else"], 
        vibesJP: ["不快な大音量の音楽", "深夜の騒音苦情", "他の全員を無視する"],
        storyline: "It was 2 AM, and Hina had a massive final exam the next day. But the guy next door, acting like he was the main character in a movie, was blaring out heavy metal music so loud the apartment walls were actually shaking.", 
        storylineJP: "深夜2時、ヒナは翌日に超重要な期末試験を控えていた。しかし隣の男は、まるで自分が映画の主人公であるかのように振る舞い、壁が実際に震えるほどの大音量でヘヴィメタルを鳴り響かせていた。", 
        quiz: { question: "The broken car radio was obnoxiously ___ the breaking news across the street.", options: ["blaring out", "blocking out", "blurting out"], correctIndex: 0, explanation: "loud noise." } 
      },
      { 
        pv: "Bliss out", trope: "The Ultimate Self-Care", cefr: "C1", icon: Smile, 
        meaning: "To reach a state of extreme relaxation and complete happiness, ignoring all stress.", 
        meaningJP: "至福に浸る、うっとりする、完全にリラックスする", 
        example: "I'm spending my entire Sunday just blissing out.", 
        exampleJP: "私は日曜日丸一日をただ至福に浸って過ごしている。",
        vibes: ["A zero-stress weekend", "Peak self-care routines", "A state of pure relaxation"], 
        vibesJP: ["ストレスゼロの週末", "究極のセルフケアルーティン", "純粋なリラックス状態"],
        storyline: "After a brutal 60-hour work week dealing with angry clients, Mika turned off her phone, put on a thick face mask, and sank into a mountain of soft pillows. She spent the entire Sunday just blissing out, absolutely ignoring the chaotic world outside.", 
        storylineJP: "怒れる顧客の対応に追われた過酷な週60時間労働の後、ミカはスマホの電源を切り、分厚いフェイスマスクをつけて、ふかふかの枕の山に沈み込んだ。彼女は外のカオスな世界を完全に無視し、日曜日丸一日をただただ至福に浸って（完全にリラックスして）過ごした。", 
        quiz: { question: "I just want to lay on the warm, sunny beach and completely ___.", options: ["bliss out", "blow off", "blank out"], correctIndex: 0, explanation: "extremely relaxed." } 
      },
      { 
        pv: "Block out", trope: "The Toxic Shield", cefr: "B2", icon: Shield, 
        meaning: "To intentionally try not to think about or hear something upsetting or negative.", 
        meaningJP: "（不快な考えやノイズを）遮断する、締め出す", 
        example: "I just try to block out the haters and focus intensely on my own goals.", 
        exampleJP: "私はただアンチを遮断し、自分の目標に激しく集中しようとしている。",
        vibes: ["Defending against toxic vibes", "Ignoring intense negativity", "Laser focus on a journey"], 
        vibesJP: ["有毒なバイブスから身を守る", "強烈なネガティブさを無視する", "自分の旅へのレーザーのような集中"],
        storyline: "The anonymous internet comments under his new artwork were getting incredibly mean and personal. Sora took a deep breath, put on his noise-canceling headphones, and decided to just block out the haters to protect his peace and focus on his craft.", 
        storylineJP: "彼の新しいアートについたネットの匿名コメントは、信じられないほど意地悪で個人的な攻撃になってきていた。ソラは深呼吸をし、ノイズキャンセリングヘッドホンをつけ、自分の平穏を守り創作に集中するために、批判者たちを完全に遮断することに決めた。", 
        quiz: { question: "I put on loud music and tried my best to ___ the terrifying noise of the storm.", options: ["block out", "blow out", "bliss out"], correctIndex: 0, explanation: "try not to think/hear." } 
      },
      { 
        pv: "Blow away", trope: "The Next-Gen Masterpiece", cefr: "C1", icon: Sparkles, 
        meaning: "To impress someone so greatly that it exceeds all their expectations.", 
        meaningJP: "（人を）圧倒する、強く感動させる", 
        example: "The crazy, hyper-realistic graphics in that game completely blew me away.", 
        exampleJP: "そのゲームの狂気的なほど超リアルなグラフィックは、私を完全に圧倒した。",
        vibes: ["Obsessed with high quality", "Experiencing an amazing masterpiece", "Feeling absolute shock"], 
        vibesJP: ["高品質への執着", "素晴らしい傑作を体験する", "絶対的なショックを感じる"],
        storyline: "Kaito had high expectations for the new VR RPG, but the moment he put the headset on, he was speechless. The insane level of detail, the perfect lighting, and the massive scale of the virtual world literally blew him away.", 
        storylineJP: "海斗はその新作VR RPGに大きな期待を寄せていたが、ヘッドセットを被った瞬間、彼は言葉を失った。狂気的なレベルの細部、完璧な光の表現、そして仮想世界の巨大なスケールが、文字通り彼を圧倒した（感動させた）。", 
        quiz: { question: "The young singer's incredibly powerful, emotional performance completely ___ the cynical judges ___.", options: ["blew / away", "back / away", "blank / out"], correctIndex: 0, explanation: "impress greatly." } 
      },
      { 
        pv: "Blow off", trope: "The Flaky Ghosting", cefr: "B2", icon: Ghost, 
        meaning: "To intentionally not keep an appointment or casually ignore someone you made plans with.", 
        meaningJP: "（約束を）すっぽかす、無視する", 
        example: "He totally blew me off last night to hang out with other people.", 
        exampleJP: "彼は昨夜、他の人と遊ぶために完全に私の約束をすっぽかした。",
        vibes: ["Getting rudely ghosted", "Being ditched for better plans", "Dealing with a flaky friend"], 
        vibesJP: ["失礼にも音信不通にされる", "より良い予定のために見捨てられる", "当てにならない友人の対処"],
        storyline: "Rin had been waiting at the fancy cafe for an hour, dressed in her absolute best outfit. Checking her phone, she saw a photo of him at a wild house party. He had totally blown her off without even sending a single apology text message.", 
        storylineJP: "リンはとびきりのおしゃれをして、おしゃれなカフェで1時間も待っていた。スマホを見ると、彼が派手なホームパーティにいる写真が上がっていた。彼はたった一通の謝罪メッセージもなく、彼女を完全にすっぽかした（無視した）のだ。", 
        quiz: { question: "I can't believe she rudely ___ her extremely important doctor's meeting just to sleep in.", options: ["blew off", "blew up", "blew over"], correctIndex: 0, explanation: "not keep appointment." } 
      },
      { 
        pv: "Blow over", trope: "The Fast Cancel Culture", cefr: "B2", icon: Wind, 
        meaning: "When a scandal, intense argument, or problem is eventually forgotten and passes without serious harm.", 
        meaningJP: "（嵐や噂などが）収まる、忘れ去られる", 
        example: "Don't stress about the social media drama; it will definitely blow over soon.", 
        exampleJP: "SNSの騒動についてストレスを感じないで。間違いなくすぐに収まるから。",
        vibes: ["Waiting for people to move on", "Surviving online scandals", "The fast news cycle"], 
        vibesJP: ["人々が前に進む（忘れる）のを待つ", "ネットのスキャンダルを生き延びる", "速いニュースサイクル"],
        storyline: "Mika was absolutely terrified when a slightly embarrassing video of her went viral at school. Her wise older sister just laughed. 'Don't worry about this stupid drama. Give it three days, and it'll completely blow over when someone else messes up worse.'", 
        storylineJP: "学校で少し恥ずかしい動画が拡散され、ミカは恐怖に怯えていた。賢い姉はただ笑った。「こんなくだらない騒動、心配しなくていいわ。3日もすれば、誰か別の人がもっとひどい失敗をして、この件は完全に忘れ去られる（収まる）から。」", 
        quiz: { question: "The massive political scandal dominated the news for weeks, but finally ___ after a month.", options: ["blew over", "blew up", "blissed out"], correctIndex: 0, explanation: "problem forgotten." } 
      },
      { 
        pv: "Blow up", trope: "The Furious Parent", cefr: "B1", icon: Flame, 
        meaning: "To lose your temper and become suddenly, intensely angry at someone.", 
        meaningJP: "激怒する、キレる", 
        example: "My mom completely blew up at me because of my grades.", 
        exampleJP: "私の成績のせいで、お母さんは完全に私に激怒した（キレた）。",
        vibes: ["Sudden intense anger", "A severe parental scolding", "A dramatic yelling match"], 
        vibesJP: ["突然の激しい怒り", "親の厳しい説教", "ドラマチックな怒鳴り合い"],
        storyline: "Leo swore he would clean the entire kitchen before mom got home from work. When she walked in to see towering piles of dirty plates and a sleeping Leo on the couch, she absolutely blew up at him, her furious voice echoing down the street.", 
        storylineJP: "レオは母が仕事から帰る前にキッチン全体を掃除すると誓っていた。そびえ立つ汚れた皿の山と、ソファで眠るレオを見た瞬間、彼女は絶対的に彼に激怒し（キレて）、その猛烈な声は通りまで響き渡った。", 
        quiz: { question: "The stressed manager suddenly ___ at his confused team over a tiny spelling error.", options: ["blew up", "blew off", "blared out"], correctIndex: 0, explanation: "lose temper." } 
      },
      { 
        pv: "Blow up", trope: "The Viral Phenomenon", cefr: "B1", icon: Zap, 
        meaning: "To get a massive amount of sudden attention, especially on social media.", 
        meaningJP: "（SNSなどで）大炎上する、バズる", 
        example: "My random 3 AM TikTok is totally blowing up!", 
        exampleJP: "深夜3時の適当なTikTokが完全にバズってる！",
        vibes: ["Going viral overnight", "Endless notifications", "Sudden internet success"], 
        vibesJP: ["一夜にしてバズる", "終わりのない通知", "突然のネットでの成功"],
        storyline: "Sora posted a silly, ten-second clip of his cat trying to catch a laser pointer right before going to sleep. When he woke up, his phone was literally frozen from notifications. The video was blowing up, hitting two million views overnight.", 
        storylineJP: "ソラは寝る前に、猫がレーザーポインターを捕まえようとするふざけた10秒の動画を投稿した。朝起きると、通知の嵐でスマホが文字通りフリーズしていた。その動画はバズりまくり（爆発的な人気になり）、一晩で200万再生を突破していた。", 
        quiz: { question: "Her controversial fashion post totally ___ overnight, getting thousands of angry comments.", options: ["blew up", "blanked out", "blissed out"], correctIndex: 0, explanation: "get attention." } 
      },
      { 
        pv: "Blurt out", trope: "The Accidental Tea Spill", cefr: "B2", icon: MessageCircle, 
        meaning: "To say a secret or something sensitive suddenly and without thinking.", 
        meaningJP: "（秘密などを）うっかり口走る", 
        example: "I accidentally blurted out the big secret at dinner.", 
        exampleJP: "夕食の時に、うっかりその大きな秘密を口走ってしまった。",
        vibes: ["Spilling the tea by mistake", "Failing to keep a secret", "Instant, crushing embarrassment"], 
        vibesJP: ["間違えてゴシップを漏らす", "秘密を守れない", "即座の、打ちのめされるような恥ずかしさ"],
        storyline: "Everyone had worked for weeks to keep the massive surprise party a total secret from Kaito. But as soon as Kaito walked into the quiet room, a nervous Hina panicked and blurted out, 'Happy Birthday!' ten whole minutes too early. The silence was agonizing.", 
        storylineJP: "海斗に大規模なサプライズパーティを完全に内緒にするため、全員が何週間も苦心していた。しかし海斗が静かな部屋に入ってきた瞬間、緊張したヒナはパニックになり、丸10分も早く「誕生日おめでとう！」とうっかり口走ってしまった。その後の沈黙は耐え難いものだった。", 
        quiz: { question: "Under pressure from the intense police, the nervous suspect accidentally ___ the terrifying truth!", options: ["blurted out", "blocked out", "blared out"], correctIndex: 0, explanation: "say without thinking." } 
      }
    ],
    6: [
      { 
        pv: "Board out", trope: "The Pet Vacation Plan", cefr: "B2", icon: Home, 
        meaning: "To arrange for a pet to stay somewhere else (like a kennel) while you are away.", 
        meaningJP: "（旅行中などにペットを他の場所に）預ける", 
        example: "We have a massive trip, so we had to board our energetic dog out for a week.", 
        exampleJP: "大規模な旅行があるので、私たちは元気な犬を1週間預けなければならなかった。",
        vibes: ["Planning expensive pet care", "Preparing for a long family trip", "Worrying about furry friends"], 
        vibesJP: ["高額なペットケアを計画する", "長期の家族旅行の準備", "毛皮の友達（ペット）を心配する"],
        storyline: "The family was incredibly excited for their two-week dream vacation to Japan. However, the hardest part of the planning was finding a trustworthy, caring place to board out their beloved, highly anxious golden retriever so he wouldn't feel abandoned.", 
        storylineJP: "家族は2週間にわたる夢の日本旅行に信じられないほど興奮していた。しかし、計画で一番大変だったのは、彼らが愛してやまない、ひどく神経質なゴールデンレトリバーが見捨てられたと感じないよう、預けるための信頼できる温かい場所を見つけることだった。", 
        quiz: { question: "Before flying to Europe, we urgently need to safely ___ the old dog.", options: ["board out", "bog off", "book in"], correctIndex: 0, explanation: "pet stay elsewhere." } 
      },
      { 
        pv: "Bog down", trope: "The Endless Research Trap", cefr: "B2", icon: Wind, 
        meaning: "To slow progress significantly or to get completely stuck on minor, annoying details.", 
        meaningJP: "行き詰まる、泥沼にはまる、進捗がひどく遅れる", 
        example: "I got totally bogged down in minor formatting details.", 
        exampleJP: "私は細かいフォーマットの調整に完全に泥沼にはまってしまった。",
        vibes: ["Getting stuck on homework", "Slow, frustrating progress", "Losing sight of the main goal"], 
        vibesJP: ["宿題で行き詰まる", "遅くてイライラする進捗", "本来の目的を見失う"],
        storyline: "Mika had a brilliant, overarching idea for her final thesis essay. But as started reading historical archives, she got so deeply bogged down in verifying tiny, irrelevant dates that she completely missed her midnight submission deadline.", 
        storylineJP: "ミカの卒論エッセイの全体的なアイデアは素晴らしかった。しかし歴史的アーカイブを読み始めた途端、彼女は無関係な細かい日付の確認に深く行き詰まって（泥沼にはまって）しまい、深夜の提出期限を完全に見過ごしてしまった。", 
        quiz: { question: "Try to focus on the big picture and don't get completely ___ by minor formatting errors.", options: ["bogged down", "bogged into", "bogged off"], correctIndex: 0, explanation: "slow progress." } 
      },
      { 
        pv: "Bog into", trope: "The Savage Post-Workout Hunger", cefr: "B1", icon: ShoppingCart, 
        meaning: "To begin eating a meal very enthusiastically, greedily, and without hesitation.", 
        meaningJP: "ガツガツ食べる、むさぼり食う", 
        example: "I was starving and bogged into that huge burger instantly.", 
        exampleJP: "私はお腹がペコペコだったので、その巨大なハンバーガーに即座にガツガツと食らいついた。",
        vibes: ["Extreme post-workout hunger", "Devouring fast food", "A messy, highly satisfying meal"], 
        vibesJP: ["ワークアウト後の極度の空腹", "ファストフードをむさぼり食う", "汚いけど最高に満足な食事"],
        storyline: "Sora had been playing intense, competitive basketball for six hours straight with zero breaks. The moment the steaming hot, greasy Uber Eats pizza arrived, he didn't even grab a plate; he just aggressively bogged into it like a starving wolf.", 
        storylineJP: "ソラは休憩なしで6時間ぶっ通しで、激しい競技バスケをしていた。湯気を立てる脂っこいUber Eatsのピザが届いた瞬間、彼はお皿を取ることすらせず、まるで飢えた狼のようにアグレッシブにそれにガツガツと食らいついた。", 
        quiz: { question: "Famished after the incredibly long mountain hike, he ruthlessly ___ the delicious steak.", options: ["bogged into", "bogged off", "booked up"], correctIndex: 0, explanation: "eat enthusiastically." } 
      },
      { 
        pv: "Bog off!", trope: "The Ultimate Slang Shutdown", cefr: "C1", icon: XCircle, 
        meaning: "A harsh, aggressive slang phrase telling someone to get lost or go away immediately.", 
        meaningJP: "（失礼に）あっちへ行け！、うせろ！", 
        example: "He wouldn't stop annoying me, so I finally turned and told him to bog off.", 
        exampleJP: "彼が私を苛立たせるのをやめなかったので、ついに私は振り返って「うせろ」と言い放った。",
        vibes: ["Harsh British-style slang", "Shutting down annoying people", "Rude, direct rejection"], 
        vibesJP: ["厳しいイギリス風スラング", "鬱陶しい人をシャットダウンする", "無礼で直接的な拒絶"],
        storyline: "The persistent, fast-talking salesman followed Hina down three different streets, aggressively pushing his useless, expensive skincare products. Annoyed beyond belief, she finally stopped, glared at him with pure ice, and firmly told him to bog off.", 
        storylineJP: "早口でしつこいセールスマンはヒナを3つの通りにわたって追いかけ、役に立たない高価なスキンケア用品を強引に勧めてきた。信じられないほど苛立った彼女はついに立ち止まり、氷のように冷たい視線で彼を睨みつけ、きっぱりと「うせろ（あっちへ行け）」と言い放った。", 
        quiz: { question: "Tired of the constant, completely unhelpful advice from the stranger, I loudly told him to just ___.", options: ["bog off", "boil over", "boot up"], correctIndex: 0, explanation: "get lost/go away." } 
      },
      { 
        pv: "Boil down to", trope: "The Ultimate Core Issue", cefr: "B2", icon: Calculator, 
        meaning: "To basically amount to or be reduced to its main, most essential point.", 
        meaningJP: "要するに～ということになる、～に帰着する", 
        example: "It essentially boils down to a massive matter of money.", 
        exampleJP: "それは本質的に、お金という巨大な問題に帰着する。",
        vibes: ["Summarizing messy drama", "Finding the simple, hard fact", "Cutting through the nonsense"], 
        vibesJP: ["厄介なドラマを要約する", "シンプルで厳然たる事実を見つける", "無意味なことを切り捨てる"],
        storyline: "The student council debated for four agonizing hours about the festival theme, bringing up a hundred different conflicting ideas and complaints. But as Leo pointed out, the whole complex argument basically boiled down to one brutal thing: they had absolutely zero budget.", 
        storylineJP: "生徒会は文化祭のテーマについて4時間も苦痛な議論を交わし、100もの相反するアイデアや不満を出した。しかしレオが指摘したように、その複雑な議論のすべては、要するに「予算が完全にゼロである」という一つの残酷な事実に帰着したのだ。", 
        quiz: { question: "Despite all the complex scientific theories, the mysterious problem simply ___ one obvious choice.", options: ["boils down to", "boils over", "bolsters up"], correctIndex: 0, explanation: "basically amount to." } 
      },
      { 
        pv: "Boil over", trope: "The Nasty Group Chat Explosion", cefr: "C1", icon: Flame, 
        meaning: "To completely lose one's temper, or for a tense situation to suddenly erupt.", 
        meaningJP: "（怒りや不満が）限界を超えて爆発する", 
        example: "The long-standing argument finally boiled over into actual violence.", 
        exampleJP: "長年の言い争いが、ついに限界を超えて実際の暴力へと爆発した。",
        vibes: ["A long-standing fight erupting", "Uncontrollable, nasty anger", "A group chat disaster"], 
        vibesJP: ["長年の争いの勃発", "制御不能な嫌な怒り", "グループチャットの惨事"],
        storyline: "The petty, passive-aggressive arguments in the gaming group chat had been simmering for weeks over tiny misunderstandings. Last night, the toxic tension finally boiled over, resulting in screaming voicenotes, crying, and everyone blocking each other permanently.", 
        storylineJP: "ゲームのグループチャットでの陰湿で些細な言い争いは、小さな誤解から何週間もくすぶり続けていた。昨夜、その有毒な緊張がついに限界を超えて爆発し、絶叫のボイスメッセージや号泣が飛び交い、全員が互いを永久にブロックする事態となった。", 
        quiz: { question: "The simmering, unspoken anger between the two bitter business rivals suddenly ___.", options: ["boiled over", "boiled down", "booked up"], correctIndex: 0, explanation: "lose temper." } 
      },
      { 
        pv: "Bolster up", trope: "The Ultimate Friend Hype", cefr: "C1", icon: Award, 
        meaning: "To actively support, strengthen, or boost someone's confidence or a weak argument.", 
        meaningJP: "（自信や主張などを）高める、テコ入れする、強化する", 
        example: "I really need you to bolster up my confidence before this date.", 
        exampleJP: "このデートの前に、君に私の自信をテコ入れして（高めて）もらう必要があるんだ。",
        vibes: ["Giving a massive pep talk", "Hyping up a nervous friend", "Adding strong proof to an essay"], 
        vibesJP: ["大規模なペップトーク（激励）をする", "緊張している友人を盛り上げる", "エッセイに強力な証拠を追加する"],
        storyline: "Kaito was absolutely terrified right before his big stage debut, his hands visibly shaking and sweat pouring down his face. His best friend grabbed his shoulders, looked him dead in the eye, and delivered a fiery speech to bolster up his shattered confidence.", 
        storylineJP: "海斗は大舞台でのデビュー直前、絶対的な恐怖に怯え、手は目に見えて震え、顔には汗が流れていた。親友は彼の肩を掴み、その目をまっすぐに見つめ、粉々になった彼の自信を強烈に高める（テコ入れする）ための熱いスピーチをした。", 
        quiz: { question: "The nervous speaker used impressive, colorful charts to aggressively ___ his weak argument.", options: ["bolster up", "botch up", "bounce back"], correctIndex: 0, explanation: "support/strengthen." } 
      },
      { 
        pv: "Bone up on", trope: "The Desperate Energy-Drink Cram", cefr: "C1", icon: Book, 
        meaning: "To study very hard and quickly for a specific goal, test, or event.", 
        meaningJP: "（試験や面接の前に）猛勉強する、詰め込み勉強をする", 
        example: "I need to urgently bone up on ancient history tonight.", 
        exampleJP: "今夜、至急古代史の詰め込み勉強をする必要がある。",
        vibes: ["Frantic exam focus", "Preparing for a scary interview", "Intense, quick study sessions"], 
        vibesJP: ["半狂乱の試験への集中", "怖い面接の準備", "強烈で素早い勉強セッション"],
        storyline: "Sora had entirely ignored his Spanish classes all semester. With his family trip to Madrid only three days away, he panicked, bought five energy drinks, and stayed up 48 hours straight to desperately bone up on the local language and culture.", 
        storylineJP: "ソラは一学期中、スペイン語の授業を完全に無視していた。マドリードへの家族旅行がわずか3日後に迫る中、彼はパニックになり、エナジードリンクを5本買い込み、現地の言葉と文化を必死に詰め込み勉強するために48時間ぶっ通しで徹夜した。", 
        quiz: { question: "Before the vital job interview, I'm going to extensively ___ the company's strict rules.", options: ["bone up on", "book up", "boot up"], correctIndex: 0, explanation: "study hard." } 
      },
      { 
        pv: "Book in", trope: "The Fancy Anniversary Check-in", cefr: "B1", icon: Calendar, 
        meaning: "To make a reservation or officially register your arrival at a place like a hotel.", 
        meaningJP: "（ホテルやレストランを）予約する、チェックインする", 
        example: "I managed to book us in for an exclusive, highly-rated dinner.", 
        exampleJP: "限定の、高評価のディナーの予約を取ることに成功したよ。",
        vibes: ["Planning a perfect vacation", "Luxury travel vibes", "Securing a highly desired spot"], 
        vibesJP: ["完璧な休暇を計画する", "豪華な旅行のバイブス", "大人気のスポットを確保する"],
        storyline: "It was Mika's highly anticipated 20th birthday. Kaito wanted everything to be absolutely flawless, so he made sure to book them in for the most exclusive, expensive private dining room in the city a full two months in advance.", 
        storylineJP: "ミカの待ちに待った20歳の誕生日だった。海斗はすべてを絶対に完璧にしたかったので、2ヶ月も前から、市内で最もエクスクルーシブで高価な個室ダイニングを確実に予約しておいた。", 
        quiz: { question: "Have you successfully ___ at the luxury seaside hotel yet?", options: ["booked in", "boarded up", "blown away"], correctIndex: 0, explanation: "reserve/check in." } 
      },
      { 
        pv: "Book up", trope: "The Sold Out Tragedy", cefr: "B2", icon: Lock, 
        meaning: "To be completely full, reserved, or sold out with no space left at all.", 
        meaningJP: "予約でいっぱいになる、完全に満席になる", 
        example: "The entire concert tour is already booked up for the year.", 
        exampleJP: "そのコンサートツアーは、今年分はすでにすべて予約でいっぱいになっている。",
        vibes: ["Crushing disappointment", "A sold-out, extremely busy event", "Zero availability anywhere"], 
        vibesJP: ["打ちのめされるような失望", "完売した、非常に忙しいイベント", "どこも空きがない"],
        storyline: "Rin had meticulously saved her allowance for a whole year to go to the legendary pop star's comeback concert. But the exact moment she logged onto the ticketing site, she saw the tragic red text: the entire stadium was completely booked up within two minutes.", 
        storylineJP: "リンは、伝説的なポップスターの復帰ライブに行くために、丸1年間お小遣いを几帳面に貯めていた。しかし、チケットサイトにログインしたまさにその瞬間、彼女は悲劇的な赤い文字を目にした。スタジアム全体がわずか2分で完全に予約でいっぱいになっていたのだ。", 
        quiz: { question: "I'm sorry, sir, but the scheduled flight is entirely ___ for the next three days.", options: ["booked up", "booked in", "booted up"], correctIndex: 0, explanation: "fully sold out." } 
      },
      { 
        pv: "Boot up", trope: "The Ancient Tech Frustration", cefr: "B1", icon: Cpu, 
        meaning: "To start a computer or electronic device and make it ready to use.", 
        meaningJP: "（コンピュータなどを）起動する、立ち上げる", 
        example: "This ancient PC takes absolutely ages just to boot up.", 
        exampleJP: "この古代のPCは、ただ起動するだけで途方もない時間がかかる。",
        vibes: ["Frustration with extremely slow tech", "Waiting for a heavy game to start", "The loud sound of an old fan"], 
        vibesJP: ["極端に遅いテクノロジーへの苛立ち", "重いゲームの起動を待つ", "古いファンのうるさい音"],
        storyline: "The crucial, heavily-monitored online exam was starting in exactly one minute. Leo frantically mashed the power button on his dusty, eight-year-old laptop, praying to every god as the noisy machine took a terrifyingly slow ten minutes just to boot up.", 
        storylineJP: "厳重に監視される極めて重要なオンライン試験が、きっかり1分後に始まろうとしていた。レオは埃をかぶった8年前のノートPCの電源ボタンを狂ったように連打し、騒々しい機械が単に起動するだけで恐ろしく遅い10分間を費やす間、あらゆる神に祈った。", 
        quiz: { question: "Please wait quietly for a moment; the massive main system takes time to securely ___.", options: ["boot up", "bowl over", "bounce back"], correctIndex: 0, explanation: "start computer." } 
      },
      { 
        pv: "Boss around", trope: "The Toxic Club Control", cefr: "B2", icon: UserPlus, 
        meaning: "To tell people what to do continuously in an arrogant, rudely authoritative way.", 
        meaningJP: "（人に対して）威張って指図する、こき使う", 
        example: "Please stop endlessly bossing everyone around like you own the place!", 
        exampleJP: "自分がこの場所のボスであるかのように、果てしなく皆に威張って指図するのはやめて！",
        vibes: ["A controlling, toxic friend", "An annoying workplace dynamic", "Intense sibling rivalry"], 
        vibesJP: ["支配的で有毒な友人", "迷惑な職場の力学", "激しい兄弟の対立"],
        storyline: "The newly elected club president let the tiny bit of power go straight to his head. He walked around the room constantly bossing the senior members around like they were his personal servants, until they collectively decided to ignore him entirely.", 
        storylineJP: "新しく選ばれた部長は、ほんの少しの権力に完全に酔いしれていた。彼は部屋を歩き回り、まるで先輩たちが自分の個人的な召使いであるかのように絶えず威張って指図し続け、ついに彼らは全員一致で彼を完全に無視することに決めた。", 
        quiz: { question: "Nobody here likes being rudely ___ by someone who just joined the team yesterday.", options: ["bossed around", "botched up", "bottled up"], correctIndex: 0, explanation: "control excessively." } 
      },
      { 
        pv: "Botch up", trope: "The Epic DIY Fail", cefr: "C1", icon: Trash2, 
        meaning: "To ruin or spoil something completely by doing it very badly or clumsily.", 
        meaningJP: "（不手際やヘマで）台無しにする、ひどくしくじる", 
        example: "I disastrously botched up my hair trying to fade it.", 
        exampleJP: "髪をフェード（刈り上げ）にしようとして、悲惨なほどに台無しにしてしまった。",
        vibes: ["A tragic, funny fail", "A DIY project gone horribly wrong", "Deep, embarrassing regret"], 
        vibesJP: ["悲劇的で笑える失敗", "DIYプロジェクトがひどい方向に進む", "深くて恥ずかしい後悔"],
        storyline: "Wanting to save money, Leo watched a three-minute tutorial and tried to cut his own hair with kitchen scissors. He botched it up so disastrously that he had to wear a thick beanie indoors for an entire month out of sheer, undeniable shame.", 
        storylineJP: "お金を節約したかったレオは、3分間のチュートリアル動画を見て、キッチンばさみで自分の髪を切ろうとした。彼はそれをあまりにも悲惨なほど台無しにして（しくじって）しまい、純粋で否定できない羞恥心から丸1ヶ月間、屋内でも分厚いニット帽を被らなければならなかった。", 
        quiz: { question: "He clumsily ___ the simple pipe repair job, making the water leak much worse.", options: ["botched up", "bolstered up", "booked up"], correctIndex: 0, explanation: "ruin/spoil." } 
      },
      { 
        pv: "Bottle up", trope: "The Silent Sufferer", cefr: "B2", icon: Lock, 
        meaning: "To forcefully hide and not express strong, often negative, emotions.", 
        meaningJP: "（感情を）押し殺す、内に秘める", 
        example: "Don't continuously bottle up your anger; it will destroy you.", 
        exampleJP: "怒りを絶えず内に押し殺してはいけない。それがあなたを破壊してしまう。",
        vibes: ["Giving deep psychological advice", "A toxic mental state", "The urgent need to vent"], 
        vibesJP: ["深い心理的なアドバイスをする", "有毒な精神状態", "感情を吐き出す緊急の必要性"],
        storyline: "For months, Hina smiled brightly while secretly struggling with massive family issues. Sora finally sat her down and said gently, 'It's incredibly toxic to bottle up all that pain. You need to let it out before you completely break.'", 
        storylineJP: "何ヶ月もの間、ヒナは家族の大きな問題で密かに苦しみながらも明るく微笑んでいた。ソラはついに彼女を座らせ、優しく言った。「その痛みをすべて内に押し殺すのは信じられないほど有毒だよ。完全に壊れてしまう前に吐き出さなきゃ。」", 
        quiz: { question: "It is unhealthy to consistently ___ intense anger instead of talking about it.", options: ["bottle up", "boot up", "bowl over"], correctIndex: 0, explanation: "suppress feelings." } 
      },
      { 
        pv: "Bounce back", trope: "The Ultimate Glow-Up Era", cefr: "B2", icon: Sparkles, 
        meaning: "To successfully and quickly recover from a severe setback, illness, or failure.", 
        meaningJP: "（困難から）立ち直る、見事に回復する", 
        example: "I will bounce back stronger from this terrible situation.", 
        exampleJP: "このひどい状況から、私はより強くなって立ち直ってみせる。",
        vibes: ["A powerful recovery phase", "Entering a new, positive era", "Overcoming severe illness"], 
        vibesJP: ["力強い回復期", "新しくポジティブな時代に入る", "重病を克服する"],
        storyline: "After a devastating public breakup that left her in tears for weeks, Mika hit the gym, completely changed her style, and started a successful business. She didn't just survive; she was rapidly bouncing back and entering her ultimate glow-up era.", 
        storylineJP: "何週間も涙に暮れるほどの悲惨で公の失恋の後、ミカはジムに通い、スタイルを完全に変え、成功するビジネスを立ち上げた。彼女はただ生き延びただけではない。急速に立ち直り、究極の絶好調の時期（グロウアップ・エラ）に突入したのだ。", 
        quiz: { question: "Despite the massive financial failure, the highly resilient CEO ___ astonishingly fast.", options: ["bounced back", "booked in", "blanked out"], correctIndex: 0, explanation: "recover from setback." } 
      },
      { 
        pv: "Bowl over", trope: "The Shook Reaction", cefr: "C1", icon: AlertCircle, 
        meaning: "To surprise, shock, or impress someone so greatly that they are left completely speechless.", 
        meaningJP: "（人を）圧倒する、ひどく驚愕させる、腰を抜かさせる", 
        example: "The insane, unexpected price literally bowled me over.", 
        exampleJP: "その狂気じみた、予期せぬ価格に、私は文字通り腰を抜かした。",
        vibes: ["Utter, speechless shock", "Being absolutely 'shook'", "Reacting to sudden, massive news"], 
        vibesJP: ["完全に言葉を失うほどのショック", "絶対的に『打ちのめされる』", "突然の大ニュースに反応する"],
        storyline: "Kaito knew the luxury boutique was expensive, but when the elegant waiter casually handed him a bill for a single cup of artisan coffee that cost fifty dollars, he was literally bowled over by the sheer, undeniable audacity of the price.", 
        storylineJP: "海斗はその高級ブティックが高いことは知っていたが、優雅なウェイターが何気なく渡してきた職人手作りのコーヒー1杯50ドルという請求書を見た時、その価格のあまりの、否定できない図々しさに、文字通り圧倒され腰を抜かしそうになった。", 
        quiz: { question: "He was entirely ___ by the surprisingly generous, completely unexpected news.", options: ["bowled over", "botched up", "booted up"], correctIndex: 0, explanation: "surprise greatly." } 
      }
    ],

    7: [
      { 
        pv: "Box in", trope: "The Trapped Driver", cefr: "B2", icon: Lock, 
        meaning: "To prevent someone or something from moving by entirely surrounding them.", 
        meaningJP: "（身動きがとれないように）閉じ込める", 
        example: "I was totally boxed in at the mall parking lot.", 
        exampleJP: "モールの駐車場で完全に閉じ込められてしまった。",
        vibes: ["Being stuck in a terrible spot", "Frustrating traffic jams", "Aggressive, careless parking"], 
        vibesJP: ["最悪な場所で立ち往生する", "イライラする交通渋滞", "アグレッシブで不注意な駐車"],
        storyline: "Sato had a crucial job interview in thirty minutes. But when he rushed back to the crowded mall parking lot, he found his tiny car was totally, hopelessly boxed in by two massive, illegally parked SUVs. He couldn't move a single inch.", 
        storylineJP: "佐藤は30分後に極めて重要な就職面接を控えていた。しかし、混雑したモールの駐車場に急いで戻ると、彼の小さな車は、違法駐車された2台の巨大なSUVによって完全に、絶望的に閉じ込められていた。彼は1インチも動けなかった。", 
        quiz: { question: "The defensive police cars successfully ___ the heavily armed, fleeing suspect.", options: ["boxed in", "boxed up", "broken in"], correctIndex: 0, explanation: "prevent moving." } 
      },
      { 
        pv: "Box up", trope: "The Big Moving Day", cefr: "B1", icon: Package, 
        meaning: "To neatly pack things inside boxes, usually for storage or preparing for a move.", 
        meaningJP: "（荷物を）箱に詰める", 
        example: "I finally boxed up my old, bulky winter clothes.", 
        exampleJP: "ついに古くてかさばる冬服を箱に詰めた。",
        vibes: ["Organizing a messy, overflowing closet", "The absolute chaos of moving house", "Storing away sentimental memories"], 
        vibesJP: ["散らかって溢れかえったクローゼットを整理する", "引っ越しの絶対的なカオス", "感傷的な思い出を収納する"],
        storyline: "Spring had finally arrived in full bloom, bringing warm sunshine. Hina spent her entire weekend ruthlessly organizing her overflowing closet, meticulously boxing up all her heavy winter coats to make precious room for her light, colorful summer fits.", 
        storylineJP: "ついに春が満開となり、暖かい日差しをもたらした。ヒナは週末を丸ごと使って溢れかえるクローゼットを容赦なく整理し、軽やかでカラフルな夏服の貴重なスペースを作るために、重い冬のコートをすべて几帳面に箱に詰めた。", 
        quiz: { question: "She carefully ___ the fragile, ancient antique books for the long, bumpy journey.", options: ["boxed up", "boxed in", "broke up"], correctIndex: 0, explanation: "pack in boxes." } 
      },
      { 
        pv: "Brace up", trope: "The Pre-Game Hype", cefr: "C1", icon: Heart, 
        meaning: "To force yourself to feel more courageous and confident in a scary or stressful situation.", 
        meaningJP: "（気を引き締めて）自信を持つ、奮起する", 
        example: "You need to brace up and face them directly.", 
        exampleJP: "気を引き締めて、彼らに直接立ち向かう必要がある。",
        vibes: ["Giving a friend an intense hype talk", "Building sudden, necessary confidence", "Overcoming deep social anxiety"], 
        vibesJP: ["友人に強烈なハッパをかける", "突然必要な自信を築く", "深い社交不安を克服する"],
        storyline: "Mika was trembling violently behind the heavy stage curtain, terrified of the massive audience waiting for her solo. Her friend grabbed her shoulders firmly. 'You need to brace up right now,' she ordered. 'You are a star. Stop worrying and just shine.'", 
        storylineJP: "ミカは重いステージのカーテンの裏で、自分のソロを待つ巨大な観客に怯え、激しく震えていた。友人は彼女の肩をしっかりと掴んだ。「今すぐ気を引き締めて（奮起して）」と彼女は命じた。「あなたはスターよ。心配するのをやめてただ輝きなさい。」", 
        quiz: { question: "You absolutely need to ___ before stepping into that extremely difficult negotiation room.", options: ["brace up", "branch out", "break in"], correctIndex: 0, explanation: "feel confident." } 
      },
      { 
        pv: "Branch out", trope: "The Content Creator's New Era", cefr: "B2", icon: GitBranch, 
        meaning: "To move into a different, new area of business or personal interest.", 
        meaningJP: "（新しい分野へ）活動を広げる、手を広げる", 
        example: "I’m actively trying to branch out into lifestyle vlogs.", 
        exampleJP: "ライフスタイル系のVlogへと積極的に活動を広げようとしている。",
        vibes: ["Entering a 'new era' of content creation", "Expanding a personal, passionate hobby", "Growing a risky startup business"], 
        vibesJP: ["コンテンツ制作の『新時代』に突入する", "個人的で情熱的な趣味を広げる", "リスクの高いスタートアップビジネスを成長させる"],
        storyline: "Sora had built a massive online following just by streaming racing games from his bedroom. But feeling creatively stifled, he announced to his loyal fans that he was trying to branch out into outdoor travel vlogs, eager to explore a totally different, vibrant world.", 
        storylineJP: "ソラは自室からレースゲームを配信するだけで巨大なオンラインフォロワーを築き上げていた。しかし創造的な息苦しさを感じた彼は、全く違う活気ある世界を探求したいと熱望し、アウトドア旅行のVlogへ活動を広げる（手を広げる）と忠実なファンに発表した。", 
        quiz: { question: "The highly successful tech firm is aggressively ___ into completely new overseas markets.", options: ["branching out", "breaking away", "breezing through"], correctIndex: 0, explanation: "move into new area." } 
      },
      { 
        pv: "Break away", trope: "The Solo Debut", cefr: "B2", icon: LogOut, 
        meaning: "To leave an organization, group, or strict situation to become independent.", 
        meaningJP: "（集団や束縛から）脱退する、逃げ出す", 
        example: "She decided to break away from the toxic group.", 
        exampleJP: "彼女はその有毒なグループから脱退することを決意した。",
        vibes: ["A musician shockingly going solo", "Leaving a highly restrictive circle", "A dramatic bid for true independence"], 
        vibesJP: ["ミュージシャンが衝撃的にソロになる", "非常に制限の多いサークルを去る", "真の独立へのドラマチックな試み"],
        storyline: "For five long years, Hina had been the lead singer of a highly controlled, manufactured pop idol group. Suffocating under the impossibly strict rules, she shocked the entire industry by deciding to boldly break away from the agency and start her own independent solo project.", 
        storylineJP: "長く苦しい5年間、ヒナは厳格に管理された作られたポップアイドルグループのボーカルだった。不可能なほど厳しいルールに息苦しさを感じていた彼女は、大胆にも事務所から脱退し、自分自身の独立したソロプロジェクトを始める決断を下して業界全体を震撼させた。", 
        quiz: { question: "The frustrated rebel leader decided to finally ___ from the deeply corrupt empire.", options: ["break away", "break off", "break out"], correctIndex: 0, explanation: "leave organization." } 
      },
      { 
        pv: "Break down", trope: "The Emotional Finale", cefr: "B1", icon: Droplets, 
        meaning: "To lose control of your emotions and suddenly start crying uncontrollably.", 
        meaningJP: "（感情を抑えきれずに）泣き崩れる", 
        example: "I lowkey broke down in tears at the very end.", 
        exampleJP: "最後には、思わず感情を抑えきれずに泣き崩れてしまった。",
        vibes: ["Crying over a devastatingly sad K-drama", "An overwhelming emotional reaction", "Releasing weeks of pent-up stress"], 
        vibesJP: ["壊滅的に悲しい韓国ドラマで泣く", "圧倒的な感情的反応", "何週間も溜まったストレスを解放する"],
        storyline: "Sora always acted tough and proudly claimed he never cried at movies. But when the heroic main character tragically sacrificed himself in the epic, heartbreaking finale of the show, Sora lowkey broke down in uncontrollable tears right in the middle of the living room.", 
        storylineJP: "ソラはいつも強がり、映画で泣いたことなどないと誇らしげに主張していた。しかし、その番組の壮大で胸が張り裂けるような最終回で、英雄的な主人公が悲劇的な自己犠牲を払った時、ソラはリビングのど真ん中で密かに、抑えきれない涙に泣き崩れた。", 
        quiz: { question: "Overwhelmed by the tragic, unexpected news, she suddenly ___ in bitter, heavy tears.", options: ["broke down", "broke up", "brought about"], correctIndex: 0, explanation: "start crying." } 
      },
      { 
        pv: "Break in", trope: "The Abrupt Interruption", cefr: "B2", icon: MessageCircle, 
        meaning: "To suddenly interrupt a conversation or an ongoing situation.", 
        meaningJP: "（会話などに）割り込む、口を挟む", 
        example: "I'm so sorry to break in, but you all need to look at this!", 
        exampleJP: "話を遮って（割り込んで）本当に申し訳ないんだけど、みんなこれを見る必要があるよ！",
        vibes: ["Jumping eagerly into a group chat", "Delivering shocking, sudden news", "An urgent, somewhat rude interruption"], 
        vibesJP: ["グループチャットに熱心に飛び込む", "衝撃的で突然のニュースを伝える", "緊急の、いくらか無礼な割り込み"],
        storyline: "The study group was deeply focused, quietly and seriously debating a complex math problem. Suddenly, Leo slammed the door open, completely breathless. 'Sorry to break in on your boring convo,' he yelled, waving his phone, 'but did you guys see the insane new game trailer?!'", 
        storylineJP: "勉強会は深く集中し、複雑な数学の問題を静かに真剣に議論していた。突然、レオが息を切らしてドアをバンと開けた。「つまんない会話に割り込んで悪いけど」と彼はスマホを振り回しながら叫んだ。「お前ら、あのヤバい新作ゲームの予告編見た？！」", 
        quiz: { question: "He rudely ___ the highly sensitive meeting to loudly announce his personal achievement.", options: ["broke in", "broke out", "brought back"], correctIndex: 0, explanation: "interrupt." } 
      },
      { 
        pv: "Break in", trope: "The Painful New Shoes", cefr: "B2", icon: Footprints, 
        meaning: "To wear or use something new carefully until it becomes comfortable.", 
        meaningJP: "（靴などを）履き慣らす、使い慣らす", 
        example: "I badly need to break in these incredibly stiff sneakers.", 
        exampleJP: "この信じられないほど硬いスニーカーを、どうしても履き慣らす必要がある。",
        vibes: ["Prepping for a massive music festival", "Dealing with painful, bleeding blisters", "Wearing shoes strictly around the house"], 
        vibesJP: ["大規模な音楽フェスの準備", "痛くて血の出る靴擦れに対処する", "家の中だけで靴を履く"],
        storyline: "Mika bought a stunning, but incredibly stiff, pair of leather boots for the upcoming three-day music festival. Knowing the sheer agony of foot blisters, she painfully spent a whole week wearing them around her small apartment just to thoroughly break them in.", 
        storylineJP: "ミカは、迫り来る3日間の音楽フェスのために、素晴らしいが信じられないほど硬い革のブーツを買った。靴擦れの純粋な激痛を知っている彼女は、ただ徹底的にブーツを履き慣らすためだけに、狭いアパートの中で丸1週間、痛みに耐えながらそれを履き続けた。", 
        quiz: { question: "Make absolutely sure you ___ the new leather hiking boots before the long mountain trek.", options: ["break in", "break off", "bring down"], correctIndex: 0, explanation: "use new item." } 
      },
      { 
        pv: "Break off", trope: "The Sudden Split", cefr: "B2", icon: XCircle, 
        meaning: "To suddenly end a relationship, agreement, or ongoing discussion.", 
        meaningJP: "（関係や交渉を）絶つ、解消する", 
        example: "They shockingly decided to break off their highly publicized engagement.", 
        exampleJP: "彼らは衝撃的にも、大々的に報じられた婚約を解消する（関係を絶つ）ことを決断した。",
        vibes: ["Spilling tea about a harsh breakup", "A dramatic, incredibly sudden split", "Ending a deeply toxic relationship"], 
        vibesJP: ["ひどい破局についてのゴシップをこぼす", "ドラマチックで信じられないほど突然の別れ", "深く有毒な関係を終わらせる"],
        storyline: "The famous celebrity couple seemed perfectly happy and were openly planning a massive, lavish summer wedding. But after a completely explosive argument in a crowded public restaurant, they shockingly decided to break off their engagement, sending the internet into an absolute frenzy.", 
        storylineJP: "その有名なセレブカップルは完璧に幸せそうで、大規模で豪華な夏の結婚式を公に計画していた。しかし、混雑した公共のレストランでの完全に爆発的な大喧嘩の後、彼らは衝撃的にも婚約を解消する（関係を絶つ）ことを決断し、ネット上を絶対的な熱狂の渦に巻き込んだ。", 
        quiz: { question: "Following the incredibly bitter dispute, the two allied countries entirely ___ the peace talks.", options: ["broke off", "broke out", "brought off"], correctIndex: 0, explanation: "end relationship." } 
      },
      { 
        pv: "Break out", trope: "The Sensitive Skin Disaster", cefr: "B2", icon: AlertTriangle, 
        meaning: "To suddenly develop skin sores, spots, or a painful irritation.", 
        meaningJP: "（吹き出物や発疹が）突然出る", 
        example: "I will instantly break out in a harsh, stinging rash.", 
        exampleJP: "私はすぐに、ひどくヒリヒリする発疹が出てしまう。",
        vibes: ["Discussing severe skin sensitivity", "A terribly bad skin day before an event", "Allergic reactions to new products"], 
        vibesJP: ["ひどい敏感肌について話し合う", "イベント前の最悪な肌のコンディション", "新製品に対するアレルギー反応"],
        storyline: "Kaito's skin was notoriously sensitive. He carelessly borrowed a cheap, heavily perfumed laundry detergent from a friend, and the very next morning, his face and arms began to intensely break out in a harsh, painfully itchy red rash right before his big date.", 
        storylineJP: "海斗の肌は敏感なことで有名だった。彼は不注意にも、友人から安くて香料の強い洗濯洗剤を借りたが、まさに次の日の朝、大事なデートの直前に、彼の顔と腕は激しく痛痒い真っ赤な発疹がひどく出始め（吹き出し）た。", 
        quiz: { question: "If I eat fresh strawberries, I instantly ___ in incredibly itchy, painful red spots.", options: ["break out", "break up", "bring about"], correctIndex: 0, explanation: "develop sores." } 
      },
      { 
        pv: "Break out of", trope: "The Routine Escape", cefr: "B2", icon: Wind, 
        meaning: "To escape from a physical place or a boring, highly restrictive situation.", 
        meaningJP: "（退屈な日常や牢獄から）抜け出す、脱走する", 
        example: "I desperately need to break out of this dull, endless routine.", 
        exampleJP: "私はこの退屈で終わりのないルーティンから、死に物狂いで抜け出す必要がある。",
        vibes: ["Escaping a boring, highly repetitive life", "A deep, burning desire for wild travel", "Intense prison break energy"], 
        vibesJP: ["退屈で高度に反復的な生活から逃れる", "ワイルドな旅行への深く燃えるような欲望", "強烈な脱獄のエネルギー"],
        storyline: "Every single day was completely identical: wake up, study, eat, sleep. Staring blankly at his dull, gray bedroom wall, Sora felt like he was suffocating. 'I desperately need to break out of this mind-numbing routine and travel somewhere completely unknown,' he muttered.", 
        storylineJP: "毎日が完全に同じだった。起きて、勉強して、食べて、寝る。退屈で灰色の自室の壁をぼんやり見つめながら、ソラは窒息しそうだった。「この思考を麻痺させるようなルーティンから死に物狂いで抜け出して、全く見知らぬどこかへ旅に出なきゃ」と彼は呟いた。", 
        quiz: { question: "The clever, desperate prisoner managed to mysteriously ___ the maximum-security facility.", options: ["break out of", "break away", "bring along"], correctIndex: 0, explanation: "escape." } 
      },
      { 
        pv: "Break up", trope: "The Tragic Misunderstanding", cefr: "A2", icon: XCircle, 
        meaning: "To completely finish a romantic relationship.", 
        meaningJP: "（恋人と）別れる、関係を完全に終わらせる", 
        example: "I heard a crazy rumor that they brutally broke up.", 
        exampleJP: "彼らが残酷な別れ方をしたというクレイジーな噂を聞いたよ。",
        vibes: ["Gossiping about exes in the group chat", "Intense, tearful relationship drama", "A sad, shocking ending to a romance"], 
        vibesJP: ["グループチャットで元恋人の噂話をする", "強烈で涙を誘う恋愛ドラマ", "ロマンスの悲しくて衝撃的な結末"],
        storyline: "They had been the absolute, undeniable 'it couple' of the school for three perfect years. But Monday morning, the group chat was flooded with shocked messages. I heard they finally broke up because of a tiny, stupid misunderstanding that blew completely out of proportion.", 
        storylineJP: "彼らは3年間、学校で絶対的かつ誰もが認める「憧れのカップル」だった。しかし月曜の朝、グループチャットはショックを受けたメッセージで溢れ返った。完全に尾ひれがついて大きくなった、ささいで馬鹿げた誤解のせいで、彼らはついに別れたらしい。", 
        quiz: { question: "After a complex decade of marriage, the famous actors sadly decided to definitively ___.", options: ["break up", "break down", "bring around"], correctIndex: 0, explanation: "finish relationship." } 
      },
      { 
        pv: "Break up", trope: "The Bad Signal Glitch", cefr: "B2", icon: CloudOff, 
        meaning: "To become completely inaudible over a phone or radio due to a bad signal.", 
        meaningJP: "（電話などの音声が）途切れる、ひどく乱れる", 
        example: "Wait, stop, you're badly breaking up; I can't hear a thing you're saying.", 
        exampleJP: "待って、止まって、声がひどく途切れてるよ。あなたが言ってること、全く聞こえない。",
        vibes: ["A glitchy, horribly lagging Zoom call", "A terrible, disconnected cell phone signal", "Extremely frustrating tech issues"], 
        vibesJP: ["バグが多く、ひどく遅延するZoom通話", "ひどく切断される携帯の電波", "極度にイライラする技術的な問題"],
        storyline: "Hina was in the middle of emotionally pouring her heart out over the phone, confessing her true feelings. But Kaito was driving through a long, dark tunnel. 'Wait, wait, you're breaking up! I can't hear a single word! I'll call you back!' he yelled desperately.", 
        storylineJP: "ヒナは電話越しに感情的に心を打ち明け、本当の気持ちを告白している最中だった。しかし海斗は長く暗いトンネルの中を運転していた。「待って、待って、声がひどく途切れてる！一言も聞こえない！後でかけ直す！」彼は必死に叫んだ。", 
        quiz: { question: "The vital emergency radio transmission is severely ___ due to the heavy, interference-filled storm.", options: ["breaking up", "breaking in", "bringing up"], correctIndex: 0, explanation: "inaudible signal." } 
      },
      { 
        pv: "Breeze through", trope: "The Academic Flex", cefr: "C1", icon: Wind, 
        meaning: "To pass a test or complete a difficult task very easily and with extreme confidence.", 
        meaningJP: "（難題を）涼しい顔で（楽々と）やり遂げる", 
        example: "I literally breezed through the complex math test without breaking a sweat.", 
        exampleJP: "文字通り、全く汗をかくことなく、複雑な数学のテストを涼しい顔でやり遂げたよ。",
        vibes: ["Bragging loudly about a high score", "A task feeling effortlessly, surprisingly easy", "The sweet reward of actual studying"], 
        vibesJP: ["高得点を大声で自慢する", "驚くほど簡単に感じるタスク", "実際に勉強したことの甘い報酬"],
        storyline: "Everyone else in the class was sweating and trembling over the impossibly difficult calculus final. But for once in his life, Leo had studied for two weeks straight. He smiled smugly, grabbed his pencil, and literally breezed through the entire test in half the allotted time.", 
        storylineJP: "クラスの他の全員が、不可能なほど難しい微積分の期末試験に汗をかき、震えていた。しかしレオは人生で初めて、2週間ぶっ通しで勉強していた。彼は得意げに微笑み、鉛筆を握ると、文字通り半分の時間でテスト全体を涼しい顔で（楽々と）やり遂げた。", 
        quiz: { question: "Because she practiced meticulously every single day, she completely ___ the intense final exam.", options: ["breezed through", "broke through", "brought through"], correctIndex: 0, explanation: "pass easily." } 
      },
      { 
        pv: "Brighten up", trope: "The Golden Retriever Energy", cefr: "B1", icon: Sun, 
        meaning: "To suddenly become much happier or to make a place significantly more cheerful.", 
        meaningJP: "（表情や雰囲気が）パッと明るくなる", 
        example: "The grim, depressing mood instantly brightened up.", 
        exampleJP: "陰惨で憂鬱な雰囲気が、瞬時にパッと明るくなった。",
        vibes: ["Radiating happy, pure golden energy", "Changing the entire vibe of a dark room", "A sudden, incredibly warm smile"], 
        vibesJP: ["幸せで純粋な黄金のエネルギーを放つ", "暗い部屋の雰囲気を一変させる", "突然の、信じられないほど温かい笑顔"],
        storyline: "The hospital waiting room was filled with a heavy, deeply grim silence as everyone worried. But the very second little five-year-old Hina walked in carrying a bright yellow balloon and giggling loudly, the entire somber mood of the room instantly brightened up.", 
        storylineJP: "皆が深く心配し、病院の待合室は重く沈鬱な沈黙に包まれていた。しかし、5歳の小さなヒナが鮮やかな黄色い風船を持ち、大声でくすくす笑いながら入ってきたまさにその瞬間、部屋全体の陰気な雰囲気がパッと明るくなった。", 
        quiz: { question: "The dark, threatening gray sky miraculously ___ immediately after the fierce storm passed.", options: ["brightened up", "breezed through", "broke up"], correctIndex: 0, explanation: "become happier." } 
      },
      { 
        pv: "Bring about", trope: "The Student Revolution", cefr: "B2", icon: Zap, 
        meaning: "To make a significant change or major event happen.", 
        meaningJP: "（大きな変化や結果を）もたらす、引き起こす", 
        example: "We’re trying to urgently bring about real, tangible change.", 
        exampleJP: "私たちは至急、現実的で具体的な変化をもたらそうとしている。",
        vibes: ["Fierce, organized student activism", "Sparking a major, historical difference", "Loudly demanding new, better policies"], 
        vibesJP: ["激しく組織的な学生の活動", "大きな歴史的変化を引き起こす", "新しいより良い政策を大声で要求する"],
        storyline: "The school cafeteria was notorious for its terrible, unhealthy food and massive plastic waste. A passionate group of students formed a committee, tirelessly protesting and petitioning the principal, desperately trying to bring about a real, lasting change in the strict school policy.", 
        storylineJP: "学校の食堂は、ひどく不健康な食事と大量のプラスチックゴミで悪名高かった。情熱的な生徒たちのグループが委員会を結成し、校長に絶え間なく抗議と嘆願を行い、厳格な学校の方針に、真の永続的な変化をもたらそう（引き起こそう）と必死に努力した。", 
        quiz: { question: "The brilliant new young leader hopes to clearly ___ a massive, unprecedented cultural revolution.", options: ["bring about", "bring along", "bring back"], correctIndex: 0, explanation: "make happen." } 
      },
      { 
        pv: "Bring along", trope: "The Party Plus-One", cefr: "A2", icon: Users, 
        meaning: "To bring someone or something with you to a specific place or social event.", 
        meaningJP: "（人や物を）一緒に連れて行く、持ってくる", 
        example: "Can I please bring my bestie along to the exclusive party?", 
        exampleJP: "その限定のパーティーに、私の親友を一緒に連れて行ってもいいですか？",
        vibes: ["Asking for a party 'plus one'", "Inviting nervous friends to an event", "Not wanting to go completely alone"], 
        vibesJP: ["パーティーの同伴者を頼む", "緊張している友人をイベントに誘う", "絶対に一人では行きたくない"],
        storyline: "Mika received a glittering gold invitation to the most exclusive, high-society party of the year. Terrified of walking into a room full of wealthy strangers by herself, she quickly texted the host, pleading, 'Can I please bring my socially-awkward bestie along?'", 
        storylineJP: "ミカは、今年最もエクスクルーシブな上流階級のパーティへの、キラキラ輝く金の招待状を受け取った。裕福な見知らぬ人だらけの部屋に一人で入ることに怯えた彼女は、すぐに主催者にメッセージを送り、「どうか、コミュ障の親友を一緒に連れて行ってもいいですか？」と懇願した。", 
        quiz: { question: "Whenever you go to the scorching beach, make absolutely sure to ___ enough sunscreen.", options: ["bring along", "bring down", "bring off"], correctIndex: 0, explanation: "bring someone." } 
      },
      { 
        pv: "Bring around", trope: "The Ultimate Persuasion", cefr: "C1", icon: MessageCircle, 
        meaning: "To successfully persuade or convince someone to agree with your controversial idea.", 
        meaningJP: "（人を説得して）意見を変えさせる、完全に納得させる", 
        example: "I finally brought my incredibly strict parents around.", 
        exampleJP: "ついに信じられないほど厳格な両親を説得して意見を変えさせた。",
        vibes: ["Convincing intensely stubborn people", "Winning a difficult, long argument", "Successfully sharing your unique vision"], 
        vibesJP: ["極度に頑固な人を説得する", "困難で長い議論に勝つ", "独自のビジョンをうまく共有する"],
        storyline: "Sora's parents were completely, fundamentally opposed to him dying his hair bright electric blue. But after weeks of making detailed PowerPoint presentations and promising perfect grades, he miraculously brought them around to letting him do it.", 
        storylineJP: "ソラの両親は、彼が髪を鮮やかなエレクトリックブルーに染めることに、根本から完全に反対していた。しかし、何週間にもわたって詳細なPowerPointでプレゼンをし、完璧な成績を約束した後、彼は奇跡的にも彼らを説得して（意見を変えさせて）、髪を染める許可を得た。", 
        quiz: { question: "It took hours of intense debate, but I will eventually ___ him ___ to my progressive side.", options: ["bring / around", "break / off", "box / in"], correctIndex: 0, explanation: "persuade." } 
      },
      { 
        pv: "Bring back", trope: "The Core Memory Nostalgia", cefr: "B1", icon: Clock, 
        meaning: "To cause someone to intensely remember something from the distant past.", 
        meaningJP: "（記憶などを）思い出させる、鮮やかに呼び覚ます", 
        example: "This old, familiar scent brings back so many core memories.", 
        exampleJP: "この古くて馴染みのある香りは、たくさんの大切な記憶（コアメモリー）を鮮やかに呼び覚ます。",
        vibes: ["Deep, highly emotional nostalgia", "Listening to forgotten childhood music", "Looking at old, faded, happy photos"], 
        vibesJP: ["深く、非常に感情的なノスタルジア", "忘れられていた子供時代の音楽を聴く", "古く色あせた幸せな写真を見る"],
        storyline: "While cleaning out the dusty attic, Ken found his battered old acoustic guitar. Plucking a single, out-of-tune rusty string, the sound instantly brought back a massive flood of warm, bittersweet core memories from his chaotic middle school days.", 
        storylineJP: "埃っぽい屋根裏部屋を掃除している時、ケンはボロボロになった古いアコースティックギターを見つけた。チューニングの狂った錆びた弦を一本弾くと、その音は瞬時に、彼のカオスだった中学時代の温かくもほろ苦い大切な記憶（コアメモリー）の巨大な洪水を呼び覚ました（思い出させた）。", 
        quiz: { question: "Looking at this deeply faded photograph vividly ___ memories of my incredibly happy youth.", options: ["brings back", "brings down", "brings forward"], correctIndex: 0, explanation: "cause to remember." } 
      },
      { 
        pv: "Bring down", trope: "The Black Friday Waiting Game", cefr: "B2", icon: TrendingDown, 
        meaning: "To make the price or level of something significantly cheaper or lower.", 
        meaningJP: "（価格やレベルを）下げる、大きく引き下げる", 
        example: "I'm waiting for the big seasonal sales to bring the price down.", 
        exampleJP: "大規模な季節のセールで価格が下がるのを待っている。",
        vibes: ["Waiting for massive shopping sales", "Hunting for extreme, rare discounts", "Planning a major, expensive purchase"], 
        vibesJP: ["大規模なショッピングセールを待つ", "極端でレアな割引を狙う", "大規模で高価な買い物を計画する"],
        storyline: "Mika had been utterly obsessed with the shiny new iPad Pro for months, but it was heavily gatekept by its astronomical price tag. She refused to buy it, patiently waiting like a sniper for the Black Friday sales to finally bring the price down to reality.", 
        storylineJP: "ミカは何ヶ月もピカピカの新しいiPad Proの完全な虜になっていたが、その天文学的な価格設定によって厳重に阻まれていた。彼女は決して買わず、まるでスナイパーのように忍耐強く、ブラックフライデーのセールがついにその価格を現実的なレベルまで引き下げるのを待っていた。", 
        quiz: { question: "The government took highly drastic measures in an attempt to ___ the soaring cost of living.", options: ["bring down", "bring off", "bring about"], correctIndex: 0, explanation: "make cheaper." } 
      },
      { 
        pv: "Bring forward", trope: "The Sudden Deadline Panic", cefr: "B2", icon: Calendar, 
        meaning: "To change the schedule so that an event happens much earlier than originally planned.", 
        meaningJP: "（予定や期日を）前倒しにする、急に早める", 
        example: "The cruel professor mercilessly brought the deadline forward.", 
        exampleJP: "残酷な教授は無慈悲にも締め切りを前倒しした。",
        vibes: ["Extreme stress over schedule changes", "A sudden, unfair deadline shift", "Total, sleepless classroom panic"], 
        vibesJP: ["スケジュール変更に対する極度のストレス", "突然の不公平な締め切りの変更", "クラスの完全に眠れないパニック"],
        storyline: "The massive, 50-page group project was initially due on a comfortable Monday. But without warning, the ruthless professor sent a midnight email, stating he had brought the deadline forward to Friday. The entire class erupted into a state of sheer, sleepless panic.", 
        storylineJP: "巨大な50ページのグループプロジェクトは、当初は余裕のある月曜日が締め切りだった。しかし無慈悲な教授は予告なしに深夜にメールを送り、締め切りを金曜日に前倒ししたと宣言した。クラス全体が、純粋な、眠れないパニック状態に陥った。", 
        quiz: { question: "Due to the impending, dangerous storm, the outdoor meeting was unexpectedly ___.", options: ["brought forward", "brought along", "brought back"], correctIndex: 0, explanation: "make happen earlier." } 
      },
      { 
        pv: "Bring off", trope: "The Impossible Win", cefr: "C1", icon: Award, 
        meaning: "To succeed in doing something extremely difficult or nearly impossible.", 
        meaningJP: "（困難なことを）見事にやり遂げる、奇跡的に成し遂げる", 
        example: "I didn't think I could bring off that dance, but I totally nailed it!", 
        exampleJP: "あのダンスを見事にやり遂げられるとは思っていなかったけど、完全に成功させたよ！",
        vibes: ["Celebrating a massive, hard-fought win", "Conquering a near-impossible challenge", "Absolute relief after intense pressure"], 
        vibesJP: ["大規模な苦戦の勝利を祝う", "ほぼ不可能な挑戦を克服する", "強烈なプレッシャーの後の絶対的な安堵"],
        storyline: "The acrobatic dance routine was notoriously brutal, involving a blindfolded backflip. Everyone heavily doubted she could do it without injury. But under the blinding stage lights, Hina didn't just survive; she managed to flawlessly bring it off, leaving the audience screaming in awe.", 
        storylineJP: "そのアクロバティックなダンスの振り付けは、目隠しでの後方宙返りを含む悪名高いほど過酷なものだった。誰もが彼女が怪我なくできるわけがないと強く疑っていた。しかし眩しいステージの照明の下、ヒナはただ生き延びただけでなく、それを見事に完璧にやり遂げ、観客を畏敬の念で絶叫させた。", 
        quiz: { question: "Against all logical odds, the determined underdog team ___ a miraculous, historic victory.", options: ["brought off", "breezed through", "broke out"], correctIndex: 0, explanation: "succeed with difficulty." } 
      }
    ],
   8: [
      { 
        pv: "Bring on", trope: "The Catalyst", cefr: "B2", icon: Zap, 
        meaning: "To cause something to happen or speed up the process.", 
        meaningJP: "（病気や事態などを）引き起こす、もたらす", 
        example: "Getting wet in the rain yesterday brought on my cold.", 
        exampleJP: "昨日雨に濡れたことが、私の風邪を引き起こした。",
        vibes: ["Triggering an event", "Sudden sickness", "Speeding things up"], 
        vibesJP: ["出来事の引き金になる", "突然の病気", "物事を加速させる"],
        storyline: "Sora refused to wear a warm jacket in the freezing snow. Unsurprisingly, the brutal weather brought on a terrible fever, leaving him completely stuck in bed for a week.", 
        storylineJP: "ソラは凍えるような雪の中で暖かいジャケットを着るのを拒否した。当然のことながら、その過酷な天候はひどい熱を引き起こし、彼は1週間完全にベッドから動けなくなった。", 
        quiz: { question: "The immense stress of the final exams unfortunately ___ a severe migraine.", options: ["brought on", "brought out", "brushed off"], correctIndex: 0, explanation: "to cause to happen." } 
      },
      { 
        pv: "Bring out", trope: "The Release Drop", cefr: "B1", icon: Sparkles, 
        meaning: "To release, publish, or make something available.", 
        meaningJP: "（作品や製品を）世に出す、発売する", 
        example: "The band are bringing out a new CD in the autumn.", 
        exampleJP: "そのバンドは秋に新しいCDを発売する（世に出す）予定だ。",
        vibes: ["Music drops", "Publishing content", "Making it public"], 
        vibesJP: ["音楽のリリース", "コンテンツの出版", "公にする"],
        storyline: "After hiding in the studio for two years, the legendary indie band announced they are finally bringing out a brand new album this autumn, sending fans into an absolute frenzy.", 
        storylineJP: "2年間スタジオに引きこもった後、その伝説のインディーズバンドは今秋ついに全く新しいアルバムを発売する（世に出す）と発表し、ファンを絶対的な熱狂の渦に巻き込んだ。", 
        quiz: { question: "The famous author is planning to ___ a thrilling new mystery novel next month.", options: ["bring out", "bring up", "buck up"], correctIndex: 0, explanation: "to publish or release." } 
      },
      { 
        pv: "Bring out in", trope: "The Allergy Panic", cefr: "B2", icon: AlertTriangle, 
        meaning: "To cause a health problem or reaction, like a rash.", 
        meaningJP: "（発疹などの症状を）引き起こす、出させる", 
        example: "It was the lobster that brought me out in this rash all over my body.", 
        exampleJP: "私の全身にこの発疹を引き起こしたのは、あのロブスターだった。",
        vibes: ["Allergic reactions", "Skin sensitivity", "Sudden health issues"], 
        vibesJP: ["アレルギー反応", "肌の敏感さ", "突然の健康問題"],
        storyline: "Kaito wanted to impress his date by ordering the most expensive seafood platter. But tragically, the rich lobster brought him out in a painfully itchy, bright red rash right in the middle of dinner.", 
        storylineJP: "海斗は最も高価なシーフードプラッターを注文してデート相手を感心させたかった。しかし悲劇的なことに、その濃厚なロブスターは、ディナーの真っ只中に彼の全身に痛痒く真っ赤な発疹を引き起こした。", 
        quiz: { question: "Touching that strange, poisonous plant immediately ___ her ___ in painful blisters.", options: ["brought / out in", "brought / round", "brushed / off"], correctIndex: 0, explanation: "to cause a skin reaction." } 
      },
      { 
        pv: "Bring round / to", trope: "The Recovery", cefr: "C1", icon: Activity, 
        meaning: "To make someone wake up from unconsciousness or an anaesthetic.", 
        meaningJP: "意識を回復させる、目を覚まさせる", 
        example: "The doctors brought him round a few hours after the operation.", 
        exampleJP: "医師たちは手術の数時間後に彼の意識を回復させた。",
        vibes: ["Medical recovery", "Waking up", "Regaining senses"], 
        vibesJP: ["医学的な回復", "目を覚ます", "意識を取り戻す"],
        storyline: "The surgery had been incredibly long and complex. The worried family paced the waiting room until the skilled doctors successfully brought him round and confirmed he was perfectly safe.", 
        storylineJP: "手術は信じられないほど長く複雑だった。心配する家族が待合室をうろうろしていると、熟練した医師たちが無事に彼の意識を回復させ、彼が完全に無事であることを確認した。", 
        quiz: { question: "After the boxer collapsed, the referee urgently called the medics to ___ him ___.", options: ["bring / round", "brush / up", "build / up"], correctIndex: 0, explanation: "to make conscious again." } 
      },
      { 
        pv: "Bring up", trope: "The Taboo Topic / Raising Kids", cefr: "B1", icon: MessageCircle, 
        meaning: "To mention a subject, OR to raise and educate a child.", 
        meaningJP: "話題を持ち出す、または子供を育てる", 
        example: "They didn't bring the subject up, even though she was brought up strictly.", 
        exampleJP: "彼女が厳格に育てられたにもかかわらず、彼らはその話題を持ち出さなかった。",
        vibes: ["Dodging awkward topics", "Childhood lore", "Parenting styles"], 
        vibesJP: ["気まずい話題を避ける", "子供時代の言い伝え", "子育てのスタイル"],
        storyline: "Despite growing up in a chaotic city, Mika was incredibly polite. 'My parents brought me up to respect others,' she explained. However, nobody dared to bring up the recent scandal at dinner.", 
        storylineJP: "カオスな都会で育ったにもかかわらず、ミカは礼儀正しかった。「両親は他人を尊重するように私を育ててくれたの」と彼女は説明した。しかし、夕食の席で最近のスキャンダルの話題を持ち出す勇気のある者は誰もいなかった。", 
        quiz: { question: "Please do not ___ his recent embarrassing failure during the meeting.", options: ["bring up", "buckle down", "budge up"], correctIndex: 0, explanation: "to mention a topic." } 
      },
      { 
        pv: "Brush off / aside", trope: "The Hater Blocker", cefr: "B2", icon: Shield, 
        meaning: "To ignore, pay little attention to, or dismiss criticism.", 
        meaningJP: "（批判などを）無視する、軽くあしらう", 
        example: "The minister brushed off the criticism and brushed aside their concerns.", 
        exampleJP: "大臣はその批判を軽くあしらい、彼らの懸念を無視した。",
        vibes: ["Ignoring the haters", "Dodging negativity", "Staying focused"], 
        vibesJP: ["アンチを無視する", "ネガティビティを避ける", "集中を保つ"],
        storyline: "The aggressive reporters shouted harsh questions, trying to ruin her reputation. But the confident idol just smiled, smoothly brushed off the unfair criticism, and walked gracefully to her waiting car.", 
        storylineJP: "攻撃的な記者たちは厳しい質問を浴びせ、彼女の評判を落とそうとした。しかし自信に満ちたアイドルはただ微笑み、不当な批判をスマートに軽くあしらうと、待たせてある車へと優雅に歩いていった。", 
        quiz: { question: "Instead of getting angry, he simply ___ the rude insult and continued working.", options: ["brushed off", "brought on", "bucked up"], correctIndex: 0, explanation: "to ignore criticism." } 
      },
      { 
        pv: "Brush up", trope: "The Quick Study", cefr: "B1", icon: BookOpen, 
        meaning: "To improve a skill quickly, especially one you haven't used for a while.", 
        meaningJP: "（錆びついたスキルを）急いで磨き直す、復習する", 
        example: "She took a course to brush up her Spanish before she went travelling.", 
        exampleJP: "彼女は旅行に行く前に、スペイン語を磨き直す（復習する）ためのコースを受講した。",
        vibes: ["Last-minute study", "Skill refreshing", "Travel prep"], 
        vibesJP: ["直前の勉強", "スキルのリフレッシュ", "旅行の準備"],
        storyline: "Sora hadn't spoken a word of French since high school. With his sudden business trip to Paris looming, he aggressively used language apps every night to desperately brush up his rusty skills.", 
        storylineJP: "ソラは高校以来、フランス語を全く話していなかった。突然のパリへの出張が迫る中、彼は錆びついたスキルを必死に磨き直す（復習する）ため、毎晩アグレッシブに語学アプリを使った。", 
        quiz: { question: "I urgently need to ___ my coding skills before the major tech interview.", options: ["brush up", "bundle off", "burn down"], correctIndex: 0, explanation: "to improve a skill." } 
      },
      { 
        pv: "Bubble over", trope: "The Pure Joy", cefr: "C1", icon: Smile, 
        meaning: "To become very excited and full of positive emotion.", 
        meaningJP: "（興奮や喜びで）沸き返る、感情が溢れ出る", 
        example: "She bubbled over with joy when she heard her exam results.", 
        exampleJP: "試験の結果を聞いて、彼女は喜びで沸き返った（感情が溢れ出した）。",
        vibes: ["Golden retriever energy", "Overwhelming happiness", "Pure hype"], 
        vibesJP: ["ゴールデンレトリバーのようなエネルギー", "圧倒的な幸福感", "純粋な興奮"],
        storyline: "When the strict teacher finally handed back the impossibly difficult test, Hina saw a perfect score. She literally bubbled over with absolute joy, hugging everyone in the front row.", 
        storylineJP: "厳格な教師がついに不可能なほど難しいテストを返却した時、ヒナは満点のスコアを目にした。彼女は文字通り絶対的な喜びで沸き返り（感情が溢れ出し）、最前列の全員に抱きついた。", 
        quiz: { question: "The enthusiastic children ___ with excitement when the clown appeared.", options: ["bubbled over", "buckled under", "buffed up"], correctIndex: 0, explanation: "to become very excited." } 
      },
      { 
        pv: "Buck up", trope: "The Wake-Up Call", cefr: "B2", icon: Zap, 
        meaning: "To hurry, or to smarten up and improve your behaviour.", 
        meaningJP: "急ぐ、気を引き締める、態度を改める", 
        example: "You had better buck your ideas up, or you'll fail the course.", 
        exampleJP: "態度を改め（気を引き締め）た方がいい、さもないとこのコースを落第するぞ。",
        vibes: ["Getting serious", "Harsh motivation", "Speeding up"], 
        vibesJP: ["真剣になる", "厳しいモチベーション", "ペースを上げる"],
        storyline: "Leo was lazily playing games instead of studying for finals. His older sister snatched the controller away. 'Buck up your ideas right now,' she warned coldly, 'or you are going to completely fail this year.'", 
        storylineJP: "レオは期末試験の勉強をせずに怠惰にゲームをしていた。姉はコントローラーを奪い取った。「今すぐ気を引き締めなさい（態度を改めなさい）」と彼女は冷たく警告した。「さもないと、あんた今年完全に落第するわよ。」", 
        quiz: { question: "The coach yelled at the lazy players to ___ and start running faster.", options: ["buck up", "bug off", "bulk out"], correctIndex: 0, explanation: "to improve or hurry." } 
      },
      { 
        pv: "Bucket down", trope: "The Monsoon", cefr: "B1", icon: CloudOff, 
        meaning: "To rain extremely heavily.", 
        meaningJP: "（雨が）バケツをひっくり返したように降る、土砂降りになる", 
        example: "Take an umbrella; it's bucketing down.", 
        exampleJP: "傘を持っていきなさい。バケツをひっくり返したような土砂降りだよ。",
        vibes: ["Terrible weather", "Staying indoors", "Heavy rain"], 
        vibesJP: ["最悪の天気", "室内に留まる", "大雨"],
        storyline: "The clear blue sky suddenly turned pitch black. Within seconds, it was violently bucketing down, completely flooding the school courtyard and forcing everyone to run screaming inside.", 
        storylineJP: "澄み切った青空が突然真っ黒になった。数秒のうちに、暴力的にバケツをひっくり返したような土砂降りになり、学校の中庭は完全に水浸しになり、全員が悲鳴を上げながら屋内に逃げ込むことになった。", 
        quiz: { question: "We can't play the football match today because it is absolutely ___ outside.", options: ["bucketing down", "burning off", "bursting into"], correctIndex: 0, explanation: "to rain heavily." } 
      },
      { 
        pv: "Buckle down", trope: "The Academic Grind", cefr: "B2", icon: HardHat, 
        meaning: "To start working hard and applying yourself seriously.", 
        meaningJP: "本腰を入れる、真剣に取り組む", 
        example: "We had to buckle down and study for the exam.", 
        exampleJP: "私たちは本腰を入れて試験勉強をしなければならなかった。",
        vibes: ["Library lock-in", "Deep focus", "Exam prep"], 
        vibesJP: ["図書館にこもる", "深い集中", "試験準備"],
        storyline: "After weeks of endlessly goofing around and ignoring assignments, the terrifying final deadline was only two days away. Sora finally turned off his phone, grabbed his coffee, and decided to seriously buckle down.", 
        storylineJP: "何週間も果てしなくふざけて課題を無視した後、恐ろしい最終締め切りまでわずか2日となった。ソラはついにスマホの電源を切り、コーヒーを手に取り、真剣に本腰を入れる決心をした。", 
        quiz: { question: "Stop wasting time on social media and ___ to finish your important project.", options: ["buckle down", "build up", "bump into"], correctIndex: 0, explanation: "to start working hard." } 
      },
      { 
        pv: "Buckle under", trope: "The Surrender", cefr: "C1", icon: Undo2, 
        meaning: "To accept something unwillingly under immense pressure.", 
        meaningJP: "（重圧などに）屈する、負ける", 
        example: "They didn't like the ideas, but had to buckle under or face the sack.", 
        exampleJP: "彼らはそのアイデアを気に入らなかったが、圧力に屈するかクビになるかのどちらかだった。",
        vibes: ["Giving in", "Corporate pressure", "Losing the battle"], 
        vibesJP: ["降参する", "企業のプレッシャー", "戦いに負ける"],
        storyline: "The independent bookstore owners fiercely fought against the massive corporate buyout for months. But with mounting debts and aggressive lawyers, they finally had to buckle under the immense financial pressure and sell.", 
        storylineJP: "独立系書店のオーナーたちは、巨大企業による買収に対して何ヶ月も激しく戦った。しかし、膨れ上がる借金と攻撃的な弁護士を前に、彼らはついに計り知れない財政的重圧に屈し、売却せざるを得なかった。", 
        quiz: { question: "Despite the intense, threatening interrogation, the brave spy refused to ___.", options: ["buckle under", "bump off", "buy out"], correctIndex: 0, explanation: "to yield under pressure." } 
      },
      { 
        pv: "Buckle up", trope: "The Safety Check", cefr: "B1", icon: Lock, 
        meaning: "To fasten a seatbelt.", 
        meaningJP: "シートベルトを締める", 
        example: "We were told to buckle up before take-off.", 
        exampleJP: "離陸前にシートベルトを締めるように言われた。",
        vibes: ["Pre-flight checks", "Car safety", "Getting ready"], 
        vibesJP: ["飛行前のチェック", "車の安全性", "準備をする"],
        storyline: "The massive roller coaster slowly clicked to the top of the terrifying drop. 'Alright everyone, buckle up tight and hold on!' the operator announced over the crackling loudspeaker.", 
        storylineJP: "巨大なジェットコースターが、カチカチと音を立てて恐ろしい急降下の頂上へとゆっくり登っていった。「よしみんな、シートベルトをしっかり締めて、しっかり掴まれ！」と、係員がノイズ交じりのスピーカーでアナウンスした。", 
        quiz: { question: "The strict flight attendant told all passengers to safely ___ immediately.", options: ["buckle up", "budge up", "burn down"], correctIndex: 0, explanation: "to fasten a seatbelt." } 
      },
      { 
        pv: "Budge up", trope: "The Crowded Couch", cefr: "B2", icon: Users, 
        meaning: "To move to make space for someone else.", 
        meaningJP: "席を詰める、少し動く", 
        example: "We had to budge up to let the fourth person in the back of the car.", 
        exampleJP: "車の後部座席に4人目を入れるために、私たちは席を詰めなければならなかった。",
        vibes: ["Squeezing in", "Making room", "Crowded spaces"], 
        vibesJP: ["無理やり割り込む", "スペースを作る", "混雑した空間"],
        storyline: "The tiny booth at the diner was already completely packed with three friends. When Kaito arrived with the pizza, Mika sighed and told the others to urgently budge up so he could sit.", 
        storylineJP: "ダイナーの狭いボックス席は、すでに3人の友人で完全に満員だった。海斗がピザを持って到着すると、ミカはため息をつき、彼が座れるように至急席を詰めるよう他の皆に言った。", 
        quiz: { question: "Could you please ___ a little bit so I can sit on this extremely crowded bench?", options: ["budge up", "buff up", "bunk off"], correctIndex: 0, explanation: "to make space." } 
      },
      { 
        pv: "Buff up", trope: "The Polish", cefr: "C1", icon: Star, 
        meaning: "To clear, clean, make shine, or improve your knowledge quickly.", 
        meaningJP: "磨き上げる、（知識を）詰め込む", 
        example: "I buffed up on my grammar before the test.", 
        exampleJP: "テストの前に文法を磨き直した（詰め込んだ）。",
        vibes: ["Shining things up", "Quick revision", "Looking polished"], 
        vibesJP: ["ピカピカに磨く", "素早い復習", "洗練されて見える"],
        storyline: "The silver antique sword was covered in centuries of thick dirt. Ken spent an entire Sunday carefully buffing it up until the majestic blade reflected the sunlight perfectly.", 
        storylineJP: "銀のアンティークの剣は、何世紀分もの分厚い汚れに覆われていた。ケンは丸一日かけて慎重にそれを磨き上げ、その荘厳な刃が太陽の光を完璧に反射するまでにした。", 
        quiz: { question: "He used a soft, expensive cloth to completely ___ the shiny vintage car.", options: ["buff up", "bust up", "buy in"], correctIndex: 0, explanation: "to make shine or improve." } 
      },
      { 
        pv: "Bug off / out", trope: "The Slang Escape", cefr: "C1", icon: XCircle, 
        meaning: "To rudely tell someone to go away, or to leave a place in a hurry.", 
        meaningJP: "（失礼に）うせろ！、急いで逃げ出す", 
        example: "I told him to bug off, and then we bugged out before the cops arrived.", 
        exampleJP: "彼にうせろと言い放ち、警察が来る前に私たちは急いで逃げ出した。",
        vibes: ["Setting strict boundaries", "Fleeing the scene", "Rude dismissals"], 
        vibesJP: ["厳しい境界線を引く", "現場から逃走する", "無礼な拒絶"],
        storyline: "The scammer kept pushing fake watches into Sora's face. Sora firmly yelled, 'Bug off!' Just then, police sirens wailed, and the entire illegal street market panicked and bugged out in every direction.", 
        storylineJP: "詐欺師は偽物の時計をソラの顔に押し付け続けた。ソラはきっぱりと「うせろ！」と怒鳴った。その時、警察のサイレンが鳴り響き、違法なストリートマーケット全体がパニックになり、四方八方へ急いで逃げ出した。", 
        quiz: { question: "Annoyed by the persistent salesman, she angrily shouted for him to ___.", options: ["bug off", "buoy up", "butt in"], correctIndex: 0, explanation: "to tell someone to go away." } 
      },
      { 
        pv: "Build up", trope: "The Rising Tension", cefr: "B1", icon: TrendingUp, 
        meaning: "To increase, develop, or accumulate over time.", 
        meaningJP: "（徐々に）増える、高まる、築き上げる", 
        example: "Tension has been building up ever since the new law passed.", 
        exampleJP: "新しい法律が成立して以来、緊張が高まり続けている。",
        vibes: ["Growing stronger", "Accumulating wealth", "Mounting pressure"], 
        vibesJP: ["より強くなる", "富を蓄積する", "高まるプレッシャー"],
        storyline: "Sora started his streaming channel with zero viewers. By relentlessly posting quality content every single day, he slowly managed to build up an incredibly loyal, massive fanbase.", 
        storylineJP: "ソラは視聴者ゼロで配信チャンネルを始めた。毎日欠かさず質の高いコンテンツを投稿し続けることで、彼はゆっくりと、信じられないほど忠実で巨大なファンベースを築き上げることに成功した。", 
        quiz: { question: "Over the years, the successful company has ___ a legendary global reputation.", options: ["built up", "bumped off", "burned down"], correctIndex: 0, explanation: "to develop or increase." } 
      },
      { 
        pv: "Bulk out / up", trope: "The Muscle & Fluff", cefr: "B2", icon: PlusSquare, 
        meaning: "To gain weight/muscle, or to make something bigger/thicker (like an essay).", 
        meaningJP: "筋肉をつける、（量を）水増しする", 
        example: "He bulked up at the gym, while she bulked out her essay with quotes.", 
        exampleJP: "彼はジムで筋肉をつけ、彼女は引用でエッセイを水増しした。",
        vibes: ["Hitting the gym", "Padding the word count", "Getting bigger"], 
        vibesJP: ["ジムに通う", "文字数を水増しする", "体を大きくする"],
        storyline: "Ken bulked up by lifting weights daily. Meanwhile, Mika's history paper was hopelessly short, so she desperately bulked it out by adding massive, repetitive quotes.", 
        storylineJP: "ケンは毎日ウェイトを上げて筋肉をつけた（体を大きくした）。一方、ミカの歴史のレポートは絶望的に短かったので、彼女は巨大で反復的な引用を追加して必死に量を水増しした。", 
        quiz: { question: "The dedicated actor had to heavily ___ to play the superhero role.", options: ["bulk up", "buoy up", "buy into"], correctIndex: 0, explanation: "to gain muscle." } 
      },
      { 
        pv: "Bump into", trope: "The Accidental Reunion", cefr: "B1", icon: Users, 
        meaning: "To meet someone purely by chance.", 
        meaningJP: "ばったり出会う、偶然出会う", 
        example: "I bumped into Helen on the underground the other day.", 
        exampleJP: "先日、地下鉄でヘレンにばったり出会った。",
        vibes: ["Small world energy", "Unexpected faces", "Street encounters"], 
        vibesJP: ["世間は狭いという感覚", "予期せぬ顔ぶれ", "路上での出会い"],
        storyline: "Hina was traveling alone in completely crowded, chaotic New York City. While crossing Times Square, she amazingly bumped into her old childhood friend who moved away ten years ago.", 
        storylineJP: "ヒナは完全に混雑しカオスなニューヨークを一人で旅していた。タイムズスクエアを横断している時、彼女は驚くべきことに、10年前に引っ越した昔の幼馴染にばったり出会った。", 
        quiz: { question: "I couldn't believe it when I randomly ___ my strict boss at the rock concert.", options: ["bumped into", "burned out", "butted in"], correctIndex: 0, explanation: "to meet by chance." } 
      },
      { 
        pv: "Bump off", trope: "The Hitman", cefr: "C1", icon: XOctagon, 
        meaning: "To kill or murder someone.", 
        meaningJP: "（俗語で）殺す、消す", 
        example: "The drug dealer was bumped off by a rival gang.", 
        exampleJP: "その麻薬密売人はライバルのギャングに殺された（消された）。",
        vibes: ["Mafia movies", "Assassination plots", "Criminal underworld"], 
        vibesJP: ["マフィア映画", "暗殺計画", "犯罪の裏社会"],
        storyline: "The corrupt politician knew too many dangerous secrets about the criminal syndicate. Before he could testify in court, a mysterious sniper quietly bumped him off in the dead of night.", 
        storylineJP: "腐敗した政治家は、犯罪組織に関する危険な秘密を知りすぎていた。彼が法廷で証言する前に、謎の狙撃手が真夜中に彼を静かに暗殺した（消した）。", 
        quiz: { question: "The ruthless gangsters decided to brutally ___ the key witness.", options: ["bump off", "buy out", "buzz off"], correctIndex: 0, explanation: "to kill." } 
      },
      { 
        pv: "Bump up", trope: "The Inflation", cefr: "B2", icon: TrendingUp, 
        meaning: "To increase something, usually prices or amounts.", 
        meaningJP: "（価格や量を）引き上げる", 
        example: "They bump up the prices in the high season.", 
        exampleJP: "彼らはハイシーズンに価格を引き上げる。",
        vibes: ["Tourist traps", "Rising costs", "Making extra profit"], 
        vibesJP: ["観光客向けの罠", "コストの上昇", "追加の利益を出す"],
        storyline: "The small seaside town relied heavily on summer tourists. Knowing people had no other choice, the local restaurants maliciously bumped up the price of basic ice cream to ten dollars a scoop.", 
        storylineJP: "その小さな海辺の町は夏の観光客に大きく依存していた。人々に他に選択肢がないことを知り、地元のレストランは悪意を持って、普通のアイスクリームの価格を1スクープ10ドルに引き上げた。", 
        quiz: { question: "The greedy airline always manages to cleverly ___ the ticket prices during holidays.", options: ["bump up", "burn off", "butter up"], correctIndex: 0, explanation: "to increase." } 
      },
      { 
        pv: "Bundle off / out", trope: "The Forced Eviction", cefr: "C1", icon: Package, 
        meaning: "To send someone somewhere quickly, often without giving them a choice.", 
        meaningJP: "（人を）急いで送り出す、追い払う", 
        example: "He bundled the kids off to bed.", 
        exampleJP: "彼は子供たちを急いでベッドへ送り出した。",
        vibes: ["Strict parenting", "Rushing people away", "No time for arguments"], 
        vibesJP: ["厳格な子育て", "人を急がせる", "議論の余地なし"],
        storyline: "The highly dangerous storm was approaching faster than expected. The worried mother immediately grabbed her screaming children and hastily bundled them off to the safe underground shelter.", 
        storylineJP: "非常に危険な嵐が予想よりも早く接近していた。心配した母親は即座に叫ぶ子供たちを掴み、安全な地下シェルターへと慌ただしく急いで送り出した。", 
        quiz: { question: "To avoid the massive scandal, the embarrassed royal was quietly ___ to a foreign country.", options: ["bundled off", "bunked off", "buyed up"], correctIndex: 0, explanation: "to send someone away." } 
      },
      { 
        pv: "Bunk off", trope: "The Truant", cefr: "B2", icon: LogOut, 
        meaning: "To not go to school or work when you should; to play truant.", 
        meaningJP: "（学校や仕事を）サボる、ずる休みする", 
        example: "I used to bunk off school and go into town.", 
        exampleJP: "私はよく学校をサボって街へ出かけていた。",
        vibes: ["Skipping class", "Teenage rebellion", "Avoiding responsibility"], 
        vibesJP: ["授業をサボる", "10代の反抗", "責任逃れ"],
        storyline: "The math lecture was agonizingly boring, and the bright sunshine outside was calling to them. Leo and Ken decided to secretly bunk off, sneaking out the back gate to go to the arcade.", 
        storylineJP: "数学の講義は苦痛なほど退屈で、外の明るい日差しが彼らを呼んでいた。レオとケンは密かにサボることを決め、ゲームセンターに行くために裏門から忍び出た。", 
        quiz: { question: "If you constantly ___ work to go to the beach, you will get fired.", options: ["bunk off", "bust up", "buzz around"], correctIndex: 0, explanation: "to skip school or work." } 
      }
    ],

    9: [
      { 
        pv: "Buoy up", trope: "The Morale Boost", cefr: "C1", icon: Heart, 
        meaning: "To make someone feel more positive or keep them afloat.", 
        meaningJP: "元気づける、希望を持たせる、浮かせる", 
        example: "After so much criticism, the positive review buoyed him up.", 
        exampleJP: "あれほどの批判の後、肯定的なレビューが彼を元気づけた。",
        vibes: ["Lifting spirits", "A wave of relief", "Floating on good news"], 
        vibesJP: ["気分を上げる", "安堵の波", "良いニュースで浮かび上がる"],
        storyline: "Sora was utterly depressed after failing his first three college exams. But a surprisingly encouraging, supportive email from his strict professor truly buoyed him up, giving him the hope to try again.", 
        storylineJP: "ソラは最初の3つの大学の試験に落ちて完全に落ち込んでいた。しかし、厳格な教授からの驚くほど励まされる、支援的なメールが彼を本当に元気づけ、再挑戦する希望を与えた。", 
        quiz: { question: "The incredibly generous donation totally ___ the struggling charity ___.", options: ["buoyed / up", "burned / down", "called / off"], correctIndex: 0, explanation: "to make feel positive." } 
      },
      { 
        pv: "Burn down", trope: "The Ashes", cefr: "B1", icon: Flame, 
        meaning: "To destroy completely by fire.", 
        meaningJP: "全焼する、焼き尽くす", 
        example: "They had to completely rebuild the museum after the old one burned down.", 
        exampleJP: "古い博物館が全焼した後、彼らはそれを完全に再建しなければならなかった。",
        vibes: ["Tragic destruction", "Raging infernos", "Starting from ashes"], 
        vibesJP: ["悲劇的な破壊", "猛威を振るう業火", "灰からの出発"],
        storyline: "The ancient, beautiful wooden temple had stood proudly for four centuries. Tragically, a single lightning strike during the dry season caused it to completely burn down to the ground overnight.", 
        storylineJP: "古代の美しい木造寺院は4世紀にわたって誇らしげに建っていた。悲劇的なことに、乾季の一度の落雷が原因で、それは一晩で跡形もなく完全に全焼してしまった。", 
        quiz: { question: "The forgotten, abandoned warehouse mysteriously ___ in the middle of the night.", options: ["burned down", "bulked out", "bumped into"], correctIndex: 0, explanation: "to destroy by fire." } 
      },
      { 
        pv: "Burn off", trope: "The Calorie Killer", cefr: "B2", icon: Activity, 
        meaning: "To remove by burning or to expend energy/calories.", 
        meaningJP: "（カロリーなどを）燃焼させる、焼き払う", 
        example: "I burn off a lot of calories in the gym.", 
        exampleJP: "私はジムでたくさんのカロリーを燃焼させている。",
        vibes: ["Cardio workouts", "Sweating it out", "Removing excess"], 
        vibesJP: ["有酸素運動", "汗をかいて絞り出す", "余分なものを取り除く"],
        storyline: "Mika felt incredibly guilty after eating an entire family-sized pizza by herself. She immediately put on her running shoes and sprinted for ten miles, desperate to burn off the massive meal.", 
        storylineJP: "ミカはファミリーサイズのピザを一人で丸ごと食べてしまい、信じられないほどの罪悪感を感じた。彼女はすぐにランニングシューズを履き、その大量の食事を必死に燃焼させるために10マイルを全速力で走った。", 
        quiz: { question: "The intense, high-speed aerobics class will effectively help you ___ fat.", options: ["burn off", "butt out", "buy into"], correctIndex: 0, explanation: "to expend energy." } 
      },
      { 
        pv: "Burn out", trope: "The Hustle Exhaustion", cefr: "B2", icon: CloudOff, 
        meaning: "To lose enthusiasm and energy from overworking.", 
        meaningJP: "燃え尽きる、過労でダウンする", 
        example: "Jennie burnt out after ten years working as a futures broker and went to live in the country.", 
        exampleJP: "ジェニーは先物ブローカーとして10年間働いた後、完全に燃え尽きて田舎に引っ越した。",
        vibes: ["Toxic hustle culture", "Needing a break", "Mental exhaustion"], 
        vibesJP: ["有毒なハッスルカルチャー", "休息が必要", "精神的な疲労"],
        storyline: "Kaito worked eighty-hour weeks at the tech firm without a single holiday. After two years, his brilliant mind just stopped. He completely burned out, quit his job, and moved to a quiet farm.", 
        storylineJP: "海斗はテック企業で休日なしで週80時間働いた。2年後、彼の優秀な頭脳はただ停止した。彼は完全に燃え尽き、仕事を辞め、静かな農場に引っ越した。", 
        quiz: { question: "If you never, ever take a relaxing break, you will inevitably ___.", options: ["burn out", "burst into", "call out"], correctIndex: 0, explanation: "to exhaust from overwork." } 
      },
      { 
        pv: "Burst into / out", trope: "The Sudden Emotion", cefr: "B2", icon: Zap, 
        meaning: "To suddenly start doing something, like crying or laughing.", 
        meaningJP: "突然（泣き・笑い）出す", 
        example: "She burst into laughter when she heard the joke, and burst out crying later.", 
        exampleJP: "彼女はそのジョークを聞いて突然笑い出し、後になって突然泣き出した。",
        vibes: ["Unable to hold it in", "Explosive reactions", "Emotional swings"], 
        vibesJP: ["こらえきれない", "爆発的な反応", "感情の揺れ"],
        storyline: "The tense, dramatic scene had everyone holding their breath. Suddenly, the main character tripped on a banana peel, and the entire audience unexpectedly burst into massive laughter. However, the tragic ending made them burst out crying.", 
        storylineJP: "緊張感あるドラマチックなシーンで、全員が息を呑んでいた。突然主人公がバナナの皮でつまずき、観客全員が予想外に大爆笑し始めた（突然笑い出した）。しかし悲劇的な結末で彼らは突然泣き出した。", 
        quiz: { question: "Overwhelmed by the tragic news, the fragile man suddenly ___ tears.", options: ["burst into", "bust up", "buzz off"], correctIndex: 0, explanation: "to start suddenly." } 
      },
      { 
        pv: "Bust up", trope: "The Messy Split", cefr: "C1", icon: XCircle, 
        meaning: "To end a relationship, usually angrily or after arguing.", 
        meaningJP: "（激しく喧嘩して）別れる、破局する", 
        example: "They bust up after a row last night.", 
        exampleJP: "彼らは昨夜の口論の末に破局した（喧嘩別れした）。",
        vibes: ["Toxic breakups", "Shouting matches", "Ending it all"], 
        vibesJP: ["有毒な破局", "怒鳴り合い", "すべてを終わらせる"],
        storyline: "Kaito and Hina were the school's most famous, dramatic couple. After a terrifyingly loud argument in the cafeteria about a stolen phone charger, they finally completely bust up.", 
        storylineJP: "海斗とヒナは学校で最も有名でドラマチックなカップルだった。盗まれたスマホの充電器を巡る、カフェテリアでの恐ろしいほど大声での口論の後、彼らはついに完全に破局した（喧嘩別れした）。", 
        quiz: { question: "Following years of bitter resentment, the famous band finally ___ completely.", options: ["bust up", "butted in", "bought out"], correctIndex: 0, explanation: "to end a relationship angrily." } 
      },
      { 
        pv: "Butt in / out", trope: "The Boundary Enforcer", cefr: "B2", icon: Shield, 
        meaning: "To interrupt a conversation inappropriately (in), or to stop interfering (out).", 
        meaningJP: "割り込む（in）、首を突っ込まない（out）", 
        example: "She butted in on our chat, so I told her to butt out.", 
        exampleJP: "彼女が私たちの会話に割り込んできたので、干渉しないよう（首を突っ込まないよう）に言った。",
        vibes: ["Rude interruptions", "Setting boundaries", "Telling someone off"], 
        vibesJP: ["失礼な割り込み", "境界線を引く", "人に文句を言う"],
        storyline: "Sora was confessing his feelings when an annoying classmate butted in to ask about homework. Hina glared with pure ice in her eyes. 'This doesn't concern you. Just butt out!'", 
        storylineJP: "ソラが気持ちを告白していると、厄介なクラスメイトが宿題について聞くために完全に割り込んできた（butted in）。ヒナは純粋な氷のような目で睨みつけた。「これはあなたに関係ないわ。ただ干渉しないで（butt out）！」", 
        quiz: { question: "It is considered extremely rude to constantly ___ when adults are speaking.", options: ["butt in", "butter up", "call back"], correctIndex: 0, explanation: "to interrupt." } 
      },
      { 
        pv: "Butter up", trope: "The Flatterer", cefr: "B2", icon: Heart, 
        meaning: "To praise or flatter someone excessively to get something you want.", 
        meaningJP: "ごまをする、おだてる", 
        example: "I tried buttering my tutor up but she still wouldn't let me hand it in late.", 
        exampleJP: "チューターにごまをすってみたが、それでも彼女は提出の遅れを許してくれなかった。",
        vibes: ["Fake compliments", "Sucking up to the boss", "Trying to get favors"], 
        vibesJP: ["偽の褒め言葉", "上司に媚びへつらう", "優遇されようとする"],
        storyline: "Kaito desperately wanted the brand new, insanely expensive gaming console. He spent the entire week aggressively buttering up his parents, doing all the chores and complimenting his mother's cooking daily.", 
        storylineJP: "海斗は信じられないほど高価な新品のゲーム機を死に物狂いで欲しがっていた。彼は丸一週間、すべての家事をこなし、毎日母親の料理を褒めちぎることで、両親にアグレッシブにごまをすった。", 
        quiz: { question: "The sly employee is constantly ___ the manager ___ to get a promotion.", options: ["buttering / up", "buying / off", "calling / in"], correctIndex: 0, explanation: "to flatter excessively." } 
      },
      { 
        pv: "Buy in / up", trope: "The Stockpile Scalper", cefr: "B2", icon: ShoppingCart, 
        meaning: "To purchase in large quantities (in) or to buy all that is available (up).", 
        meaningJP: "大量に買い込む（in）、買い占める（up）", 
        example: "We bought in supplies, but the scalpers bought up all the rare tickets.", 
        exampleJP: "私たちは物資を大量に買い込んだが、転売ヤーが希少なチケットをすべて買い占めた。",
        vibes: ["Hoarding supplies", "Ticket scalpers", "Clearing the shelves"], 
        vibesJP: ["物資の買いだめ", "チケットの転売ヤー", "棚を空にする（買い占める）"],
        storyline: "Hearing rumors of a blizzard, the neighborhood bought in mountains of bread. Meanwhile, sophisticated bots mercilessly bought up the entire global stock of limited-edition sneakers within two seconds.", 
        storylineJP: "猛吹雪の噂を聞き、近隣住民はパンの山を大量に買い込んだ（bought in）。一方、高度なボットは2秒以内に限定版スニーカーの全世界の在庫を容赦なくすべて買い占めた（bought up）。", 
        quiz: { question: "Before the severe winter storm hit, the town completely ___ essential supplies.", options: ["bought in", "buzzed off", "carried on"], correctIndex: 0, explanation: "to purchase in quantity." } 
      },
      { 
        pv: "Buy into", trope: "The Skeptic", cefr: "C1", icon: Eye, 
        meaning: "To accept or believe an idea, claim, or theory.", 
        meaningJP: "（考えなどを）信じる、受け入れる", 
        example: "I never bought into the idea of a federalist European Union.", 
        exampleJP: "私は連邦主義的な欧州連合というアイデアを信じた（受け入れた）ことは一度もない。",
        vibes: ["Questioning the hype", "Believing the vision", "Conspiracy theories"], 
        vibesJP: ["誇大広告を疑う", "ビジョンを信じる", "陰謀論"],
        storyline: "The flashy speaker promised that his new crypto scheme would make everyone instant millionaires. While the crowd cheered, cautious Ken crossed his arms. 'I'm absolutely not buying into this obvious scam,' he muttered.", 
        storylineJP: "その派手な講演者は、彼の新しい仮想通貨スキームが全員を即座に億万長者にすると約束した。群衆が歓声を上げる中、慎重なケンは腕を組んだ。「こんな明らかな詐欺、絶対に信じない（受け入れない）ぞ」と彼は呟いた。", 
        quiz: { question: "Despite the massive advertising, the smart consumers didn't ___ the fake claims.", options: ["buy into", "buzz around", "call off"], correctIndex: 0, explanation: "to accept an idea." } 
      },
      { 
        pv: "Buy off", trope: "The Bribe", cefr: "C1", icon: DollarSign, 
        meaning: "To pay someone to stop them causing trouble or exposing a secret.", 
        meaningJP: "買収する、金で黙らせる", 
        example: "He bought the newspaper off by placing a lot of adverts.", 
        exampleJP: "彼は大量の広告を出すことで、その新聞社を買収した（金で黙らせた）。",
        vibes: ["Corrupt politicians", "Hush money", "Shady business"], 
        vibesJP: ["腐敗した政治家", "口止め料", "胡散臭いビジネス"],
        storyline: "The investigative journalist found undeniable proof of the massive corporate pollution. The desperate CEO invited her to a private dinner and offered her a million dollars to completely buy her off.", 
        storylineJP: "その調査ジャーナリストは、巨大企業の大規模な汚染の否定できない証拠を見つけた。絶望したCEOは彼女をプライベートなディナーに招待し、彼女を完全に買収する（金で黙らせる）ために100万ドルを提示した。", 
        quiz: { question: "The highly corrupt officials attempted to illegally ___ the honest judge.", options: ["buy off", "call out", "catch on"], correctIndex: 0, explanation: "to bribe someone." } 
      },
      { 
        pv: "Buy out", trope: "The Takeover", cefr: "B2", icon: Database, 
        meaning: "To buy somebody's share in a company to take full control.", 
        meaningJP: "（権利などを）買い取る、買収して完全所有する", 
        example: "His business partners bought him out to get rid of him.", 
        exampleJP: "彼のビジネスパートナーたちは、彼を追い出すために彼の株を買い取った。",
        vibes: ["Hostile takeovers", "Business strategy", "Securing total control"], 
        vibesJP: ["敵対的買収", "ビジネス戦略", "完全な支配権の確保"],
        storyline: "The two friends started the tiny app company together. But as it exploded in popularity, they argued constantly. Finally, the ruthless partner brutally bought out the other's share, taking total control of the empire.", 
        storylineJP: "2人の友人は小さなアプリ会社を一緒に始めた。しかし人気が爆発するにつれ、彼らは絶えず口論になった。ついに、冷酷なパートナーがもう一方のシェアを容赦なく買い取り、帝国の完全な支配権を握った。", 
        quiz: { question: "The giant global corporation aggressively decided to ___ the small rival startup.", options: ["buy out", "carry off", "cave in"], correctIndex: 0, explanation: "to purchase someone's share." } 
      },
      { 
        pv: "Buzz around / off", trope: "The Busy Exit", cefr: "B1", icon: Activity, 
        meaning: "To move quickly and busily around (around), or to leave quickly (off).", 
        meaningJP: "忙しく飛び回る（around）、急いで立ち去る（off）", 
        example: "Reporters were buzzing around, so the celebrity decided to buzz off.", 
        exampleJP: "記者たちが忙しく飛び回っていたので、そのセレブは急いで立ち去ることに決めた。",
        vibes: ["Frantic energy", "Leaving quickly", "A swarm of people"], 
        vibesJP: ["半狂乱のエネルギー", "急いで立ち去る", "人の群れ"],
        storyline: "Backstage was pure chaos, with frantic models and stressed makeup artists buzzing around like trapped bees. Finding the noise unbearable, Kaito grabbed his jacket and whispered, 'This is lame, I'm buzzing off right now.'", 
        storylineJP: "舞台裏は純粋なカオスで、半狂乱のモデルやメイク担当者が閉じ込められた蜂のように忙しく飛び回っていた（buzzing around）。騒音に耐えきれなくなった海斗はジャケットを掴み、「ここつまんないから、俺はもう立ち去るよ（buzzing off）」と囁いた。", 
        quiz: { question: "The nervous staff were rapidly ___ the kitchen trying to prepare the massive feast.", options: ["buzzing around", "buying into", "calling back"], correctIndex: 0, explanation: "to move busily." } 
      },
      { 
        pv: "Call after", trope: "The Namesake", cefr: "B1", icon: User, 
        meaning: "To give someone the same name as someone else.", 
        meaningJP: "～にちなんで名付ける", 
        example: "She was called Rose after her late grandmother.", 
        exampleJP: "彼女は亡き祖母にちなんでローズと名付けられた。",
        vibes: ["Family legacies", "Honoring ancestors", "Meaningful names"], 
        vibesJP: ["家族の遺産", "先祖を敬う", "意味のある名前"],
        storyline: "The legendary warrior saved the kingdom from total destruction but perished in the battle. Years later, every firstborn child in the capital city was proudly called after the great hero.", 
        storylineJP: "伝説の戦士は王国を完全な破壊から救ったが、その戦いで命を落とした。数年後、首都で最初に生まれた子供は皆、その偉大な英雄にちなんで誇らしげに名付けられた。", 
        quiz: { question: "The beautiful new library was officially ___ the generous billionaire donor.", options: ["called after", "chalked up to", "checked in"], correctIndex: 0, explanation: "to name in honor of." } 
      },
      { 
        pv: "Call back", trope: "The Missed Connection", cefr: "A1", icon: Smartphone, 
        meaning: "To return a phone call.", 
        meaningJP: "折り返し電話する", 
        example: "I must call her back when we get to the office.", 
        exampleJP: "オフィスに着いたら彼女に折り返し電話しなきゃ。",
        vibes: ["Leaving voicemails", "Phone tag", "Important messages"], 
        vibesJP: ["留守電を残す", "電話のすれ違い", "重要なメッセージ"],
        storyline: "Sora was in the middle of a terrifying boss fight when his phone rang. He glanced at the screen, saw it was his angry mother, and panicked. 'I'll just politely call her back later,' he thought, ignoring it.", 
        storylineJP: "ソラが恐ろしいボス戦の真っ最中だった時、彼の電話が鳴った。画面をちらりと見て、それが怒っている母親だとわかり、彼はパニックになった。「後で丁寧に折り返し電話しよう」と彼は考え、それを無視した。", 
        quiz: { question: "I am completely busy right now, but I promise to ___ you ___ in an hour.", options: ["call / back", "care / for", "catch / on"], correctIndex: 0, explanation: "to return a call." } 
      },
      { 
        pv: "Call for", trope: "The Demand", cefr: "B1", icon: AlertTriangle, 
        meaning: "To demand, require, or go collect something/someone.", 
        meaningJP: "～を要求する、必要とする、呼びに（取りに）行く", 
        example: "An emergency like this calls for some pretty drastic action.", 
        exampleJP: "このような緊急事態は、かなり思い切った行動を要求する（必要とする）。",
        vibes: ["Strict requirements", "Protesting for change", "Severe situations"], 
        vibesJP: ["厳しい要求", "変化を求めて抗議する", "深刻な状況"],
        storyline: "The massive, unprecedented economic crash devastated the country. The angry citizens flooded the streets, holding signs and relentlessly calling for the immediate resignation of the corrupt Prime Minister.", 
        storylineJP: "かつてない大規模な経済崩壊が国を壊滅させた。怒れる市民たちは通りに溢れ出し、プラカードを掲げ、腐敗した首相の即時辞任を容赦なく要求した。", 
        quiz: { question: "The extremely complex, delicate surgery definitely ___ highly specialized skills.", options: ["calls for", "carries off", "chases down"], correctIndex: 0, explanation: "to require." } 
      },
      { 
        pv: "Call in", trope: "The Expert", cefr: "B1", icon: UserPlus, 
        meaning: "To get someone to come and do a specific job or help.", 
        meaningJP: "（専門家などを）呼ぶ、招く", 
        example: "We had to call in a plumber because the sink was leaking.", 
        exampleJP: "シンクから水漏れしていたので、配管工を呼ばなければならなかった。",
        vibes: ["Calling for backup", "Technical support", "Fixing a disaster"], 
        vibesJP: ["応援を呼ぶ", "テクニカルサポート", "大惨事を修理する"],
        storyline: "The ancient, haunted mansion's plumbing completely exploded, flooding the entire first floor with dark water. Panic-stricken, the owners had to urgently call in an elite team of engineers to stop the disaster.", 
        storylineJP: "古代の幽霊屋敷の配管が完全に爆発し、1階全体が黒い水で水浸しになった。パニックに陥った所有者たちは、大惨事を止めるためにエリートエンジニアチームを至急呼ばなければならなかった。", 
        quiz: { question: "When the complex computer system crashed entirely, they had to quickly ___ a pro.", options: ["call in", "carry on", "cave in"], correctIndex: 0, explanation: "to summon for help." } 
      },
      { 
        pv: "Call off", trope: "The Cancellation", cefr: "B1", icon: XCircle, 
        meaning: "To cancel an event or agreement.", 
        meaningJP: "中止する、取り消す", 
        example: "The concert had to be called off because the singer went down with a bad case of flu.", 
        exampleJP: "歌手がひどいインフルエンザで倒れたため、コンサートは中止（取り消し）にせざるを得なかった。",
        vibes: ["Rain checks", "Ruined plans", "Sudden stops"], 
        vibesJP: ["延期", "台無しになった計画", "突然の中止"],
        storyline: "Hina had trained relentlessly for six months for the national marathon. But on the morning of the race, a devastating typhoon hit the coast, and the organizers tragically called off the entire massive event.", 
        storylineJP: "ヒナは全国マラソンのために6ヶ月間容赦なくトレーニングしてきた。しかしレース当日の朝、壊滅的な台風が海岸を直撃し、主催者は悲劇的にもその巨大なイベント全体を中止した。", 
        quiz: { question: "Due to the sudden, severe lack of necessary funding, they sadly ___ the project.", options: ["called off", "checked out", "cheated on"], correctIndex: 0, explanation: "to cancel." } 
      },
      { 
        pv: "Call on", trope: "The Spotlight", cefr: "B2", icon: Mic2, 
        meaning: "To ask someone to do something, especially to speak in public or to visit.", 
        meaningJP: "（発言などを）求める、指名する、訪問する", 
        example: "I now call on the other party to give their account of what happened.", 
        exampleJP: "それでは、何が起こったのかを説明するよう相手方に求めます（指名します）。",
        vibes: ["Being put on the spot", "Formal speeches", "Classroom dread"], 
        vibesJP: ["急に指名される", "公式なスピーチ", "教室での恐怖"],
        storyline: "Sora was secretly sleeping in the back row of the massive lecture hall. The strict professor noticed, smiled coldly, and suddenly called on him to deeply explain the most complex theory on the board.", 
        storylineJP: "ソラは巨大な講堂の最後列で密かに眠っていた。厳格な教授はそれに気づき、冷たく微笑むと、突然彼を指名して、黒板の最も複雑な理論を深く説明するよう求めた。", 
        quiz: { question: "The desperate charity firmly ___ the local community to kindly donate food.", options: ["called on", "carried out", "caught up"], correctIndex: 0, explanation: "to ask or appeal to." } 
      },
      { 
        pv: "Call out", trope: "The Exposure", cefr: "B2", icon: Angry, 
        meaning: "To expose or accuse someone of wrongdoing or incompetence.", 
        meaningJP: "公に非難する、暴露する", 
        example: "He called them out over awarding contracts to family members.", 
        exampleJP: "彼は家族に契約を与えていることについて、彼らを公に非難した（暴露した）。",
        vibes: ["Cancel culture", "Exposing the truth", "Brave accusations"], 
        vibesJP: ["キャンセルカルチャー", "真実を暴露する", "勇敢な告発"],
        storyline: "The famous influencer secretly edited all her fitness photos while claiming they were natural. A brave follower gathered undeniable proof and aggressively called her out on Twitter, destroying her fake empire.", 
        storylineJP: "その有名なインフルエンサーは、自然だと主張しながら密かにフィットネス写真をすべて加工していた。ある勇敢なフォロワーが否定できない証拠を集め、Twitter上でアグレッシブに彼女を公に非難（暴露）し、彼女の偽りの帝国を破壊した。", 
        quiz: { question: "The fearless investigative journalist publicly ___ the deeply corrupt politicians.", options: ["called out", "cashed in", "caved in"], correctIndex: 0, explanation: "to accuse publicly." } 
      }
    ],

    10: [
      { 
        pv: "Calm down", trope: "The Deep Breath", cefr: "A2", icon: Smile, 
        meaning: "To stop being angry or emotionally excited.", 
        meaningJP: "落ち着く、冷静になる", 
        example: "When I lose my temper, it takes ages for me to calm down again.", 
        exampleJP: "一度キレてしまうと、再び落ち着くまでに途方もない時間がかかる。",
        vibes: ["Diffusing a bomb", "Finding zen", "Stopping a panic"], 
        vibesJP: ["爆弾の信管を抜く", "禅の心を見つける", "パニックを止める"],
        storyline: "Mika was absolutely hyperventilating because she thought she had permanently lost her passport at the crowded airport. Kaito grabbed her shoulders gently. 'Mika, look at me. Just calm down. It's in your side pocket.'", 
        storylineJP: "ミカは混雑した空港でパスポートを永久に失ったと思い込み、完全に過呼吸になっていた。海斗は彼女の肩を優しく掴んだ。「ミカ、俺を見て。ただ落ち着いて。サイドポケットに入ってるよ。」", 
        quiz: { question: "Please try to slowly ___ and completely rationally explain what just happened.", options: ["calm down", "catch on", "chalk up"], correctIndex: 0, explanation: "to become less agitated." } 
      },
      { 
        pv: "Cancel out", trope: "The Equalizer", cefr: "B2", icon: X, 
        meaning: "To have an opposite effect on something, neutralizing it.", 
        meaningJP: "相殺する、帳消しにする", 
        example: "The airport taxes cancelled out the savings we had made on the flight tickets.", 
        exampleJP: "空港税が、私たちが航空券で節約した分を相殺してしまった。",
        vibes: ["Zero sum game", "Balancing the scales", "Wasted effort"], 
        vibesJP: ["ゼロサムゲーム", "天秤を釣り合わせる", "無駄な努力"],
        storyline: "Leo spent an agonizing three hours cleaning the entire kitchen until it sparkled. But ten minutes later, his chaotic dog ran in covered in thick, black mud, completely canceling out all his hard work instantly.", 
        storylineJP: "レオはキッチン全体が輝くまで、苦痛な3時間をかけて掃除した。しかし10分後、カオスな飼い犬が分厚い黒い泥まみれで走り込んできて、彼の懸命な努力を瞬時に完全に帳消しにした（相殺した）。", 
        quiz: { question: "The horrible, severe side effects entirely ___ the benefits of the new medicine.", options: ["cancelled out", "carried off", "chased down"], correctIndex: 0, explanation: "to neutralize." } 
      },
      { 
        pv: "Care for", trope: "The Polite Dislike", cefr: "B1", icon: Heart, 
        meaning: "To like something (usually used in the negative to express dislike).", 
        meaningJP: "（主に否定文で）好む、好ましく思う", 
        example: "I don't care for fizzy drinks; I prefer water.", 
        exampleJP: "炭酸飲料はあまり好まない。水の方が好きだ。",
        vibes: ["Polite rejection", "Having strict tastes", "Fancy preferences"], 
        vibesJP: ["礼儀正しい拒絶", "厳格な好みを持つ", "高級な好み"],
        storyline: "The wealthy, arrogant noble was offered a humble plate of traditional village stew. He wrinkled his nose in absolute disgust. 'Take this away immediately. I honestly do not care for peasant food,' he sneered.", 
        storylineJP: "裕福で傲慢な貴族は、伝統的な村のシチューの質素な皿を勧められた。彼は絶対的な嫌悪感で鼻にシワを寄せた。「今すぐこれを下げろ。私は正直、農民の食べ物など好まない」と彼は嘲笑した。", 
        quiz: { question: "To be completely honest, I really don't ___ his loud, aggressive modern art.", options: ["care for", "catch out", "cater for"], correctIndex: 0, explanation: "to like (often negative)." } 
      },
      { 
        pv: "Carried away", trope: "The Overreaction", cefr: "B2", icon: Zap, 
        meaning: "To get so emotional or excited that you lose control.", 
        meaningJP: "調子に乗る、我を忘れる", 
        example: "The team got carried away when they won the championship and started shouting.", 
        exampleJP: "チームは優勝した時に調子に乗り、大声で叫び始めた。",
        vibes: ["Losing control", "Going overboard", "Caught in the hype"], 
        vibesJP: ["コントロールを失う", "やりすぎる", "熱狂に巻き込まれる"],
        storyline: "It was supposed to be a simple, quiet birthday dinner. But surrounded by his friends and free drinks, Kaito got completely carried away, ending up singing karaoke on a table at three in the morning.", 
        storylineJP: "それはシンプルで静かな誕生日ディナーのはずだった。しかし友人たちと無料の飲み物に囲まれ、海斗は完全に我を忘れ（調子に乗り）、深夜3時にテーブルの上でカラオケを歌う羽目になった。", 
        quiz: { question: "Please don't get highly ___ and dangerously spend all your savings in one day.", options: ["carried away", "checked out", "cheered up"], correctIndex: 0, explanation: "to lose control from emotion." } 
      },
      { 
        pv: "Carry off", trope: "The Impossible Flex", cefr: "C1", icon: Award, 
        meaning: "To succeed in doing or winning something difficult.", 
        meaningJP: "（困難なことを）見事にやってのける、勝ち取る", 
        example: "She carried off the first prize in the competition.", 
        exampleJP: "彼女はそのコンテストで見事に一等賞を勝ち取った。",
        vibes: ["Securing the win", "Pulling it off", "A massive flex"], 
        vibesJP: ["勝利を確実にする", "やってのける", "とてつもない自慢（フレックス）"],
        storyline: "Wearing a bright neon pink suit to a highly formal, strict corporate event seemed like professional suicide. But Hina walked with such incredible, undeniable confidence that she actually carried it off perfectly, impressing the CEO.", 
        storylineJP: "非常にフォーマルで厳格な企業のイベントに鮮やかなネオンピンクのスーツを着ていくのは、職業的自殺のように思えた。しかしヒナは信じられないほど否定できない自信を持って歩き、実に見事にそれを着こなし（やってのけ）、CEOを感心させた。", 
        quiz: { question: "Despite the extreme pressure, the young, brave actor flawlessly ___ the complex role.", options: ["carried off", "cashed in", "chased up"], correctIndex: 0, explanation: "to succeed." } 
      },
      { 
        pv: "Carry on", trope: "The Stubborn March", cefr: "B1", icon: Play, 
        meaning: "To continue doing something despite difficulties or interruptions.", 
        meaningJP: "続ける、続行する", 
        example: "Carry on quietly with your work until the substitute teacher arrives.", 
        exampleJP: "代理の先生が来るまで、静かに自分の作業を続けなさい。",
        vibes: ["Keep calm", "Never giving up", "Endless grind"], 
        vibesJP: ["冷静を保つ", "決して諦めない", "終わりのない苦労"],
        storyline: "The power completely failed, plunging the massive concert hall into total darkness. But the brave acoustic guitarist simply smiled, strummed the strings, and boldly decided to carry on playing entirely unplugged.", 
        storylineJP: "電源が完全に落ち、巨大なコンサートホールは完全な暗闇に包まれた。しかし勇敢なアコースティックギタリストは単に微笑み、弦を弾き、完全にアンプなしで演奏を続ける（続行する）ことを大胆に決意した。", 
        quiz: { question: "Despite the harsh, freezing wind, the determined hikers stubbornly ___ walking.", options: ["carried on", "caught on", "checked in"], correctIndex: 0, explanation: "to continue." } 
      },
      { 
        pv: "Carry out", trope: "The Mission", cefr: "B1", icon: Target, 
        meaning: "To perform a task, order, or experiment.", 
        meaningJP: "実行する、遂行する", 
        example: "The government is carrying out tests on growing genetically modified crops.", 
        exampleJP: "政府は遺伝子組み換え作物の栽培に関するテストを実行している。",
        vibes: ["Executing orders", "Scientific research", "Getting it done"], 
        vibesJP: ["命令を実行する", "科学的研究", "やり遂げる"],
        storyline: "The secret agent received an encrypted, self-destructing message. His face turned completely pale as he realized the incredibly dangerous mission he was strictly ordered to carry out before midnight.", 
        storylineJP: "秘密工作員は暗号化された自動消滅メッセージを受け取った。真夜中までに実行（遂行）するよう厳命された、信じられないほど危険な任務を悟り、彼の顔は完全に青ざめた。", 
        quiz: { question: "The brilliant scientists successfully ___ a highly complex biological experiment.", options: ["carried out", "cast aside", "caved in"], correctIndex: 0, explanation: "to perform." } 
      },
      { 
        pv: "Cash in / out", trope: "The Payout", cefr: "B2", icon: DollarSign, 
        meaning: "To exchange something for money (in), or collect winnings to leave (out).", 
        meaningJP: "換金する（in）、精算して手を引く（out）", 
        example: "They cashed in their bonds, and he cashed out his poker chips.", 
        exampleJP: "彼らは債券を換金し、彼はポーカーのチップを精算して手を引いた。",
        vibes: ["Cashing out", "Taking the profit", "Securing the bag"], 
        vibesJP: ["現金化する", "利益を確定する", "大金を手にする"],
        storyline: "Sora gladly cashed in his rare, vintage comic books for a fortune. Meanwhile at the casino, Ken realized he had doubled his savings and wisely decided to cash out before his luck ran completely dry.", 
        storylineJP: "ソラは希少なビンテージコミックを喜んで大金に換金した（cashed in）。一方カジノでは、ケンが貯金を倍にしたことに気づき、運が完全に尽きる前に賢明にも精算して手を引く（cashed out）決断をした。", 
        quiz: { question: "He decided to ___ his poker chips and safely go home with the profit.", options: ["cash out", "call off", "carry on"], correctIndex: 0, explanation: "to exchange for money." } 
      },
      { 
        pv: "Cash in on", trope: "The Opportunist", cefr: "C1", icon: DollarSign, 
        meaning: "To benefit or make money on something, especially if done unfairly.", 
        meaningJP: "～に乗じて（不正に）儲ける、つけこむ", 
        example: "The opposition party is cashing in on the government's unpopularity.", 
        exampleJP: "野党は政府の不人気に乗じて利益を得ている（つけこんでいる）。",
        vibes: ["Taking advantage", "Making a quick buck", "Political strategy"], 
        vibesJP: ["つけこむ", "手っ取り早く稼ぐ", "政治的戦略"],
        storyline: "After the famous pop star was seen wearing a bizarre hat, countless cheap online stores immediately tried to cash in on the viral trend by selling terrible fakes.", 
        storylineJP: "有名なポップスターが奇妙な帽子を被っているのを目撃された後、無数の安っぽいオンラインショップがひどい偽物を売って、そのバズったトレンドに乗じて儲けようと即座に動いた。", 
        quiz: { question: "They are aggressively ___ the sudden hype surrounding the new movie.", options: ["cashing in on", "catching up on", "chasing down"], correctIndex: 0, explanation: "to benefit financially from a situation." } 
      },
      { 
        pv: "Cash up", trope: "The Closing Shift", cefr: "B1", icon: Calculator, 
        meaning: "To count all the money taken in a shop or business at the end of the day.", 
        meaningJP: "（閉店後に）レジの売上金を計算する", 
        example: "After the shop closed, they had to cash up before they could go home.", 
        exampleJP: "店が閉まった後、彼らは家に帰る前に売上金を計算しなければならなかった。",
        vibes: ["Closing time", "Retail struggles", "Counting the register"], 
        vibesJP: ["閉店時間", "小売業の苦労", "レジを計算する"],
        storyline: "It had been a chaotic, endlessly busy Saturday at the cafe. At 10 PM, the exhausted manager locked the front doors and sat down to silently cash up the mountain of coins and crumpled bills.", 
        storylineJP: "カフェでのカオスで果てしなく忙しい土曜日だった。午後10時、疲れ切った店長は正面のドアに鍵をかけ、山のような硬貨とくしゃくしゃの紙幣の売上金を黙々と計算するために座り込んだ。", 
        quiz: { question: "The last duty of the store manager every night is to efficiently ___.", options: ["cash up", "check over", "clear out"], correctIndex: 0, explanation: "to count the day's takings." } 
      },
      { 
        pv: "Cast around for", trope: "The Desperate Search", cefr: "C1", icon: Search, 
        meaning: "To try to find something by looking in many places.", 
        meaningJP: "（解決策などを）あちこち探し回る", 
        example: "She was casting around for people to help her.", 
        exampleJP: "彼女は助けてくれる人をあちこち探し回っていた。",
        vibes: ["Seeking a lifeline", "Running out of options", "Brainstorming solutions"], 
        vibesJP: ["命綱を求める", "選択肢が尽きる", "解決策を出し合う"],
        storyline: "The massive project was entirely behind schedule, and the budget was depleted. The panicked director began frantically casting around for any possible excuse to tell the furious investors.", 
        storylineJP: "巨大なプロジェクトは完全に予定から遅れ、予算は枯渇していた。パニックに陥ったディレクターは、激怒する投資家たちに伝えるための可能な言い訳を狂ったようにあちこち探し回り始めた。", 
        quiz: { question: "Feeling totally lost, the team is desperately ___ a new, innovative idea.", options: ["casting around for", "catching up with", "catering to"], correctIndex: 0, explanation: "to try to find something." } 
      },
      { 
        pv: "Cast aside / off", trope: "The Cold Discard", cefr: "C2", icon: Trash2, 
        meaning: "To dispose of, get rid of, or ignore because you no longer want or need it.", 
        meaningJP: "投げ捨てる、見捨てる、脱ぎ捨てる", 
        example: "He cruelly cast her aside when he became famous.", 
        exampleJP: "有名になると、彼は残酷にも彼女を見捨てた。",
        vibes: ["Ruthless ambition", "Leaving the past behind", "Cold rejections"], 
        vibesJP: ["冷酷な野望", "過去を置き去りにする", "冷たい拒絶"],
        storyline: "For years, his loyal friends supported him through extreme poverty. But the absolute second he won the massive acting award, he cast them aside, pretending he didn't even know their names anymore.", 
        storylineJP: "何年もの間、彼の忠実な友人たちは極貧の中で彼を支えた。しかし、彼が大きな演技賞を獲得したまさにその瞬間、彼は彼らを見捨て（投げ捨て）、もはや名前すら知らないふりをした。", 
        quiz: { question: "She dramatically ___ her heavy winter coat the moment she stepped inside.", options: ["cast off", "caught out", "chewed up"], correctIndex: 0, explanation: "to get rid of or remove." } 
      },
      { 
        pv: "Catch on", trope: "The Viral Trend", cefr: "B2", icon: TrendingUp, 
        meaning: "To become popular, or to finally understand what is going on.", 
        meaningJP: "流行する、理解する", 
        example: "It took him ages to catch on to what they were planning.", 
        exampleJP: "彼らが何を計画しているのか、彼が理解するのには途方もない時間がかかった。",
        vibes: ["Going viral", "The 'Aha!' moment", "Being slow to realize"], 
        vibesJP: ["バイラルになる", "「アハ！」体験", "気づくのが遅い"],
        storyline: "At first, Mika's asymmetrical, neon hairstyle was heavily mocked by everyone at the academy. But surprisingly, within three weeks, the strange aesthetic caught on, and half the school copied her exact look.", 
        storylineJP: "最初、ミカの非対称なネオンカラーの髪型はアカデミーの全員からひどく嘲笑された。しかし驚いたことに、3週間以内にその奇妙な美学は流行し、学校の半数が彼女と全く同じスタイルを真似した。", 
        quiz: { question: "I wonder if this incredibly bizarre new fashion trend will actually ___ globally.", options: ["catch on", "chime in", "cave in"], correctIndex: 0, explanation: "to become popular or understand." } 
      },
      { 
        pv: "Catch out", trope: "The Clever Trap", cefr: "C1", icon: AlertCircle, 
        meaning: "To trick someone, discover they are lying, or put them in a difficult situation.", 
        meaningJP: "罠にかける、嘘を見破る、不意打ちする", 
        example: "He caught me out when he checked my story with my previous employer.", 
        exampleJP: "彼が以前の雇用主に私の話を確認した時、私の嘘は見破られた（罠にかかった）。",
        vibes: ["Exposing a liar", "Unexpected pop quizzes", "Being caught in the rain"], 
        vibesJP: ["嘘つきを暴露する", "予期せぬ小テスト", "雨に降られる（不意打ち）"],
        storyline: "The arrogant suspect thought his fake alibi was completely flawless. But the veteran detective had secretly checked the security cameras, perfectly catching him out in a massive, undeniable lie.", 
        storylineJP: "傲慢な容疑者は自分の偽のアリバイが完全に完璧だと思い込んでいた。しかしベテラン刑事は密かに防犯カメラを確認しており、彼の巨大で否定できない嘘を見事に見破った（罠にかけた）。", 
        quiz: { question: "The extremely difficult exam question was deliberately designed to ___ you ___.", options: ["catch / out", "cast / off", "cheer / up"], correctIndex: 0, explanation: "to trick or discover a lie." } 
      },
      { 
        pv: "Catch up / on", trope: "The Sprint & Gossip", cefr: "B1", icon: Coffee, 
        meaning: "To reach someone ahead (up), do missed work (on), or talk about recent news.", 
        meaningJP: "追いつく、遅れを取り戻す、近況を話し合う", 
        example: "I caught up to the leader, then caught up on my sleep.", 
        exampleJP: "私はリーダーに追いつき、その後、睡眠不足を取り戻した。",
        vibes: ["Academic grinding", "Spilling the tea", "Making up for lost time"], 
        vibesJP: ["学業のガリ勉", "ゴシップをこぼす", "失われた時間を取り戻す"],
        storyline: "After a two-week vacation, Sora desperately caught up on a mountain of fifty unread assignments. Later, he met Ken at a sunny cafe to finally catch up on all the relationship drama he missed.", 
        storylineJP: "2週間の休暇後、ソラは50個の未読課題の山に必死で遅れを取り戻した（caught up on）。その後、彼は日当たりの良いカフェでケンに会い、見逃していたあらゆる恋愛ドラマの近況をようやく話し合った。", 
        quiz: { question: "I'm incredibly exhausted, so I'm going home early to ___ my sleep.", options: ["catch up on", "chance upon", "check out"], correctIndex: 0, explanation: "to do something you missed." } 
      },
      { 
        pv: "Cater to", trope: "The Spoiled VIP", cefr: "C1", icon: Heart, 
        meaning: "To provide what is needed or wanted, often in a way that is seen negatively or exclusively.", 
        meaningJP: "（特定の要求に）応じる、迎合する", 
        example: "The film caters to the audience's worst instincts.", 
        exampleJP: "その映画は、観客の最悪の本能に迎合している。",
        vibes: ["Exclusive VIP treatment", "Targeted algorithms", "Giving the people what they want"], 
        vibesJP: ["限定的なVIP待遇", "ターゲットを絞ったアルゴリズム", "人々が望むものを提供する"],
        storyline: "The brand new, ultra-luxury resort didn't bother trying to appeal to normal families. Instead, it was exclusively designed to uniquely cater to the bizarre, expensive demands of billionaire influencers.", 
        storylineJP: "その真新しい超高級リゾートは、一般の家族連れにアピールしようとはしなかった。代わりに、それは億万長者のインフルエンサーたちの奇妙で高価な要求に特化して応える（迎合する）ために、排他的にデザインされていた。", 
        quiz: { question: "The highly successful TV network specifically ___ a younger, teenage demographic.", options: ["caters to", "chimes in", "clams up"], correctIndex: 0, explanation: "to provide what is desired." } 
      },
      { 
        pv: "Cave in", trope: "The Pressure Drop", cefr: "C1", icon: ArrowDown, 
        meaning: "To collapse, or to stop resisting and agree under pressure.", 
        meaningJP: "崩れ落ちる、（圧力に）屈する、折れる", 
        example: "The government has refused to cave in despite the massive protests.", 
        exampleJP: "政府は大規模な抗議にもかかわらず、屈することを拒否した。",
        vibes: ["Surrendering to demands", "Structural collapse", "Losing a fierce argument"], 
        vibesJP: ["要求に降伏する", "構造的な崩壊", "激しい議論に負ける"],
        storyline: "The students staged a massive, highly organized sit-in outside the strict principal's office for a week. Facing intense media coverage and angry parents, the principal finally caved in and abolished the terrible rule.", 
        storylineJP: "生徒たちは厳格な校長室の外で、1週間にわたる大規模で組織的な座り込みを行った。激しいメディアの報道と怒れる親たちを前に、校長はついに屈し（折れ）、そのひどいルールを廃止した。", 
        quiz: { question: "Under incredibly intense interrogation, the weak suspect finally ___ and confessed.", options: ["caved in", "checked off", "chucked away"], correctIndex: 0, explanation: "to yield under pressure." } 
      },
      { 
        pv: "Chalk up / to", trope: "The High Score Excuse", cefr: "C1", icon: Award, 
        meaning: "To achieve something good (up), or to attribute a failure to a cause (to).", 
        meaningJP: "達成する（up）、～のせいにする（to）", 
        example: "We chalked up a win, and chalked the previous loss up to bad luck.", 
        exampleJP: "私たちは勝利を収め（達成し）、前の敗北は不運のせいにした。",
        vibes: ["Winning streaks", "Making analytical excuses", "Setting new records"], 
        vibesJP: ["連勝", "分析的な言い訳をする", "新記録を樹立する"],
        storyline: "The underdog team surprisingly chalked up twenty consecutive wins. When they finally lost a single game, the wise coach didn't yell; he just chalked the chaos up to first-game nerves and lack of experience.", 
        storylineJP: "その無名チームは驚くべきことに20連勝を記録した（chalked up）。ついに1試合負けた時、賢明なコーチは怒鳴らず、そのカオスを初戦の緊張と経験不足のせいだと考えた（chalked up to）。", 
        quiz: { question: "We can safely ___ the bizarre system failure ___ the unexpected power surge.", options: ["chalk / up to", "cheat / out of", "cast / around for"], correctIndex: 0, explanation: "to attribute to a cause." } 
      },
      { 
        pv: "Chance upon", trope: "The Lucky Find", cefr: "C1", icon: Sparkles, 
        meaning: "To find something or someone purely by accident.", 
        meaningJP: "偶然見つける、たまたま出くわす", 
        example: "I chanced upon a very rare book in a car boot sale and bought it for almost nothing.", 
        exampleJP: "フリーマーケットでとても珍しい本を偶然見つけ、タダ同然で買った。",
        vibes: ["Thrifting treasures", "Unexpected encounters", "Serendipity"], 
        vibesJP: ["古着屋での宝探し", "予期せぬ出会い", "セレンディピティ（偶然の幸運）"],
        storyline: "While wandering mindlessly through the rainy, narrow streets of Kyoto, Rin ducked into a tiny, unmarked shop. There, hidden on a dusty shelf, she chanced upon the exact vintage camera she had wanted for years.", 
        storylineJP: "京都の雨の降る狭い通りを何も考えずにさまよっていた時、リンは看板のない小さな店に飛び込んだ。そこで、埃をかぶった棚に隠れていた、彼女が何年も欲しがっていたまさにそのビンテージカメラを偶然見つけた。", 
        quiz: { question: "I was completely shocked when I randomly ___ a brilliant solution to the problem.", options: ["chanced upon", "churned out", "chewed out"], correctIndex: 0, explanation: "to find by accident." } 
      },
      { 
        pv: "Charge up / with", trope: "The Energized Indictment", cefr: "B2", icon: Zap, 
        meaning: "To put electricity in a device (up), or to accuse someone of a crime officially (with).", 
        meaningJP: "充電する（up）、（罪で）起訴する（with）", 
        example: "I charged up my phone to film the corrupt mayor being charged with fraud.", 
        exampleJP: "腐敗した市長が詐欺で起訴されるのを撮影するために、私はスマホを充電した。",
        vibes: ["Red battery icons", "Courtroom drama", "Police investigations"], 
        vibesJP: ["赤いバッテリーアイコン", "法廷ドラマ", "警察の捜査"],
        storyline: "Sora had to quickly charge up his dead phone to capture the breaking news. The corrupt mayor, who thought his offshore accounts were hidden, was officially arrested and charged with massive fraud.", 
        storylineJP: "ソラは速報を撮影するために、バッテリー切れのスマホを急いで充電（charge up）しなければならなかった。オフショア口座が隠されていると思っていた腐敗した市長は、正式に逮捕され、大規模な詐欺罪で起訴された（charged with）。", 
        quiz: { question: "The aggressive prosecutors decided to officially ___ him ___ grand theft auto.", options: ["charge / with", "catch / out", "clamp / down on"], correctIndex: 0, explanation: "to accuse of a crime." } 
      },
      { 
        pv: "Chase down / off / up", trope: "The Relentless Pursuit", cefr: "C1", icon: Search, 
        meaning: "To try hard to find (down), force to leave (off), or ensure someone does something (up).", 
        meaningJP: "探し出す（down）、追い払う（off）、催促する（up）", 
        example: "I chased down the missing files, chased off the intruders, and chased up the late payment.", 
        exampleJP: "私は消えたファイルを探し出し、侵入者を追い払い、遅れている支払いを催促した。",
        vibes: ["Frustrating detective work", "Defending property", "Office micro-managing"], 
        vibesJP: ["イライラする探偵作業", "財産を守る", "オフィスのマイクロマネジメント"],
        storyline: "Leo spent months trying to chase down a rare comic. He chased off annoying scalpers, and spent all morning sending passive-aggressive emails to chase up the late delivery from the international courier.", 
        storylineJP: "レオは希少なコミックを探し出す（chase down）ために何ヶ月も費やした。彼は厄介な転売ヤーを追い払い（chased off）、国際宅急便からの遅れている配達を催促する（chase up）ために、午前中を丸ごと受動的攻撃なメールを送ることに費やした。", 
        quiz: { question: "The strict librarian is ___ me ___ about returning those extremely overdue books.", options: ["chasing / up", "cheating / on", "chuck / away"], correctIndex: 0, explanation: "to ensure someone does something." } 
      }
    ],
    
   11: [
      { 
        pv: "Chat up", trope: "The Smooth Talker", cefr: "B2", icon: MessageCircle, 
        meaning: "To talk to someone you are sexually or romantically interested in.", 
        meaningJP: "ナンパする、口説く", 
        example: "He spent the whole night chatting her up at the bar.", 
        exampleJP: "彼はバーで一晩中彼女を口説いていた。",
        vibes: ["Clubbing with friends", "Using terrible pickup lines", "Flirting intensely"], 
        vibesJP: ["友達とクラブで遊ぶ", "ひどいナンパの文句を使う", "激しくいちゃつく"],
        storyline: "Kaito thought he was the ultimate master of romance. At the neon-lit party, he approached the most beautiful girl in the room and tried chatting her up with a cheesy line, but she just laughed and walked away.", 
        storylineJP: "海斗は自分がロマンスの究極のマスターだと思っていた。ネオンが輝くパーティで、彼は部屋で一番美しい女の子に近づき、安っぽいセリフで彼女を口説こう（ナンパしよう）としたが、彼女はただ笑って立ち去ってしまった。", 
        quiz: { question: "It was incredibly obvious that he was actively trying to ___ the new student ___.", options: ["chat / up", "chew / out", "clam / up"], correctIndex: 0, explanation: "to flirt with someone." } 
      },
      { 
        pv: "Cheat on", trope: "The Toxic Betrayal", cefr: "B1", icon: XCircle, 
        meaning: "To be sexually unfaithful to your romantic partner.", 
        meaningJP: "浮気する、裏切る", 
        example: "She immediately broke up with him after finding out he cheated on her.", 
        exampleJP: "彼女は彼が浮気したと知って、すぐに彼と別れた。",
        vibes: ["Messy public breakups", "Exposing liars with screenshots", "Trust issues"], 
        vibesJP: ["公の場での泥沼の破局", "スクショで嘘つきを暴露する", "信頼関係の問題"],
        storyline: "They were considered the flawless, absolute power couple of the university. But the illusion shattered horribly when a leaked text message proved that he had shamelessly cheated on her during their supposedly romantic summer trip.", 
        storylineJP: "彼らは大学で非の打ち所がない絶対的なパワーカップルだと思われていた。しかし、彼らがロマンチックなはずの夏の旅行中に、彼が恥知らずにも浮気していたことを証明するメッセージが流出し、その幻想は恐ろしいほどに打ち砕かれた。", 
        quiz: { question: "I absolutely cannot believe he would deliberately ___ his loyal partner like that.", options: ["cheat on", "chip in", "clear up"], correctIndex: 0, explanation: "to be unfaithful." } 
      },
      { 
        pv: "Cheat out of", trope: "The Scam Artist", cefr: "C1", icon: AlertTriangle, 
        meaning: "To get money from someone under false pretenses or by tricking them.", 
        meaningJP: "騙し取る", 
        example: "I hate him- he completely cheated me out of £100 with his fake sob story.", 
        exampleJP: "彼なんか大嫌いだ。作り泣きの話で私から100ポンドを完全に騙し取った。",
        vibes: ["Falling for scams", "Losing hard-earned money", "Greedy conmen"], 
        vibesJP: ["詐欺に引っかかる", "苦労して稼いだお金を失う", "強欲な詐欺師"],
        storyline: "The elderly man trusted the friendly, well-dressed salesman at his door. But it was a cruel scam. The salesman tricked him into signing a fake contract and essentially cheated him out of his entire life savings.", 
        storylineJP: "その老人は、ドアの前に現れた親切で身なりが良いセールスマンを信じた。しかしそれは残酷な詐欺だった。セールスマンは彼を騙して偽の契約書にサインさせ、事実上、彼の全財産を騙し取ったのだ。", 
        quiz: { question: "The highly corrupt bank manager deliberately ___ the clients ___ their investments.", options: ["cheated / out of", "cast / around for", "caught / up in"], correctIndex: 0, explanation: "to get money by tricking." } 
      },
      { 
        pv: "Check in / into", trope: "The Vacation Mode", cefr: "A2", icon: Map, 
        meaning: "To register on arriving at a hotel or airport.", 
        meaningJP: "チェックインする", 
        example: "We took a taxi from the airport to the hotel and checked in.", 
        exampleJP: "私たちは空港からホテルまでタクシーに乗り、チェックインした。",
        vibes: ["Travel hype", "Handing over passports", "Entering luxury resorts"], 
        vibesJP: ["旅行のワクワク感", "パスポートを渡す", "高級リゾートに入る"],
        storyline: "After a completely exhausting, turbulent 14-hour flight, the excited group finally arrived at the sparkling beachfront resort. Hina immediately sprinted to the beautiful front desk to check in and grab the precious room keys.", 
        storylineJP: "完全に疲れ果て、揺れの激しかった14時間のフライトの後、興奮した一行はついに輝くビーチフロントのリゾートに到着した。ヒナはすぐに美しいフロントデスクに全速力で向かい、チェックインをして貴重な部屋の鍵を受け取った。", 
        quiz: { question: "All international passengers must absolutely ___ at the desk two hours prior to departure.", options: ["check in", "chill out", "chop up"], correctIndex: 0, explanation: "to register arrival." } 
      },
      { 
        pv: "Check off", trope: "The To-Do List", cefr: "B1", icon: CheckCircle2, 
        meaning: "To mark something on a list as done or dealt with.", 
        meaningJP: "（リストの項目に）チェックマークを入れる", 
        example: "She confidently checked off the candidates' names as they arrived.", 
        exampleJP: "彼女は到着した候補者の名前に自信満々でチェックマークを入れていった。",
        vibes: ["Productivity high", "Clearing tasks", "Ultimate satisfaction"], 
        vibesJP: ["生産性が高い", "タスクを片付ける", "究極の満足感"],
        storyline: "It had been an overwhelmingly stressful, chaotic week of endless assignments. But as Sunday evening approached, Mika smiled with deep satisfaction as she grabbed her red pen and finally checked off the very last task on her massive list.", 
        storylineJP: "終わりのない課題に追われる、圧倒的にストレスフルでカオスな一週間だった。しかし日曜の夕方が近づくと、ミカは赤いペンを握り、ついに巨大なリストの最後の項目にチェックマークを入れて、深い満足感とともに微笑んだ。", 
        quiz: { question: "Once you have completely finished packing an item, systematically ___ it ___ the master list.", options: ["check / off", "cheer / on", "choke / off"], correctIndex: 0, explanation: "to mark as done." } 
      },
      { 
        pv: "Check out", trope: "The Hype Explorer", cefr: "A2", icon: Eye, 
        meaning: "To pay the bill when leaving a hotel, or to investigate/look at something interesting.", 
        meaningJP: "チェックアウトする、見てみる、調べる", 
        example: "I checked the new restaurant out as soon as it officially opened.", 
        exampleJP: "正式にオープンしてすぐ、その新しいレストランをチェックしに行った。",
        vibes: ["Exploring new city spots", "Watching a cool video", "Leaving a fancy hotel"], 
        vibesJP: ["街の新しいスポットを探索する", "かっこいい動画を見る", "高級ホテルをチェックアウトする"],
        storyline: "Mika grabbed Leo's arm and practically dragged him down the neon-lit street. 'You absolutely have to check out this hidden, underground vintage shop I found,' she squealed excitedly. 'The aesthetic inside is literally immaculate!'", 
        storylineJP: "ミカはレオの腕を掴み、ネオンが輝く通りをほとんど引きずるように歩いた。「私が見つけたこの隠れ家的な地下のビンテージショップ、絶対にチェックしなきゃダメ（見てみないとダメ）！」彼女は興奮して叫んだ。「中の雰囲気が文字通り完璧なの！」", 
        quiz: { question: "Hey guys, you seriously have to ___ this incredibly cool, viral TikTok video!", options: ["check out", "clam up", "clear up"], correctIndex: 0, explanation: "to look at or investigate." } 
      },
      { 
        pv: "Check over / up on", trope: "The Strict Manager", cefr: "B2", icon: Search, 
        meaning: "To examine something carefully (over), or monitor someone's behavior (up on).", 
        meaningJP: "入念にチェックする（over）、監視する（up on）", 
        example: "I checked over the contract, while my boss checked up on my progress.", 
        exampleJP: "私が契約書を入念にチェックしている間、上司は私の進捗を監視していた。",
        vibes: ["Proofreading essays", "Micro-managing bosses", "Spotting tiny errors"], 
        vibesJP: ["エッセイの校正", "細かく管理する上司", "小さなミスを見つける"],
        storyline: "The massive, million-dollar space launch was only hours away. The paranoid lead engineer kept checking up on his staff, forcing them to check over every single line of code one last time to prevent an explosion.", 
        storylineJP: "100万ドル規模の巨大な宇宙打ち上げまで数時間と迫っていた。偏執的なチーフエンジニアはスタッフを監視（check up on）し続け、爆発を防ぐためにコードのすべての行を最後にもう一度入念にチェックする（check over）よう強制した。", 
        quiz: { question: "The careful doctor decided to thoroughly ___ the patient ___ for any hidden injuries.", options: ["check / over", "chuck / away", "clamp / down on"], correctIndex: 0, explanation: "to examine carefully." } 
      },
      { 
        pv: "Cheer on", trope: "The Superfan", cefr: "B1", icon: Mic2, 
        meaning: "To encourage someone or a team with shouts and cheers.", 
        meaningJP: "声援を送る、応援する", 
        example: "They enthusiastically cheered their team on throughout the tough match.", 
        exampleJP: "彼らは厳しい試合中ずっと、熱狂的にチームを応援した。",
        vibes: ["Stadium energy", "Screaming till your throat hurts", "Supportive friends"], 
        vibesJP: ["スタジアムの熱気", "喉が痛くなるまで叫ぶ", "応援してくれる友達"],
        storyline: "It was the final, brutal lap of the marathon, and Sora's legs were giving out. But seeing his entire class standing by the road, loudly cheering him on with bright banners, he found a sudden, miraculous burst of energy to finish.", 
        storylineJP: "マラソンの過酷な最終ラップで、ソラの脚は限界を迎えていた。しかし、クラス全員が道端に立ち、鮮やかな横断幕を持って大声で彼に声援を送っている（応援している）のを見て、彼は突然、奇跡的なエネルギーを爆発させて完走した。", 
        quiz: { question: "The passionate fans continuously ___ the exhausted runners ___ near the finish line.", options: ["cheered / on", "choked / up", "chucked / in"], correctIndex: 0, explanation: "to encourage with shouts." } 
      },
      { 
        pv: "Cheer up", trope: "The Wholesome Support", cefr: "A2", icon: Smile, 
        meaning: "To become less unhappy, or make someone feel happier.", 
        meaningJP: "元気を出す、元気づける", 
        example: "Come on, cheer up; it really isn't all bad, you know.", 
        exampleJP: "ほら、元気を出して。本当に全部が悪いわけじゃないんだから。",
        vibes: ["Comforting a sad bestie", "Bringing sweet treats", "Turning a terrible day around"], 
        vibesJP: ["悲しむ親友を慰める", "甘いお菓子を持っていく", "最悪な日を好転させる"],
        storyline: "Hina was crying quietly at her dark desk after horribly failing the terrifying math exam. Kaito silently walked over, placed her absolute favorite premium strawberry milk in front of her, and cracked a famously terrible joke, desperately trying to cheer her up.", 
        storylineJP: "恐ろしい数学の試験にひどく落ちて、ヒナは暗い机で静かに泣いていた。海斗は無言で歩み寄り、彼女が絶対的に大好きな高級イチゴミルクを目の前に置き、彼特有のひどい冗談を飛ばして、必死に彼女を元気づけようとした。", 
        quiz: { question: "Please don't be so sad about the incredibly minor mistake; try to ___!", options: ["cheer up", "chill out", "churn out"], correctIndex: 0, explanation: "to become happier." } 
      },
      { 
        pv: "Chew over", trope: "The Deep Thinker", cefr: "C1", icon: Lightbulb, 
        meaning: "To think about an issue carefully before deciding.", 
        meaningJP: "熟考する、よく考える", 
        example: "He asked for a few days to chew the complex matter over before he made a final decision.", 
        exampleJP: "最終決定を下す前に、彼はその複雑な問題を熟考するための数日間を要求した。",
        vibes: ["Late-night pondering", "Analyzing heavy choices", "Taking time to reflect"], 
        vibesJP: ["深夜の熟考", "重い選択を分析する", "時間をかけて振り返る"],
        storyline: "The massive international tech company offered Sora a highly lucrative but incredibly stressful lead position. Refusing to be rushed, he grabbed a coffee, went to the quiet park, and took three full hours to just chew over the life-changing decision.", 
        storylineJP: "巨大な国際的テック企業が、ソラに非常に儲かるが信じられないほどストレスの多いチーフ職をオファーした。急かされることを拒否し、彼はコーヒーを片手に静かな公園へ行き、人生を変えるようなその決断をただ熟考する（よく考える）ために丸3時間を費やした。", 
        quiz: { question: "Before accepting the risky business deal, she wanted to thoroughly ___ it ___.", options: ["chew / over", "catch / out", "chalk / up"], correctIndex: 0, explanation: "to think about carefully." } 
      },
      { 
        pv: "Chew out", trope: "The Furious Boss", cefr: "C1", icon: Angry, 
        meaning: "To criticize someone angrily.", 
        meaningJP: "激しく叱り飛ばす、大目玉を食らわす", 
        example: "They chewed him out fiercely for being an hour late.", 
        exampleJP: "彼らは1時間遅刻したことで彼を激しく叱り飛ばした。",
        vibes: ["Getting yelled at", "A terrifying scolding", "Public humiliation"], 
        vibesJP: ["怒鳴られる", "恐ろしいお説教", "公の場での屈辱"],
        storyline: "Leo accidentally deleted the entire, completed presentation file right before the massive client meeting. The strict, unforgiving CEO dragged him into the glass office and brutally chewed him out so loudly that the entire floor could hear the screaming.", 
        storylineJP: "レオは巨大なクライアント会議の直前に、完成したプレゼンファイル全体を誤って削除してしまった。厳格で容赦のないCEOは彼をガラス張りのオフィスに引きずり込み、フロア全体に怒鳴り声が聞こえるほどの音量で残酷に彼を激しく叱り飛ばした。", 
        quiz: { question: "For losing the highly confidential documents, the angry manager loudly ___ her ___.", options: ["chewed / out", "choked / off", "cleared / up"], correctIndex: 0, explanation: "to criticize angrily." } 
      },
      { 
        pv: "Chew up", trope: "The Paper Jam", cefr: "B2", icon: Cpu, 
        meaning: "To damage something inside a machine, or cut into small pieces with teeth.", 
        meaningJP: "（機械が）巻き込んでグチャグチャにする、噛み砕く", 
        example: "The stupid old video player chewed my favourite tape up.", 
        exampleJP: "あのバカな古いビデオデッキが、私のお気に入りのテープを巻き込んでグチャグチャにした。",
        vibes: ["Printer jams", "Ruined documents", "Puppies destroying shoes"], 
        vibesJP: ["プリンターの紙詰まり", "台無しになった書類", "靴を破壊する子犬"],
        storyline: "It was five minutes before her thesis submission. Mika tried to print her flawless, 100-page essay, but the cheap, dusty university printer jammed horribly, loudly grinding and totally chewing up her incredibly important title page into unreadable shreds.", 
        storylineJP: "卒論提出の5分前だった。ミカは完璧な100ページのエッセイを印刷しようとしたが、埃をかぶった大学の安物のプリンターがひどく詰まり、大きな音を立てて彼女の信じられないほど重要なタイトルページを完全に巻き込んでグチャグチャにし、読めない切れ端にしてしまった。", 
        quiz: { question: "The hyperactive puppy got bored and completely ___ his owner's expensive leather shoes.", options: ["chewed up", "chucked away", "chiped in"], correctIndex: 0, explanation: "to damage or bite to pieces." } 
      },
      { 
        pv: "Chicken out", trope: "The Last-Minute Fear", cefr: "B2", icon: AlertTriangle, 
        meaning: "To decide not to do something because you are too frightened.", 
        meaningJP: "怖気づいてやめる、尻込みする", 
        example: "I was going to do the terrifying bungee jump, but I chickened out at the last second.", 
        exampleJP: "恐ろしいバンジージャンプをやるつもりだったけど、最後の瞬間に怖気づいてやめてしまった。",
        vibes: ["Losing courage", "Backing away from extreme sports", "A sudden wave of fear"], 
        vibesJP: ["勇気を失う", "エクストリームスポーツから手を引く", "突然の恐怖の波"],
        storyline: "Kaito bragged loudly all week to his friends about going on the terrifying, record-breaking new roller coaster. But when he finally reached the front of the line and looked down the massive, vertical drop, his face went pale, and he completely chickened out, running for the exit.", 
        storylineJP: "海斗は、恐ろしい記録破りの新しいジェットコースターに乗ると、一週間ずっと友人たちに大声で自慢していた。しかし、ついに列の先頭にたどり着き、巨大な垂直の急降下を見下ろした時、彼の顔は青ざめ、完全に怖気づいてやめ、出口へと逃げ出した。", 
        quiz: { question: "She desperately wanted to sing at the talent show, but sadly ___ right before going on stage.", options: ["chickened out", "chilled out", "choked up"], correctIndex: 0, explanation: "to avoid due to fear." } 
      },
      { 
        pv: "Chill out", trope: "The Weekend Vibe", cefr: "A2", icon: Coffee, 
        meaning: "To relax completely, or to stop being angry and stressed.", 
        meaningJP: "リラックスする、落ち着く", 
        example: "I'm staying at home and just chilling out this peaceful evening.", 
        exampleJP: "この平和な夕方は、家にとどまってただ完全にリラックスするよ。",
        vibes: ["Cozy rainy days", "Watching movies in pajamas", "Calming down a friend"], 
        vibesJP: ["居心地の良い雨の日", "パジャマで映画を見る", "友人を落ち着かせる"],
        storyline: "After an absolutely brutal, 60-hour week of endless corporate meetings, Mika refused to leave her quiet apartment. She put on her fluffiest oversized pajamas, ordered a giant pizza, and spent the entire rainy Saturday just chilling out on her comfortable couch.", 
        storylineJP: "終わりのない企業会議が続く絶対的に過酷な週60時間労働の後、ミカは静かなアパートから出ることを拒否した。彼女は最もふわふわの特大パジャマを着て、巨大なピザを注文し、雨の土曜日を丸一日、ただ快適なソファで完全にリラックスして過ごした。", 
        quiz: { question: "Dude, you're massively overreacting to a tiny problem. You seriously need to ___.", options: ["chill out", "chop up", "clam up"], correctIndex: 0, explanation: "to relax or calm down." } 
      },
      { 
        pv: "Chime in", trope: "The Conversation Joiner", cefr: "C1", icon: MessageCircle, 
        meaning: "To contribute to a discussion or interrupt to say something.", 
        meaningJP: "（会話に）相槌を打つ、口を挟む、同調する", 
        example: "If it's OK, I'd like to chime in here because I think it's a really brilliant idea.", 
        exampleJP: "もしよければ、ここで少し口を挟ませてほしい。それは本当に素晴らしいアイデアだと思うからだ。",
        vibes: ["Adding a quick opinion", "Group brainstorming", "A polite interruption"], 
        vibesJP: ["ちょっとした意見を付け加える", "グループでのブレインストーミング", "礼儀正しい割り込み"],
        storyline: "The senior marketing team was arguing endlessly in circles about the boring new ad campaign. Seeing them stuck, the quiet young intern nervously raised her hand and bravely decided to chime in with a shockingly creative, fresh perspective.", 
        storylineJP: "シニアマーケティングチームは、退屈な新しい広告キャンペーンについて堂々巡りの議論を果てしなく続けていた。彼らが行き詰まっているのを見て、物静かな若いインターンは緊張しながら手を挙げ、驚くほどクリエイティブで斬新な視点で勇敢にも会話に口を挟む（同調する）ことを決意した。", 
        quiz: { question: "While they were debating the strict rules, the manager suddenly ___ with a firm disagreement.", options: ["chimed in", "checked off", "churned out"], correctIndex: 0, explanation: "to contribute or interrupt." } 
      },
      { 
        pv: "Chip in", trope: "The Group Gift", cefr: "B1", icon: DollarSign, 
        meaning: "To contribute money or help with a shared task or gift.", 
        meaningJP: "（お金や労力を）出し合う、寄付する", 
        example: "Everybody eagerly chipped in ten dollars to pay the expensive restaurant bill.", 
        exampleJP: "高価なレストランの支払いのために、全員が快く10ドルずつ出し合った。",
        vibes: ["Splitting the cost", "Teamwork", "Buying a surprise present"], 
        vibesJP: ["割り勘にする", "チームワーク", "サプライズプレゼントを買う"],
        storyline: "The beloved, strict homeroom teacher was finally retiring after thirty years. Sora secretly organized the entire class. 'If we all chip in just five dollars,' he suggested, 'we can easily afford to buy him that incredibly fancy watch he always looks at in the shop window.'", 
        storylineJP: "愛されつつも厳格だった担任の先生が、30年間の勤務を経てついに退職することになった。ソラは密かにクラス全体をまとめた。「全員がたった5ドルずつ出し合えば、先生がいつもショーウィンドウで見つめているあの信じられないほど高級な時計を簡単に買えるよ」と彼は提案した。", 
        quiz: { question: "To afford the massively expensive leaving present, all the coworkers had to ___.", options: ["chip in", "choke off", "chuck away"], correctIndex: 0, explanation: "to contribute money or help." } 
      },
      { 
        pv: "Choke off", trope: "The Supply Cut", cefr: "C2", icon: Lock, 
        meaning: "To stop or restrict something completely, often gradually.", 
        meaningJP: "（供給や成長などを）止める、制限する", 
        example: "These aggressive guerrilla attacks are rapidly choking off our vital food shipments.", 
        exampleJP: "これらの攻撃的なゲリラ攻撃は、私たちの極めて重要な食糧輸送を急速に制限している（止めている）。",
        vibes: ["Cutting off resources", "Suffocating a business", "Strict blockades"], 
        vibesJP: ["資源を絶つ", "ビジネスを窒息させる", "厳重な封鎖"],
        storyline: "The dominant, massive global tech corporation wanted to entirely crush the small, innovative startup. By illegally threatening the supply chains and buying up all the raw materials, they slowly managed to choke off the startup's ability to manufacture anything.", 
        storylineJP: "支配的で巨大なグローバルテック企業は、小さく革新的なスタートアップを完全に潰したいと考えていた。違法にサプライチェーンを脅し、すべての原材料を買い占めることで、彼らはゆっくりと、そのスタートアップが何かを製造する能力を制限し止めることに成功した。", 
        quiz: { question: "The new, extremely strict banking regulations are severely ___ the flow of foreign investments.", options: ["choking off", "chewing over", "clearing up"], correctIndex: 0, explanation: "to stop or restrict." } 
      },
      { 
        pv: "Choke up", trope: "The Emotional Speech", cefr: "B2", icon: Droplets, 
        meaning: "To become tearfully emotional and unable to speak clearly.", 
        meaningJP: "感極まって言葉に詰まる", 
        example: "Jeff completely choked up during his heartfelt retirement speech.", 
        exampleJP: "ジェフは心からの退職スピーチの途中で、完全に感極まって言葉に詰まってしまった。",
        vibes: ["Crying at a wedding", "Overwhelming gratitude", "Trying not to sob"], 
        vibesJP: ["結婚式で泣く", "圧倒的な感謝", "すすり泣きをこらえる"],
        storyline: "After leading the underdog basketball team to their first national victory in twenty years, the tough, stoic coach stood at the podium. He tried to thank his incredibly dedicated players, but looking at their bruised, smiling faces, he completely choked up, tears silently falling.", 
        storylineJP: "弱小バスケチームを20年ぶりの全国優勝に導いた後、タフで禁欲的なコーチが演壇に立った。彼は信じられないほど献身的な選手たちに感謝しようとしたが、彼らのアザだらけの笑顔を見た時、完全に感極まって言葉に詰まり、静かに涙を流した。", 
        quiz: { question: "Watching the beautiful, deeply moving tribute video made the strong man suddenly ___.", options: ["choke up", "catch on", "clamp down"], correctIndex: 0, explanation: "to become very emotional." } 
      },
      { 
        pv: "Chop up", trope: "The Prep Cook", cefr: "A2", icon: Hammer, 
        meaning: "To cut something into small pieces.", 
        meaningJP: "細かく切り刻む", 
        example: "I carefully chopped up the fresh vegetables for the hot soup.", 
        exampleJP: "私は温かいスープのために、新鮮な野菜を丁寧に細かく切り刻んだ。",
        vibes: ["Cooking dinner", "Slicing ingredients", "Kitchen prep"], 
        vibesJP: ["夕食を作る", "材料をスライスする", "キッチンの下ごしらえ"],
        storyline: "It was Kaito's turn to cook for the picky roommates. Armed with a massive, terrifyingly sharp chef's knife, he aggressively chopped up piles of onions, garlic, and carrots, accidentally making himself cry a river of tears in the process.", 
        storylineJP: "気難しいルームメイトたちのために料理をする海斗の番だった。恐ろしく鋭い巨大な牛刀で武装し、彼は玉ねぎ、ニンニク、そしてニンジンの山をアグレッシブに細かく切り刻み、その過程でうっかり自分に川のような涙を流させてしまった。", 
        quiz: { question: "Before adding the raw chicken to the hot pan, make sure you ___ it ___ properly.", options: ["chop / up", "chuck / in", "check / off"], correctIndex: 0, explanation: "to cut into pieces." } 
      },
      { 
        pv: "Chow down", trope: "The Dinner Bell", cefr: "B2", icon: ShoppingCart, 
        meaning: "To eat something enthusiastically.", 
        meaningJP: "ガツガツ食べる、食事にする", 
        example: "Dinner is finally ready and steaming hot- let's chow down!", 
        exampleJP: "夕食がついにできて湯気を立てているよ、さあガツガツ食べよう！",
        vibes: ["Starving after a workout", "Feasting on junk food", "A messy, satisfying meal"], 
        vibesJP: ["ワークアウト後の腹ペコ", "ジャンクフードを平らげる", "汚いけど満足のいく食事"],
        storyline: "The school hiking club had been walking up the steep, freezing mountain for ten exhausting hours. The absolute second they finally reached the cozy, warm cabin and saw the massive spread of hot stew, they didn't even talk; they just sat and instantly started to chow down.", 
        storylineJP: "学校のハイキングクラブは、疲れ果てるような10時間、凍えるような急な山を歩き続けていた。彼らがついにお祝いで暖かいキャビンに到着し、温かいシチューの巨大なごちそうを見た絶対的な瞬間、彼らは一言も話さず、ただ座って即座にガツガツと食べ始めた。", 
        quiz: { question: "We ordered three massive extra-large pizzas, so get ready to completely ___ tonight!", options: ["chow down", "clam up", "catch out"], correctIndex: 0, explanation: "to eat enthusiastically." } 
      }
    ],
    
12: [
      { 
        pv: "Chuck away / in", trope: "The Spring Cleaning / Rage Quit", cefr: "C1", icon: Trash2, 
        meaning: "To dispose of something you don't need (away), or to quit something (in).", 
        meaningJP: "捨てる（away）、（仕事を）辞める（in）", 
        example: "I chucked away all my old records, and chucked in my boring job.", 
        exampleJP: "私は古いレコードをすべて捨て（chuck away）、退屈な仕事を辞めた（chuck in）。",
        vibes: ["Throwing out garbage", "Quitting dramatically", "Getting rid of the past"], 
        vibesJP: ["ゴミを捨てる", "ドラマチックに辞める", "過去を処分する"],
        storyline: "Hina's tiny apartment was suffocatingly full of ex-boyfriend gifts. Filled with chaotic energy, she chucked away everything. Then, feeling totally free, she went to work and shockingly chucked in her stressful job without any warning.", 
        storylineJP: "ヒナの狭いアパートは元カレからの贈り物で息が詰まるほどだった。カオスなエネルギーに満たされ、彼女はすべてを捨てた（chucked away）。そして完全に自由を感じた彼女は仕事に行き、何の前触れもなくストレスの多い仕事を衝撃的にも辞めてしまった（chucked in）。", 
        quiz: { question: "Please neatly organize your desk and completely ___ any useless, scrap paper.", options: ["chuck away", "chalk up", "cheer on"], correctIndex: 0, explanation: "to dispose of." } 
      },
      { 
        pv: "Churn out", trope: "The Content Mill", cefr: "C1", icon: Package, 
        meaning: "To produce a lot of something fast, usually without regard to quality.", 
        meaningJP: "大量生産する、粗製乱造する", 
        example: "The lazy government churns out new, useless educational policies every few months.", 
        exampleJP: "怠惰な政府は数ヶ月おきに新しくて無駄な教育政策を大量生産している。",
        vibes: ["Quantity over quality", "A content mill", "Endless production"], 
        vibesJP: ["質より量", "コンテンツの大量生産", "終わりのない生産"],
        storyline: "The exhausted, underpaid writers at the massive media company weren't allowed to be creative anymore. They were locked in tiny cubicles and strictly ordered to just mindlessly churn out ten boring, clickbait articles every single day to satisfy the greedy algorithm.", 
        storylineJP: "巨大なメディア企業で働く、疲れ切って薄給のライターたちは、もはやクリエイティブであることは許されていなかった。彼らは狭いパーティションに閉じ込められ、強欲なアルゴリズムを満たすためだけに、毎日10本の退屈なクリックベイト記事をただ何も考えずに大量生産する（粗製乱造する）よう厳命されていた。", 
        quiz: { question: "The massive, incredibly fast automated factory can easily ___ five thousand cheap toys an hour.", options: ["churn out", "cast aside", "charge up"], correctIndex: 0, explanation: "to produce in large amounts quickly." } 
      },
      { 
        pv: "Clam up", trope: "The Silent Suspect", cefr: "C1", icon: Lock, 
        meaning: "To be quiet, or suddenly refuse to speak, often due to fear or nervousness.", 
        meaningJP: "押し黙る、口を閉ざす", 
        example: "Everybody completely clammed up when the angry Principal entered the classroom.", 
        exampleJP: "怒った校長が教室に入ってくると、全員が完全に口を閉ざした。",
        vibes: ["Refusing to snitch", "Nervous silence", "Interrogation room anxiety"], 
        vibesJP: ["密告を拒否する", "緊張した沈黙", "取調室の不安"],
        storyline: "Leo was famously the loudest, most incredibly talkative guy in the entire school. But when the furious, intimidating police officer aggressively demanded to know who broke the valuable antique window, Leo went totally pale and instantly clammed up in absolute terror.", 
        storylineJP: "レオは学校全体で最も声が大きく、信じられないほどおしゃべりな男として有名だった。しかし、激怒した威圧的な警察官が、誰が高価なアンティークの窓を割ったのかアグレッシブに問い詰めた時、レオは完全に青ざめ、絶対的な恐怖の中で瞬時に口を閉ざした（押し黙った）。", 
        quiz: { question: "The terrified witness suddenly ___ and entirely refused to answer the lawyer's questions.", options: ["clammed up", "chickened out", "chilled out"], correctIndex: 0, explanation: "to refuse to speak." } 
      },
      { 
        pv: "Clamp down on", trope: "The Strict Crackdown", cefr: "C1", icon: Shield, 
        meaning: "To restrict or try to stop something using authority or strict rules.", 
        meaningJP: "厳しく取り締まる、弾圧する", 
        example: "The government is aggressively clamping down on illegal, anti-social behaviour.", 
        exampleJP: "政府は違法で反社会的な行動をアグレッシブに厳しく取り締まっている。",
        vibes: ["Zero tolerance", "Enforcing new laws", "A severe crackdown"], 
        vibesJP: ["一切の妥協なし", "新しい法律を施行する", "厳しい取り締まり"],
        storyline: "For years, students secretly played loud, chaotic mobile games during the boring historical lectures. But the newly appointed, incredibly severe headmaster promised to heavily clamp down on any phone usage, coldly confiscating devices instantly without giving a single warning.", 
        storylineJP: "何年もの間、生徒たちは退屈な歴史の講義中、密かにうるさくてカオスなスマホゲームをしていた。しかし新しく赴任した信じられないほど厳格な校長は、あらゆるスマホの使用を厳しく取り締まると宣言し、たった一度の警告も与えずに冷酷に端末を即座に没収した。", 
        quiz: { question: "The busy city absolutely needs to urgently ___ illegal, dangerous street racing.", options: ["clamp down on", "catch up on", "chime in"], correctIndex: 0, explanation: "to restrict or stop with authority." } 
      },
      { 
        pv: "Clean out", trope: "The Empty Wallet", cefr: "B2", icon: Home, 
        meaning: "To empty a place completely, or steal/spend all of someone's money.", 
        meaningJP: "すっかり片付ける、金を巻き上げる", 
        example: "The incredibly expensive holiday completely cleaned me out.", 
        exampleJP: "その信じられないほど高価な休暇が、私の金を完全にすっからかんにした。",
        vibes: ["Going broke", "Spring cleaning", "Thieves striking"], 
        vibesJP: ["一文無しになる", "大掃除", "泥棒の襲撃"],
        storyline: "Ken thought he was a genius at the casino. However, after three hours of extremely bad bets, the ruthless card dealer didn't just beat him; he completely cleaned Ken out, leaving him without even enough money for a taxi home.", 
        storylineJP: "ケンはカジノで自分が天才だと思っていた。しかし3時間の最悪の賭けの後、冷酷なディーラーは単に彼を負かしただけでなく、ケンの金を完全に巻き上げ（すっからかんにし）、タクシーで帰る金すら残さなかった。", 
        quiz: { question: "The sneaky burglars broke in at night and totally ___ the jewelry store ___.", options: ["cleaned / out", "closed / down", "cleared / up"], correctIndex: 0, explanation: "to empty completely." } 
      },
      { 
        pv: "Clean up", trope: "The Golden Sweep", cefr: "A2", icon: Sparkles, 
        meaning: "To make a place totally tidy, or to make a massive, quick profit.", 
        meaningJP: "綺麗に掃除する、大儲けする", 
        example: "I desperately need to clean up my terribly messy room before mom arrives.", 
        exampleJP: "お母さんが着く前に、このひどく散らかった部屋を何としても綺麗に掃除しなきゃ。",
        vibes: ["Pre-party chores", "Making a massive profit", "Scrubbing floors"], 
        vibesJP: ["パーティー前の雑用", "莫大な利益を上げる", "床を磨く"],
        storyline: "Ten minutes before going live to his thousands of followers, Sora realized his room looked like a complete disaster zone. He frantically scrambled to clean up his gaming setup so it looked perfectly aesthetic on camera.", 
        storylineJP: "何千人ものフォロワーに向けてライブ配信をする10分前、ソラは自分の部屋が完全な災害地帯のようになっていることに気づいた。彼はカメラ映りが完璧におしゃれに見えるように、狂ったようにゲーミングセットアップを綺麗に片付けた。", 
        quiz: { question: "The smart tech startup managed to completely ___ selling trendy accessories.", options: ["clean up", "clear away", "coast along"], correctIndex: 0, explanation: "to tidy or to profit." } 
      },
      { 
        pv: "Clear away", trope: "The Aftermath", cefr: "B1", icon: Wind, 
        meaning: "To remove things from an area to make space or restore order.", 
        meaningJP: "片付ける、取り除く", 
        example: "Please clear away all these empty plates so we can actually play cards.", 
        exampleJP: "実際にカードゲームができるように、この空のお皿をすべて片付けて。",
        vibes: ["Cleaning after a feast", "Clearing a workspace", "Making room for fun"], 
        vibesJP: ["ごちそうの後の片付け", "作業スペースを片付ける", "遊ぶスペースを作る"],
        storyline: "The massive Thanksgiving dinner was absolutely delicious, but the dining table looked like a battlefield. 'Alright everyone,' Grandpa announced, clapping his hands. 'Let's quickly clear away these dishes so we can finally bring out the pie.'", 
        storylineJP: "大規模な感謝祭の夕食は絶対に美味しかったが、ダイニングテーブルは戦場のような有様だった。「よしみんな」祖父は手を叩いて宣言した。「最後についにパイを出せるように、急いでこのお皿を片付けよう。」", 
        quiz: { question: "The efficient waitstaff quickly ___ the dirty glasses from our crowded table.", options: ["cleared away", "closed off", "clouded over"], correctIndex: 0, explanation: "to remove things." } 
      },
      { 
        pv: "Clear out", trope: "The Eviction", cefr: "B2", icon: LogOut, 
        meaning: "To leave a place permanently, or force someone to leave, or empty a room.", 
        meaningJP: "立ち退く、追い出す、すっかり片付ける", 
        example: "The furious landlord told the noisy tenants to clear out by Friday.", 
        exampleJP: "激怒した大家は、うるさい住人たちに金曜日までに立ち退くよう言った。",
        vibes: ["Getting kicked out", "Emptying a hoarder's room", "A forced exit"], 
        vibesJP: ["追い出される", "ゴミ屋敷の部屋を空にする", "強制的な退出"],
        storyline: "For five years, Kaito's garage was a dumping ground for broken electronics and old boxes. One sunny weekend, he finally gathered his courage, rented a huge dumpster, and ruthlessly cleared out the entire space.", 
        storylineJP: "5年間、海斗のガレージは壊れた電化製品や古い箱のゴミ捨て場だった。ある晴れた週末、彼はついに勇気を振り絞って巨大なゴミ箱を借り、その空間全体を容赦なくすっかり片付けた（空にした）。", 
        quiz: { question: "After graduating, the students had to ___ their dorm rooms before summer.", options: ["clear out", "cling on", "coast along"], correctIndex: 0, explanation: "to leave or empty a place." } 
      },
      { 
        pv: "Clear up", trope: "The Silver Lining", cefr: "B1", icon: Sun, 
        meaning: "To explain a misunderstanding, cure an illness, or for bad weather to become sunny.", 
        meaningJP: "（誤解を）解く、（病気が）治る、（天気が）晴れる", 
        example: "I genuinely hope the gloomy weather clears up for the picnic tomorrow.", 
        exampleJP: "明日のピクニックのために、この陰鬱な天気が晴れることを心から願っているよ。",
        vibes: ["Solving drama", "Sunny skies returning", "Fixing confusion"], 
        vibesJP: ["ドラマ（揉め事）を解決する", "晴れ空が戻る", "混乱を修正する"],
        storyline: "A stupid, fake rumor caused a massive, tearful argument between the two best friends. Sitting down with some warm tea, they finally managed to clear up the silly misunderstanding and instantly hugged each other.", 
        storylineJP: "くだらない偽の噂が原因で、2人の親友の間で涙ながらの大喧嘩が起こった。温かいお茶を飲みながら座り合い、彼女たちはついにその馬鹿げた誤解を解くことに成功し、すぐに抱き合った。", 
        quiz: { question: "The helpful manager organized a quick meeting to efficiently ___ the confusion.", options: ["clear up", "cobble together", "come about"], correctIndex: 0, explanation: "to explain or improve weather." } 
      },
      { 
        pv: "Click through", trope: "The Ad Trap", cefr: "B1", icon: Eye, 
        meaning: "To open an advertisement or link on a webpage.", 
        meaningJP: "（リンクなどを）クリックして進む", 
        example: "Thousands of users incredibly clicked through the flashy new banner ad.", 
        exampleJP: "信じられないことに、何千人ものユーザーがその派手な新しいバナー広告をクリックして進んだ。",
        vibes: ["Digital marketing", "Falling for clickbait", "Navigating the web"], 
        vibesJP: ["デジタルマーケティング", "クリックベイトに引っかかる", "ウェブのナビゲート"],
        storyline: "Mika was trying to read a serious article, but a brightly colored, incredibly annoying pop-up ad blocked the screen. Frustrated, she accidentally clicked through the link, instantly opening a dozen spam websites on her computer.", 
        storylineJP: "ミカは真面目な記事を読もうとしていたが、明るい色で信じられないほど鬱陶しいポップアップ広告が画面をブロックした。苛立って彼女はうっかりリンクをクリックして進んでしまい、即座にコンピュータに何十ものスパムサイトを開いてしまった。", 
        quiz: { question: "To read the full, exciting news story, please ___ the link below.", options: ["click through", "climb down", "clog up"], correctIndex: 0, explanation: "to open a web link." } 
      },
      { 
        pv: "Climb down", trope: "The Humble Apology", cefr: "C2", icon: Undo2, 
        meaning: "To unexpectedly admit you were entirely wrong, or retreat from an aggressive position.", 
        meaningJP: "自説を撤回する、非を認める、引き下がる", 
        example: "The arrogant minister was forcefully forced to climb down over his controversial new policy.", 
        exampleJP: "その傲慢な大臣は、自身の物議を醸す新政策について自説を撤回する（引き下がる）ことを強制された。",
        vibes: ["Eating humble pie", "A public apology", "Retreating gracefully"], 
        vibesJP: ["屈辱を味わう", "公の場での謝罪", "優雅に後退する"],
        storyline: "The famous, highly stubborn professor publicly claimed the student's research was completely fake. But when the student proved it with undeniable, hard data, the embarrassed professor was painfully forced to climb down and apologize in front of the whole university.", 
        storylineJP: "その有名で非常に頑固な教授は、学生の研究が完全に偽物であると公に主張した。しかし学生が否定できない確固たるデータでそれを証明した時、恥をかいた教授は苦痛を伴いながらも自説を撤回し（引き下がり）、大学全体の前で謝罪せざるを得なかった。", 
        quiz: { question: "Realizing his facts were outdated, the debater had to awkwardly ___.", options: ["climb down", "close off", "cloud over"], correctIndex: 0, explanation: "to admit being wrong." } 
      },
      { 
        pv: "Cling on to", trope: "The Desperate Grasp", cefr: "B2", icon: Heart, 
        meaning: "To try extremely hard to keep something, like a belief, hope, or physical object.", 
        meaningJP: "（希望や物に）しがみつく、固執する", 
        example: "Despite the terrible odds, he desperately clung on to the faint hope of rescue.", 
        exampleJP: "絶望的な状況にもかかわらず、彼は救助のわずかな希望に必死にしがみついていた。",
        vibes: ["Never letting go", "Desperate survival", "Holding onto the past"], 
        vibesJP: ["絶対に手放さない", "必死の生存", "過去にしがみつく"],
        storyline: "The raging river was freezing, and the current was brutally strong. Sora was terrified but absolutely refused to let go, desperately clinging on to the slippery, wet rock until the heroic rescue helicopter finally arrived.", 
        storylineJP: "猛威を振るう川は凍えるように冷たく、流れは残酷なほど強かった。ソラは恐怖に怯えていたが、絶対に手を離すことを拒み、英雄的な救助ヘリがついに到着するまで、滑りやすく濡れた岩に必死にしがみついていた。", 
        quiz: { question: "Even after the undeniable defeat, she sadly ___ her unrealistic dreams.", options: ["clung on to", "clowned around", "coasted along"], correctIndex: 0, explanation: "to try hard to keep." } 
      },
      { 
        pv: "Clog up", trope: "The Traffic Jam", cefr: "B2", icon: XOctagon, 
        meaning: "To completely block something, causing it to stop moving or flowing.", 
        meaningJP: "完全に詰まらせる、塞ぐ", 
        example: "The massive accident severely clogged up the main highway for five straight hours.", 
        exampleJP: "その大規模な事故は、主要な高速道路を5時間ぶっ通しでひどく塞いで（詰まらせて）しまった。",
        vibes: ["Plumbing disasters", "Rush hour traffic", "A blocked system"], 
        vibesJP: ["配管の大惨事", "ラッシュアワーの渋滞", "ブロックされたシステム"],
        storyline: "During the chaotic national holiday, thousands of excited tourists drove their cars into the tiny, ancient mountain village. The massive influx of giant SUVs completely clogged up the narrow, winding streets, trapping everyone for hours.", 
        storylineJP: "カオスな国民の休日の間、何千人もの興奮した観光客が小さな古代の山村に車で乗り込んだ。巨大なSUVの大量流入は、狭く曲がりくねった通りを完全に塞ぎ（詰まらせ）、何時間も全員を閉じ込めた。", 
        quiz: { question: "Pouring that thick, nasty grease down the sink will definitely ___ the pipes.", options: ["clog up", "close down", "clear out"], correctIndex: 0, explanation: "to block completely." } 
      },
      { 
        pv: "Close down", trope: "The Bankrupt Business", cefr: "B1", icon: Lock, 
        meaning: "To permanently stop operating a business or shop.", 
        meaningJP: "（店などを）永久に閉鎖する、廃業する", 
        example: "The beloved old bookshop sadly had to close down due to huge financial debts.", 
        exampleJP: "愛されていた古い本屋は、巨額の借金のために悲しいことに永久に閉鎖（廃業）しなければならなかった。",
        vibes: ["A sad farewell", "Economic depression", "The end of an era"], 
        vibesJP: ["悲しい別れ", "経済の不況", "一つの時代の終わり"],
        storyline: "The cozy, family-owned bakery had served warm, perfect pastries to the neighborhood for sixty long years. But when the massive, cheap supermarket chain opened across the street, the tiny bakery tragically had to close down forever.", 
        storylineJP: "その居心地の良い家族経営のパン屋は、60年という長い間、近所に温かく完璧なペストリーを提供してきた。しかし巨大で安いスーパーのチェーン店が通りの向かいにオープンした時、その小さなパン屋は悲劇的にも永久に廃業（閉鎖）しなければならなかった。", 
        quiz: { question: "Due to the severe, ongoing economic crisis, the old factory will permanently ___.", options: ["close down", "close in", "cobble together"], correctIndex: 0, explanation: "to stop operating permanently." } 
      },
      { 
        pv: "Close in", trope: "The Looming Threat", cefr: "B2", icon: Target, 
        meaning: "To surround someone or something, often while getting closer and closer.", 
        meaningJP: "包囲する、迫ってくる", 
        example: "The fierce, hungry wolves began to close in on the trapped, terrified deer.", 
        exampleJP: "獰猛で飢えた狼たちが、罠にかかって怯える鹿を包囲し（迫り）始めた。",
        vibes: ["Impending doom", "A stressful countdown", "Being surrounded"], 
        vibesJP: ["差し迫った破滅", "ストレスフルなカウントダウン", "囲まれる"],
        storyline: "Sora was completely lost in the thick, disorienting fog. He could hear the strange, eerie footsteps getting louder. Feeling absolute panic, he realized the mysterious shadows were rapidly closing in on him from all sides.", 
        storylineJP: "ソラは濃く方向感覚を失わせる霧の中で完全に迷子になっていた。奇妙で不気味な足音が大きくなるのが聞こえた。絶対的なパニックを感じながら、彼は謎の影が四方八方から急速に彼に迫ってきている（包囲している）ことに気づいた。", 
        quiz: { question: "The dark, threatening storm clouds are quickly ___ on the tiny boat.", options: ["closing in", "closing off", "clearing up"], correctIndex: 0, explanation: "to surround or get closer." } 
      },
      { 
        pv: "Close off", trope: "The VIP Section", cefr: "B2", icon: XCircle, 
        meaning: "To completely block access to a specific place or area.", 
        meaningJP: "（場所を）封鎖する、立ち入り禁止にする", 
        example: "The police completely closed off the busy street following the terrible accident.", 
        exampleJP: "悲惨な事故の後、警察はその混雑した通りを完全に封鎖した。",
        vibes: ["Crime scene tape", "Exclusive VIP events", "Roadblock delays"], 
        vibesJP: ["事件現場のテープ", "限定のVIPイベント", "バリケードによる遅延"],
        storyline: "A massive, highly unexpected sinkhole suddenly opened up right in the middle of the crowded downtown intersection. The panicked local police immediately arrived and completely closed off the entire block to prevent any tragic accidents.", 
        storylineJP: "混雑したダウンタウンの交差点のど真ん中に、巨大で全く予期せぬ陥没穴が突然開いた。パニックになった地元警察が即座に到着し、悲劇的な事故を防ぐためにブロック全体を完全に封鎖した（立ち入り禁止にした）。", 
        quiz: { question: "For the famous celebrity's private wedding, they had to strictly ___ the entire beach.", options: ["close off", "climb down", "chuck away"], correctIndex: 0, explanation: "to block access." } 
      },
      { 
        pv: "Cloud over", trope: "The Sudden Gloom", cefr: "B2", icon: CloudOff, 
        meaning: "For the sky to become completely covered in clouds, or someone's face to look unhappy.", 
        meaningJP: "（空が）曇る、（顔が）曇る", 
        example: "The bright, sunny morning quickly clouded over, and then the heavy rain started.", 
        exampleJP: "明るく晴れた朝はあっという間に曇り、そして大雨が降り始めた。",
        vibes: ["Ruined picnics", "A sudden shift in mood", "Dark skies"], 
        vibesJP: ["台無しになったピクニック", "気分の突然の変化", "暗い空"],
        storyline: "The outdoor festival was going perfectly under the bright blue sky. But when the strict teacher suddenly arrived and demanded to see everyone's homework, Sora's cheerful face instantly clouded over with deep anxiety and dread.", 
        storylineJP: "屋外のフェスティバルは真っ青な空の下で完璧に進行していた。しかし、厳格な教師が突然現れ、全員の宿題を見るよう要求した時、ソラの陽気な顔は深い不安と恐怖で瞬時に曇った。", 
        quiz: { question: "When she heard the undeniably bad news, her previously happy expression noticeably ___.", options: ["clouded over", "clogged up", "cleared away"], correctIndex: 0, explanation: "to become cloudy or unhappy." } 
      },
      { 
        pv: "Clown around", trope: "The Class Joker", cefr: "B1", icon: Smile, 
        meaning: "To behave in a totally silly or foolish way to make other people laugh.", 
        meaningJP: "ふざけ回る、おどける", 
        example: "Please stop constantly clowning around and just finish your serious homework!", 
        exampleJP: "絶えずふざけ回るのはやめて、とにかく大事な宿題を終わらせて！",
        vibes: ["Classroom distractions", "Goofing off with friends", "Being the funny one"], 
        vibesJP: ["教室での気晴らし", "友達とふざける", "ひょうきん者になる"],
        storyline: "The museum tour was supposed to be a serious, highly educational experience. But Leo simply couldn't behave. He kept clowning around, putting ancient Roman helmets on his head and dramatically posing for ridiculous selfies, totally annoying the tour guide.", 
        storylineJP: "博物館のツアーは真面目で非常に教育的な体験になるはずだった。しかしレオはどうしても大人しくできなかった。彼はふざけ回り続け、古代ローマの兜を頭に被り、馬鹿げた自撮りのためにドラマチックなポーズをとり、ツアーガイドを完全に苛立たせた。", 
        quiz: { question: "The hyperactive boys were endlessly ___ in the back of the quiet library.", options: ["clowning around", "coasting along", "clinging on to"], correctIndex: 0, explanation: "to act silly." } 
      },
      { 
        pv: "Coast along", trope: "The Bare Minimum", cefr: "B2", icon: Activity, 
        meaning: "To do only the absolute minimum amount of work necessary to survive or pass.", 
        meaningJP: "（努力せずに）楽にやっていく、惰性で進む", 
        example: "You're exceptionally smart, but you can't just casually coast along forever.", 
        exampleJP: "あなたは並外れて賢いけれど、いつまでも呑気に惰性で進む（楽にやっていく）わけにはいかないよ。",
        vibes: ["Cruising through school", "Zero effort", "Wasting natural talent"], 
        vibesJP: ["学校を楽々と通り抜ける", "努力ゼロ", "生まれつきの才能を無駄にする"],
        storyline: "Ken was undeniably a natural genius at mathematics. He never studied, never opened a textbook, and just lazily coasted along, managing to score a solid B on every single test while playing video games all night.", 
        storylineJP: "ケンは数学において否定できない生まれつきの天才だった。彼は決して勉強せず、教科書も開かず、ただ怠惰に惰性で進み（楽にやっていき）、一晩中ビデオゲームをしながら、すべてのテストでしっかりとしたB評価を取り続けていた。", 
        quiz: { question: "She didn't try hard at all; she just complacently ___ through her senior year.", options: ["coasted along", "cobbled together", "chucked in"], correctIndex: 0, explanation: "to do minimal work." } 
      },
      { 
        pv: "Cobble together", trope: "The MacGyver Fix", cefr: "C1", icon: Hammer, 
        meaning: "To quickly make or assemble something roughly from whatever parts are available.", 
        meaningJP: "（あり合わせのもので）急いで作り上げる、でっち上げる", 
        example: "We frantically cobbled together a crude, unstable raft from old, rotten branches.", 
        exampleJP: "私たちは古くて腐った枝から、粗末で不安定なイカダを狂ったように急いで作り上げた。",
        vibes: ["A desperate DIY fix", "Last-minute project panics", "Creative survival"], 
        vibesJP: ["必死のDIY修理", "直前のプロジェクトのパニック", "クリエイティブなサバイバル"],
        storyline: "The deadline for the massive science fair was in exactly one hour. With absolutely zero preparation, the panicked team furiously cobbled together a strange, sparking robot out of duct tape, a broken toaster, and pure adrenaline.", 
        storylineJP: "巨大なサイエンスフェアの締め切りはきっかり1時間後だった。全く準備をしていなかったパニック状態のチームは、ダクトテープ、壊れたトースター、そして純粋なアドレナリンを使って、火花を散らす奇妙なロボットを猛烈な勢いで急いで作り上げた（でっち上げた）。", 
        quiz: { question: "With no actual ingredients, I miraculously ___ a somewhat tasty soup from leftovers.", options: ["cobbled together", "cleared out", "closed down"], correctIndex: 0, explanation: "to assemble roughly." } 
      }
    ],
  13: [
      { 
        pv: "Cock up", trope: "The Epic Fail", cefr: "C1", icon: Trash2, 
        meaning: "To completely ruin or spoil something.", 
        meaningJP: "（計画などを）台無しにする、ひどくしくじる", 
        example: "He completely cocked up the crucial presentation by forgetting his notes.", 
        exampleJP: "彼はメモを忘れたことで、その重要なプレゼンを完全に台無しにした（ひどくしくじった）。",
        vibes: ["Ruining a big opportunity", "Making a massive mistake", "Embarrassing failures"], 
        vibesJP: ["大きなチャンスを台無しにする", "とてつもないミスをする", "恥ずかしい失敗"],
        storyline: "Leo was supposed to bake a beautiful cake for his mom's birthday. But he completely cocked up the recipe, adding salt instead of sugar and burning it to a crisp.", 
        storylineJP: "レオは母親の誕生日に美しいケーキを焼くはずだった。しかし彼はレシピを完全に台無しにし、砂糖の代わりに塩を入れ、黒焦げにしてしまった。", 
        quiz: { question: "He really ___ the surprise party by accidentally telling her about it.", options: ["cocked up", "came about", "cooped up"], correctIndex: 0, explanation: "to ruin or spoil." } 
      },
      { 
        pv: "Colour in", trope: "The Mindful Artist", cefr: "A1", icon: Sparkles, 
        meaning: "To fill a shape or drawing with colour.", 
        meaningJP: "色を塗る", 
        example: "The children spent the afternoon colouring in their new picture books.", 
        exampleJP: "子供たちは午後を、新しい絵本に色を塗って過ごした。",
        vibes: ["Childhood memories", "Relaxing hobbies", "Creative focus"], 
        vibesJP: ["子供時代の思い出", "リラックスできる趣味", "クリエイティブな集中"],
        storyline: "To calm her anxiety before the big exam, Hina bought an intricate mandala book. She spent three quiet hours just colouring in the tiny details with bright markers.", 
        storylineJP: "大試験前の不安を静めるため、ヒナは複雑な曼荼羅の本を買った。彼女は鮮やかなマーカーで細かい部分にただ色を塗って、静かな3時間を過ごした。", 
        quiz: { question: "She asked her little brother to neatly ___ the drawing of the dragon.", options: ["colour in", "come about", "crack on"], correctIndex: 0, explanation: "to fill with color." } 
      },
      { 
        pv: "Come about", trope: "The Plot Twist", cefr: "B2", icon: Lightbulb, 
        meaning: "To happen, especially by chance or unexpectedly.", 
        meaningJP: "（偶然に）起こる、生じる", 
        example: "How did this incredibly strange situation come about?", 
        exampleJP: "この信じられないほど奇妙な状況は、一体どのようにして生じた（起こった）のですか？",
        vibes: ["Unexpected plot twists", "Investigating a mystery", "Historical changes"], 
        vibesJP: ["予期せぬどんでん返し", "ミステリーを調査する", "歴史的な変化"],
        storyline: "The small startup suddenly became a billion-dollar empire overnight. When reporters asked how this massive success came about, the founder just smiled.", 
        storylineJP: "小さなスタートアップが一夜にして10億ドルの帝国になった。記者たちがこの大成功がどのようにして起こったのかを尋ねると、創業者はただ微笑んだ。", 
        quiz: { question: "Can you explain how this terrible disaster actually ___?", options: ["came about", "came apart", "came round"], correctIndex: 0, explanation: "to happen." } 
      },
      { 
        pv: "Come across", trope: "The Hidden Treasure", cefr: "B1", icon: Search, 
        meaning: "To find something by chance, or to make a certain impression.", 
        meaningJP: "偶然見つける、（～という）印象を与える", 
        example: "I came across some incredibly rare photos in the dusty attic.", 
        exampleJP: "私は埃っぽい屋根裏部屋で、信じられないほど希少な写真を偶然見つけた。",
        vibes: ["Thrifting rare finds", "First impressions", "Stumbling upon secrets"], 
        vibesJP: ["古着屋でレアなものを見つける", "第一印象", "秘密に偶然出くわす"],
        storyline: "While cleaning the attic, Kaito opened a heavy chest. Inside, buried under old blankets, he unexpectedly came across a beautifully preserved ancient map.", 
        storylineJP: "屋根裏部屋を掃除している時、海斗は重い箱を開けた。古い毛布の下に埋もれたその中で、彼は美しく保存された古代の地図を偶然見つけた。", 
        quiz: { question: "I randomly ___ a fascinating article about space travel online.", options: ["came across", "came down with", "came over"], correctIndex: 0, explanation: "to find by chance." } 
      },
      { 
        pv: "Come apart", trope: "The Cheap Knockoff", cefr: "B2", icon: XOctagon, 
        meaning: "To break into pieces or separate.", 
        meaningJP: "バラバラになる、壊れる", 
        example: "The exceptionally cheap toy completely came apart in my hands.", 
        exampleJP: "そのとてつもなく安っぽいおもちゃは、私の手の中で完全にバラバラに壊れた。",
        vibes: ["Flimsy products", "DIY disasters", "Things breaking"], 
        vibesJP: ["安っぽい製品", "DIYの惨事", "物が壊れる"],
        storyline: "Leo proudly bought a discounted luxury watch from a sketchy vendor. But the first time he put it on, the metal band literally came apart in his hands.", 
        storylineJP: "レオは怪しい商人から割引された高級時計を誇らしげに買った。しかし初めてそれをつけた時、金属のバンドが文字通り彼の手の中でバラバラになった。", 
        quiz: { question: "The old, fragile book literally ___ when I opened it.", options: ["came apart", "came forward", "came in"], correctIndex: 0, explanation: "to break into pieces." } 
      },
      { 
        pv: "Come around / round", trope: "The Changed Mind", cefr: "C1", icon: RefreshCw, 
        meaning: "To slowly change your opinion to agree with someone.", 
        meaningJP: "（意見を）変える、同調する", 
        example: "He hated the risky idea at first, but he finally came around.", 
        exampleJP: "彼は最初はそのリスクの高いアイデアを嫌っていたが、ついに意見を変えた（同調した）。",
        vibes: ["Winning a difficult argument", "Changing stubborn minds", "Accepting the truth"], 
        vibesJP: ["困難な議論に勝つ", "頑固な考えを変えさせる", "真実を受け入れる"],
        storyline: "Sora's strict dad initially hated his esports dream. But after watching Sora win a massive global tournament, his dad finally came around and bought a team jersey.", 
        storylineJP: "ソラの厳格な父親は当初、彼のeスポーツの夢を嫌っていた。しかしソラが世界大会で優勝するのを見て、父親はついに意見を変え、チームのジャージを買った。", 
        quiz: { question: "She was completely opposed to the plan, but eventually she ___.", options: ["came around", "came apart", "came across"], correctIndex: 0, explanation: "to change one's opinion." } 
      },
      { 
        pv: "Come back", trope: "The Nostalgic Return", cefr: "A2", icon: Undo2, 
        meaning: "To return to a place or to become popular again.", 
        meaningJP: "戻る、再び流行する", 
        example: "I really hope that 90s fashion completely comes back.", 
        exampleJP: "私は90年代のファッションが完全に再び流行する（戻ってくる）ことを本当に願っている。",
        vibes: ["Vintage aesthetics", "Returning home", "Retro trends"], 
        vibesJP: ["ビンテージの美学", "故郷に帰る", "レトロなトレンド"],
        storyline: "After living in the futuristic city for five years, Sora finally came back to his quiet hometown. The old bakery was still there, unchanged and perfect.", 
        storylineJP: "未来的な都市に5年間住んだ後、ソラはついに静かな故郷に戻ってきた。古いパン屋は変わらず完璧なままそこにあった。", 
        quiz: { question: "Many fashion designers are predicting that baggy jeans will ___ this summer.", options: ["come back", "come off", "come over"], correctIndex: 0, explanation: "to become popular again." } 
      },
      { 
        pv: "Come before", trope: "The Top Priority", cefr: "B2", icon: Award, 
        meaning: "To be more important than something else, or to appear in court.", 
        meaningJP: "（〜より）優先される、重要である", 
        example: "In this strict company, loyalty must always come before profit.", 
        exampleJP: "この厳格な会社では、忠誠心は常に利益よりも優先されなければ（重要でなければ）ならない。",
        vibes: ["Setting strict priorities", "Family first", "Courtroom judgments"], 
        vibesJP: ["厳密な優先順位を設定する", "家族第一", "法廷での判決"],
        storyline: "The ruthless CEO demanded Kaito work on the holiday. Kaito firmly refused. 'I'm sorry, but my family will always come before this company,' he stated coldly.", 
        storylineJP: "冷酷なCEOは海斗に休日も働くよう要求した。海斗は固く拒否した。「申し訳ありませんが、私の家族は常にこの会社より優先されます」と彼は冷たく言い放った。", 
        quiz: { question: "For a true artist, creative integrity should always ___ money.", options: ["come before", "come by", "come down"], correctIndex: 0, explanation: "to be more important." } 
      },
      { 
        pv: "Come by", trope: "The Rare Find", cefr: "C1", icon: Home, 
        meaning: "To acquire something (often difficult), or to visit casually.", 
        meaningJP: "手に入れる、ふらっと立ち寄る", 
        example: "Good, reliable friends are incredibly hard to come by these days.", 
        exampleJP: "最近では、良くて信頼できる友人というのは、信じられないほど手に入りにくい。",
        vibes: ["Finding rare items", "Casual visits", "Appreciating scarcity"], 
        vibesJP: ["レアなアイテムを見つける", "カジュアルな訪問", "希少性を評価する"],
        storyline: "The vintage synthesizer was legendary. When Rin finally found one in a dusty shop, the owner smiled. 'A piece like that is very hard to come by,' he whispered.", 
        storylineJP: "そのビンテージシンセサイザーは伝説的だった。リンがついに埃っぽい店でそれを見つけた時、店主は微笑んだ。「あんな品はとても手に入りにくいんだよ」と彼は囁いた。", 
        quiz: { question: "How did you manage to ___ such a rare and expensive ticket?", options: ["come by", "come back", "come off"], correctIndex: 0, explanation: "to acquire." } 
      },
      { 
        pv: "Come down", trope: "The Heavy Rain", cefr: "B1", icon: Droplets, 
        meaning: "To rain heavily, or for a price/level to decrease.", 
        meaningJP: "（雨が）激しく降る、下がる", 
        example: "The rain was coming down so hard we couldn't see the road.", 
        exampleJP: "道路が見えないほど、雨が激しく降っていた。",
        vibes: ["Sudden storms", "Prices dropping", "Seeking shelter"], 
        vibesJP: ["突然の嵐", "価格の下落", "避難場所を探す"],
        storyline: "They were halfway up the mountain when the sky turned black. Suddenly, the rain started to come down in absolute sheets, forcing them into a small cave.", 
        storylineJP: "彼らが山の中腹にいた時、空が黒くなった。突然、雨が文字通り激しく降り始め、彼らは小さな洞窟に避難せざるを得なくなった。", 
        quiz: { question: "We have to wait here until the incredibly heavy rain stops ___.", options: ["coming down", "coming off", "coming out"], correctIndex: 0, explanation: "to rain heavily." } 
      },
      { 
        pv: "Come down on", trope: "The Strict Boss", cefr: "C2", icon: Gavel, 
        meaning: "To punish or criticize someone very strictly and harshly.", 
        meaningJP: "厳しく罰する、激しく非難する", 
        example: "The manager came down heavily on anyone who arrived late.", 
        exampleJP: "マネージャーは、遅刻した者を誰であれ厳しく罰した（激しく非難した）。",
        vibes: ["Zero tolerance rules", "Facing harsh criticism", "A terrifying scolding"], 
        vibesJP: ["一切の妥協なしのルール", "厳しい批判に直面する", "恐ろしいお説教"],
        storyline: "The team completely missed the vital deadline. The furious director didn't just fire them; he came down on them with a terrifying two-hour lecture about corporate responsibility.", 
        storylineJP: "チームは極めて重要な締め切りを完全に見逃した。激怒したディレクターは彼らを単に解雇しただけでなく、企業の責任について恐ろしい2時間の説教で彼らを激しく非難した。", 
        quiz: { question: "The government promised to strongly ___ illegal street racing.", options: ["come down on", "come down with", "come in for"], correctIndex: 0, explanation: "to punish strictly." } 
      },
      { 
        pv: "Come down with", trope: "The Sudden Sickness", cefr: "B2", icon: Thermometer, 
        meaning: "To start to suffer from a minor illness.", 
        meaningJP: "（病気などに）かかる", 
        example: "I think I'm coming down with a really nasty flu.", 
        exampleJP: "本当に厄介なインフルエンザにかかり始めていると思う。",
        vibes: ["Feeling terrible", "Calling in sick", "Winter blues"], 
        vibesJP: ["最悪の気分", "病欠の電話をする", "冬の憂鬱"],
        storyline: "The day before the highly anticipated music festival, Mika woke up shivering with a blazing fever. Realizing she was rapidly coming down with something serious, she tragically gave her ticket away.", 
        storylineJP: "待ちに待った音楽フェスの前日、ミカは震えと燃えるような熱で目を覚ました。急速に何か深刻な病気にかかり始めていると悟り、彼女は悲劇的にもチケットを他人に譲った。", 
        quiz: { question: "He missed the crucial meeting because he ___ a terrible cold.", options: ["came down with", "came into", "came off"], correctIndex: 0, explanation: "to get an illness." } 
      },
      { 
        pv: "Come from", trope: "The Hometown Pride", cefr: "A1", icon: Map, 
        meaning: "To originate in a specific place or to be born there.", 
        meaningJP: "〜の出身である、〜に由来する", 
        example: "This delicious, spicy dish originally comes from southern Italy.", 
        exampleJP: "この美味しくてスパイシーな料理は、もともと南イタリアに由来する。",
        vibes: ["Sharing cultural roots", "Tracing history", "Local pride"], 
        vibesJP: ["文化的ルーツを共有する", "歴史をたどる", "地元の誇り"],
        storyline: "Everyone assumed the quiet transfer student was from the bustling capital. But when he proudly showed his rural accent, he smiled. 'I actually come from a tiny farming village up north.'", 
        storylineJP: "誰もがその物静かな転校生は賑やかな首都の出身だと思っていた。しかし彼が誇らしげに田舎の訛りを見せた時、彼は微笑んだ。「実は北部の小さな農村の出身なんだ。」", 
        quiz: { question: "The brilliant new intern actually ___ a very famous university in London.", options: ["comes from", "comes out", "comes down"], correctIndex: 0, explanation: "to originate from." } 
      },
      { 
        pv: "Come in", trope: "The Finish Line", cefr: "A2", icon: CheckCircle2, 
        meaning: "To arrive, enter a room, or finish a race in a certain position.", 
        meaningJP: "入る、到着する、ゴールする", 
        example: "The furious boss asked me to come in to his office immediately.", 
        exampleJP: "激怒したボスは、私に直ちにオフィスへ入る（来る）ように言った。",
        vibes: ["Entering a space", "Waiting for a flight", "Crossing the finish line"], 
        vibesJP: ["空間に入る", "フライトを待つ", "フィニッシュラインを越える"],
        storyline: "Sora trained for months for the grueling marathon. He didn't win, but he proudly came in fourth place, completely exhausting every last drop of his energy.", 
        storylineJP: "ソラは過酷なマラソンのために何ヶ月もトレーニングした。優勝はできなかったが、彼は最後のエネルギーの一滴まで完全に使い果たし、誇らしげに4位でゴールした。", 
        quiz: { question: "What exact time does the express train from Tokyo usually ___?", options: ["come in", "come on", "come out"], correctIndex: 0, explanation: "to arrive." } 
      },
      { 
        pv: "Come in for", trope: "The Harsh Criticism", cefr: "C1", icon: Angry, 
        meaning: "To receive blame, criticism, or praise.", 
        meaningJP: "（非難などを）受ける", 
        example: "The mayor came in for a lot of harsh criticism over the new tax.", 
        exampleJP: "市長は新しい税金について、多くの厳しい批判を受けた。",
        vibes: ["Facing public backlash", "Taking the heat", "Cancel culture"], 
        vibesJP: ["大衆の反発に直面する", "非難を浴びる", "キャンセルカルチャー"],
        storyline: "After releasing a highly controversial movie, the arrogant director came in for intense, global criticism from fans who felt he completely ruined the beloved franchise.", 
        storylineJP: "非常に物議を醸す映画を公開した後、その傲慢な監督は、愛されるシリーズを完全に台無しにしたと感じるファンから、強烈で世界的な非難を受けた。", 
        quiz: { question: "The new, unpopular policy has ___ a massive amount of public anger.", options: ["come in for", "come down with", "come up against"], correctIndex: 0, explanation: "to receive blame." } 
      },
      { 
        pv: "Come into", trope: "The Sudden Heir", cefr: "C1", icon: DollarSign, 
        meaning: "To suddenly receive money or property, usually through inheritance.", 
        meaningJP: "（財産などを）相続する、受け継ぐ", 
        example: "She came into a massive fortune when her eccentric uncle passed away.", 
        exampleJP: "変わり者の叔父が亡くなった時、彼女は莫大な財産を相続した。",
        vibes: ["Unexpected wealth", "Inheriting an old mansion", "Becoming rich overnight"], 
        vibesJP: ["予期せぬ富", "古いお屋敷を相続する", "一夜にして金持ちになる"],
        storyline: "Rin was barely surviving on instant noodles. Out of nowhere, she received a letter stating she had come into a vast country estate from a distant, forgotten relative.", 
        storylineJP: "リンはインスタントラーメンでかろうじて生き延びていた。どこからともなく、彼女は遠く忘れ去られた親戚から広大な田舎の領地を相続したと書かれた手紙を受け取った。", 
        quiz: { question: "He unexpectedly ___ a vast sum of money after the tragedy.", options: ["came into", "came up with", "counted on"], correctIndex: 0, explanation: "to inherit money." } 
      },
      { 
        pv: "Come off", trope: "The Flawless Execution", cefr: "C1", icon: Star, 
        meaning: "To happen as planned, or to succeed in doing something.", 
        meaningJP: "（計画などが）成功する、予定通りに行われる", 
        example: "The highly complex surprise party came off perfectly.", 
        exampleJP: "その非常に複雑なサプライズパーティーは、完璧に成功した（予定通りに行われた）。",
        vibes: ["Pulling off a master plan", "Relief after a big event", "A successful gamble"], 
        vibesJP: ["マスタープランをやってのける", "大イベントの後の安堵", "成功したギャンブル"],
        storyline: "The coordinated heist required absolute precision. Despite a terrified moment when the alarms almost triggered, the daring operation amazingly came off without a single hitch.", 
        storylineJP: "組織化された強盗は絶対的な精度を要求した。警報が作動しかけた恐怖の瞬間があったにもかかわらず、その大胆な作戦は驚くべきことに、一つの問題もなく完璧に成功した。", 
        quiz: { question: "I was extremely worried, but the tricky presentation ___ beautifully.", options: ["came off", "came out", "came over"], correctIndex: 0, explanation: "to succeed as planned." } 
      },
      { 
        pv: "Come on", trope: "The Hype Chant", cefr: "A2", icon: Zap, 
        meaning: "To encourage someone, or for a machine to start functioning.", 
        meaningJP: "（機械が）作動する、応援する、急げ", 
        example: "Come on! We are going to completely miss the final train!", 
        exampleJP: "急いで（さあ）！最終電車を完全に逃しちゃうよ！",
        vibes: ["Cheering loudly", "Rushing a slow friend", "Waiting for the AC to start"], 
        vibesJP: ["大声で応援する", "遅い友達を急かす", "エアコンが作動するのを待つ"],
        storyline: "Sora was losing the boxing match badly. From the stands, his best friend screamed, 'Come on, Sora! Get up!' The intense encouragement sparked a miraculous comeback.", 
        storylineJP: "ソラはボクシングの試合でひどく負けていた。スタンドから親友が「頑張れ、ソラ！立ち上がれ！」と叫んだ。その強烈な応援が奇跡的な逆転劇の火付け役となった。", 
        quiz: { question: "I'm patiently waiting for the central heating to finally ___.", options: ["come on", "come in", "come off"], correctIndex: 0, explanation: "to start functioning." } 
      },
      { 
        pv: "Come out", trope: "The Grand Reveal", cefr: "B1", icon: Eye, 
        meaning: "To become known, to be published, or to publicly declare one's identity.", 
        meaningJP: "（事実が）明らかになる、出版される、カミングアウトする", 
        example: "The shocking truth about his secret identity finally came out.", 
        exampleJP: "彼の秘密の正体に関する衝撃的な真実が、ついに明らかになった。",
        vibes: ["Dropping new content", "Spilling massive secrets", "A public debut"], 
        vibesJP: ["新しいコンテンツをドロップする", "巨大な秘密を漏らす", "公のデビュー"],
        storyline: "For months, rumors heavily swirled about the famous idol. The overwhelming pressure peaked until the absolute truth finally came out via leaked photos, crashing social media.", 
        storylineJP: "何ヶ月もの間、その有名なアイドルについての噂が激しく渦巻いていた。圧倒的な圧力は頂点に達し、ついに流出した写真によって絶対的な真実が明らかになり、SNSをダウンさせた。", 
        quiz: { question: "When exactly does their highly anticipated new album ___?", options: ["come out", "cross out", "cut out"], correctIndex: 0, explanation: "to be published or revealed." } 
      },
      { 
        pv: "Come out in", trope: "The Allergy Panic", cefr: "C1", icon: AlertTriangle, 
        meaning: "To develop a rash, spots, or a physical reaction on your skin.", 
        meaningJP: "（発疹などが）出る", 
        example: "If I eat shrimp, I instantly come out in an incredibly itchy red rash.", 
        exampleJP: "エビを食べると、即座に信じられないほど痒い赤い発疹が出る。",
        vibes: ["Skin sensitivity", "Medical panics", "Allergic reactions"], 
        vibesJP: ["肌の敏感さ", "医学的なパニック", "アレルギー反応"],
        storyline: "Kaito wanted to impress his date by ordering the expensive seafood. But tragically, the rich lobster caused him to come out in a painfully itchy rash right during dinner.", 
        storylineJP: "海斗は高価なシーフードを注文してデート相手を感心させたかった。しかし悲劇的なことに、そのロブスターは、ディナーの最中に彼に痛痒い発疹を出させた。", 
        quiz: { question: "Touching that strange, poisonous plant made her ___ painful blisters.", options: ["come out in", "come down with", "catch on to"], correctIndex: 0, explanation: "to develop a skin condition." } 
      },
      { 
        pv: "Come out of", trope: "The Bright Side", cefr: "B2", icon: TrendingUp, 
        meaning: "To develop from something, or to recover from a bad situation.", 
        meaningJP: "〜から生じる、結果として起こる", 
        example: "I genuinely hope something positive will come out of this absolute mess.", 
        exampleJP: "この絶対的な混乱から、何かポジティブな結果が生じることを心から願っている。",
        vibes: ["Finding the silver lining", "Recovering from trauma", "Unexpected good results"], 
        vibesJP: ["希望の光を見つける", "トラウマからの回復", "予期せぬ良い結果"],
        storyline: "The terrible hurricane destroyed the town's old bridge. However, the only good thing to come out of the disaster was the community uniting to build a beautiful new park.", 
        storylineJP: "ひどいハリケーンが町の古い橋を破壊した。しかし、その大惨事から生じた唯一の素晴らしい結果は、地域社会が団結して美しい新しい公園を建設したことだった。", 
        quiz: { question: "Let's hope that a brilliant new strategy will ___ this long meeting.", options: ["come out of", "come up against", "con out of"], correctIndex: 0, explanation: "to develop from." } 
      },
      { 
        pv: "Come out with", trope: "The Shocking Statement", cefr: "C1", icon: MessageCircle, 
        meaning: "To say something entirely unexpectedly or surprisingly.", 
        meaningJP: "（出し抜けに）言い出す", 
        example: "He suddenly came out with the most ridiculous excuse I've ever heard.", 
        exampleJP: "彼は突然、私が今まで聞いた中で最も馬鹿げた言い訳を出し抜けに言い出した。",
        vibes: ["Dropping bombs", "Unexpected confessions", "Blurting the truth"], 
        vibesJP: ["爆弾発言をする", "予期せぬ告白", "真実をうっかり口走る"],
        storyline: "The dinner was incredibly quiet and polite. Then, without any warning, Grandpa entirely ruined the peaceful vibe when he randomly came out with a highly controversial political opinion.", 
        storylineJP: "夕食は信じられないほど静かで礼儀正しかった。それから何の前触れもなく、祖父が非常に物議を醸す政治的意見を出し抜けに言い出し、平和な雰囲気を完全に台無しにした。", 
        quiz: { question: "She shocked everyone when she suddenly ___ a brilliant, wild idea.", options: ["came out with", "came down on", "cooked up"], correctIndex: 0, explanation: "to say unexpectedly." } 
      }
    ],

    14: [
      { 
        pv: "Come over", trope: "The Casual Visit", cefr: "A2", icon: Home, 
        meaning: "To visit someone's house casually, or for a feeling to affect you.", 
        meaningJP: "（家に）やってくる、（感情が）襲う", 
        example: "Why don't you come over tonight and we can watch some movies?", 
        exampleJP: "今夜うちに来ない？一緒に映画でも見ようよ。",
        vibes: ["Inviting friends", "Casual hangouts", "A sudden wave of emotion"], 
        vibesJP: ["友達を誘う", "カジュアルな集まり", "突然の感情の波"],
        storyline: "Feeling lonely on a rainy Sunday, Kaito texted his group chat, 'I bought three giant pizzas. Do you guys want to come over and completely waste the day?'", 
        storylineJP: "雨の日曜日に孤独を感じ、海斗はグループチャットに「巨大なピザを3枚買ったんだ。お前ら、うちに来て一日中完全に無駄に過ごさない？」と送った。", 
        quiz: { question: "Feel absolutely free to ___ to my apartment whenever you are free.", options: ["come over", "come apart", "cool down"], correctIndex: 0, explanation: "to visit casually." } 
      },
      { 
        pv: "Come round", trope: "The Wake-Up", cefr: "B2", icon: Activity, 
        meaning: "To regain consciousness, or to change your opinion.", 
        meaningJP: "意識を取り戻す、意見を変える", 
        example: "The doctors were relieved when the patient finally came round after surgery.", 
        exampleJP: "患者が手術後にようやく意識を取り戻した時、医者たちは安堵した。",
        vibes: ["Medical recovery", "Waking up dazed", "Finally agreeing"], 
        vibesJP: ["医学的な回復", "ぼんやりと目覚める", "ついに同意する"],
        storyline: "The boxer took a devastating hit and collapsed in the ring. The terrified crowd held their breath for two agonizing minutes until he slowly came round and blinked.", 
        storylineJP: "ボクサーは壊滅的な一撃を受け、リングに倒れ込んだ。怯えた観客は、彼がゆっくりと意識を取り戻して瞬きするまで、苦痛な2分間息を呑んだ。", 
        quiz: { question: "After fainting from the extreme heat, it took him ten minutes to ___.", options: ["come round", "come off", "cotton on"], correctIndex: 0, explanation: "to regain consciousness." } 
      },
      { 
        pv: "Come through", trope: "The Clutch Save", cefr: "C1", icon: Shield, 
        meaning: "To successfully produce a promised result, or survive a dangerous situation.", 
        meaningJP: "（約束を）果たす、危機を乗り越える", 
        example: "I knew you would come through and secure the vital tickets for us!", 
        exampleJP: "君が約束を果たし、私たちのために重要なチケットを確保してくれると知っていたよ！",
        vibes: ["Being totally reliable", "Surviving trauma", "A clutch victory"], 
        vibesJP: ["完全に信頼できる", "トラウマを生き延びる", "土壇場での勝利"],
        storyline: "The deadline was in five minutes, and the files were corrupted. Just as panic set in, the quiet IT guy managed to come through, magically restoring everything at the last second.", 
        storylineJP: "締め切りまで5分で、ファイルは破損していた。パニックになりかけたその時、物静かなIT担当者が約束を果たし、最後の瞬間に魔法のようにすべてを復元した。", 
        quiz: { question: "Despite the terrible odds, the brave soldiers managed to safely ___.", options: ["come through", "con into", "coop up"], correctIndex: 0, explanation: "to survive or deliver." } 
      },
      { 
        pv: "Come to", trope: "The Final Total", cefr: "B1", icon: Calculator, 
        meaning: "To total a specific amount, or to regain consciousness.", 
        meaningJP: "合計〜になる、意識を取り戻す", 
        example: "The insanely expensive dinner bill came to over five hundred dollars.", 
        exampleJP: "その異常に高価な夕食の請求は、500ドルを超えた（合計500ドル以上になった）。",
        vibes: ["Splitting the check", "Shocking expenses", "Waking up confused"], 
        vibesJP: ["割り勘にする", "衝撃的な出費", "混乱して目覚める"],
        storyline: "Mika excitedly loaded her shopping cart with aesthetic stationery. But when the cashier scanned the final item, her face paled as the total came to an impossible 200 dollars.", 
        storylineJP: "ミカは興奮しておしゃれな文房具をカートに詰め込んだ。しかしレジ係が最後の商品をスキャンした時、合計が不可能な200ドルになり彼女の顔は青ざめた。", 
        quiz: { question: "With all the hidden taxes, the total cost of the holiday ___ $2,000.", options: ["came to", "came before", "counted for"], correctIndex: 0, explanation: "to total an amount." } 
      },
      { 
        pv: "Come up", trope: "The Sudden Obstacle", cefr: "B1", icon: AlertCircle, 
        meaning: "To appear or happen unexpectedly, or to be mentioned in conversation.", 
        meaningJP: "（問題が）生じる、話題に上る", 
        example: "I'm so sorry I must cancel our date; something urgent has come up at work.", 
        exampleJP: "デートをキャンセルしなきゃいけなくて本当にごめん。職場で急な問題が生じたんだ。",
        vibes: ["Last-minute cancellations", "Unexpected issues", "Dodging awkward topics"], 
        vibesJP: ["直前のキャンセル", "予期せぬ問題", "気まずい話題を避ける"],
        storyline: "Hina was completely ready for the concert. Then her phone buzzed. It was Kaito. 'I'm so sorry, a massive family emergency came up. I can't make it tonight.'", 
        storylineJP: "ヒナはコンサートの準備を完全に終えていた。その時スマホが鳴った。海斗からだった。「本当にごめん、家族の大きな緊急事態が生じたんだ。今夜は行けない。」", 
        quiz: { question: "Whenever we forcefully try to implement the new software, strange errors constantly ___.", options: ["come up", "cool off", "cop out"], correctIndex: 0, explanation: "to happen unexpectedly." } 
      },
      { 
        pv: "Come up against", trope: "The Boss Battle", cefr: "C1", icon: XOctagon, 
        meaning: "To encounter a difficult problem, resistance, or a strong opponent.", 
        meaningJP: "（困難に）直面する", 
        example: "The progressive new mayor came up against fierce opposition from the wealthy elites.", 
        exampleJP: "進歩的な新市長は、裕福なエリートたちからの激しい反対に直面した。",
        vibes: ["Facing strict resistance", "An impossible challenge", "The final boss"], 
        vibesJP: ["厳しい抵抗に直面する", "不可能な挑戦", "ラスボス"],
        storyline: "The small indie studio's game was a masterpiece. But when they tried to launch it globally, they came up against aggressive, multi-billion dollar rival corporations trying to crush them.", 
        storylineJP: "小さなインディースタジオのゲームは傑作だった。しかし世界規模でリリースしようとした時、彼らを潰そうとする何十億ドル規模の攻撃的なライバル企業に直面した。", 
        quiz: { question: "The young detective ___ a highly complex web of lies during the investigation.", options: ["came up against", "came down on", "cooked up"], correctIndex: 0, explanation: "to encounter a difficulty." } 
      },
      { 
        pv: "Come up with", trope: "The Genius Idea", cefr: "B1", icon: Lightbulb, 
        meaning: "To think of or invent an idea, plan, or excuse.", 
        meaningJP: "（アイデアを）思いつく", 
        example: "She impressively came up with a brilliant solution to our massive problem.", 
        exampleJP: "彼女は私たちの巨大な問題に対する見事な解決策を見事に思いついた。",
        vibes: ["Big brain moments", "Creative problem solving", "Inventing quick excuses"], 
        vibesJP: ["頭が冴える瞬間", "創造的な問題解決", "とっさの言い訳を考える"],
        storyline: "The design team was entirely stuck on the marketing campaign. Suddenly, the quietest intern stood up and incredibly came up with a genuinely revolutionary concept that blew everyone away.", 
        storylineJP: "デザインチームはマーケティングキャンペーンで完全に行き詰まっていた。突然、最も物静かなインターンが立ち上がり、全員を圧倒する真に革命的なコンセプトを見事に思いついた。", 
        quiz: { question: "We urgently need to ___ a highly effective strategy by tomorrow morning.", options: ["come up with", "count on", "crack down on"], correctIndex: 0, explanation: "to think of an idea." } 
      },
      { 
        pv: "Con into", trope: "The Smooth Trick", cefr: "C2", icon: Ghost, 
        meaning: "To deceive or trick someone into doing something they shouldn't do.", 
        meaningJP: "騙して〜させる", 
        example: "He cleverly conned his little brother into doing all his weekend chores.", 
        exampleJP: "彼は弟を巧みに騙して、週末の家事を全部やらせた。",
        vibes: ["Manipulative behavior", "Sneaky siblings", "Falling for a trap"], 
        vibesJP: ["巧妙な行動", "狡猾な兄弟", "罠にはまる"],
        storyline: "The charismatic, smooth-talking salesman completely conned the elderly couple into signing a highly suspicious, incredibly expensive ten-year contract for useless solar panels.", 
        storylineJP: "カリスマ的で口のうまいセールスマンは、老夫婦を完全に騙して、役に立たないソーラーパネルの非常に疑わしく信じられないほど高価な10年契約にサインさせた。", 
        quiz: { question: "The sneaky scammer successfully ___ her ___ giving away her password.", options: ["conned / into", "came / out of", "cooped / up"], correctIndex: 0, explanation: "to trick into doing." } 
      },
      { 
        pv: "Con out of", trope: "The Scam Artist", cefr: "C2", icon: DollarSign, 
        meaning: "To trick someone in order to get money or property from them.", 
        meaningJP: "騙し取る", 
        example: "The fake charity totally conned me out of fifty dollars.", 
        exampleJP: "あの偽の慈善団体は、私から50ドルを完全に騙し取った。",
        vibes: ["Losing hard-earned cash", "Heartless scammers", "A cruel deception"], 
        vibesJP: ["苦労して稼いだ現金を失う", "無情な詐欺師", "残酷な欺瞞"],
        storyline: "The email looked exactly like a legitimate bank warning. Panicking, Sora clicked the link, only to realize too late that hackers had conned him out of his entire savings account.", 
        storylineJP: "そのメールは本物の銀行の警告にそっくりだった。パニックになったソラはリンクをクリックしたが、ハッカーに貯金口座の全額を騙し取られたと気づくのが遅すぎた。", 
        quiz: { question: "The highly corrupt manager deliberately ___ the clients ___ their investments.", options: ["conned / out of", "counted / against", "crept / up on"], correctIndex: 0, explanation: "to trick to get money." } 
      },
      { 
        pv: "Conjure up", trope: "The Vivid Illusion", cefr: "C2", icon: Cloud, 
        meaning: "To make a picture, image, or memory appear in your mind.", 
        meaningJP: "（記憶やイメージを）心に呼び起こす、魔法のように作り出す", 
        example: "The warm smell of baked apples immediately conjures up memories of my childhood.", 
        exampleJP: "焼きリンゴの温かい香りは、即座に私の子供時代の記憶を心に呼び起こす。",
        vibes: ["Vivid flashbacks", "Magic imagery", "Deeply emotional nostalgia"], 
        vibesJP: ["鮮やかなフラッシュバック", "魔法のようなイメージ", "深く感情的なノスタルジー"],
        storyline: "Listening to the vintage vinyl record didn't just play music; the haunting melody instantly managed to conjure up a vivid image of her late grandfather dancing in the sunlit living room.", 
        storylineJP: "ビンテージのレコードを聴くことは単に音楽を奏でるだけではなかった。その忘れられないメロディは、陽の当たるリビングで踊る亡き祖父の鮮やかなイメージを瞬時に心に呼び起こした。", 
        quiz: { question: "His deeply descriptive words expertly ___ a terrifying image of the dark forest.", options: ["conjured up", "cooked up", "covered up"], correctIndex: 0, explanation: "to create an image in mind." } 
      },
      { 
        pv: "Cook up", trope: "The Master Alibi", cefr: "C1", icon: BookOpen, 
        meaning: "To invent a fake story, excuse, or plan, usually to deceive someone.", 
        meaningJP: "（話や言い訳を）でっち上げる、企む", 
        example: "He desperately tried to cook up a believable excuse for being three hours late.", 
        exampleJP: "彼は3時間遅刻したことへのもっともらしい言い訳を必死にでっち上げようとした。",
        vibes: ["Lying to the boss", "Creating a sketchy alibi", "Mischievous plotting"], 
        vibesJP: ["上司に嘘をつく", "怪しいアリバイを作る", "悪戯な企み"],
        storyline: "Sora and Ken had accidentally destroyed the neighbor's fence. Hiding in the bushes, they frantically spent twenty minutes trying to cook up a flawless lie to avoid getting grounded for life.", 
        storylineJP: "ソラとケンはうっかり隣人のフェンスを破壊してしまった。茂みに隠れながら、彼らは一生外出禁止になるのを避けるため、完璧な嘘をでっち上げるのに狂ったように20分を費やした。", 
        quiz: { question: "I seriously doubt his story; I think he just ___ it ___ to avoid extreme trouble.", options: ["cooked / up", "cooled / down", "crossed / out"], correctIndex: 0, explanation: "to invent a fake story." } 
      },
      { 
        pv: "Cool down", trope: "The Temperature Drop", cefr: "A2", icon: Thermometer, 
        meaning: "To become less hot, or to become calmer.", 
        meaningJP: "冷える、落ち着く", 
        example: "Leave the freshly baked pie by the window to cool down completely.", 
        exampleJP: "完全に冷える（落ち着く）まで、焼きたてのパイを窓辺に置いておいて。",
        vibes: ["Post-workout stretches", "Waiting to eat hot food", "A refreshing breeze"], 
        vibesJP: ["ワークアウト後のストレッチ", "熱い食べ物を待つ", "爽やかな風"],
        storyline: "After running ten miles in the scorching summer heat, Kaito sat in the shade, pouring ice water over his head, desperately waiting for his burning body to finally cool down.", 
        storylineJP: "灼熱の夏の暑さの中を10マイル走った後、海斗は日陰に座り、頭から氷水をかぶり、燃えるような体がようやく冷えるのを必死に待っていた。", 
        quiz: { question: "After the intense exercise, it's important to walk slowly and ___.", options: ["cool down", "cop out", "count off"], correctIndex: 0, explanation: "to become less hot." } 
      },
      { 
        pv: "Cool off", trope: "The Heated Argument Fix", cefr: "B2", icon: Wind, 
        meaning: "To become calmer and less angry after an intense situation.", 
        meaningJP: "頭を冷やす、怒りが静まる", 
        example: "You're incredibly furious right now; just take a walk and cool off.", 
        exampleJP: "君は今信じられないほど激怒している。少し散歩して頭を冷やしてきなさい。",
        vibes: ["De-escalating a fight", "Taking a deep breath", "Stepping away from drama"], 
        vibesJP: ["喧嘩を鎮める", "深呼吸する", "ドラマから離れる"],
        storyline: "The bitter argument escalated until everyone was screaming. Realizing it was getting toxic, Hina threw her hands up. 'Everyone just stop! We need to go into separate rooms and thoroughly cool off.'", 
        storylineJP: "苦々しい口論は全員が叫び声を上げるまでエスカレートした。有毒な状況になっていると悟り、ヒナは両手を挙げた。「みんないったん止めて！別々の部屋に行って徹底的に頭を冷やす必要があるわ。」", 
        quiz: { question: "Before sending that highly aggressive email, you should definitely wait and ___.", options: ["cool off", "cotton on", "crop up"], correctIndex: 0, explanation: "to calm down." } 
      },
      { 
        pv: "Coop up", trope: "The Cabin Fever", cefr: "C1", icon: Lock, 
        meaning: "To keep someone or an animal confined in a space that is too small.", 
        meaningJP: "（狭い所に）閉じ込める", 
        example: "I hate being cooped up in this tiny office for nine hours a day.", 
        exampleJP: "1日9時間もこの狭いオフィスに閉じ込められるのは大嫌いだ。",
        vibes: ["Cabin fever", "Rainy day boredom", "Feeling trapped"], 
        vibesJP: ["幽閉状態（キャビンフィーバー）", "雨の日の退屈", "閉じ込められていると感じる"],
        storyline: "The massive blizzard raged for five straight days. Cooped up inside the tiny wooden cabin without internet, the three friends slowly began to lose their minds from absolute boredom.", 
        storylineJP: "巨大な猛吹雪が5日間ぶっ通しで吹き荒れた。ネットのない小さな丸太小屋の中に閉じ込められ、3人の友人は絶対的な退屈からゆっくりと正気を失い始めた。", 
        quiz: { question: "The energetic dog became destructive because it was ___ inside all day.", options: ["cooped up", "cordoned off", "covered up"], correctIndex: 0, explanation: "to confine in a small space." } 
      },
      { 
        pv: "Cop it", trope: "The Guaranteed Trouble", cefr: "C2", icon: Angry, 
        meaning: "To get into serious trouble or be heavily punished.", 
        meaningJP: "ひどい目に遭う、叱られる", 
        example: "You are really going to cop it when mom sees this broken vase.", 
        exampleJP: "お母さんがこの割れた花瓶を見たら、お前は本当にひどく叱られる（ひどい目に遭う）ぞ。",
        vibes: ["Impending doom", "Waiting for a scolding", "Caught red-handed"], 
        vibesJP: ["差し迫った破滅", "説教を待つ", "現行犯で捕まる"],
        storyline: "Ken accidentally shattered the incredibly rare, antique television screen with a baseball. His older brother just shook his head slowly. 'Oh man, you are absolutely going to cop it when dad gets home.'", 
        storylineJP: "ケンは野球のボールで信じられないほど希少なアンティークのテレビ画面をうっかり粉砕してしまった。兄はゆっくりと首を横に振った。「ああ、親父が帰ってきたらお前、絶対にひどく叱られる（ひどい目に遭う）ぞ。」", 
        quiz: { question: "If the strict boss finds out you lost the file, you will definitely ___.", options: ["cop it", "cop out", "cough up"], correctIndex: 0, explanation: "to get into trouble." } 
      },
      { 
        pv: "Cop out", trope: "The Weak Excuse", cefr: "C1", icon: LogOut, 
        meaning: "To avoid doing something you promised to do by making a weak excuse.", 
        meaningJP: "逃げ口上を使う、責任逃れをする", 
        example: "He copped out of helping us move by claiming he had a sudden headache.", 
        exampleJP: "彼は突然頭痛がすると主張して、私たちの引っ越しを手伝うことから逃げ口上を使って逃れた。",
        vibes: ["Flaky friends", "Avoiding hard work", "Pathetic excuses"], 
        vibesJP: ["当てにならない友人", "辛い仕事を避ける", "哀れな言い訳"],
        storyline: "Everyone was exhausted from carrying heavy boxes all day. But Leo entirely copped out of the heavy lifting, dramatically rubbing his back and claiming he suddenly pulled a muscle.", 
        storylineJP: "一日中重い箱を運んで全員が疲れ切っていた。しかしレオは背中を大げさにさすり、突然筋肉を痛めたと主張して、重労働から完全に逃げ口上を使って責任逃れをした。", 
        quiz: { question: "She ___ of giving the presentation because she was too nervous.", options: ["copped out", "counted out", "creamed off"], correctIndex: 0, explanation: "to avoid responsibility." } 
      },
      { 
        pv: "Cordon off", trope: "The Crime Scene", cefr: "C1", icon: XCircle, 
        meaning: "To restrict access to an area using a physical barrier like tape or rope.", 
        meaningJP: "（テープなどで）封鎖する、立ち入り禁止にする", 
        example: "The police cordoned off the entire street after the bank robbery.", 
        exampleJP: "銀行強盗の後、警察は通り全体をテープで封鎖した。",
        vibes: ["Yellow police tape", "A strict perimeter", "Keeping the public away"], 
        vibesJP: ["黄色い警察のテープ", "厳重な境界線", "一般人を遠ざける"],
        storyline: "A highly suspicious, ticking package was left in the crowded town square. The bomb squad arrived in minutes, screaming at people to move back as they aggressively cordoned off the entire central plaza.", 
        storylineJP: "混雑した町の広場に、カチカチと音を立てる非常に怪しい小包が置かれていた。爆発物処理班が数分で到着し、人々を下がらせるよう叫びながら、中央広場全体をアグレッシブに封鎖した。", 
        quiz: { question: "To protect the dangerous sinkhole, the city workers quickly ___ the road.", options: ["cordoned off", "cracked down on", "crossed out"], correctIndex: 0, explanation: "to restrict access." } 
      },
      { 
        pv: "Cotton on", trope: "The Sudden Realization", cefr: "C1", icon: Eye, 
        meaning: "To finally begin to realize or understand something that was hidden.", 
        meaningJP: "（状況を）理解する、気づく", 
        example: "It took him an agonizingly long time to cotton on to what we were secretly planning.", 
        exampleJP: "私たちが密かに計画していることに彼が気づく（理解する）まで、苦痛なほど長い時間がかかった。",
        vibes: ["The lightbulb moment", "Figuring out a prank", "A delayed reaction"], 
        vibesJP: ["ひらめきの瞬間", "いたずらを理解する", "遅れた反応"],
        storyline: "The entire office threw hints all week about the massive surprise party. But Kaito was completely oblivious. He only finally cottoned on when he walked into the dark room and fifty people yelled 'Surprise!'", 
        storylineJP: "オフィス全体が大規模なサプライズパーティーについて一週間中ヒントを出していた。しかし海斗は全く気づいていなかった。彼が暗い部屋に入り、50人が『サプライズ！』と叫んだ時に初めて、彼はついに状況を理解した（気づいた）。", 
        quiz: { question: "I'm surprised she didn't ___ to the incredibly obvious scam earlier.", options: ["cotton on", "catch out", "count for"], correctIndex: 0, explanation: "to realize something." } 
      },
      { 
        pv: "Cough up", trope: "The Reluctant Payout", cefr: "C2", icon: DollarSign, 
        meaning: "To provide money or information very reluctantly.", 
        meaningJP: "（しぶしぶ金を）吐き出す、払う", 
        example: "The insurance company finally coughed up the massive settlement money.", 
        exampleJP: "保険会社はついにその巨額の和解金をしぶしぶ吐き出した（支払った）。",
        vibes: ["Paying unfair fines", "Extortion vibes", "A painful wallet drain"], 
        vibesJP: ["不当な罰金を払う", "恐喝のバイブス", "痛みを伴う出費"],
        storyline: "The corrupt landlord continuously refused to fix the broken heater. It was only when the furious tenants threatened to sue him that he finally coughed up the money for a brand new system.", 
        storylineJP: "腐敗した大家は壊れたヒーターを直すのを拒み続けた。激怒した住人たちが彼を訴えると脅した時に初めて、彼はついに新品のシステムのための金をしぶしぶ吐き出した。", 
        quiz: { question: "You broke my extremely expensive phone, so you better ___ the cash for a new one.", options: ["cough up", "crank out", "creep in"], correctIndex: 0, explanation: "to pay reluctantly." } 
      },
      { 
        pv: "Could do with", trope: "The Desperate Need", cefr: "B2", icon: Heart, 
        meaning: "To need or strongly want something to improve a situation.", 
        meaningJP: "〜があるとありがたい、〜が必要だ", 
        example: "I am entirely exhausted; I could really do with a giant cup of coffee right now.", 
        exampleJP: "完全に疲れ切っている。今すぐ巨大なコーヒーのカップがあったら本当にありがたい（必要だ）。",
        vibes: ["Craving a nap", "Needing a vacation", "Desiring comfort"], 
        vibesJP: ["昼寝を切望する", "休暇を必要とする", "快適さを求める"],
        storyline: "The freezing, endlessly rainy winter had depressed everyone for months. Staring out the gray window, Mika sighed heavily. 'I could seriously do with a sunny, relaxing week on a tropical beach.'", 
        storylineJP: "凍えるような果てしない雨の冬が何ヶ月も全員を憂鬱にさせていた。灰色の窓の外を見つめながら、ミカは重いため息をついた。「南国のビーチで晴れたリラックスできる1週間がマジであったらありがたいのに。」", 
        quiz: { question: "This boring, completely plain living room ___ a bright coat of fresh paint.", options: ["could do with", "comes down to", "counts towards"], correctIndex: 0, explanation: "to need or want." } 
      },
      { 
        pv: "Count against", trope: "The Unfair Disadvantage", cefr: "C1", icon: TrendingDown, 
        meaning: "To be considered a disadvantage or a negative factor against someone.", 
        meaningJP: "〜にとって不利になる", 
        example: "His absolute lack of professional experience will definitely count against him in the interview.", 
        exampleJP: "プロとしての経験が全くないことは、面接で間違いなく彼にとって不利になるだろう。",
        vibes: ["Failing a background check", "A harsh grading system", "Holding grudges"], 
        vibesJP: ["身辺調査に落ちる", "厳しい評価システム", "恨みを抱く"],
        storyline: "Sora was a brilliant, self-taught programmer, but he didn't have a fancy university degree. He was deeply worried that his lack of formal education would unfairly count against him at the elite tech company.", 
        storylineJP: "ソラは独学の優秀なプログラマーだったが、立派な大学の学位を持っていなかった。彼は、正式な教育を受けていないことが、エリートテック企業で不当に自分にとって不利になるのではないかと深く心配していた。", 
        quiz: { question: "Having a terrible criminal record will certainly ___ you in court.", options: ["count against", "creep up on", "crop up"], correctIndex: 0, explanation: "to be a disadvantage." } 
      },
      { 
        pv: "Count among", trope: "The Elite Circle", cefr: "C1", icon: Users, 
        meaning: "To include someone or something in a specific, often highly esteemed group.", 
        meaningJP: "〜の一員とみなす、〜の1つに数える", 
        example: "I proudly count her among my absolute closest, most trusted friends.", 
        exampleJP: "私は誇りを持って、彼女を私の最も親しく、最も信頼できる友人の一員とみなしている。",
        vibes: ["High respect", "Exclusive memberships", "Recognizing greatness"], 
        vibesJP: ["深い尊敬", "限定的なメンバーシップ", "偉大さを認める"],
        storyline: "Despite his extremely humble origins and quiet personality, the globally renowned author is now widely counted among the greatest literary geniuses of the entire 21st century.", 
        storylineJP: "極めて質素な生い立ちと物静かな性格にもかかわらず、その世界的に著名な作家は現在、21世紀全体の最も偉大な文学の天才の一員と広くみなされている（数えられている）。", 
        quiz: { question: "The legendary musician is undoubtedly ___ the greatest guitarists in history.", options: ["counted among", "conned into", "cooped up"], correctIndex: 0, explanation: "to include in a group." } 
      }
    ],
    15: [
      { 
        pv: "Count down", trope: "The Anticipation", cefr: "B1", icon: Clock, 
        meaning: "To wait eagerly for an event while tracking the remaining time.", 
        meaningJP: "秒読みする、指折り数えて待つ", 
        example: "We are incredibly excited, literally counting down the days until our Hawaii vacation.", 
        exampleJP: "私たちは信じられないほど興奮しており、文字通りハワイ旅行までの日数を秒読みして（指折り数えて）いる。",
        vibes: ["New Year's Eve energy", "Waiting for a game release", "Extreme hype"], 
        vibesJP: ["大晦日のエネルギー", "ゲームの発売を待つ", "極度の興奮"],
        storyline: "The entire school had been brutally stressed by exams. As the clock hit 2:59 PM on the final day, the whole class loudly started to count down the final agonizing seconds until absolute summer freedom.", 
        storylineJP: "学校全体が試験の過酷なストレスにさらされていた。最終日の午後2時59分になった時、クラス全体が絶対的な夏の自由までの苦痛な最後の数秒を大声で秒読みし始めた。", 
        quiz: { question: "The excited fans gathered in the square to excitedly ___ to the new year.", options: ["count down", "count for", "cover up"], correctIndex: 0, explanation: "to track remaining time." } 
      },
      { 
        pv: "Count for", trope: "The Meaningful Effort", cefr: "C1", icon: Award, 
        meaning: "To have importance, value, or influence.", 
        meaningJP: "価値がある、重要である", 
        example: "Does my five years of intense loyalty to this company count for absolutely nothing?", 
        exampleJP: "この会社に対する私の5年間の熱烈な忠誠心は、全く何の価値もない（重要ではない）のか？",
        vibes: ["Demanding respect", "Feeling undervalued", "Seeking validation"], 
        vibesJP: ["敬意を要求する", "軽く扱われていると感じる", "承認を求める"],
        storyline: "Leo worked incredibly hard on the project, but the arrogant boss took all the credit. Furious, Leo slammed his fist on the desk. 'Does my endless, exhausting overtime count for literally nothing here?!'", 
        storylineJP: "レオはプロジェクトで信じられないほど懸命に働いたが、傲慢なボスがすべての手柄を横取りした。激怒したレオは机を拳で叩いた。「俺の終わりのない疲労困憊の残業は、ここでは文字通り何の価値もない（重要ではない）のか？！」", 
        quiz: { question: "Good intentions are nice, but only real, tangible results truly ___ something in business.", options: ["count for", "crack on", "crash out"], correctIndex: 0, explanation: "to have value." } 
      },
      { 
        pv: "Count in", trope: "The Group Invite", cefr: "B1", icon: UserPlus, 
        meaning: "To include someone in an activity, plan, or group.", 
        meaningJP: "（仲間や計画に）入れる", 
        example: "If you guys are going for incredibly spicy ramen tonight, definitely count me in!", 
        exampleJP: "もし君たちが今夜信じられないほど辛いラーメンを食べに行くなら、間違いなく私を仲間に入れて！",
        vibes: ["Joining the squad", "Saying 'yes' to plans", "FOMO prevention"], 
        vibesJP: ["仲間に加わる", "計画に「イエス」と言う", "取り残される不安（FOMO）の防止"],
        storyline: "Kaito announced to the group chat that he was renting a massive luxury cabin in the snowy mountains for the weekend. Instantly, Hina replied, 'Snowboarding and hot chocolate? Absolutely count me in!'", 
        storylineJP: "海斗は週末に雪山で巨大な高級キャビンを借りるとグループチャットで発表した。即座にヒナが返信した。「スノボとホットチョコレート？絶対に私を仲間に入れて！」", 
        quiz: { question: "If you're ordering huge pizzas for the entire office, please ___ me ___.", options: ["count / in", "cross / out", "cut / off"], correctIndex: 0, explanation: "to include someone." } 
      },
      { 
        pv: "Count off", trope: "The Roll Call", cefr: "B2", icon: Mic2, 
        meaning: "To say numbers aloud in sequence, usually to check a group's size.", 
        meaningJP: "番号を唱える、点呼をとる", 
        example: "The strict gym teacher made all the exhausted students count off from one to ten.", 
        exampleJP: "厳格な体育の先生は、疲れ切った生徒全員に1から10まで番号を唱えさせた（点呼をとった）。",
        vibes: ["Military drills", "School trip panic", "Organizing chaos"], 
        vibesJP: ["軍事訓練", "修学旅行のパニック", "カオスを整理する"],
        storyline: "The crowded bus was incredibly noisy as the school trip prepared to leave. The highly stressed teacher clapped his hands loudly. 'Everyone be completely quiet and count off so I know nobody is left behind!'", 
        storylineJP: "修学旅行の出発を控え、混雑したバスは信じられないほどうるさかった。非常にストレスを抱えた教師は手を大きく叩いた。「全員完全に静かにして、誰も置いてきぼりになっていないか確認するために点呼をとれ（番号を唱えろ）！」", 
        quiz: { question: "The terrifying drill sergeant ordered the nervous recruits to rapidly ___.", options: ["count off", "crank up", "creep in"], correctIndex: 0, explanation: "to say numbers in sequence." } 
      },
      { 
        pv: "Count on", trope: "The Reliable Bestie", cefr: "B1", icon: Shield, 
        meaning: "To rely or depend on someone or confidently expect something to happen.", 
        meaningJP: "当てにする、頼りにする", 
        example: "I know I can always reliably count on my best friend to support my wild ideas.", 
        exampleJP: "自分の突拍子もないアイデアをサポートしてくれる親友を、私は常に確実に頼りにできると知っている。",
        vibes: ["Deep trust", "Relying on a partner", "Knowing someone has your back"], 
        vibesJP: ["深い信頼", "パートナーを頼る", "誰かが味方だと知っている"],
        storyline: "The massive stage set was literally falling apart ten minutes before the grand show. But Kaito wasn't panicked. He knew he could absolutely count on his highly skilled tech team to fix everything.", 
        storylineJP: "壮大なショーの10分前、巨大な舞台セットは文字通り崩れ落ちそうになっていた。しかし海斗はパニックにならなかった。彼は熟練した技術チームがすべてを修理してくれると、絶対的に頼りにできると知っていたのだ。", 
        quiz: { question: "When the severe crisis hit, I knew I could securely ___ you for help.", options: ["count on", "cut off", "dash off"], correctIndex: 0, explanation: "to rely or depend on." } 
      },
      { 
        pv: "Count out", trope: "The Exclusion", cefr: "B2", icon: XCircle, 
        meaning: "To exclude someone from an activity, or to count money individually.", 
        meaningJP: "（数や仲間から）除外する、数え出す", 
        example: "I absolutely hate horror movies, so please count me out of your cinema trip.", 
        exampleJP: "私はホラー映画が絶対に大嫌いなので、映画館の予定から私を除外して。",
        vibes: ["Opting out of drama", "Knowing your limits", "Counting cold hard cash"], 
        vibesJP: ["トラブルから身を引く", "自分の限界を知る", "冷たい現金を数える"],
        storyline: "The group enthusiastically planned to go skydiving from a terrifyingly high airplane. Sora, who was deathly afraid of heights, instantly raised his hands. 'Yeah, no. Completely count me out of this madness.'", 
        storylineJP: "グループは恐ろしいほど高い飛行機からスカイダイビングに行く計画を熱心に立てた。極度の高所恐怖症であるソラは即座に両手を挙げた。「ああ、無理。この狂気からは完全に俺を除外してくれ。」", 
        quiz: { question: "If you are planning to dangerously hike in the blizzard, strictly ___ me ___.", options: ["count / out", "cream / off", "crop / up"], correctIndex: 0, explanation: "to exclude." } 
      },
      { 
        pv: "Count towards", trope: "The Final Grade", cefr: "B2", icon: PlusSquare, 
        meaning: "To be included as part of a final total or requirement.", 
        meaningJP: "（成績や合計の）一部として計算される", 
        example: "Does this incredibly difficult extra essay actually count towards our final grade?", 
        exampleJP: "この信じられないほど難しい追加のエッセイは、実際に最終成績の一部として計算されるのですか？",
        vibes: ["Academic stress", "Collecting loyalty points", "Calculating requirements"], 
        vibesJP: ["学業のストレス", "ロイヤリティポイントを集める", "必要条件を計算する"],
        storyline: "Mika was exhausted, staring at the massive pile of optional volunteer work. She asked the strict professor, 'Will these fifty grueling hours of extra lab work actually count towards my final graduation credits?'", 
        storylineJP: "ミカは疲れ果てて、任意のボランティア活動の巨大な山を見つめていた。彼女は厳格な教授に尋ねた。「この50時間の過酷な追加の実験作業は、実際に私の最終的な卒業単位の一部として計算されますか？」", 
        quiz: { question: "Every single hour you passionately volunteer will strictly ___ your certificate.", options: ["count towards", "creep over", "cross out"], correctIndex: 0, explanation: "to be included in a total." } 
      },
      { 
        pv: "Count up", trope: "The Final Tally", cefr: "B2", icon: Calculator, 
        meaning: "To add everything together to find a final total.", 
        meaningJP: "合計する、数え上げる", 
        example: "We excitedly counted up all the heavy coins from the charity donation box.", 
        exampleJP: "私たちは興奮して、チャリティーの募金箱からすべての重い硬貨を合計した（数え上げた）。",
        vibes: ["Counting the loot", "End of day retail", "Tallying the votes"], 
        vibesJP: ["戦利品を数える", "小売業の一日の終わり", "票を集計する"],
        storyline: "The intense, highly competitive school election was finally over. The committee locked the doors, dumped the thousands of paper ballots onto a massive table, and nervously began to carefully count up the final results.", 
        storylineJP: "激しく競争の激しい学校選挙がついに終わった。委員会はドアに鍵をかけ、何千枚もの紙の投票用紙を巨大なテーブルにぶちまけ、緊張しながら慎重に最終結果を合計し（数え上げ）始めた。", 
        quiz: { question: "At the end of the busy shift, the manager meticulously ___ the register money.", options: ["counted up", "cracked down on", "cranked out"], correctIndex: 0, explanation: "to add together." } 
      },
      { 
        pv: "Cover for", trope: "The Loyal Alibi", cefr: "B2", icon: User, 
        meaning: "To provide an alibi, or to do someone's work when they are away.", 
        meaningJP: "（人の）代わりを務める、かばう", 
        example: "Can you briefly cover for me at the front desk while I run to the bathroom?", 
        exampleJP: "トイレに行っている間、フロントデスクで少し私の代わりを務めて（かばって）くれない？",
        vibes: ["Taking a shift", "Providing a fake alibi", "Coworker solidarity"], 
        vibesJP: ["シフトを代わる", "偽のアリバイを提供する", "同僚の結束"],
        storyline: "Sora desperately needed to sneak out of the strict boarding school to attend the concert. Ken nervously nodded. 'Alright, I'll cover for you if the terrifying dorm master asks where you are.'", 
        storylineJP: "ソラはコンサートに行くため、厳格な全寮制学校から死に物狂いで抜け出す必要があった。ケンは緊張しながら頷いた。「わかった、もしあの恐ろしい寮長がお前がどこにいるか聞いたら、俺がかばってやるよ。」", 
        quiz: { question: "The incredibly loyal friend falsely lied to the police to completely ___ him.", options: ["cover for", "creep up on", "crack on"], correctIndex: 0, explanation: "to provide an alibi or take a place." } 
      },
      { 
        pv: "Cover up", trope: "The Corporate Conspiracy", cefr: "C1", icon: Lock, 
        meaning: "To attempt to hide the truth about a mistake, crime, or embarrassing fact.", 
        meaningJP: "隠蔽する、もみ消す", 
        example: "The corrupt politicians tried desperately to cover up the massive financial scandal.", 
        exampleJP: "腐敗した政治家たちは、大規模な金融スキャンダルを必死に隠蔽しようとした。",
        vibes: ["Hiding the truth", "Conspiracy theories", "Burying the evidence"], 
        vibesJP: ["真実を隠す", "陰謀論", "証拠を葬る"],
        storyline: "The powerful corporation accidentally spilled toxic chemicals into the local river. Instead of apologizing and paying for the cleanup, they spent millions aggressively bribing officials to completely cover up their devastating mistake.", 
        storylineJP: "権力を持つ巨大企業は、うっかり有毒な化学物質を地元の川に流出させてしまった。謝罪し清掃費用を払う代わりに、彼らは何百万ドルもの大金を費やして役人にアグレッシブに賄賂を贈り、その壊滅的なミスを完全にもみ消そう（隠蔽しよう）とした。", 
        quiz: { question: "The sneaky criminal deliberately tried to ___ his very obvious tracks.", options: ["cover up", "count off", "cut down on"], correctIndex: 0, explanation: "to hide the truth." } 
      },
      { 
        pv: "Crack down on", trope: "The Strict Crackdown", cefr: "C1", icon: Gavel, 
        meaning: "To enforce rules strictly to stop bad or illegal behavior.", 
        meaningJP: "厳しく取り締まる、断固たる処置をとる", 
        example: "The school is aggressively cracking down on students who skip class.", 
        exampleJP: "学校は、授業をサボる生徒をアグレッシブに厳しく取り締まっている。",
        vibes: ["Zero tolerance", "Enforcing harsh rules", "No more warnings"], 
        vibesJP: ["一切の妥協なし", "厳しい規則を施行する", "これ以上の警告なし"],
        storyline: "For years, cars carelessly sped through the quiet residential neighborhood. Finally, the angry local government installed hidden cameras and decided to ruthlessly crack down on reckless driving, handing out massive fines.", 
        storylineJP: "何年もの間、車は静かな住宅街を不注意に猛スピードで通り抜けていた。ついに怒った地方自治体は隠しカメラを設置し、無謀な運転を容赦なく厳重に取り締まり、全員に巨額の罰金を科すことを決定した。", 
        quiz: { question: "The tough new police chief promised to relentlessly ___ organized street crime.", options: ["crack down on", "crop up", "count towards"], correctIndex: 0, explanation: "to enforce rules strictly." } 
      },
      { 
        pv: "Crack on", trope: "The Focused Grind", cefr: "C2", icon: Zap, 
        meaning: "To continue doing something with energy, speed, and determination.", 
        meaningJP: "（仕事を）どんどん進める、気合を入れて続ける", 
        example: "We've wasted entirely too much time arguing; let's just crack on with the project.", 
        exampleJP: "私たちは完全に時間を無駄にしすぎた。気合を入れてプロジェクトをどんどん進めよう。",
        vibes: ["British productivity", "Ignoring distractions", "Head down, grinding"], 
        vibesJP: ["イギリス的な生産性", "気を散らすものを無視する", "集中して取り組む"],
        storyline: "The design team was endlessly debating tiny color choices while the deadline rapidly approached. The lead designer clapped her hands sharply. 'Enough talking! We desperately need to crack on and actually finish this prototype!'", 
        storylineJP: "締め切りが急速に迫る中、デザインチームは些細な色の選択について果てしなく議論していた。リードデザイナーは鋭く手を叩いた。「おしゃべりは終わり！死に物狂いで気合を入れてどんどん進め、実際にこのプロトタイプを完成させる必要があるわ！」", 
        quiz: { question: "Stop completely wasting the afternoon and actively ___ with your important homework.", options: ["crack on", "crash out", "creep in"], correctIndex: 0, explanation: "to continue with energy." } 
      },
      { 
        pv: "Crack up", trope: "The Laughing Fit", cefr: "C1", icon: Smile, 
        meaning: "To suddenly burst into loud laughter, or to suffer a mental breakdown.", 
        meaningJP: "大爆笑する、精神的に参る", 
        example: "His incredibly dry, sarcastic joke completely cracked me up in the silent meeting.", 
        exampleJP: "静かな会議中、彼の信じられないほどドライで皮肉なジョークに私は完全に大爆笑してしまった。",
        vibes: ["Uncontrollable laughter", "Crying from a joke", "Losing your absolute mind"], 
        vibesJP: ["抑えきれない笑い", "ジョークで泣く", "完全に正気を失う"],
        storyline: "The funeral scene in the movie was supposed to be completely serious and deeply tragic. But when the actor accidentally sneezed highly dramatically, the entire tense theater completely cracked up, unable to stop laughing.", 
        storylineJP: "映画の葬式のシーンは完全に真面目で深く悲劇的であるはずだった。しかし俳優がうっかり非常にドラマチックなくしゃみをしてしまった時、緊張した劇場全体が完全に大爆笑し、笑いを止めることができなかった。", 
        quiz: { question: "The incredibly hilarious stand-up comedian managed to totally ___ the entire audience ___.", options: ["crack / up", "count / in", "cream / off"], correctIndex: 0, explanation: "to burst into laughter." } 
      },
      { 
        pv: "Crank out", trope: "The Production Line", cefr: "C2", icon: Package, 
        meaning: "To produce things quickly and in large numbers, often lacking quality.", 
        meaningJP: "（機械的に）大量生産する、次々と生み出す", 
        example: "The famous, greedy author cranks out three identical thriller novels every single year.", 
        exampleJP: "その有名で強欲な作家は、毎年3冊の全く同じようなスリラー小説を機械的に大量生産している。",
        vibes: ["A relentless content mill", "Quantity over quality", "A massive factory line"], 
        vibesJP: ["容赦ないコンテンツ工場", "質より量", "巨大な工場のライン"],
        storyline: "The highly stressed, underpaid animation studio was pushed to the absolute breaking point. They were mercilessly forced to crank out a new, low-quality episode every single week, sacrificing their artistic souls for sheer profit.", 
        storylineJP: "極度にストレスを抱えた薄給のアニメスタジオは、絶対的な限界点まで追い詰められていた。彼らは純粋な利益のために芸術的な魂を犠牲にし、毎週新しい低品質なエピソードを容赦なく大量生産するよう強制されていた。", 
        quiz: { question: "The massive, highly automated factory can easily ___ thousands of cheap plastic toys daily.", options: ["crank out", "creep into", "crop up"], correctIndex: 0, explanation: "to produce in large numbers." } 
      },
      { 
        pv: "Crank up", trope: "The Hype Volume", cefr: "C1", icon: Volume2, 
        meaning: "To significantly increase the volume of a machine, or the intensity of a situation.", 
        meaningJP: "（音量や強さを）上げる、増大させる", 
        example: "Please entirely crank up the heavy bass on this incredible new song!", 
        exampleJP: "この素晴らしい新曲の重低音の音量を完全に上げて！",
        vibes: ["Blasting loud music", "Turning up the heat", "Maximum intensity"], 
        vibesJP: ["大音量で音楽を流す", "熱を上げる", "最大の激しさ"],
        storyline: "The incredibly boring house party was completely dying at 11 PM. Kaito suddenly grabbed the Bluetooth speaker, entirely bypassed the playlist, and aggressively cranked up an absolute club banger, instantly reviving the dead energy.", 
        storylineJP: "信じられないほど退屈なホームパーティーは午後11時に完全に死にかけていた。海斗は突然Bluetoothスピーカーを掴み、プレイリストを完全に無視して、アグレッシブに最高に盛り上がるクラブ曲の音量を上げ、死んだエネルギーを瞬時に蘇らせた。", 
        quiz: { question: "It's freezing in this dark room; severely ___ the central heating, please.", options: ["crank up", "cover for", "count out"], correctIndex: 0, explanation: "to increase volume or intensity." } 
      },
      { 
        pv: "Crash out", trope: "The Exhausted Sleep", cefr: "C1", icon: CloudOff, 
        meaning: "To suddenly fall asleep heavily due to extreme tiredness or intoxication.", 
        meaningJP: "泥のように疲れて眠り込む、バタンキューと寝る", 
        example: "After the grueling twelve-hour shift, I just went straight home and brutally crashed out.", 
        exampleJP: "過酷な12時間シフトの後、私はまっすぐ家に帰り、残酷なまでにバタンキューと寝た（泥のように眠り込んだ）。",
        vibes: ["Zero energy left", "Sleeping in your clothes", "Complete bodily shutdown"], 
        vibesJP: ["エネルギーがゼロ", "服を着たまま寝る", "完全な身体のシャットダウン"],
        storyline: "Sora stayed completely awake for exactly 48 hours to finish his massive, terrifying final thesis. The absolute second he clicked the 'submit' button, he didn't even make it to his bed; he brutally crashed out right on the hard floor.", 
        storylineJP: "ソラは巨大で恐ろしい卒業論文を終わらせるため、きっかり48時間完全に起き続けていた。「提出」ボタンをクリックした絶対的な瞬間、彼はベッドにたどり着くことすらできず、硬い床の上でそのまま泥のように眠り込んだ。", 
        quiz: { question: "Totally exhausted from the long mountain hike, he deeply ___ on the tiny sofa.", options: ["crashed out", "cracked on", "crept in"], correctIndex: 0, explanation: "to fall asleep heavily." } 
      },
      { 
        pv: "Cream off", trope: "The Unfair Skim", cefr: "C2", icon: Star, 
        meaning: "To selfishly take the best part of something for yourself, or extract the top performers.", 
        meaningJP: "（一番良い部分を）かすめ取る、えり抜く", 
        example: "The highly corrupt executives were secretly creaming off the massive company profits.", 
        exampleJP: "その極めて腐敗した幹部たちは、莫大な会社の利益を密かにかすめ取っていた。",
        vibes: ["Unfair corporate greed", "Taking the elite", "Selfish skimming"], 
        vibesJP: ["不当な企業の強欲", "エリートを抽出する", "自己中心的なピンハネ"],
        storyline: "The extremely prestigious private academy claimed to support absolutely all local students. In reality, they were just ruthlessly creaming off only the top one percent of elite scholars, leaving the struggling public schools with zero resources.", 
        storylineJP: "その非常に権威ある私立アカデミーは、地元のすべての生徒を支援すると主張していた。しかし実際には、彼らはエリート学者の上位1%だけを容赦なくえり抜き（一番良い部分をかすめ取り）、苦労している公立学校にゼロの資源しか残していなかった。", 
        quiz: { question: "The greedy manager unfairly ___ the absolutely best, highest-paying clients for himself.", options: ["creamed off", "counted for", "cranked out"], correctIndex: 0, explanation: "to take the best part." } 
      },
      { 
        pv: "Creep in", trope: "The Subtle Doubt", cefr: "C1", icon: Ghost, 
        meaning: "To start to be noticed or happen slowly and subtly, often describing negative feelings.", 
        meaningJP: "（疑念などが）忍び込む、こっそり入り込む", 
        example: "As the completely silent days passed, a dark, heavy doubt began to slowly creep in.", 
        exampleJP: "完全に無音の日々が過ぎるにつれ、暗く重い疑念がゆっくりと忍び込み始めた。",
        vibes: ["A growing paranoia", "Subtle negative changes", "An eerie, creeping feeling"], 
        vibesJP: ["増大するパラノイア", "微妙なネガティブな変化", "不気味で忍び寄る感覚"],
        storyline: "The complex space mission seemed flawlessly perfect for the first incredibly smooth three days. But when a tiny, almost invisible red light blinked silently on the dashboard, a deeply terrifying, cold sense of impending doom slowly began to creep in.", 
        storylineJP: "複雑な宇宙ミッションは、信じられないほど順調な最初の3日間は完璧に完璧であるように見えた。しかしダッシュボードでほとんど見えない小さな赤いランプが静かに点滅した時、深く恐ろしい、迫り来る破滅の冷たい感覚がゆっくりと忍び込み始めた。", 
        quiz: { question: "Despite his arrogant confidence, a tiny, quiet fear started to slowly ___.", options: ["creep in", "crack up", "crop up"], correctIndex: 0, explanation: "to start to happen slowly." } 
      },
      { 
        pv: "Creep into", trope: "The Silent Entry", cefr: "C1", icon: Footprints, 
        meaning: "To slowly and quietly enter a place, situation, or language.", 
        meaningJP: "そっと入り込む、（言葉などが）浸透する", 
        example: "American internet slang is rapidly creeping into the daily vocabulary of Japanese teens.", 
        exampleJP: "アメリカのネットスラングは、日本の10代の若者の日常的な語彙に急速に浸透して（そっと入り込んで）いる。",
        vibes: ["Silent ninja moves", "Language evolving", "Subtle influence"], 
        vibesJP: ["静かな忍者の動き", "言語の進化", "微妙な影響"],
        storyline: "The old, strictly traditional company prided itself on massive formality. But as more brilliant, incredibly young designers were hired, a relaxed, highly modern startup culture slowly began to completely creep into their incredibly stiff, boring daily meetings.", 
        storylineJP: "古く厳格に伝統的なその会社は、強烈な形式主義を誇りにしていた。しかし、優秀で信じられないほど若いデザイナーが多く雇われるにつれ、リラックスした非常に現代的なスタートアップの文化が、彼らの信じられないほど堅苦しく退屈な日常の会議にゆっくりと完全にそっと入り込み始めた。", 
        quiz: { question: "Errors naturally began to slowly ___ his highly complex, massive report as he got utterly exhausted.", options: ["creep into", "count among", "cover up"], correctIndex: 0, explanation: "to enter slowly." } 
      },
      { 
        pv: "Creep over", trope: "The Sudden Chill", cefr: "C2", icon: Cloud, 
        meaning: "To slowly experience a strong feeling (like fear or cold) covering your body.", 
        meaningJP: "（感情などが）ゆっくりと全身を覆う", 
        example: "A terrifyingly cold, dark shiver crept over her as she intensely stared at the ghost.", 
        exampleJP: "幽霊を激しく見つめていると、恐ろしく冷たく暗い悪寒がゆっくりと彼女の全身を覆った。",
        vibes: ["A horror movie chill", "A wave of deep sadness", "Physical sensations of fear"], 
        vibesJP: ["ホラー映画の悪寒", "深い悲しみの波", "恐怖の身体的感覚"],
        storyline: "The massive, ancient stone castle was utterly, completely abandoned. As Sora boldly walked alone down the pitch-black hallway, a sudden, paralyzing feeling of absolute, undeniably pure dread slowly crept over him, freezing his heavy footsteps.", 
        storylineJP: "巨大で古代の石造りの城は、全く完全に放棄されていた。ソラが真っ暗な廊下を一人で大胆に歩いていると、突然、麻痺するような絶対的で否定しがたい純粋な恐怖の感情がゆっくりと彼の全身を覆い、彼の重い足取りを凍りつかせた。", 
        quiz: { question: "A deeply profound sense of completely silent calm gently ___ the exhausted, weary group.", options: ["crept over", "counted towards", "cranked up"], correctIndex: 0, explanation: "to slowly experience a feeling." } 
      },
      { 
        pv: "Creep up on", trope: "The Jump Scare", cefr: "C1", icon: EyeOff, 
        meaning: "To approach someone extremely quietly to surprise them, or for a feeling to sneak up.", 
        meaningJP: "（人に）こっそり近づく、忍び寄る", 
        example: "Please don't maliciously creep up on me like that; you entirely terrified me!", 
        exampleJP: "そんな風に悪意を持ってこっそり近づかないで。完全に恐怖したじゃないか！",
        vibes: ["A terrifying jump scare", "Old age approaching", "A stealthy ninja attack"], 
        vibesJP: ["恐ろしいジャンプスケア", "忍び寄る老い", "ステルス忍者の攻撃"],
        storyline: "Mika was deeply, intensely focused on painting her complex masterpiece with her premium headphones on. Kaito thought it would be highly hilarious to silently creep up on her, resulting in her completely screaming and throwing a bright red paintbrush at his head.", 
        storylineJP: "ミカは高級ヘッドホンをつけ、複雑な傑作を描くことに深く強烈に集中していた。海斗は無言で彼女にこっそり近づくのが最高に面白いだろうと考えたが、結果として彼女は完全に絶叫し、真っ赤な絵筆を彼の頭に投げつけることになった。", 
        quiz: { question: "The incredibly sneaky, clever cat managed to entirely ___ the entirely unaware, relaxed bird.", options: ["creep up on", "crack down on", "cross out"], correctIndex: 0, explanation: "to approach quietly." } 
      },
      { 
        pv: "Crop up", trope: "The Unwanted Surprise", cefr: "C1", icon: AlertTriangle, 
        meaning: "To appear, happen, or occur suddenly and highly unexpectedly.", 
        meaningJP: "突然持ち上がる、不意に現れる", 
        example: "I'm so incredibly sorry I'm totally late; a highly serious problem suddenly cropped up.", 
        exampleJP: "完全に遅刻してしまって本当に申し訳ありません。非常に深刻な問題が突然持ち上がった（不意に現れた）のです。",
        vibes: ["Unexpected emergencies", "Last-minute problems", "Surprise obstacles"], 
        vibesJP: ["予期せぬ緊急事態", "直前の問題", "予期せぬ障害"],
        storyline: "The extremely complex wedding preparations were entirely finished, and the venue looked absolutely perfect. But just three short hours before the ceremony, a massive, highly unexpected thunderstorm aggressively cropped up out of nowhere, completely ruining everything.", 
        storylineJP: "極めて複雑な結婚式の準備は完全に終わり、会場は絶対的に完璧に見えた。しかし式のわずか3時間前、全く予期せぬ巨大な雷雨がどこからともなくアグレッシブに突然持ち上がり（不意に現れ）、すべてを完全に台無しにしてしまった。", 
        quiz: { question: "Whenever we forcefully try to implement this software, highly strange errors constantly ___.", options: ["crop up", "come about", "cool down"], correctIndex: 0, explanation: "to appear unexpectedly." } 
      }
    ],
    16: [
      { 
        pv: "Cross off / out", trope: "The To-Do List", cefr: "A2", icon: CheckCircle2, 
        meaning: "To delete from a list, or put a line through a mistake.", 
        meaningJP: "リストから消す、線を引いて消す", 
        example: "She crossed out her mistakes and crossed off the finished tasks.", 
        exampleJP: "彼女は間違いを線で消し（crossed out）、終わったタスクをリストから消した（crossed off）。",
        vibes: ["Productivity high", "Fixing essays", "Checking off to-do lists"], 
        vibesJP: ["生産性が高い", "エッセイの修正", "やることリストのチェック"],
        storyline: "Ken had a massive list of chores. He thoroughly cleaned the room, grabbed his red marker, and aggressively crossed the task off his list.", 
        storylineJP: "ケンには大量の家事リストがあった。彼は部屋を徹底的に掃除し、赤いマーカーを掴み、アグレッシブにそのタスクをリストから線を引いて消した。", 
        quiz: { question: "If you accidentally make a spelling mistake, simply ___ it ___.", options: ["cross / out", "count / on", "cook / up"], correctIndex: 0, explanation: "to draw a line through." } 
      },
      { 
        pv: "Cross up", trope: "The Decoy", cefr: "C1", icon: HelpCircle, 
        meaning: "To confuse or deceive someone.", 
        meaningJP: "混乱させる、騙す", 
        example: "The treasure map was deliberately drawn to cross us up.", 
        exampleJP: "その宝の地図は、私たちを混乱させる（騙す）ために意図的に描かれていた。",
        vibes: ["Falling for a trap", "Tricky tests", "Being deceived"], 
        vibesJP: ["罠にはまる", "ひっかけ問題", "騙される"],
        storyline: "Leo thought he knew all the opponent's moves. But the rival team deliberately crossed him up with a fake play, leaving him completely confused on the field.", 
        storylineJP: "レオは相手の動きをすべて知っていると思っていた。しかしライバルチームはフェイントで故意に彼を混乱させ（騙し）、彼をコート上で完全に困惑させた。", 
        quiz: { question: "The clever villain designed the puzzle specifically to ___ the heroes ___.", options: ["cross / up", "cry / off", "cut / across"], correctIndex: 0, explanation: "to confuse or deceive." } 
      },
      { 
        pv: "Cruise through", trope: "The Academic Flex", cefr: "B2", icon: Wind, 
        meaning: "To pass a test or succeed in a task very easily.", 
        meaningJP: "（難題を）楽々とやり遂げる", 
        example: "He effortlessly cruised through the difficult final exam.", 
        exampleJP: "彼は難しい期末試験を難なく楽々とやり遂げた。",
        vibes: ["Acing the test", "Zero stress", "Natural genius"], 
        vibesJP: ["テストで満点を取る", "ストレスゼロ", "生まれつきの天才"],
        storyline: "Everyone was sweating over the impossible calculus final. But Leo, who surprisingly studied all week, just smiled and cruised through the whole thing in twenty minutes.", 
        storylineJP: "誰もが不可能な微積分の期末試験に冷や汗をかいていた。しかし驚くことに一週間勉強したレオは、ただ微笑み、20分でテスト全体を楽々とやり遂げた。", 
        quiz: { question: "Because she practiced daily, she completely ___ the difficult audition.", options: ["cruised through", "cut back", "dashed off"], correctIndex: 0, explanation: "to pass easily." } 
      },
      { 
        pv: "Crumb down", trope: "The Fancy Waiter", cefr: "C2", icon: Sparkles, 
        meaning: "To clear a table of crumbs in a restaurant.", 
        meaningJP: "（テーブルの）パンくずを片付ける", 
        example: "The waiter crumbed down before the coffee was served.", 
        exampleJP: "コーヒーが出される前に、ウェイターはパンくずを片付けた。",
        vibes: ["Five-star dining", "Immaculate service", "Luxury restaurants"], 
        vibesJP: ["5つ星のダイニング", "非の打ち所がないサービス", "高級レストラン"],
        storyline: "The exclusive restaurant was incredibly fancy. Right after they finished their expensive bread, a highly professional waiter appeared and silently crumbed down the table.", 
        storylineJP: "その高級レストランは信じられないほど豪華だった。彼らが高価なパンを食べ終わった直後、非常にプロフェッショナルなウェイターが現れ、無言でテーブルのパンくずを片付けた。", 
        quiz: { question: "Between the main course and dessert, the elegant staff ___ the table.", options: ["crumbed down", "cried off", "cut in"], correctIndex: 0, explanation: "to clear a table." } 
      },
      { 
        pv: "Cry off", trope: "The Last-Minute Flake", cefr: "C1", icon: XCircle, 
        meaning: "To suddenly cancel an arrangement or back out of a plan.", 
        meaningJP: "（直前に）約束を取り消す", 
        example: "I've got to work tonight; can I cry off going out for dinner?", 
        exampleJP: "今夜は仕事なんだ。ディナーに行く約束、取り消してもいいかな？",
        vibes: ["Flaky friends", "Canceling plans", "Sudden excuses"], 
        vibesJP: ["当てにならない友人", "予定をキャンセルする", "突然の言い訳"],
        storyline: "The group had planned the massive beach trip for months. But the morning of the trip, Kaito texted that he had a headache and completely cried off, leaving everyone annoyed.", 
        storylineJP: "グループは何ヶ月も前から大規模なビーチ旅行を計画していた。しかし旅行の朝、海斗は頭痛がするとメッセージを送り、完全に約束を取り消して全員を苛立たせた。", 
        quiz: { question: "She enthusiastically agreed to help, but sadly ___ at the very last minute.", options: ["cried off", "crossed up", "cut out"], correctIndex: 0, explanation: "to cancel an arrangement." } 
      },
      { 
        pv: "Cry out", trope: "The Sudden Shock", cefr: "B1", icon: Volume2, 
        meaning: "To shout loudly because you are in pain, scared, or surprised.", 
        meaningJP: "（苦痛や恐怖で）大声を上げる", 
        example: "He violently cried out when he dropped the heavy box on his toes.", 
        exampleJP: "つま先に重い箱を落とした時、彼は激しく大声を上げた。",
        vibes: ["Stubbing your toe", "Horror movie reactions", "Sudden agony"], 
        vibesJP: ["足の指をぶつける", "ホラー映画の反応", "突然の激痛"],
        storyline: "The haunted house was terrifyingly dark. When a hidden actor suddenly grabbed Sora's ankle, he couldn't help it; he loudly cried out in absolute, pure terror.", 
        storylineJP: "お化け屋敷は恐ろしいほど暗かった。隠れていたアクターが突然ソラの足首を掴んだ時、彼は耐えきれず、絶対的で純粋な恐怖から大声を上げた。", 
        quiz: { question: "The terrified child ___ in fear when the loud thunder suddenly struck.", options: ["cried out", "cut out", "died down"], correctIndex: 0, explanation: "to shout in pain/fear." } 
      },
      { 
        pv: "Cut across", trope: "The Shortcut", cefr: "B1", icon: Map, 
        meaning: "To take a shortcut, or to affect people of different groups.", 
        meaningJP: "横切る、近道をする、（集団を越えて）影響を及ぼす", 
        example: "The new issue cuts across social backgrounds as it affects us all equally.", 
        exampleJP: "その新たな問題は私たち全員に平等に影響するため、社会的背景を越えて影響を及ぼす。",
        vibes: ["Saving time", "Walking on the grass", "Universal issues"], 
        vibesJP: ["時間の節約", "芝生の上を歩く", "普遍的な問題"],
        storyline: "Running incredibly late for the morning bell, Hina ignored the paved sidewalk. 'Follow me!' she yelled to Rin, boldly cutting across the muddy football pitch to save three minutes.", 
        storylineJP: "朝のチャイムに信じられないほど遅れそうになり、ヒナは舗装された歩道を無視した。「ついてきて！」と彼女はリンに叫び、3分を節約するために泥だらけのサッカーコートを大胆に横切った（近道した）。", 
        quiz: { question: "The massive new environmental policy will directly ___ all social classes.", options: ["cut across", "cut in", "dawn on"], correctIndex: 0, explanation: "to affect different groups / go across." } 
      },
      { 
        pv: "Cut back (on)", trope: "The Strict Budget", cefr: "B2", icon: TrendingDown, 
        meaning: "To significantly reduce expenditure or production.", 
        meaningJP: "（出費や量を）切り詰める、削減する", 
        example: "The firm cut back production because sales were sluggish.", 
        exampleJP: "売上が低迷したため、その会社は生産を削減した。",
        vibes: ["Going on a budget", "Saving up for a trip", "Financial stress"], 
        vibesJP: ["予算を立てる", "旅行のために貯金する", "財政的ストレス"],
        storyline: "After seeing his terrifying credit card bill, Kaito had a panic attack. He firmly swore to completely cut back on ordering expensive delivery food and started cooking simple meals.", 
        storylineJP: "恐ろしいクレジットカードの請求書を見て、海斗はパニック発作を起こした。彼は高価なデリバリーを頼むのを完全に切り詰めると固く誓い、シンプルな自炊を始めた。", 
        quiz: { question: "The failing company had to desperately ___ production because sales dropped.", options: ["cut back", "decide on", "dish out"], correctIndex: 0, explanation: "to reduce." } 
      },
      { 
        pv: "Cut down (on)", trope: "The Health Kick", cefr: "B1", icon: Activity, 
        meaning: "To consume less of something, or to fell a tree / shoot someone.", 
        meaningJP: "（量を）減らす、切り倒す、撃ち倒す", 
        example: "I'm desperately trying to cut down on the amount of coffee I drink.", 
        exampleJP: "私は飲むコーヒーの量を減らそうと必死になっている。",
        vibes: ["Dieting goals", "Lumberjack energy", "Reducing bad habits"], 
        vibesJP: ["ダイエットの目標", "木こりのエネルギー", "悪い習慣を減らす"],
        storyline: "The doctor looked at Ken's test results and frowned. 'You are drinking entirely too much sugary soda,' she warned. 'You absolutely need to cut down immediately for your health.'", 
        storylineJP: "医者はケンの検査結果を見て眉をひそめた。「あなたは甘い炭酸飲料を完全に飲みすぎです」と彼女は警告した。「健康のために今すぐ絶対に量を減らす必要があります。」", 
        quiz: { question: "The powerful lumberjacks quickly ___ the massive, ancient oak tree.", options: ["cut down", "cut in", "died off"], correctIndex: 0, explanation: "to fell a tree / consume less." } 
      },
      { 
        pv: "Cut in", trope: "The Rude Interruption", cefr: "B2", icon: MessageCircle, 
        meaning: "To interrupt someone speaking, drive in front of a vehicle, or start functioning.", 
        meaningJP: "話を遮る、割り込む、（機械が）作動する", 
        example: "We were having a serious conversation when he rudely cut in.", 
        exampleJP: "私たちが真剣な会話をしている時に、彼は無礼にも話を遮って割り込んできた。",
        vibes: ["Rude drivers", "Eavesdropping", "Sudden interruptions"], 
        vibesJP: ["乱暴な運転手", "立ち聞き", "突然の割り込み"],
        storyline: "Mika was in the middle of emotionally confessing her feelings to Sora. Suddenly, the annoying class clown rudely cut in to ask about the math homework, completely ruining the moment.", 
        storylineJP: "ミカはソラに感情的に気持ちを告白している真っ最中だった。突然、厄介なお調子者が数学の宿題について聞くために無礼にも話を遮り（割り込み）、その瞬間を完全に台無しにした。", 
        quiz: { question: "The aggressive sports car dangerously ___ front of the heavy truck.", options: ["cut in", "cut out", "dashed off"], correctIndex: 0, explanation: "to interrupt or drive in front." } 
      },
      { 
        pv: "Cut it out!", trope: "The Angry Teacher", cefr: "B1", icon: XOctagon, 
        meaning: "An imperative used to tell someone to stop their unfair or unreasonable behavior.", 
        meaningJP: "いい加減にしろ！、やめろ！", 
        example: "Will you two idiots please cut it out and keep quiet?", 
        exampleJP: "君たち二人のバカ、いい加減にして静かにしてくれないか？",
        vibes: ["Losing patience", "Scolding siblings", "Stopping bad behavior"], 
        vibesJP: ["忍耐を失う", "兄弟を叱る", "悪い行動を止めさせる"],
        storyline: "The two brothers had been poking each other and giggling in the backseat for two hours. Finally, dad slammed the steering wheel. 'Cut it out right now, or I'm turning this car around!'", 
        storylineJP: "2人の兄弟は後部座席で2時間も互いをつつき合い、クスクス笑っていた。ついに父親はハンドルを叩いた。「今すぐやめろ（いい加減にしろ）！さもないと車を引き返すぞ！」", 
        quiz: { question: "You are making entirely too much noise, so just ___!", options: ["cut it out", "die away", "dive in"], correctIndex: 0, explanation: "to stop annoying behavior." } 
      },
      { 
        pv: "Cut off", trope: "The Dead Connection", cefr: "B2", icon: CloudOff, 
        meaning: "To disconnect a service, or completely isolate a place/person.", 
        meaningJP: "（電気・通信を）止める、孤立させる", 
        example: "The phone company cut off our internet because we forgot to pay.", 
        exampleJP: "支払いを忘れたため、電話会社は私たちのインターネットを止めた（切断した）。",
        vibes: ["Losing Wi-Fi", "Snowed in", "Unpaid bills"], 
        vibesJP: ["Wi-Fiを失う", "雪に閉じ込められる", "未払いの請求書"],
        storyline: "The massive, unprecedented avalanche crashed down the mountain. Instantly, the main road was blocked, entirely cutting off the tiny ski village from the rest of the world for three days.", 
        storylineJP: "かつてない大規模な雪崩が山を崩れ落ちた。瞬時に主要道路が塞がれ、その小さなスキー村は3日間、外の世界から完全に孤立させられた（断たれた）。", 
        quiz: { question: "The angry bartender ___ the drunk customer ___ and refused to serve him.", options: ["cut / off", "cried / out", "divided / up"], correctIndex: 0, explanation: "to disconnect or isolate." } 
      },
      { 
        pv: "Cut out", trope: "The Engine Failure", cefr: "B2", icon: Cpu, 
        meaning: "To exclude something, leave quickly, or for an engine to suddenly stop.", 
        meaningJP: "除外する、急いで立ち去る、（エンジンなどが）突然止まる", 
        example: "The rusty car engine sputtered and violently cut out at the traffic lights.", 
        exampleJP: "錆びた車のエンジンがブルブルと音を立て、信号で激しく突然止まった。",
        vibes: ["Car breaking down", "Dietary restrictions", "Removing toxic people"], 
        vibesJP: ["車の故障", "食事制限", "有毒な人々を排除する"],
        storyline: "They were blasting music on the highway when the old van violently shuddered. Black smoke poured from the hood, and the engine entirely cut out, leaving them stranded in the desert.", 
        storylineJP: "彼らが高速道路で音楽を爆音で流していると、古いバンが激しく震えた。ボンネットから黒煙が上がり、エンジンが完全に突然止まり、彼らは砂漠に取り残された。", 
        quiz: { question: "If you want to be healthy, you must entirely ___ junk food from your diet.", options: ["cut out", "cut up", "damp down"], correctIndex: 0, explanation: "to exclude or stop working." } 
      },
      { 
        pv: "Cut out on", trope: "The Ultimate Betrayal", cefr: "C1", icon: Ghost, 
        meaning: "To let down, snub, or abandon someone unexpectedly.", 
        meaningJP: "（人を）見捨てる、約束をすっぽかす", 
        example: "Although he promised to help, the star cut out on the charity event.", 
        exampleJP: "助けると約束したにもかかわらず、そのスターはチャリティイベントをすっぽかした。",
        vibes: ["Flaking on a team", "Leaving someone stranded", "Selfish behavior"], 
        vibesJP: ["チームを見捨てる", "誰かを置き去りにする", "利己的な行動"],
        storyline: "The massive science project was due tomorrow, and everyone was working frantically. But Leo, claiming his hand hurt, cowardly cut out on his team and went home to play games.", 
        storylineJP: "巨大な科学プロジェクトは明日が期限で、全員が狂ったように働いていた。しかしレオは手が痛いと言い張り、卑怯にもチームを見捨てて（約束をすっぽかして）ゲームをするために帰宅した。", 
        quiz: { question: "I can't believe she selfishly ___ us right before the big presentation.", options: ["cut out on", "dawned on", "dozed off"], correctIndex: 0, explanation: "to let down or abandon." } 
      },
      { 
        pv: "Cut up", trope: "The Broken Heart", cefr: "B2", icon: Heart, 
        meaning: "To make someone deeply upset emotionally, cut into pieces, or drive into a lane.", 
        meaningJP: "ひどく悲しませる、細かく切り刻む、無理な割り込みをする", 
        example: "Her harsh, unforgiving reaction to the gift really cut me up.", 
        exampleJP: "プレゼントに対する彼女の厳しく容赦のない反応は、私を本当にひどく悲しませた。",
        vibes: ["Deep emotional pain", "Chopping veggies", "A devastating breakup"], 
        vibesJP: ["深い感情的な痛み", "野菜を刻む", "壊滅的な別れ"],
        storyline: "It wasn't just a pet; it was his best friend of fifteen years. When the loyal dog finally passed away, Ken was so completely cut up that he locked himself in his room for days.", 
        storylineJP: "それはただのペットではなく、15年来の親友だった。その忠実な犬が息を引き取った時、ケンはあまりにもひどく悲しみ、何日も部屋に閉じこもった。", 
        quiz: { question: "The furious chef efficiently ___ the vegetables into tiny, perfect squares.", options: ["cut up", "died down", "dished out"], correctIndex: 0, explanation: "to upset or cut to pieces." } 
      },
      { 
        pv: "Damp down", trope: "The Drama Defuser", cefr: "C1", icon: Droplets, 
        meaning: "To calm or reduce negative feelings, or make a fire burn less strongly.", 
        meaningJP: "（感情を）鎮める、（火を）弱める", 
        example: "The school tried to damp down the anger over the sudden rule change.", 
        exampleJP: "学校は、突然の規則変更に対する怒りを鎮めようとした。",
        vibes: ["Defusing a bomb", "Putting out fires", "Calming the crowd"], 
        vibesJP: ["爆弾の信管を抜く", "火を消す", "群衆を落ち着かせる"],
        storyline: "Rumors spread that the school festival was canceled. Students were furious and ready to riot. The principal grabbed a microphone to quickly damp down the panic with the real facts.", 
        storylineJP: "学園祭が中止になったという噂が広まった。生徒たちは激怒し、暴動を起こす勢いだった。校長はマイクを掴み、真実を伝えてそのパニックを素早く鎮めようとした。", 
        quiz: { question: "The firefighters successfully managed to ___ the massive flames.", options: ["damp down", "dash off", "decide on"], correctIndex: 0, explanation: "to calm feelings or reduce fire." } 
      },
      { 
        pv: "Damp off", trope: "The Plant Parent Fail", cefr: "C2", icon: Droplets, 
        meaning: "When there is too much moisture and a plant is affected by fungal parasites.", 
        meaningJP: "（湿気で植物が）立ち枯れ病になる、根腐れする", 
        example: "The fragile seedlings damp off in the spring if it's very wet.", 
        exampleJP: "春に非常に湿気が多いと、繊細な苗は立ち枯れ病になってしまう。",
        vibes: ["Overwatering", "Rotten roots", "Fungal disasters"], 
        vibesJP: ["水のやりすぎ", "腐った根", "真菌の大惨事"],
        storyline: "Mika excitedly bought expensive, rare tomato seeds. But she watered them entirely too much every single day. Within a week, the tiny green shoots began to damp off and completely die.", 
        storylineJP: "ミカは興奮して高価で珍しいトマトの種を買った。しかし彼女は毎日完全に水をやりすぎた。1週間以内に、小さな緑の芽は立ち枯れ病になり（根腐れし）、完全に死んでしまった。", 
        quiz: { question: "If you overwater those delicate plants, they will quickly ___.", options: ["damp off", "die away", "dip out"], correctIndex: 0, explanation: "plant disease from moisture." } 
      },
      { 
        pv: "Dash down / off", trope: "The Panic Exit", cefr: "B2", icon: Wind, 
        meaning: "To write something very quickly, or leave a place in a massive hurry.", 
        meaningJP: "一気に書き上げる、急いで立ち去る", 
        example: "It's late; I'm going to dash off home now!", 
        exampleJP: "遅くなった。もう急いで家に帰るよ！",
        vibes: ["Running for the train", "Last-minute essays", "The Irish exit"], 
        vibesJP: ["電車に向かって走る", "直前のエッセイ", "黙って立ち去る（アイリッシュ・エグジット）"],
        storyline: "The fancy dinner party was getting highly interesting. But Kaito checked his buzzing phone, turned pale, and had to completely dash off into the night without saying goodbye.", 
        storylineJP: "豪華なディナーパーティは最高に面白くなってきたところだった。しかし海斗はスマホを確認すると青ざめ、別れも告げずに夜の中へ急いで立ち去らなければならなかった。", 
        quiz: { question: "He frantically ___ a quick apology note before running out the door.", options: ["dashed down", "died out", "dug in"], correctIndex: 0, explanation: "to write or leave quickly." } 
      },
      { 
        pv: "Dawn on", trope: "The Epiphany", cefr: "C1", icon: Sun, 
        meaning: "To finally realize or understand something completely after a period of confusion.", 
        meaningJP: "（事実などに）ハッと気づく、分かり始める", 
        example: "The terrifying truth only dawned on me much later.", 
        exampleJP: "その恐ろしい真実に私がハッと気づいたのは、ずっと後になってからだった。",
        vibes: ["Sudden realization", "Plot twist clicking", "Connecting the dots"], 
        vibesJP: ["突然の気付き", "どんでん返しに納得する", "点と点が繋がる"],
        storyline: "Sora stared blankly at the highly cryptic text message for ten minutes. Suddenly, the strange emojis made sense, and it powerfully dawned on him what the hidden message meant.", 
        storylineJP: "ソラは不可解なテキストメッセージを10分間ぼんやりと見つめていた。突然、奇妙な絵文字の意味が繋がり、隠されたメッセージの意味が彼に強力にハッと分かり始めた（気づいた）。", 
        quiz: { question: "After reading the old emails, the painful truth finally ___ her.", options: ["dawned on", "did away with", "drew back"], correctIndex: 0, explanation: "to finally realize." } 
      },
      { 
        pv: "Decide on / upon", trope: "The Final Choice", cefr: "B1", icon: CheckCircle2, 
        meaning: "To definitively choose or select something after careful thought.", 
        meaningJP: "（よく考えた末に）〜に決める", 
        example: "She looked at houses for months, but eventually decided on one near work.", 
        exampleJP: "彼女は何ヶ月も家を見て回ったが、最終的に職場の近くの家に決めた。",
        vibes: ["Making tough choices", "Commitment", "Finalizing plans"], 
        vibesJP: ["難しい選択をする", "コミットメント（誓約）", "計画を最終決定する"],
        storyline: "The cultural club argued for three weeks about the festival theme. After eliminating haunted houses and cafes, they finally proudly decided upon a massive, interactive escape room.", 
        storylineJP: "文化部は3週間、学園祭のテーマについて議論した。お化け屋敷やカフェを却下した後、彼らはついに、大規模でインタラクティブな脱出ゲームに決めた。", 
        quiz: { question: "After hours of menu reading, I finally ___ the spicy chicken curry.", options: ["decided on", "died for", "doled out"], correctIndex: 0, explanation: "to choose." } 
      }
    ],
    
    17: [
      { 
        pv: "Die away", trope: "The Fading Echo", cefr: "B2", icon: Volume2, 
        meaning: "To become quieter or inaudible (of a sound).", 
        meaningJP: "（音が）次第に消える、静まる", 
        example: "The last notes of the beautiful song died away, and the audience applauded.", 
        exampleJP: "その美しい歌の最後の音符が次第に消え（静まり）、観客は拍手喝采した。",
        vibes: ["Fading music", "Echoes disappearing", "A quiet end"], 
        vibesJP: ["消えゆく音楽", "消えていくエコー", "静かな終わり"],
        storyline: "The intense, chaotic rock concert finally ended. As the massive cheering slowly died away into the cool night air, Kaito smiled, his ears still ringing from the bass.", 
        storylineJP: "激しくカオスなロックコンサートがついに終わった。巨大な歓声が涼しい夜気の中にゆっくりと静まり（次第に消えて）いく中、海斗はベースの音でまだ耳鳴りがしながらも微笑んだ。", 
        quiz: { question: "The loud sound of the passing ambulance siren gradually ___ in the distance.", options: ["died away", "dug out", "did in"], correctIndex: 0, explanation: "to become quieter." } 
      },
      { 
        pv: "Die back", trope: "The Winter Sleep", cefr: "C2", icon: CloudOff, 
        meaning: "When the parts of a plant above ground die, but the roots remain alive.", 
        meaningJP: "（植物の地上部が）枯れる（根は生きている）", 
        example: "The plant dies back in the winter, but returns every spring.", 
        exampleJP: "その植物は冬には地上部が枯れるが、毎年春になると再び芽吹く。",
        vibes: ["Winter gardening", "Hidden survival", "Waiting for spring"], 
        vibesJP: ["冬のガーデニング", "隠された生存", "春を待つ"],
        storyline: "Mika panicked when her expensive rose bushes completely turned brown and withered in December. 'Don't worry,' her grandmother smiled. 'They just die back in the cold. They'll bloom again.'", 
        storylineJP: "12月に高価なバラの茂みが完全に茶色く枯れてしまい、ミカはパニックになった。「心配しないで」と祖母は微笑んだ。「寒さで地上部が枯れている（死んでいる）だけよ。また咲くわ。」", 
        quiz: { question: "These specific flowers will ___ completely during the freezing winter months.", options: ["die back", "dip out", "dish up"], correctIndex: 0, explanation: "plant dies above ground." } 
      },
      { 
        pv: "Die down", trope: "The Fading Storm", cefr: "B2", icon: TrendingDown, 
        meaning: "To gradually decrease, become quieter, or fade away completely.", 
        meaningJP: "（騒ぎや嵐が）静まる、収まる", 
        example: "I'm patiently waiting for the massive online hate to finally die down.", 
        exampleJP: "私は、ネット上の大規模なヘイトが最終的に静まる（収まる）のを忍耐強く待っている。",
        vibes: ["Internet drama fading", "A raging storm passing", "Losing relevance"], 
        vibesJP: ["ネットの騒動が色褪せる", "猛烈な嵐が過ぎ去る", "関連性を失う"],
        storyline: "The massive, terrifying thunderstorm raged all night, rattling the windows. But as the golden sun rose, the fierce winds finally died down, leaving a perfect, peaceful morning.", 
        storylineJP: "巨大で恐ろしい雷雨が一晩中吹き荒れ、窓をガタガタと鳴らした。しかし黄金の太陽が昇るにつれ、激しい風はついに静まり（収まり）、完璧で平和な朝を残した。", 
        quiz: { question: "We waited in the shelter until the heavy rain finally ___.", options: ["died down", "dug out", "did in"], correctIndex: 0, explanation: "to become less intense." } 
      },
      { 
        pv: "Die for", trope: "The Intense Craving", cefr: "B1", icon: Heart, 
        meaning: "To want something or someone extremely badly.", 
        meaningJP: "〜が欲しくてたまらない、死ぬほど欲しい", 
        example: "I'm absolutely dying for the weekend; this week has been so hard.", 
        exampleJP: "週末が絶対的に死ぬほど待ち遠しい（欲しくてたまらない）。今週は本当に大変だったから。",
        vibes: ["Desperate thirst", "Craving a vacation", "Loving a dessert"], 
        vibesJP: ["必死の渇き", "休暇を切望する", "デザートを愛する"],
        storyline: "After running a grueling ten-kilometer marathon in the blazing summer heat, Sora collapsed on the grass. 'I am literally dying for an ice-cold sports drink right now,' he gasped.", 
        storylineJP: "灼熱の夏の暑さの中、過酷な10kmマラソンを走った後、ソラは芝生に倒れ込んだ。「今、氷のように冷たいスポーツドリンクが文字通り死ぬほど欲しい（欲しくてたまらない）よ」と彼は息を切らした。", 
        quiz: { question: "After eating all that salty popcorn, I am ___ a large glass of water.", options: ["dying for", "doing without", "droning on"], correctIndex: 0, explanation: "to want something a lot." } 
      },
      { 
        pv: "Die off / out", trope: "The Extinction", cefr: "B2", icon: Ghost, 
        meaning: "To become completely extinct or disappear over time.", 
        meaningJP: "絶滅する、次第に消滅する、廃れる", 
        example: "Some scientists say the dinosaurs died out when a comet hit the earth.", 
        exampleJP: "一部の科学者は、彗星が地球に衝突した時に恐竜が絶滅した（消滅した）と言っている。",
        vibes: ["Evolution", "Forgotten technology", "Fading traditions"], 
        vibesJP: ["進化", "忘れられたテクノロジー", "色褪せる伝統"],
        storyline: "Decades ago, the town was famous for its traditional wooden toys. But as cheap plastic imports flooded the market, the old crafting skills tragically died out completely.", 
        storylineJP: "何十年も前、その町は伝統的な木製のおもちゃで有名だった。しかし安いプラスチックの輸入品が市場に溢れるにつれ、古い職人技は悲劇的にも完全に廃れて（消滅して）しまった。", 
        quiz: { question: "Without urgent protection, this beautiful species of tiger will completely ___.", options: ["die out", "dig in", "dish out"], correctIndex: 0, explanation: "to become extinct." } 
      },
      { 
        pv: "Dig in / into", trope: "The Foodie", cefr: "B1", icon: ShoppingCart, 
        meaning: "To start eating greedily, excavate a shelter, or reach inside something.", 
        meaningJP: "（食事に）がっつく、塹壕を掘る、手を突っ込む", 
        example: "We were completely starving, so we really dug in when the food arrived.", 
        exampleJP: "私たちは完全に腹ペコだったので、食べ物が到着した時に本当にがっついた。",
        vibes: ["Feasting", "Searching your purse", "Military trenches"], 
        vibesJP: ["ごちそう", "財布の中を探す", "軍の塹壕"],
        storyline: "The massive holiday feast was beautifully laid out. Nobody spoke a single polite word; they just grabbed their forks and aggressively dug into the food like a pack of wolves.", 
        storylineJP: "巨大な休日のごちそうが美しく並べられた。誰も礼儀正しい言葉を一つも発さず、ただフォークを掴み、まるで狼の群れのようにアグレッシブに食事にがっついた（食べ始めた）。", 
        quiz: { question: "She excitedly ___ her large handbag to find her ringing phone.", options: ["dug into", "did away with", "drew back"], correctIndex: 0, explanation: "to reach inside or start eating." } 
      },
      { 
        pv: "Dig out", trope: "The Hoarder's Find", cefr: "B2", icon: Search, 
        meaning: "To find something you haven't seen for a long time, or remove by digging.", 
        meaningJP: "（古いものを）探し出す、掘り出す", 
        example: "I dug out my old university essays from the dusty attic.", 
        exampleJP: "私は埃っぽい屋根裏部屋から、大学時代の古いエッセイを掘り出した（探し出した）。",
        vibes: ["Spring cleaning", "Finding childhood toys", "Archaeology"], 
        vibesJP: ["大掃除", "子供時代のおもちゃを見つける", "考古学"],
        storyline: "The power went out during the freezing blizzard. Kaito went down to the dark basement and spent an hour trying to dig out the ancient, dusty emergency generator from under piles of junk.", 
        storylineJP: "凍えるような猛吹雪の中で停電が起きた。海斗は暗い地下室に降り、ガラクタの山の下から古くて埃をかぶった非常用発電機を掘り出す（探し出す）ために1時間を費やした。", 
        quiz: { question: "I finally managed to ___ my old winter coat from the back of the closet.", options: ["dig out", "do in", "dole out"], correctIndex: 0, explanation: "to find something old or hidden." } 
      },
      { 
        pv: "Dig up", trope: "The Secret Unearthed", cefr: "C1", icon: Search, 
        meaning: "To find a secret, or remove something from the ground by digging.", 
        meaningJP: "（秘密などを）暴く、掘り起こす", 
        example: "The greedy reporters eventually dug up the ugly truth about his affair.", 
        exampleJP: "強欲な記者たちは、最終的に彼の浮気に関する醜い真実を暴き出した（掘り起こした）。",
        vibes: ["Exposing scandals", "Tabloid journalism", "Digging holes"], 
        vibesJP: ["スキャンダルを暴露する", "タブロイド・ジャーナリズム", "穴を掘る"],
        storyline: "The corrupt mayor thought his offshore bank accounts were perfectly hidden. But a brilliant investigative journalist dug up the digital records, exposing his crimes to the entire world.", 
        storylineJP: "腐敗した市長は、自分のオフショア口座が完璧に隠されていると思っていた。しかし優秀な調査ジャーナリストがデジタル記録を暴き（掘り起こし）、彼の犯罪を全世界に暴露した。", 
        quiz: { question: "The police completely ___ the entire garden searching for the stolen gold.", options: ["dug up", "dined out", "divided up"], correctIndex: 0, explanation: "to remove from ground or find secrets." } 
      },
      { 
        pv: "Dine out (on)", trope: "The Great Story", cefr: "C1", icon: Coffee, 
        meaning: "To eat a meal outside your home, or tell a well-received story repeatedly.", 
        meaningJP: "外食する、（武勇伝などを）何度も話してウケを取る", 
        example: "We dined out because we couldn't be bothered to cook tonight.", 
        exampleJP: "今夜は料理をするのが面倒だったので、私たちは外食した。",
        vibes: ["Fancy restaurants", "Milking a funny story", "Weekend treats"], 
        vibesJP: ["高級レストラン", "面白い話を最大限に利用する", "週末のご褒美"],
        storyline: "Years ago, Ken accidentally locked himself inside a famous pop star's dressing room. It was so hilarious that he has successfully dined out on that exact story at every party since.", 
        storylineJP: "何年も前、ケンは有名なポップスターの楽屋にうっかり閉じ込められた。それがとても面白かったため、彼はそれ以来、あらゆるパーティーでまさにその話をしてウケを取っている（外食のネタにしている）。", 
        quiz: { question: "I'm entirely too tired to cook; let's just ___ at the Italian place.", options: ["dine out", "dip in", "doze off"], correctIndex: 0, explanation: "to eat at a restaurant." } 
      },
      { 
        pv: "Dip in / into", trope: "The Savings Drain", cefr: "B2", icon: BookOpen, 
        meaning: "To put in liquid, read parts of a book, or take money from savings.", 
        meaningJP: "浸す、（本を）拾い読みする、（貯金に）手をつける", 
        example: "I've had to dip into my savings account to pay for the house repairs.", 
        exampleJP: "家の修繕費を払うために、貯金口座に手をつけなければならなかった。",
        vibes: ["Breaking the piggy bank", "Skimming a magazine", "Financial emergencies"], 
        vibesJP: ["貯金箱を割る", "雑誌を拾い読みする", "財政的な緊急事態"],
        storyline: "Kaito's gaming PC suddenly exploded with a puff of smoke. Devastated, he realized he would have to painfully dip into his college savings fund just to buy a replacement.", 
        storylineJP: "海斗のゲーミングPCが煙を上げて突然爆発した。絶望した彼は、代わりを買うためだけに、苦痛を伴いながら大学の貯金に手をつける必要があると悟った。", 
        quiz: { question: "I haven't read the whole novel properly, I've just been ___ it.", options: ["dipping into", "dishing out", "diving in"], correctIndex: 0, explanation: "to read parts or use savings." } 
      },
      { 
        pv: "Dip out", trope: "The Ghoster", cefr: "C2", icon: Ghost, 
        meaning: "To leave a place without telling anyone.", 
        meaningJP: "（こっそり）抜け出す", 
        example: "The party was so incredibly dull I just dipped out early.", 
        exampleJP: "そのパーティーは信じられないほど退屈だったので、私はただ早めにこっそり抜け出した。",
        vibes: ["The Irish exit", "Avoiding goodbyes", "Boring parties"], 
        vibesJP: ["黙って立ち去る（アイリッシュ・エグジット）", "別れの挨拶を避ける", "退屈なパーティー"],
        storyline: "The corporate networking event was painfully awkward, full of people in gray suits talking about taxes. Bored out of her mind, Mika grabbed her coat and silently dipped out the back door.", 
        storylineJP: "企業のネットワーキングイベントは、灰色のスーツを着て税金の話をする人ばかりで苦痛なほど気まずかった。退屈で気が狂いそうになったミカはコートを掴み、無言で裏口から抜け出した。", 
        quiz: { question: "I didn't want to say goodbye to everyone, so I quietly ___ of the room.", options: ["dipped out", "dosed down", "double backed"], correctIndex: 0, explanation: "to leave secretly." } 
      },
      { 
        pv: "Disagree with", trope: "The Stomach Ache", cefr: "B2", icon: Activity, 
        meaning: "To make someone feel sick or ill (usually referring to food).", 
        meaningJP: "（食べ物が体質や胃腸に）合わない", 
        example: "I feel dreadful; the spicy prawns I had for lunch are disagreeing with me.", 
        exampleJP: "気分が最悪だ。昼食に食べたスパイシーなエビが、私の胃腸に合わなかったみたい。",
        vibes: ["Food poisoning", "Regretting a meal", "Upset stomach"], 
        vibesJP: ["食中毒", "食事を後悔する", "胃の不調"],
        storyline: "Sora bravely took on the 'Hell-Level Spicy Ramen' challenge. Ten minutes later, he was sweating in deep regret. 'I love the taste, but this definitely disagrees with my stomach,' he groaned.", 
        storylineJP: "ソラは勇敢にも「地獄級激辛ラーメン」に挑んだ。10分後、彼は汗だくになり後悔していた。「味は最高なんだが、これは間違いなく俺の胃には合わないな」と彼はうめいた。", 
        quiz: { question: "I shouldn't have eaten that cheap sushi; it severely ___ me.", options: ["disagreed with", "did away with", "drew into"], correctIndex: 0, explanation: "to make sick (food)." } 
      },
      { 
        pv: "Dish out", trope: "The Harsh Critic", cefr: "C1", icon: Angry, 
        meaning: "To distribute something, or criticize (often when you can't take criticism back).", 
        meaningJP: "（罰や批判を）気前よく与える、言いたい放題言う", 
        example: "He dishes it out, but gets all hurt when anyone responds.", 
        exampleJP: "彼は批判を言いたい放題言うくせに、誰かが言い返すとひどく傷つく。",
        vibes: ["Handing out harsh penalties", "Hypocrites", "Giving unwanted advice"], 
        vibesJP: ["厳しい罰を配る", "偽善者", "ありがた迷惑なアドバイスをする"],
        storyline: "The arrogant boss loved to confidently dish out brutal, embarrassing insults to his staff all day. But the second a brave intern gently corrected his typo, he threw a massive tantrum.", 
        storylineJP: "傲慢なボスは一日中、スタッフに残酷で恥をかかせるような侮辱を自信満々に言いたい放題言う（与える）のが大好きだった。しかし勇敢なインターンが彼のタイプミスを優しく訂正した瞬間、彼は大かんしゃくを起こした。", 
        quiz: { question: "The extremely strict teacher is famously known to ruthlessly ___ massive amounts of homework.", options: ["dish out", "do in", "drag on"], correctIndex: 0, explanation: "to distribute generously." } 
      },
      { 
        pv: "Dish up", trope: "The Generous Chef", cefr: "B1", icon: Package, 
        meaning: "To serve food.", 
        meaningJP: "（食事を）取り分ける、配膳する", 
        example: "He dished up a truly great dinner when we finally got back.", 
        exampleJP: "私たちがようやく戻った時、彼は本当に素晴らしい夕食を配膳してくれた。",
        vibes: ["Serving a huge dinner", "Family meals", "Kitchen duty"], 
        vibesJP: ["巨大なディナーを提供する", "家族の食事", "キッチンの当番"],
        storyline: "After a freezing, exhausting day of skiing, they burst into the warm cabin. Grandpa smiled and immediately dished up five massive, steaming bowls of his legendary beef stew.", 
        storylineJP: "凍えるような疲労困憊のスキーの1日の後、彼らは暖かいキャビンに飛び込んだ。祖父は微笑み、即座に彼の伝説のビーフシチューの巨大で湯気を立てるお椀を5つ配膳した（取り分けた）。", 
        quiz: { question: "The hungry children cheered as the mother ___ the hot spaghetti.", options: ["dished up", "doled out", "double backed"], correctIndex: 0, explanation: "to serve food." } 
      },
      { 
        pv: "Dive in / into", trope: "The Fearless Start", cefr: "B1", icon: Zap, 
        meaning: "To start doing something enthusiastically without planning, or reach inside.", 
        meaningJP: "（ためらわずに）飛び込む、がっつく", 
        example: "When we saw what was happening, we all dived in to help immediately.", 
        exampleJP: "何が起こっているかを見た時、私たちは皆すぐに助けるためにためらわずに飛び込んだ。",
        vibes: ["Taking the plunge", "Attacking a buffet", "Action without thought"], 
        vibesJP: ["思い切って行動する", "ビュッフェを攻撃する", "考えなしの行動"],
        storyline: "The complex robotics project was completely overwhelming. Instead of making a careful plan, Leo just grabbed a soldering iron and eagerly dived right in, trusting his pure instincts.", 
        storylineJP: "その複雑なロボット工学プロジェクトは完全に圧倒的だった。慎重な計画を立てる代わりに、レオはハンダごてを掴み、純粋な直感を信じて熱心に（ためらわずに）作業に飛び込んだ。", 
        quiz: { question: "The pizza is perfectly hot and ready on the table, so everyone ___!", options: ["dive in", "die off", "drift apart"], correctIndex: 0, explanation: "to start doing/eating enthusiastically." } 
      },
      { 
        pv: "Divide up / Divvy out / up", trope: "The Fair Share", cefr: "B1", icon: Users, 
        meaning: "To share, divide, or separate something into smaller parts for everyone.", 
        meaningJP: "分配する、山分けする", 
        example: "The waiters and waitresses efficiently divvy out the tips at the end of the night.", 
        exampleJP: "ウェイターとウェイトレスたちは、夜の終わりにチップを効率よく山分けする。",
        vibes: ["Splitting the bill", "Pirates sharing loot", "Teamwork tasks"], 
        vibesJP: ["割り勘にする", "海賊が戦利品を分ける", "チームワークのタスク"],
        storyline: "After successfully completing the massive neighborhood cleanup, the club president opened a giant box of premium chocolates and carefully divided them up equally among the exhausted volunteers.", 
        storylineJP: "大規模な地域の清掃活動を成功させた後、部長は高級チョコレートの巨大な箱を開け、疲れ切ったボランティアたちの間で慎重にそれらを平等に山分けした（分配した）。", 
        quiz: { question: "We successfully sold the old company and fairly ___ the massive profits.", options: ["divided up", "did up", "dozed off"], correctIndex: 0, explanation: "to share or divide." } 
      },
      { 
        pv: "Do away with", trope: "The Absolute Rule Change", cefr: "C1", icon: Trash2, 
        meaning: "To entirely abolish, get rid of, or destroy something completely.", 
        meaningJP: "（規則などを）廃止する、完全に取り除く", 
        example: "The progressive new government decided to fully do away with the outdated tax laws.", 
        exampleJP: "進歩的な新政府は、時代遅れの税法を完全に廃止する（取り除く）ことを決定した。",
        vibes: ["Abolishing terrible rules", "Trashing old systems", "A massive structural reform"], 
        vibesJP: ["ひどいルールを廃止する", "古いシステムを捨てる", "大規模な構造改革"],
        storyline: "The strict, traditional uniform policy had been widely hated by every single student. When the progressive new principal took over, his first legendary action was to entirely do away with the suffocating rules.", 
        storylineJP: "厳格で伝統的な制服の規則は、すべての生徒から広く憎まれていた。進歩的な新校長が就任した時、彼の最初の伝説的な行動は、その息苦しいルールを完全に廃止する（取り除く）ことだった。", 
        quiz: { question: "The innovative company aims to completely ___ the use of single-use plastics.", options: ["do away with", "draw down", "drone on"], correctIndex: 0, explanation: "to abolish or remove." } 
      },
      { 
        pv: "Do in", trope: "The Exhaustion", cefr: "C1", icon: XOctagon, 
        meaning: "To completely exhaust someone, or to kill/murder them.", 
        meaningJP: "へとへとに疲れさせる、（俗語）殺す", 
        example: "That grueling, three-hour marathon completely did me in.", 
        exampleJP: "あの過酷な3時間のマラソンは、私を完全にへとへとに疲れさせた。",
        vibes: ["Total physical collapse", "Mafia hitmen", "Extreme workouts"], 
        vibesJP: ["完全な肉体の崩壊", "マフィアの殺し屋", "極限のワークアウト"],
        storyline: "Sora arrogantly claimed he could easily climb the massive mountain without any training. But by the time they reached the halfway point, the steep, rocky path had absolutely done him in.", 
        storylineJP: "ソラはトレーニングなしでも巨大な山に簡単に登れると傲慢に主張していた。しかし中間地点に到達する頃には、急で岩だらけの道が彼を完全にへとへとに疲れさせていた。", 
        quiz: { question: "The gangsters threatened to cruelly ___ him ___ if he talked to the police.", options: ["do / in", "do / without", "draw / back"], correctIndex: 0, explanation: "to kill or exhaust." } 
      },
      { 
        pv: "Do out of", trope: "The Cruel Scam", cefr: "C2", icon: AlertTriangle, 
        meaning: "To cheat or trick somebody out of something that is rightfully theirs.", 
        meaningJP: "（ズルをして）騙し取る、奪う", 
        example: "They lied on the legal reference and completely did me out of any chance of getting the job.", 
        exampleJP: "彼らは法的な推薦状で嘘をつき、私がその仕事を得るチャンスを完全に奪った（騙し取った）。",
        vibes: ["Betrayal in business", "Stolen inheritances", "Unfair losses"], 
        vibesJP: ["ビジネスでの裏切り", "盗まれた遺産", "不当な損失"],
        storyline: "The elderly man trusted the friendly, well-dressed salesman. But it was a cruel scam. The salesman tricked him into signing a fake contract, essentially doing him out of his entire life savings.", 
        storylineJP: "老人は身なりの良い親切なセールスマンを信じた。しかしそれは残酷な詐欺だった。セールスマンは彼を騙して偽の契約書にサインさせ、事実上、彼の全財産を騙し取った（奪った）のだ。", 
        quiz: { question: "The highly corrupt bank manager deliberately ___ the clients ___ their investments.", options: ["did / out of", "dressed / down", "drank / up"], correctIndex: 0, explanation: "to cheat someone out of something." } 
      },
      { 
        pv: "Do up", trope: "The Renovation Flex", cefr: "B2", icon: Hammer, 
        meaning: "To close or fasten clothes, or to extensively repair and decorate a building.", 
        meaningJP: "（ボタンなどを）留める、（家を）改装する", 
        example: "We bought an incredibly cheap, ruined old house and spent a whole year doing it up.", 
        exampleJP: "私たちは信じられないほど安い、廃墟のような古い家を買い、丸一年かけてそれを改装した。",
        vibes: ["Flipping an old house", "Zipping a heavy winter coat", "A massive aesthetic makeover"], 
        vibesJP: ["古い家を転売目的で改築する", "重い冬のコートのジッパーを上げる", "大規模な美の変身"],
        storyline: "The abandoned Victorian mansion was practically falling apart. But Mika saw its potential. She bought it for nothing and spent two exhausting years doing it up into a stunning luxury hotel.", 
        storylineJP: "見捨てられたビクトリア朝の館はほとんど崩れ落ちそうだった。しかしミカはその可能性を見出した。彼女はそれをタダ同然で買い取り、2年かけて見事な高級ホテルへと改装した（修繕した）。", 
        quiz: { question: "It's freezing outside; make absolutely sure you ___ your heavy coat tightly.", options: ["do up", "drop off", "dry up"], correctIndex: 0, explanation: "to fasten or renovate." } 
      }
    ],
    
    18: [
      { 
        pv: "Do with (Could do with)", trope: "The Desperate Need", cefr: "B2", icon: Heart, 
        meaning: "To need, wish for, or ask for something to improve a situation.", 
        meaningJP: "〜があるとありがたい、〜が必要だ", 
        example: "I am entirely exhausted; I could really do with a giant cup of coffee right now.", 
        exampleJP: "完全に疲れ切っている。今すぐ巨大なコーヒーのカップがあったら本当にありがたい（必要だ）。",
        vibes: ["Craving a nap", "Needing a vacation", "Desiring comfort"], 
        vibesJP: ["昼寝を切望する", "休暇を必要とする", "快適さを求める"],
        storyline: "The freezing, endlessly rainy winter had depressed everyone for months. Staring out the gray window, Mika sighed heavily. 'I could seriously do with a sunny, relaxing week on a tropical beach.'", 
        storylineJP: "凍えるような果てしない雨の冬が何ヶ月も全員を憂鬱にさせていた。灰色の窓の外を見つめながら、ミカは重いため息をついた。「南国のビーチで晴れたリラックスできる1週間がマジであったらありがたいのに。」", 
        quiz: { question: "This boring, completely plain living room ___ a bright coat of fresh paint.", options: ["could do with", "dreams up", "drums into"], correctIndex: 0, explanation: "to need or want." } 
      },
      { 
        pv: "Do without", trope: "The Survival Mode", cefr: "B2", icon: Shield, 
        meaning: "To manage to survive or continue successfully without having something you need.", 
        meaningJP: "〜なしで済ます、〜なしでやっていく", 
        example: "There's absolutely no sugar left, so you'll just have to do without.", 
        exampleJP: "砂糖は完全に切れているから、あなたたちはそれなしで済ますしかないわね。",
        vibes: ["Strict budgeting", "Surviving a power outage", "Giving up luxuries"], 
        vibesJP: ["厳しい予算管理", "停電を生き延びる", "贅沢を諦める"],
        storyline: "The devastating storm had completely destroyed the town's entire electrical grid. Sora groaned loudly. 'I guess we'll just have to totally do without the internet and perfectly survive on board games.'", 
        storylineJP: "壊滅的な嵐が町の送電網全体を完全に破壊してしまった。ソラは大声でうめいた。「ネットなしで完全に済ませて、ボードゲームだけで完璧に生き延びるしかないみたいだな。」", 
        quiz: { question: "Since we entirely forgot to buy fresh milk, we will just have to miraculously ___.", options: ["do without", "dwell on", "drift apart"], correctIndex: 0, explanation: "to manage without something." } 
      },
      { 
        pv: "Dob in", trope: "The Classroom Snitch", cefr: "C2", icon: AlertCircle, 
        meaning: "To report someone to authorities, contribute money, or pressure someone.", 
        meaningJP: "密告する、チクる、お金を出し合う", 
        example: "He cowardly dobbed me in to the angry teacher to save himself.", 
        exampleJP: "彼は自分を救うために、卑怯にも私を怒っている先生にチクった（密告した）。",
        vibes: ["Telling the teacher", "Betrayal", "Throwing someone under the bus"], 
        vibesJP: ["先生に言いつける", "裏切り", "誰かを犠牲にする（バスの下に投げる）"],
        storyline: "Ken and Leo accidentally broke the school window. They swore a blood oath to keep it a secret. But five minutes later, Ken panicked and completely dobbed Leo in to the terrifying principal.", 
        storylineJP: "ケンとレオはうっかり学校の窓を割ってしまった。彼らは秘密を守るため血の誓いを立てた。しかし5分後、ケンはパニックになり、恐ろしい校長にレオのことを完全にチクった（密告した）。", 
        quiz: { question: "Everyone happily ___ some cash to help pay for the injured dog's surgery.", options: ["dobbed in", "dosed down", "doubled back"], correctIndex: 0, explanation: "to contribute money or report someone." } 
      },
      { 
        pv: "Dole out", trope: "The Rations", cefr: "C1", icon: Package, 
        meaning: "To give out or distribute something (often money, food, or punishment).", 
        meaningJP: "（少しずつ）分け与える、分配する", 
        example: "The incredibly generous volunteers were doling out leaflets in front of the station.", 
        exampleJP: "信じられないほど寛大なボランティアたちが、駅前でチラシを分け与えて（配って）いた。",
        vibes: ["Handing out rations", "Charity work", "Giving tiny portions"], 
        vibesJP: ["配給品を配る", "慈善活動", "ほんの少しの量を与える"],
        storyline: "The school budget was severely cut. The grumpy art teacher was highly protective of the supplies, carefully doling out exactly one single sheet of premium paper to each student.", 
        storylineJP: "学校の予算は厳しく削減されていた。不機嫌な美術教師は備品を非常に大切にし、各生徒にきっかり1枚ずつの高級紙を慎重に分け与えた（分配した）。", 
        quiz: { question: "The government has been slowly ___ emergency funds to the flooded towns.", options: ["doling out", "drawing back", "dredging up"], correctIndex: 0, explanation: "to distribute." } 
      },
      { 
        pv: "Doss about / around / down", trope: "The Lazy Sunday", cefr: "B2", icon: Coffee, 
        meaning: "To spend time doing very little, or sleep somewhere temporarily.", 
        meaningJP: "ダラダラ過ごす、ゴロゴロする、仮眠をとる", 
        example: "I couldn't get down to my work and just dossed about all night.", 
        exampleJP: "仕事に取り掛かれず、一晩中ただダラダラ過ごして（ゴロゴロして）しまった。",
        vibes: ["Lazy weekends", "Avoiding homework", "Sleeping on a friend's couch"], 
        vibesJP: ["怠惰な週末", "宿題を避ける", "友達のソファで寝る"],
        storyline: "The final exams were over, and the summer sun was shining. Kaito felt absolutely zero guilt as he spent the entire glorious afternoon just dossing around the house in his pajamas.", 
        storylineJP: "期末試験が終わり、夏の日差しが輝いていた。海斗は、素晴らしい午後をパジャマ姿で家でただダラダラ過ごすことに、絶対的な罪悪感を全く感じなかった。", 
        quiz: { question: "Stop completely ___ and help me clean this extremely messy kitchen!", options: ["dossing around", "driving away", "dropping out"], correctIndex: 0, explanation: "to be lazy or unproductive." } 
      },
      { 
        pv: "Double as / up as", trope: "The Multi-Tool", cefr: "B2", icon: Home, 
        meaning: "To have a second function or purpose.", 
        meaningJP: "〜を兼ねる、二役を務める", 
        example: "My quiet study beautifully doubles as a spare bedroom when we have visitors.", 
        exampleJP: "私の静かな書斎は、来客時には見事に予備の寝室を兼ねる（二役を務める）。",
        vibes: ["Tiny apartments", "Space saving", "Versatile furniture"], 
        vibesJP: ["狭いアパート", "スペースの節約", "多目的な家具"],
        storyline: "Mika's new Tokyo apartment was unbelievably tiny. To save precious space, her stylish, modern dining table cleverly doubled as her primary work desk and gaming station.", 
        storylineJP: "ミカの新しい東京のアパートは信じられないほど狭かった。貴重なスペースを節約するため、彼女のスタイリッシュでモダンなダイニングテーブルは、メインの仕事机とゲーム台を巧妙に兼ねていた。", 
        quiz: { question: "This massive, comfortable couch easily ___ a guest bed for the night.", options: ["doubles as", "draws in", "dresses down"], correctIndex: 0, explanation: "to have a second function." } 
      },
      { 
        pv: "Double back", trope: "The Lost Keys", cefr: "C1", icon: Undo2, 
        meaning: "To turn around and go back exactly the way you were coming.", 
        meaningJP: "引き返す、来た道を戻る", 
        example: "When he saw the police roadblock, he quickly doubled back and went home.", 
        exampleJP: "警察のバリケードを見た時、彼はすぐに引き返して家に帰った。",
        vibes: ["Realizing you forgot your phone", "Dodging someone", "Getting completely lost"], 
        vibesJP: ["スマホを忘れたことに気づく", "誰かを避ける", "完全に迷子になる"],
        storyline: "Sora was halfway to the train station when he patted his pocket in pure panic. He had forgotten his concert tickets. Cursing loudly, he instantly doubled back and sprinted towards his house.", 
        storylineJP: "ソラが駅に向かう途中、彼は純粋なパニックでポケットを叩いた。コンサートのチケットを忘れたのだ。大声で悪態をつきながら、彼は即座に引き返し、家に向かって全速力で走った。", 
        quiz: { question: "Realizing she took the wrong forest trail, the hiker safely ___ to the main camp.", options: ["doubled back", "drank up", "droned on"], correctIndex: 0, explanation: "to go back the way you came." } 
      },
      { 
        pv: "Double over / up", trope: "The Stomach Cramp", cefr: "B2", icon: Activity, 
        meaning: "To bend over at the waist in pain or laughter.", 
        meaningJP: "（笑いや痛みで）体を折り曲げる", 
        example: "He doubled up in absolute pain after being hit in the stomach.", 
        exampleJP: "お腹を殴られた後、彼は絶対的な痛みで体を折り曲げた。",
        vibes: ["Laughing hysterically", "Stomach cramps", "Unable to breathe from laughing"], 
        vibesJP: ["狂ったように笑う", "胃のけいれん", "笑いすぎて息ができない"],
        storyline: "The comedian's unexpected joke was so incredibly, outrageously funny that the entire front row completely lost it. Ken literally doubled over, clutching his stomach and gasping for air.", 
        storylineJP: "そのコメディアンの予期せぬジョークは信じられないほどとてつもなく面白く、最前列全体が完全に爆笑した。ケンは文字通り体を折り曲げ、お腹を抱えて息を整えた。", 
        quiz: { question: "The sudden, sharp pain made him entirely ___ on the cold floor.", options: ["double over", "draw down", "drop by"], correctIndex: 0, explanation: "to bend over." } 
      },
      { 
        pv: "Doze off", trope: "The Boring Lecture", cefr: "B1", icon: CloudOff, 
        meaning: "To unintentionally fall asleep, often during the day or an event.", 
        meaningJP: "うとうと眠る、居眠りする", 
        example: "The movie was so incredibly boring that I dozed off halfway through.", 
        exampleJP: "その映画は信じられないほど退屈だったので、私は途中でうとうと眠って（居眠りして）しまった。",
        vibes: ["Heavy eyelids", "Warm classrooms", "Fighting sleep"], 
        vibesJP: ["重いまぶた", "暖かい教室", "睡魔と戦う"],
        storyline: "The principal's graduation speech was a legendary, two-hour monotone disaster. Despite pinching himself to stay awake, Leo's heavy eyelids fluttered, and he completely dozed off, snoring softly.", 
        storylineJP: "校長の卒業スピーチは、伝説的な2時間の単調な大惨事だった。起きているために自分をつねったにもかかわらず、レオの重いまぶたは揺れ、彼は完全に居眠りし、静かにいびきをかいた。", 
        quiz: { question: "The incredibly warm, quiet train ride made me gently ___ against the window.", options: ["doze off", "dress up", "dry out"], correctIndex: 0, explanation: "to fall asleep." } 
      },
      { 
        pv: "Drag on", trope: "The Endless Meeting", cefr: "C1", icon: Clock, 
        meaning: "To be unnecessarily long, lasting longer than expected and becoming boring.", 
        meaningJP: "ダラダラと長引く、不必要に続く", 
        example: "This utterly useless Zoom meeting is agonizingly dragging on forever.", 
        exampleJP: "この全く無意味なZoomミーティングは、苦痛なほど永遠にダラダラと長引いている。",
        vibes: ["Losing all patience", "Constantly checking the clock", "Wasting precious time"], 
        vibesJP: ["すべての忍耐を失う", "絶えず時計を見る", "貴重な時間を無駄にする"],
        storyline: "The weekly school assembly was supposed to be a quick update. But the arrogant principal loved hearing his own voice, and his highly repetitive speech painfully dragged on for two agonizing hours.", 
        storylineJP: "毎週の全校集会は短い連絡事項のはずだった。しかし傲慢な校長は自分の声を聞くのが大好きで、彼の非常に反復的なスピーチは完全に苦痛な2時間もの間、ダラダラと長引いた。", 
        quiz: { question: "The highly complex legal trial managed to exhaustingly ___ for three solid years.", options: ["drag on", "draw back", "drink up"], correctIndex: 0, explanation: "to last too long." } 
      },
      { 
        pv: "Draw back", trope: "The Cautious Retreat", cefr: "C1", icon: Undo2, 
        meaning: "To retreat, move backwards, or withdraw from an agreement.", 
        meaningJP: "後ずさりする、手を引く", 
        example: "He instantly drew back in terror when the aggressive dog barked.", 
        exampleJP: "攻撃的な犬が吠えた時、彼は恐怖で即座に後ずさりした。",
        vibes: ["Sensing danger", "Physical recoiling", "Canceling a risky deal"], 
        vibesJP: ["危険を察知する", "身体的にひるむ", "リスクのある取引をキャンセルする"],
        storyline: "Sora confidently reached his hand into the dark, mysterious cave. Suddenly, he heard a low, threatening growl echoing from the shadows. He instantly drew back, his heart pounding in absolute panic.", 
        storylineJP: "ソラは自信満々に暗く謎めいた洞窟に手を伸ばした。突然、彼は影から響く低く脅威的なうなり声を聞いた。彼は即座に後ずさりし、心臓は絶対的なパニックで激しく鳴った。", 
        quiz: { question: "The cautious investors firmly decided to safely ___ from the risky business deal.", options: ["draw back", "dress down", "drift apart"], correctIndex: 0, explanation: "to retreat or withdraw." } 
      },
      { 
        pv: "Draw down", trope: "The Depleted Reserves", cefr: "C2", icon: TrendingDown, 
        meaning: "To reduce levels, deplete resources, or obtain funding.", 
        meaningJP: "（資金を）引き出す、（規模や量を）縮小する", 
        example: "Gas reserves were dangerously drawn down in the recent freezing spell.", 
        exampleJP: "最近の凍えるような寒波で、ガスの備蓄が危険なほど引き出され（縮小され）た。",
        vibes: ["Military troop reduction", "Using emergency funds", "Depleting supplies"], 
        vibesJP: ["軍隊の縮小", "緊急資金を使う", "物資を枯渇させる"],
        storyline: "The student council's ambitious festival plans were far too expensive. The president sighed, realizing they had completely drawn down their entire annual budget in just one single, highly reckless month.", 
        storylineJP: "生徒会の野心的な学園祭の計画はあまりにも高額だった。会長はため息をつき、彼らがたった1ヶ月の非常に無謀な期間で、年間予算全体を完全に使い果たして（引き出して）しまったことに気づいた。", 
        quiz: { question: "The weary general officially ordered to slowly ___ the number of troops.", options: ["draw down", "dredge up", "drone on"], correctIndex: 0, explanation: "to reduce levels or get funding." } 
      },
      { 
        pv: "Draw even", trope: "The Final Sprint", cefr: "C2", icon: Zap, 
        meaning: "To equalize one's competitive position (in a race or competition).", 
        meaningJP: "（競争で）並ぶ、追いつく", 
        example: "The exhausted horse dramatically drew even at the final finish line.", 
        exampleJP: "疲れ切った馬は、最後のフィニッシュラインでドラマチックに並んだ（追いついた）。",
        vibes: ["Neck and neck", "Photo finish", "An epic comeback"], 
        vibesJP: ["首位争い", "写真判定", "壮大なカムバック"],
        storyline: "The arrogant rival runner was ahead for the entire grueling race. But in the last fifty meters, Hina found a sudden burst of pure adrenaline, sprinting wildly to beautifully draw even right at the tape.", 
        storylineJP: "傲慢なライバルのランナーは過酷なレース全体を通してリードしていた。しかし最後の50メートルで、ヒナは純粋なアドレナリンの突然の爆発を見つけ、テープの直前で見事に並ぶ（追いつく）ために猛烈にスプリントした。", 
        quiz: { question: "In the incredibly tense final seconds of the game, our underdog team finally ___.", options: ["drew even", "dropped out", "drummed up"], correctIndex: 0, explanation: "to equalize a position." } 
      },
      { 
        pv: "Draw in", trope: "The Winter Solstice", cefr: "C1", icon: Sun, 
        meaning: "To get dark earlier (of nights), or for a train to arrive at a station.", 
        meaningJP: "（日が）短くなる、（列車が）到着する", 
        example: "The freezing nights are drawing in now that it's deep winter.", 
        exampleJP: "真冬になったので、凍えるような夜が目に見えて短く（日が暮れるのが早く）なっている。",
        vibes: ["Seasonal depression", "Waiting on a cold platform", "Changing seasons"], 
        vibesJP: ["季節性のうつ病", "寒いプラットフォームで待つ", "季節の変わり目"],
        storyline: "As autumn faded, the cold, dark nights began to noticeably draw in. Maki hated it, preferring the bright, endless summer evenings when she could play basketball until 8 PM.", 
        storylineJP: "秋が色あせるにつれ、冷たく暗い夜が目に見えて短くなり（日が暮れるのが早く）始めた。マキはそれを嫌悪し、午後8時までバスケができる明るく終わりのない夏の夕暮れを好んだ。", 
        quiz: { question: "The heavy, tired passengers stood up as the late train finally ___ to the station.", options: ["drew in", "dived in", "did in"], correctIndex: 0, explanation: "to get dark earlier or arrive." } 
      },
      { 
        pv: "Draw into", trope: "The Unwanted Drama", cefr: "C1", icon: AlertCircle, 
        meaning: "To get someone involved in an unpleasant situation or argument.", 
        meaningJP: "（厄介な事に）巻き込む、引きずり込む", 
        example: "I completely refused to get drawn into their highly toxic, petty arguments.", 
        exampleJP: "私は彼らの非常に有毒で些細な言い争いに巻き込まれる（引きずり込まれる）ことを完全に拒否した。",
        vibes: ["Avoiding group chat fights", "Staying neutral", "Toxic environments"], 
        vibesJP: ["グループチャットの喧嘩を避ける", "中立を保つ", "有毒な環境"],
        storyline: "Hina and Yumi were engaged in a massive, incredibly bitter feud over a stolen design. Kaito put his headphones on and turned away, absolutely refusing to get drawn into their endless, toxic drama.", 
        storylineJP: "ヒナとユミは盗まれたデザインをめぐり、大規模で信じられないほど苦々しい確執を繰り広げていた。海斗はヘッドホンをつけて目を背け、彼女たちの終わりのない有毒なドラマに巻き込まれることを絶対的に拒否した。", 
        quiz: { question: "Please do not try to ___ me ___ your completely messy family problems.", options: ["draw / into", "drive / away", "drop / by"], correctIndex: 0, explanation: "to get involved in something unpleasant." } 
      },
      { 
        pv: "Draw on", trope: "The Cigarette Break", cefr: "C2", icon: Clock, 
        meaning: "To pass slowly (time), or to inhale smoke from a cigarette.", 
        meaningJP: "（時間が）ゆっくり過ぎる、（タバコを）吸い込む", 
        example: "As the completely silent, boring lesson drew on, the students fell asleep.", 
        exampleJP: "完全に無音で退屈な授業がゆっくりと過ぎていくにつれ、生徒たちは眠りに落ちた。",
        vibes: ["Watching the clock tick", "Noir detectives smoking", "Endless waiting"], 
        vibesJP: ["時計の針が進むのを見る", "タバコを吸うノワールの探偵", "終わりのない待ち時間"],
        storyline: "The private detective stood in the freezing rain, waiting outside the suspect's house. He deeply drew on his cigarette, wishing the agonizingly slow night wouldn't draw on forever.", 
        storylineJP: "私立探偵は凍える雨の中に立ち、容疑者の家の外で待っていた。彼はタバコを深く吸い込み、苦痛なほど遅い夜が永遠にダラダラ続か（ゆっくり過ぎ）ないことを願った。", 
        quiz: { question: "The exhausted workers sighed heavily as the incredibly dull meeting ___.", options: ["drew on", "drilled down", "dropped off"], correctIndex: 0, explanation: "to pass slowly or inhale." } 
      },
      { 
        pv: "Draw out", trope: "The Extrovert Maker", cefr: "C1", icon: Users, 
        meaning: "To make something continue longer than needed, or make a shy person more outgoing.", 
        meaningJP: "長引かせる、（人の）才能や魅力を引き出す", 
        example: "The kind teacher managed to completely draw him out and get him to participate.", 
        exampleJP: "その親切な先生は、なんとか彼の魅力を完全に引き出し、彼を参加させることに成功した。",
        vibes: ["Boring directors talking", "Helping a shy friend", "Time manipulation"], 
        vibesJP: ["退屈なディレクターの話", "内気な友人を助ける", "時間の操作"],
        storyline: "Ken was incredibly shy and never spoke in class. But the new drama teacher used fun, silly games to gently draw him out, eventually turning him into the confident star of the school play.", 
        storylineJP: "ケンは信じられないほど内気で、授業で決して話さなかった。しかし新しい演劇の先生は楽しく馬鹿げたゲームを使って優しく彼（の魅力）を引き出し、最終的に彼を学校劇の自信に満ちたスターに変えた。", 
        quiz: { question: "The arrogant director selfishly ___ the meeting ___ with a lengthy, boring speech.", options: ["drew / out", "dropped / off", "drummed / up"], correctIndex: 0, explanation: "to make longer or make someone outgoing." } 
      },
      { 
        pv: "Draw up", trope: "The Formal Contract", cefr: "C1", icon: Book, 
        meaning: "To prepare a highly formal document/plan, or for a vehicle to stop.", 
        meaningJP: "（文書や計画を）作成する、起草する、（車が）止まる", 
        example: "My strict lawyer is currently drawing up the massive new business contract.", 
        exampleJP: "私の厳格な弁護士は現在、大規模な新しいビジネス契約書を作成して（起草して）いる。",
        vibes: ["Creating serious legal documents", "Making complex plans", "Official paperwork"], 
        vibesJP: ["深刻な法的文書を作成する", "複雑な計画を立てる", "公式な書類仕事"],
        storyline: "The multi-million dollar merger was officially agreed upon. The exhausted CEO immediately ordered his highly paid legal team to stay awake all night and meticulously draw up the final, binding contracts.", 
        storylineJP: "数百万ドル規模の合併が正式に合意された。疲れ切ったCEOは、高給取りの法務チームに直ちに徹夜を命じ、最終的な拘束力のある契約書を細心の注意を払って作成する（起草する）よう指示した。", 
        quiz: { question: "The experienced architect will carefully ___ the incredibly detailed building plans.", options: ["draw up", "drill down", "drown out"], correctIndex: 0, explanation: "to prepare a formal document." } 
      },
      { 
        pv: "Dream of", trope: "The Absolute Refusal", cefr: "B2", icon: XOctagon, 
        meaning: "To not think or consider doing something (usually used in the negative).", 
        meaningJP: "（〜するなんて）夢にも思わない、考えもしない", 
        example: "I wouldn't even dream of telling her that incredibly cruel secret.", 
        exampleJP: "あんな信じられないほど残酷な秘密を彼女に話すなんて、夢にも思わない（考えもしない）。",
        vibes: ["Absolute loyalty", "Setting strict boundaries", "Refusing betrayal"], 
        vibesJP: ["絶対的な忠誠心", "厳しい境界線を引く", "裏切りを拒否する"],
        storyline: "The rival company offered Sora ten thousand dollars to leak his team's secret code. Sora glared at them with pure disgust. 'I wouldn't even dream of betraying my friends like that,' he spat.", 
        storylineJP: "ライバル企業は、チームの秘密のコードを漏らす対価としてソラに1万ドルを提示した。ソラは純粋な嫌悪感で彼らを睨みつけた。「友達をそんな風に裏切るなんて、夢にも思わない（考えもしない）ね」と彼は吐き捨てた。", 
        quiz: { question: "She is entirely loyal; she wouldn't ___ stealing from the company.", options: ["dream of", "dwell on", "dress down"], correctIndex: 0, explanation: "to not consider doing." } 
      },
      { 
        pv: "Dream up", trope: "The Crazy Mastermind", cefr: "C1", icon: Cloud, 
        meaning: "To invent a highly creative, unusual, or crazy idea or plan.", 
        meaningJP: "（奇抜なアイデアを）考え出す、夢想する", 
        example: "I have absolutely no idea how she constantly dreams up these bizarre stories.", 
        exampleJP: "彼女がどうやって常にこんな奇妙な話を考え出している（夢想している）のか、私には全く見当もつかない。",
        vibes: ["Wild imagination", "Inventing crazy schemes", "Creative brainstorming"], 
        vibesJP: ["野生的な想像力", "クレイジーな計画を発明する", "クリエイティブなブレインストーミング"],
        storyline: "The school needed to urgently raise a massive amount of funds. While everyone suggested boring bake sales, Rin incredibly dreamed up a wildly complex zombie-themed escape room that astonishingly made thousands of dollars.", 
        storylineJP: "学校は至急、多額の資金を調達する必要があった。皆が退屈なクッキー販売を提案する中、リンは信じられないことに、驚くべきことに何千ドルも稼ぎ出した非常に複雑なゾンビテーマの脱出ゲームを考え出した（夢想した）。", 
        quiz: { question: "The brilliant, eccentric author manages to easily ___ the most fascinating fantasy worlds.", options: ["dream up", "dress down", "dry up"], correctIndex: 0, explanation: "to invent an unusual idea." } 
      }
    ],
    
    19: [
      { 
        pv: "Dredge up", trope: "The Ghost of Past Mistakes", cefr: "C2", icon: Search, 
        meaning: "To deliberately discover and bring up negative things about someone's past.", 
        meaningJP: "（忘れたい過去を）掘り返す、蒸し返す", 
        example: "The ruthless newspapers dredged up the dirty details of his ancient affair.", 
        exampleJP: "冷酷な新聞は、彼の昔の浮気の汚い詳細を掘り返した（蒸し返した）。",
        vibes: ["Cancel culture", "Bringing up old receipts", "Toxic journalism"], 
        vibesJP: ["キャンセルカルチャー", "過去の証拠を持ち出す", "有毒なジャーナリズム"],
        storyline: "The progressive politician was globally loved. However, right before the election, a jealous rival maliciously dredged up a highly embarrassing, ten-year-old video of him making a terrible mistake.", 
        storylineJP: "その進歩的な政治家は世界中で愛されていた。しかし選挙の直前、嫉妬深いライバルが悪意を持って、彼がひどいミスをしている10年前の非常に恥ずかしい動画を掘り返した（蒸し返した）。", 
        quiz: { question: "It is incredibly toxic when couples continuously ___ old, resolved arguments.", options: ["dredge up", "drink up", "drop out"], correctIndex: 0, explanation: "to discover things about someone's past." } 
      },
      { 
        pv: "Dress down", trope: "The Casual Friday / Scolding", cefr: "C1", icon: User, 
        meaning: "To wear casual clothes, or to scold someone severely.", 
        meaningJP: "カジュアルな服を着る、激しく叱る", 
        example: "The strict staff are allowed to dress down on casual Fridays.", 
        exampleJP: "厳格なスタッフも、カジュアルフライデーにはカジュアルな服装をすること（dress down）が許されている。",
        vibes: ["Tech startup vibes", "Wearing jeans to work", "A brutal verbal attack"], 
        vibesJP: ["テック系スタートアップの雰囲気", "仕事にジーンズを履いていく", "残酷な言葉の攻撃（叱責）"],
        storyline: "Mika excitedly dressed down in her favorite ripped jeans for the office party. However, her traditional boss entirely hated it and brutally dressed her down in front of everyone for being utterly unprofessional.", 
        storylineJP: "ミカはオフィスパーティーのために、お気に入りのダメージジーンズで興奮してカジュアルな服装をした（dressed down）。しかし伝統的な上司はそれを完全に嫌悪し、全くプロ意識に欠けるとして全員の前で彼女を残酷に激しく叱りつけた（dressed down）。", 
        quiz: { question: "Because he completely ruined the project, the furious manager aggressively ___ him ___.", options: ["dressed / down", "drew / back", "drummed / up"], correctIndex: 0, explanation: "to dress casually or to scold." } 
      },
      { 
        pv: "Dress up", trope: "The Fit Check", cefr: "A2", icon: Star, 
        meaning: "To put on highly formal, special, or fancy clothes for a big occasion.", 
        meaningJP: "おめかしする、ドレスアップする", 
        example: "We absolutely should definitely dress up for the incredibly fancy dinner tonight.", 
        exampleJP: "今夜の信じられないほど豪華なディナーのために、私たちは絶対にドレスアップ（おめかし）するべきだ。",
        vibes: ["Getting fully ready for a date", "Taking perfect mirror selfies", "Looking entirely immaculate"], 
        vibesJP: ["デートの準備を完璧に整える", "完璧な鏡の自撮り", "完全に非の打ち所がないように見える"],
        storyline: "It was the highly anticipated opening night for the most exclusive downtown club. Mika spent three solid hours doing her flawless makeup and completely dressed up in a stunning, glittering black outfit.", 
        storylineJP: "それはダウンタウンの最もエクスクルーシブなクラブの、待ちに待ったオープン初日だった。ミカは完璧なメイクに丸3時間を費やし、見事なキラキラ光る黒い衣装で完全におめかしした（ドレスアップした）。", 
        quiz: { question: "You definitely don't need to tightly ___ for the party; it's a very casual event.", options: ["dress up", "drift apart", "drown out"], correctIndex: 0, explanation: "to wear nice clothes." } 
      },
      { 
        pv: "Drift apart", trope: "The Fading Friendship", cefr: "B2", icon: GitBranch, 
        meaning: "To slowly cease to be close to or friends with someone.", 
        meaningJP: "（心の）距離が開く、疎遠になる", 
        example: "We were great friends at school but sadly drifted apart at university.", 
        exampleJP: "私たちは学校では大親友だったが、悲しいことに大学で疎遠になってしまった。",
        vibes: ["Growing up", "Losing touch", "Different life paths"], 
        vibesJP: ["大人になること", "連絡が途絶える", "異なる人生の道"],
        storyline: "Sora and Ken used to play video games every single night. But as Ken became obsessed with soccer and Sora focused on art, their paths diverged, and over the years, they quietly, naturally drifted apart.", 
        storylineJP: "ソラとケンは毎晩欠かさずビデオゲームをしていた。しかしケンがサッカーに夢中になり、ソラがアートに集中するにつれ、彼らの道は分かれ、何年もかけて静かに、自然と疎遠になっていった。", 
        quiz: { question: "Without making any real effort to communicate, the childhood friends slowly ___.", options: ["drifted apart", "drilled down", "dropped by"], correctIndex: 0, explanation: "to slowly cease to be close." } 
      },
      { 
        pv: "Drift off", trope: "The Boring Lecture", cefr: "B2", icon: CloudOff, 
        meaning: "To start to fall asleep.", 
        meaningJP: "うとうとし始める、眠りにつく", 
        example: "I was slowly drifting off when the loud noise disturbed me.", 
        exampleJP: "ゆっくりとうとうとし始めていた時、大きな音に邪魔をされた。",
        vibes: ["Heavy eyelids", "Warm classrooms", "Fighting sleep"], 
        vibesJP: ["重いまぶた", "暖かい教室", "睡魔と戦う"],
        storyline: "The history professor's voice was incredibly monotone, and the classroom was far too warm. Despite pinching his arm to stay awake, Leo's eyes crossed, and he peacefully drifted off right at his desk.", 
        storylineJP: "歴史の教授の声は信じられないほど単調で、教室はあまりにも暖かすぎた。起きているために腕をつねったにもかかわらず、レオの目は寄り目になり、彼は机で穏やかにうとうとし始めた（眠りに落ちた）。", 
        quiz: { question: "The extremely comfortable couch made me gently ___ during the movie.", options: ["drift off", "drone on", "duck out"], correctIndex: 0, explanation: "to start to fall asleep." } 
      },
      { 
        pv: "Drill down (through)", trope: "The Data Analyst", cefr: "C1", icon: Database, 
        meaning: "To get to the bottom of something, or search detailed layers of data.", 
        meaningJP: "（データなどを）徹底的に掘り下げる", 
        example: "I really had to drill down into the massive database to find the hidden answers.", 
        exampleJP: "隠された答えを見つけるために、その巨大なデータベースを徹底的に掘り下げる必要があった。",
        vibes: ["Analyzing spreadsheets", "Finding the core issue", "Deep research"], 
        vibesJP: ["スプレッドシートを分析する", "根本的な問題を見つける", "深いリサーチ"],
        storyline: "The corporate servers had completely crashed, and nobody knew why. The elite cyber team worked tirelessly all night, drilling down through thousands of lines of complex code until they found the tiny, hidden virus.", 
        storylineJP: "企業のサーバーが完全にダウンし、誰も理由が分からなかった。エリートサイバーチームは一晩中休まず働き、小さな隠されたウイルスを見つけるまで、何千行もの複雑なコードを徹底的に掘り下げた。", 
        quiz: { question: "The financial expert intricately ___ the messy spreadsheet to find the error.", options: ["drilled down through", "drank up", "drove away"], correctIndex: 0, explanation: "to search layers of information." } 
      },
      { 
        pv: "Drill into", trope: "The Strict Coach", cefr: "C1", icon: Zap, 
        meaning: "To repeat something many times to make someone learn it.", 
        meaningJP: "（教えや規則を）徹底的に叩き込む", 
        example: "The rigorous teacher drilled the complex grammar rules into the students.", 
        exampleJP: "その厳格な教師は、複雑な文法規則を生徒たちに徹底的に叩き込んだ。",
        vibes: ["Bootcamp training", "Rote memorization", "Strict discipline"], 
        vibesJP: ["ブートキャンプ（新兵訓練）", "丸暗記", "厳格な規律"],
        storyline: "The martial arts master was utterly relentless. He made the young students repeat the exact same defensive blocks for ten hours straight, strictly drilling the crucial techniques into their muscle memory.", 
        storylineJP: "その武術の達人は全く容赦がなかった。彼は若い生徒たちに全く同じ防御のブロックを10時間ぶっ通しで繰り返させ、極めて重要な技術を彼らの筋肉の記憶に厳格に叩き込んだ。", 
        quiz: { question: "The safety instructor repeatedly ___ the emergency procedures ___ our heads.", options: ["drilled / into", "dropped / off", "dumbed / down"], correctIndex: 0, explanation: "to repeat to make someone learn." } 
      },
      { 
        pv: "Drink up", trope: "The Last Call", cefr: "A2", icon: Coffee, 
        meaning: "To finish a drink completely.", 
        meaningJP: "（飲み物を）飲み干す", 
        example: "Drink up, please; the busy bar is closing in exactly five minutes.", 
        exampleJP: "飲み干してください。この忙しいバーはきっかり5分後に閉店します。",
        vibes: ["Chugging the last drop", "Rushing out of a cafe", "Finishing a meal"], 
        vibesJP: ["最後の一滴を一気飲みする", "カフェから急いで出る", "食事を終える"],
        storyline: "The strict cafe manager aggressively flipped the open sign to 'closed' and began heavily wiping the tables. 'Alright, everyone entirely drink up and head out, we're locking the doors right now,' she commanded.", 
        storylineJP: "厳格なカフェの店長はアグレッシブに営業中の看板を「閉店」に裏返し、テーブルを強く拭き始めた。「よし、みんな完全に飲み干して出てって。今すぐドアに鍵をかけるから」と彼女は命じた。", 
        quiz: { question: "Please completely ___ your hot soup before it gets utterly cold.", options: ["drink up", "drone on", "dry out"], correctIndex: 0, explanation: "to finish a drink." } 
      },
      { 
        pv: "Drive away", trope: "The Aggressive Defender", cefr: "B1", icon: LogOut, 
        meaning: "To force someone or an animal to leave a place.", 
        meaningJP: "追い払う", 
        example: "Their extreme unfriendliness effectively drives new customers away.", 
        exampleJP: "彼らの極端な不愛想さは、新しい顧客を効果的に追い払っている。",
        vibes: ["Defending your territory", "Scaring off bad vibes", "Hostile environments"], 
        vibesJP: ["自分の縄張りを守る", "悪いバイブスを脅かして追い払う", "敵対的な環境"],
        storyline: "A flock of massively annoying seagulls kept aggressively stealing the tourists' expensive fries. Kaito totally lost his patience, wildly waving his jacket and screaming to effectively drive the greedy birds away.", 
        storylineJP: "大量の鬱陶しいカモメの群れが、観光客の高価なフライドポテトをアグレッシブに盗み続けていた。海斗は完全に我慢の限界を超え、ジャケットを激しく振り回して叫び、欲深い鳥たちを効果的に追い払った。", 
        quiz: { question: "The sudden, highly terrifying loud noise entirely ___ the curious wild animals.", options: ["drove away", "dropped out", "drummed up"], correctIndex: 0, explanation: "to force to leave." } 
      },
      { 
        pv: "Drive back", trope: "The Shield Wall", cefr: "C1", icon: Shield, 
        meaning: "To repulse or force back an attacker.", 
        meaningJP: "押し返す、撃退する", 
        example: "The heavily armed police drove the massive crowd back to secure the area.", 
        exampleJP: "重武装の警察は、エリアを確保するために巨大な群衆を押し返した。",
        vibes: ["Epic battlefronts", "Holding the line", "Defensive tactics"], 
        vibesJP: ["壮大な最前線", "戦線を維持する", "防衛戦術"],
        storyline: "The raging forest fire threatened to consume the small, peaceful village. The brave firefighters stood their ground for 48 hours, shooting massive torrents of water to successfully drive the terrifying flames back.", 
        storylineJP: "猛威を振るう山火事が、小さく平和な村を飲み込もうとしていた。勇敢な消防士たちは48時間その場に立ち留まり、巨大な水流を放って恐ろしい炎を無事に押し返した（撃退した）。", 
        quiz: { question: "The valiant defenders fiercely ___ the invading army ___ from the city walls.", options: ["drove / back", "dropped / off", "dried / up"], correctIndex: 0, explanation: "to repulse or force back." } 
      },
      { 
        pv: "Drive by", trope: "The Quick Action", cefr: "C2", icon: Zap, 
        meaning: "To do something out of a moving car.", 
        meaningJP: "車から（～を）する", 
        example: "He shouted a loud insult in a quick drive-by prank.", 
        exampleJP: "彼は車からの一瞬の悪ふざけ（ドライブバイ）で、大声で侮辱を叫んだ。",
        vibes: ["Speeding past", "Quick drive-by shots", "Action movie stunts"], 
        vibesJP: ["猛スピードで通り過ぎる", "素早い車からの撮影", "アクション映画のスタント"],
        storyline: "The mischievous teenagers thought it would be highly hilarious to throw water balloons at the local statue. They executed a perfectly planned drive-by splashing out of their van before speeding away into the night.", 
        storylineJP: "いたずら好きなティーンエイジャーたちは、地元の銅像に水風船を投げるのが最高に面白いだろうと考えた。彼らはバンの中から完璧に計画された車からの水掛け（ドライブバイ）を実行し、夜の闇へと猛スピードで走り去った。", 
        quiz: { question: "The reckless youths attempted a foolish ___ water attack out of their moving van.", options: ["drive-by", "drop-off", "duck-out"], correctIndex: 0, explanation: "to do out of a car." } 
      },
      { 
        pv: "Drive off", trope: "The Dramatic Exit", cefr: "B1", icon: Map, 
        meaning: "To drive away from a place.", 
        meaningJP: "車で走り去る", 
        example: "She slammed the heavy car door shut and drove off without saying a single word.", 
        exampleJP: "彼女は重い車のドアを強く閉め、一言も言わずに車で走り去った。",
        vibes: ["Storming out", "Speeding away", "Leaving drama behind"], 
        vibesJP: ["怒って飛び出す", "猛スピードで走り去る", "ドラマ（揉め事）を置き去りにする"],
        storyline: "The intense argument in the parking lot had reached a boiling point. Furious and entirely out of patience, Ren aggressively threw his bags into the trunk, slammed the door, and drove off in a cloud of dust.", 
        storylineJP: "駐車場での激しい口論は沸点に達していた。激怒し完全に我慢の限界を超えたレンは、アグレッシブに荷物をトランクに放り込み、ドアを強く閉め、土煙を上げて車で走り去った。", 
        quiz: { question: "Ignoring my loud apologies, she angrily started the engine and completely ___.", options: ["drove off", "drew in", "duffed up"], correctIndex: 0, explanation: "to drive away from a place." } 
      },
      { 
        pv: "Drive out", trope: "The Market Monopoly", cefr: "C1", icon: XOctagon, 
        meaning: "To force someone to leave a place or market.", 
        meaningJP: "（市場などから）追い出す、立ち退かせる", 
        example: "The massive superstore effectively drove all the small, local shops out of business.", 
        exampleJP: "その巨大なスーパーストアは、実質的にすべての地元の小さな店を廃業に追い込んだ。",
        vibes: ["Corporate takeovers", "Hostile actions", "Forced evictions"], 
        vibesJP: ["企業の買収", "敵対的な行動", "強制的な立ち退き"],
        storyline: "The cozy, family-owned bookstores had thrived for decades. But when the ruthless global retail giant opened its massive warehouse nearby, it slashed prices, intentionally driving the local competitors out of the town.", 
        storylineJP: "居心地の良い家族経営の書店は何十年も繁栄していた。しかし冷酷な世界的スーパーが巨大な店舗を近くにオープンした時、彼らは価格を大幅に下げ、意図的に地元の競合他社を町から追い出した。", 
        quiz: { question: "The heavily armed soldiers forcefully ___ the rebels ___ of the ruined building.", options: ["drove / out", "dropped / off", "drummed / up"], correctIndex: 0, explanation: "to force someone to leave." } 
      },
      { 
        pv: "Drive up", trope: "The Inflation Spike", cefr: "B2", icon: TrendingUp, 
        meaning: "To make something increase (like prices), or arrive in a vehicle.", 
        meaningJP: "（価格などを）引き上げる、車で乗り付ける", 
        example: "The sudden market uncertainty has aggressively driven prices up.", 
        exampleJP: "突然の市場の不確実性が、アグレッシブに価格を引き上げている。",
        vibes: ["Rising costs", "Rolling up to a party", "Economic inflation"], 
        vibesJP: ["コストの上昇", "パーティーに車で乗り付ける", "経済のインフレーション"],
        storyline: "The exclusive seaside town was perfectly peaceful until the billionaire tech bros arrived. Their massive influx of wealth completely destroyed the local economy, driving up housing prices to completely impossible levels.", 
        storylineJP: "その高級な海辺の町は、億万長者のテック系兄弟たちが到着するまでは完璧に平和だった。彼らの莫大な富の流入が地域経済を完全に破壊し、住宅価格を完全に不可能なレベルまで引き上げた（高騰させた）。", 
        quiz: { question: "The unexpected shortage of fresh vegetables quickly ___ the cost of dinner.", options: ["drove up", "drummed out", "dyed out"], correctIndex: 0, explanation: "to make increase." } 
      },
      { 
        pv: "Drone on", trope: "The Sleep-Inducing Speech", cefr: "C1", icon: Volume2, 
        meaning: "To talk continuously and incredibly boringly for a long time.", 
        meaningJP: "（退屈な話を）だらだらと続ける", 
        example: "The minister droned on for a full hour, and the audience looked absolutely dead.", 
        exampleJP: "大臣は丸1時間だらだらと話し続け、聴衆は完全に死んでいるように見えた。",
        vibes: ["Fighting sleep in class", "Monotone voices", "Endless lectures"], 
        vibesJP: ["授業中に睡魔と戦う", "単調な声", "終わりのない講義"],
        storyline: "The history professor was a genuinely brilliant man, but his voice lacked any emotion. As he droned on endlessly about ancient trade routes, Leo's eyes crossed, and half the lecture hall fell completely asleep.", 
        storylineJP: "その歴史の教授は純粋に優秀な人物だったが、彼の声には何の感情もなかった。彼が古代の交易路について果てしなくだらだらと話し続けると、レオの目は寄り目になり、講堂の半分は完全に眠りに落ちた。", 
        quiz: { question: "I politely completely stopped listening when the manager began to agonizingly ___.", options: ["drone on", "dredge up", "dwell on"], correctIndex: 0, explanation: "to talk boringly." } 
      },
      { 
        pv: "Drop around / round", trope: "The Casual Delivery", cefr: "B1", icon: Package, 
        meaning: "To visit someone casually or deliver something without an appointment.", 
        meaningJP: "ふらっと立ち寄る、ついでに届ける", 
        example: "I dropped the important papers round so she could deeply read them before the big meeting.", 
        exampleJP: "大きな会議の前に彼女が深く読めるように、私は重要な書類をついでに届けた（ふらっと立ち寄った）。",
        vibes: ["Casual errands", "Quick visits", "Dropping off goodies"], 
        vibesJP: ["カジュアルなお使い", "素早い訪問", "お菓子を届ける"],
        storyline: "Sora had baked way too many incredibly sweet chocolate chip cookies. Knowing Hina was studying hard, he decided to just drop round her apartment, hand over the warm treats, and leave her to her books.", 
        storylineJP: "ソラは信じられないほど甘いチョコチップクッキーを焼きすぎてしまった。ヒナが懸命に勉強しているのを知っていた彼は、彼女のアパートにふらっと立ち寄って（ついでに届けて）温かいお菓子を渡し、彼女を本に向かわせることにした。", 
        quiz: { question: "I will quickly ___ your house tomorrow to return the umbrella I borrowed.", options: ["drop round", "dry out", "duck out"], correctIndex: 0, explanation: "to visit or deliver casually." } 
      },
      { 
        pv: "Drop away", trope: "The Fading Crowd", cefr: "C1", icon: TrendingDown, 
        meaning: "To become smaller in amount or numbers over time.", 
        meaningJP: "（数や関心が）次第に減る、離れていく", 
        example: "The numbers of people actively attending began to drop away after a few boring months.", 
        exampleJP: "数ヶ月の退屈な期間の後、積極的に参加する人々の数は次第に減り（離れていき）始めた。",
        vibes: ["Losing momentum", "The hype dying", "Fading interest"], 
        vibesJP: ["勢いを失う", "熱狂が死ぬ", "色褪せる関心"],
        storyline: "The new sci-fi show started with absolute record-breaking viewership. But after a highly confusing mid-season plot twist that made zero sense, the massive audience began to steadily drop away, leaving the forums empty.", 
        storylineJP: "その新作SFドラマは絶対的な記録破りの視聴率で始まった。しかし全く意味不明で非常に混乱する中盤の展開の後、膨大な視聴者は着実に減り（離れていき）始め、掲示板は空っぽになった。", 
        quiz: { question: "As the long, difficult marathon continued, the weaker runners started to ___.", options: ["drop away", "drink up", "drive back"], correctIndex: 0, explanation: "to become smaller in numbers." } 
      },
      { 
        pv: "Drop back", trope: "The Tired Runner", cefr: "B2", icon: ArrowDown, 
        meaning: "To move towards the back of a group or race.", 
        meaningJP: "後退する、遅れをとる", 
        example: "He bravely started at the front, but got exhausted and dropped back as the grueling race went on.", 
        exampleJP: "彼は勇敢にも先頭でスタートしたが、過酷なレースが進むにつれて疲れ果て、後退した（遅れをとった）。",
        vibes: ["Losing the lead", "Running out of breath", "Falling behind the pack"], 
        vibesJP: ["リードを失う", "息切れする", "集団から遅れる"],
        storyline: "Kaito sprinted aggressively right off the starting line, leading the massive bicycle race. But he had burned far too much energy too early. Panting heavily, he slowly dropped back into the middle of the crowded pack.", 
        storylineJP: "海斗はスタートラインからアグレッシブにスプリントし、大規模な自転車レースをリードした。しかし彼はあまりにも早くエネルギーを消費しすぎていた。激しく息を切らしながら、彼は混み合う集団の中腹へとゆっくり後退した（遅れをとった）。", 
        quiz: { question: "Unable to maintain the brutal speed, the athlete was forced to ___.", options: ["drop back", "dumb down", "eat in"], correctIndex: 0, explanation: "to move towards the back." } 
      },
      { 
        pv: "Drop by / in / over", trope: "The Surprise Guest", cefr: "A2", icon: Home, 
        meaning: "To visit someone casually and usually without any strict arrangement.", 
        meaningJP: "立ち寄る、顔を出す", 
        example: "I was completely in the area so I dropped in at the office to see her.", 
        exampleJP: "完全に近くにいたので、彼女に会うためにオフィスに顔を出した。",
        vibes: ["Unexpected hangouts", "Casual, easy friendships", "Quick coffee visits"], 
        vibesJP: ["予期せぬ遊び", "カジュアルで気楽な友情", "ちょっとしたコーヒー訪問"],
        storyline: "Rin was incredibly bored on a perfectly sunny Sunday. Knowing her best friend lived nearby, she decided to buy highly expensive iced lattes and just randomly drop by her apartment to hang out.", 
        storylineJP: "リンは完璧に晴れた日曜日に信じられないほど退屈していた。親友が近くに住んでいるのを知っていた彼女は、非常に高価なアイスラテを買い、遊べるかどうか確認するために彼女のアパートにただランダムに立ち寄る（顔を出す）ことにした。", 
        quiz: { question: "Feel absolutely free to ___ my office anytime if you have any quick questions.", options: ["drop by", "draw out", "dress down"], correctIndex: 0, explanation: "to visit casually." } 
      },
      { 
        pv: "Drop off", trope: "The Sleepy Delivery", cefr: "A2", icon: Map, 
        meaning: "To take someone/something to a place, fall asleep, or decrease.", 
        meaningJP: "降ろす、送り届ける、うとうとする、減少する", 
        example: "I'll quickly drop you off at the busy station on my way to work.", 
        exampleJP: "仕事に行く途中、忙しい駅で急いであなたを降ろして（送り届けて）あげるよ。",
        vibes: ["Giving a friend a ride", "Falling asleep in class", "Declining sales"], 
        vibesJP: ["友達を車に乗せる", "授業中に眠りに落ちる", "売上の減少"],
        storyline: "The history lecture was incredibly warm and utterly monotone. Despite his absolute best efforts to stay focused, Sora's extremely heavy eyelids violently fluttered, and he completely dropped off at his tiny desk.", 
        storylineJP: "歴史の講義は信じられないほど暖かく、全く単調だった。集中を保とうとする彼の絶対的な最善の努力にもかかわらず、ソラの極めて重いまぶたは激しく揺れ、彼は小さな机で完全にうとうとと眠りについた（drop off のもう一つの意味）。", 
        quiz: { question: "Could you please safely ___ the kids ___ at school this morning?", options: ["drop / off", "dry / up", "dump / on"], correctIndex: 0, explanation: "to take someone to a place." } 
      }
    ],
    
    20: [
      { 
        pv: "Drop out", trope: "The Rage Quit", cefr: "B2", icon: LogOut, 
        meaning: "To quit a course, massive competition, or ongoing activity before fully finishing it.", 
        meaningJP: "中退する、辞退する、脱落する", 
        example: "She dramatically dropped out of college and went straight into a highly successful job.", 
        exampleJP: "彼女はドラマチックに大学を中退し、そのまま大成功する仕事に就いた。",
        vibes: ["Quitting completely early", "Changing entire life paths", "Failing to finish a goal"], 
        vibesJP: ["完全に早く辞める", "人生の進路を全く変える", "目標を達成できない"],
        storyline: "The sheer pressure of the elite, highly competitive medical program was entirely suffocating. Realizing he absolutely hated the sight of blood, Ken made the completely shocking decision to entirely drop out of university.", 
        storylineJP: "エリートで競争の激しい医学部の純粋なプレッシャーは、完全に息が詰まるものだった。自分が血を見るのが絶対に嫌いだと気づいたケンは、大学を完全に中退するという完全に衝撃的な決断を下した。", 
        quiz: { question: "She was completely exhausted and wisely decided to safely ___ of the marathon.", options: ["drop out", "draw in", "drink up"], correctIndex: 0, explanation: "to quit an activity." } 
      },
      { 
        pv: "Drop someone in it", trope: "The Ultimate Betrayal", cefr: "C1", icon: AlertTriangle, 
        meaning: "To get someone into serious trouble, often by revealing a secret.", 
        meaningJP: "（人を）窮地に陥れる、チクる", 
        example: "I really dropped him in it when I accidentally told the furious boss what he'd done.", 
        exampleJP: "彼が何をしたか激怒しているボスにうっかり話してしまった時、私は本当に彼を窮地に陥れて（チクって）しまった。",
        vibes: ["Accidental snitching", "Creating massive drama", "Betraying trust"], 
        vibesJP: ["うっかり密告する", "巨大なドラマ（揉め事）を引き起こす", "信頼を裏切る"],
        storyline: "Sora had secretly skipped class to go to the arcade. When the strict teacher asked where he was, oblivious Ken entirely dropped him in it, cheerfully saying, 'Oh, he went to play video games!'", 
        storylineJP: "ソラはゲームセンターに行くために密かに授業をサボっていた。厳格な教師が彼がどこにいるか尋ねた時、何も知らないケンは「ああ、彼はビデオゲームをしに行きましたよ！」と陽気に言い、彼を完全に窮地に陥れた（チクった）。", 
        quiz: { question: "He completely ___ his best friend ___ by showing the teacher the cheating notes.", options: ["dropped / in it", "drew / into", "dined / out on"], correctIndex: 0, explanation: "to get someone into trouble." } 
      },
      { 
        pv: "Drop through", trope: "The Canceled Plans", cefr: "C1", icon: XCircle, 
        meaning: "To come to nothing or produce absolutely no results.", 
        meaningJP: "（計画などが）無駄に終わる、ポシャる", 
        example: "The big business scheme he was excitedly talking about seems to have entirely dropped through.", 
        exampleJP: "彼が興奮して話していた大きなビジネス計画は、完全に無駄に終わった（ポシャった）ようだ。",
        vibes: ["Canceled, ruined vacations", "Deeply broken promises", "Highly disappointing news"], 
        vibesJP: ["キャンセルされ台無しになった休暇", "深く破られた約束", "非常にがっかりするニュース"],
        storyline: "They had spent six grueling months meticulously planning a grand, luxurious trip to Hawaii. But when the airline unexpectedly went entirely bankrupt overnight, the entire beautiful plan tragically dropped through.", 
        storylineJP: "彼らはハワイへの壮大で豪華な旅行を、6ヶ月の過酷な時間をかけて几帳面に計画していた。しかし航空会社が一夜にして完全に予期せず倒産したため、その美しい計画全体が悲劇的にもポシャって（無駄に終わって）しまった。", 
        quiz: { question: "Due to a sudden lack of funding, the massive construction project completely ___.", options: ["dropped through", "drowned out", "drummed up"], correctIndex: 0, explanation: "to come to nothing." } 
      },
      { 
        pv: "Drown in", trope: "The Sauce Lover", cefr: "B2", icon: Droplets, 
        meaning: "To cover excessively with liquid, or be overwhelmed with work/problems.", 
        meaningJP: "（ソースなどで）過剰に覆う、溺れる、忙殺される", 
        example: "They always incredibly drown the delicious food in overly sweet sauce.", 
        exampleJP: "彼らはいつも、美味しい食べ物を信じられないほど過剰な甘いソースで覆う（溺れさせる）。",
        vibes: ["Too much ketchup", "Buried in emails", "Overwhelming amounts"], 
        vibesJP: ["多すぎるケチャップ", "メールに埋もれる", "圧倒的な量"],
        storyline: "Mika had taken on three massive freelance projects at the exact same time. Staring blankly at her overflowing, panicked inbox, she realized she was absolutely drowning in impossible deadlines.", 
        storylineJP: "ミカは全く同時に3つの巨大なフリーランスのプロジェクトを引き受けてしまった。溢れかえりパニックになった受信トレイをぼんやり見つめながら、彼女は自分が不可能な締め切りに完全に溺れている（忙殺されている）ことに気づいた。", 
        quiz: { question: "I am entirely ___ paperwork and desperately need an assistant right now.", options: ["drowning in", "driving up", "drying off"], correctIndex: 0, explanation: "to cover excessively or be overwhelmed." } 
      },
      { 
        pv: "Drown out", trope: "The Noise Canceler", cefr: "B2", icon: Volume2, 
        meaning: "To be so loud that another sound cannot be heard at all.", 
        meaningJP: "（他の音を完全に）かき消す", 
        example: "The incredibly loud music entirely drowned out the sound of the important phone ringing.", 
        exampleJP: "信じられないほどの大音量の音楽が、重要な電話の着信音を完全にかき消してしまった。",
        vibes: ["Focusing intensely with music", "Ignoring the loud haters", "Surviving noisy environments"], 
        vibesJP: ["音楽で激しく集中する", "うるさいアンチを無視する", "騒々しい環境を生き延びる"],
        storyline: "The massive construction outside her thin window was unbearably loud. Hina furiously put on her premium noise-canceling headphones, aggressively blasting heavy bass to completely drown out the chaotic, endless drilling.", 
        storylineJP: "薄い窓の外で行われている大規模な工事は耐えられないほどうるさかった。ヒナは猛烈な勢いで高級ノイズキャンセリングヘッドホンをつけ、カオスで終わりのないドリルの音を完全にかき消すために重低音をアグレッシブに爆音で流した。", 
        quiz: { question: "The deafening cheers from the massive crowd managed to entirely ___ the referee's whistle.", options: ["drown out", "drum up", "dwell on"], correctIndex: 0, explanation: "to overpower a sound." } 
      },
      { 
        pv: "Drum into", trope: "The Repetitive Teacher", cefr: "C1", icon: Zap, 
        meaning: "To make someone learn or believe something by constant, intense repetition.", 
        meaningJP: "（教えや規則を）徹底的に叩き込む", 
        example: "They heavily drum all the strict traps into you before the terrifying test.", 
        exampleJP: "彼らは恐ろしいテストの前に、すべての厳格な罠をあなたに激しく徹底的に叩き込む。",
        vibes: ["Strict memorization", "Bootcamp training", "Endless repeating"], 
        vibesJP: ["厳密な暗記", "ブートキャンプ（新兵訓練）", "終わりのない繰り返し"],
        storyline: "The elite coding bootcamp was incredibly intense. The terrifying instructors relentlessly drummed the complex programming languages into the exhausted students' minds until they could flawlessly write code in their sleep.", 
        storylineJP: "エリートコーディングブートキャンプは信じられないほど過酷だった。恐ろしいインストラクターたちは、疲れ切った生徒たちが寝言で完璧にコードを書けるようになるまで、複雑なプログラミング言語を容赦なく彼らの頭に叩き込んだ。", 
        quiz: { question: "My parents relentlessly ___ the supreme importance of hard work ___ my head.", options: ["drummed / into", "dropped / off", "duffed / up"], correctIndex: 0, explanation: "to teach by repetition." } 
      },
      { 
        pv: "Drum out", trope: "The Public Disgrace", cefr: "C2", icon: Gavel, 
        meaning: "To formally force someone out of their job or position, usually in disgrace.", 
        meaningJP: "（不祥事などで）追い出す、免職にする", 
        example: "The corrupt minister was completely drummed out of her post for lying to the public.", 
        exampleJP: "その腐敗した大臣は、大衆に嘘をついたことで完全にその地位から追い出された（免職にされた）。",
        vibes: ["Getting canceled", "Public firings", "Losing everything"], 
        vibesJP: ["キャンセルされる", "公の場での解雇", "すべてを失う"],
        storyline: "The CEO thought his massive embezzlement was entirely a secret. When the board of directors found undeniable proof, they held an emergency meeting and brutally drummed him out of the company forever.", 
        storylineJP: "CEOは自分の大規模な横領が完全に秘密だと思っていた。取締役会が否定できない証拠を見つけた時、彼らは緊急会議を開き、彼を永遠に会社から残酷に追い出した（免職にした）。", 
        quiz: { question: "After the massive cheating scandal, the arrogant athlete was officially ___ of the league.", options: ["drummed out", "dried up", "ducked out"], correctIndex: 0, explanation: "to force out of a job." } 
      },
      { 
        pv: "Drum up", trope: "The Hype Creator", cefr: "C1", icon: TrendingUp, 
        meaning: "To try intensely hard to generate massive support, interest, or business.", 
        meaningJP: "（支持や関心を）懸命に喚起する、かき集める", 
        example: "The energetic politician traveled the entire country trying to drum up major support.", 
        exampleJP: "そのエネルギッシュな政治家は、大きな支持をかき集める（喚起する）ために国中を旅した。",
        vibes: ["Aggressive marketing campaigns", "Generating viral hype", "Hustling for attention"], 
        vibesJP: ["アグレッシブなマーケティングキャンペーン", "バイラルな熱狂を生み出す", "注目を集めるために奮闘する"],
        storyline: "The entirely unknown indie band had absolutely zero fans. They spent an incredibly exhausting month aggressively handing out colorful flyers, doing absolutely everything they could to fully drum up massive interest before their debut.", 
        storylineJP: "完全に無名のインディーズバンドには、ファンが絶対にゼロだった。彼らは、デビュー前に巨大な関心を完全に喚起する（かき集める）ために、カラフルなチラシをアグレッシブに配り、できることは絶対になんでもして信じられないほど疲労困憊する1ヶ月を過ごした。", 
        quiz: { question: "The smart company cleverly used a viral social media campaign to effectively ___ new business.", options: ["drum up", "dry out", "drone on"], correctIndex: 0, explanation: "to generate interest." } 
      },
      { 
        pv: "Dry off", trope: "The Post-Shower", cefr: "A2", icon: Wind, 
        meaning: "To dry something quickly, or to dry the surface of something.", 
        meaningJP: "乾かす、拭き取る", 
        example: "I had a brilliantly warm shower and quickly dried myself off.", 
        exampleJP: "最高に温かいシャワーを浴びて、急いで自分の体を乾かした（拭き取った）。",
        vibes: ["Getting caught in the rain", "Toweling down", "Warm air"], 
        vibesJP: ["雨に降られる", "タオルで拭く", "暖かい空気"],
        storyline: "They got completely, unexpectedly caught in a massive summer downpour. Sprinting into the warm cafe, they grabbed napkins and frantically tried to dry themselves off before shivering.", 
        storylineJP: "彼らは完全に予期せず、巨大な夏の土砂降りに巻き込まれた。暖かいカフェに全速力で駆け込み、彼らはナプキンを掴み、震え上がる前に必死で自分たちを乾かそう（拭き取ろう）とした。", 
        quiz: { question: "Use this thick, fluffy towel to immediately ___ the wet dog before he shakes.", options: ["dry off", "dumb down", "ease up"], correctIndex: 0, explanation: "to dry quickly." } 
      },
      { 
        pv: "Dry out", trope: "The Rehab", cefr: "C1", icon: Activity, 
        meaning: "To dry something fully, or to stop drinking/taking drugs when addicted.", 
        meaningJP: "完全に乾く、（アルコールなどの）依存症を治す", 
        example: "He officially checked into a quiet clinic to entirely dry out after being arrested.", 
        exampleJP: "逮捕された後、彼は依存症を完全に治す（アルコールを抜く）ために、正式に静かなクリニックに入院した。",
        vibes: ["Getting sober", "Sun-drying clothes", "Recovering health"], 
        vibesJP: ["シラフになる", "服を天日干しする", "健康を回復する"],
        storyline: "The ancient, legendary pop star's life had become an absolute, toxic mess of partying. Realizing he was losing everything, he vanished into a remote mountain facility for a year to thoroughly dry out and recover his soul.", 
        storylineJP: "その古代の伝説的なポップスターの生活は、パーティー三昧の絶対的で有毒なカオスと化していた。自分がすべてを失いかけていると悟った彼は、完全に依存症を治し（アルコールを抜き）魂を回復させるため、1年間人里離れた山の施設に姿を消した。", 
        quiz: { question: "We hung the extremely wet, heavy blankets in the hot sun to entirely ___.", options: ["dry out", "edge out", "end in"], correctIndex: 0, explanation: "to dry fully or stop an addiction." } 
      },
      { 
        pv: "Dry up", trope: "The Desert Drought", cefr: "B2", icon: CloudOff, 
        meaning: "To lose all water, stop being supplied, or be entirely unable to speak.", 
        meaningJP: "干上がる、供給が止まる、言葉に詰まる", 
        example: "In the middle of the incredibly important press conference, she panicked and completely dried up.", 
        exampleJP: "信じられないほど重要な記者会見の最中に、彼女はパニックになり完全に言葉に詰まって（干上がって）しまった。",
        vibes: ["Massive stage fright", "A devastating drought", "Income disappearing"], 
        vibesJP: ["極度のあがり症", "壊滅的な干ばつ", "収入が消える"],
        storyline: "Sora was incredibly confident during the rehearsals. But standing on the bright stage, staring directly into the terrifying eyes of the strict judges, his mind went utterly blank, and he agonizingly dried up, standing in total silence.", 
        storylineJP: "ソラはリハーサル中は信じられないほど自信に満ちていた。しかし明るいステージに立ち、厳格な審査員の恐ろしい目を直接見つめた時、彼の頭は完全に真っ白になり、彼は苦痛を伴いながら突然言葉に詰まり（干上がり）、完全な沈黙の中で立ち尽くした。", 
        quiz: { question: "Due to the severe lack of rain, the once-beautiful, deep lake entirely ___.", options: ["dried up", "dumbed down", "faced up to"], correctIndex: 0, explanation: "to evaporate or stop speaking." } 
      },
      { 
        pv: "Duck out of", trope: "The Master Dodger", cefr: "C1", icon: Ghost, 
        meaning: "To carefully avoid doing something you promised or are supposed to do.", 
        meaningJP: "（責任や約束から）逃げる、巧みに避ける", 
        example: "He entirely ducked out of helping us last night by faking a sudden headache.", 
        exampleJP: "彼は昨夜、突然の頭痛を装って、私たちを手伝うことから完全に逃げ出した（巧みに避けた）。",
        vibes: ["Avoiding hard work", "Flaky friends", "Ninja-like escapes"], 
        vibesJP: ["辛い仕事を避ける", "当てにならない友達", "忍者のような逃走"],
        storyline: "It was deep cleaning day at the dorms, and everyone was scrubbing floors. Ken, however, completely ducked out of the grueling work by quietly slipping out the back door and hiding in the library.", 
        storylineJP: "寮の大掃除の日で、全員が床を磨いていた。しかしケンは、静かに裏口から抜け出して図書館に隠れることで、その過酷な作業から完全に逃げ出した（巧みに避けた）。", 
        quiz: { question: "She cleverly managed to ___ the boring meeting by claiming she had a deadline.", options: ["duck out of", "draw into", "drop out of"], correctIndex: 0, explanation: "to avoid doing something." } 
      },
      { 
        pv: "Duff up", trope: "The Dark Alley", cefr: "C2", icon: Angry, 
        meaning: "To beat or hit someone repeatedly and severely.", 
        meaningJP: "（人を）袋叩きにする、ボコボコにする", 
        example: "He was brutally duffed up in a sketchy nightclub last night.", 
        exampleJP: "彼は昨夜、怪しいナイトクラブで残酷にも袋叩きにされた（ボコボコにされた）。",
        vibes: ["Street brawls", "Gangster movies", "Severe beatings"], 
        vibesJP: ["路上での乱闘", "ギャング映画", "ひどい暴行"],
        storyline: "The arrogant rival player had been insulting Sora's team all season. After the final match, things escalated, and a massive fight broke out where the rival got severely duffed up in the parking lot.", 
        storylineJP: "傲慢なライバル選手はシーズン中ずっとソラのチームを侮辱していた。最終戦の後、事態はエスカレートし、駐車場でライバルがひどく袋叩きにされる（ボコボコにされる）大規模な乱闘に発展した。", 
        quiz: { question: "The ruthless gang viciously ___ the informant for talking to the police.", options: ["duffed up", "damped down", "dished out"], correctIndex: 0, explanation: "to beat someone repeatedly." } 
      },
      { 
        pv: "Dumb down", trope: "The TL;DR Explanation", cefr: "C1", icon: ArrowDown, 
        meaning: "To deliberately reduce the intellectual level of something to make it wildly popular or simpler.", 
        meaningJP: "（レベルを下げて）分かりやすくする、大衆化する", 
        example: "Television has been aggressively dumbing down the serious news for years.", 
        exampleJP: "テレビは何年もの間、真面目なニュースをアグレッシブに大衆化し（レベルを下げて分かりやすくし）ている。",
        vibes: ["Needing a quick summary", "Explaining to a beginner", "Simplifying heavy jargon"], 
        vibesJP: ["簡単な要約が必要", "初心者に説明する", "難しい専門用語を単純化する"],
        storyline: "The brilliant tech CEO started using highly complex engineering jargon during the major pitch. The deeply confused investor stopped him. 'Listen, I'm absolutely not a coder. You need to entirely dumb this down for me.'", 
        storylineJP: "優秀なテック企業のCEOは、大規模なプレゼン中に非常に複雑なエンジニアリングの専門用語を使い始めた。深く混乱した投資家は彼を止めた。「聞いてくれ、私は絶対にプログラマーじゃない。これを私にも完全に分かるように噛み砕いて（レベルを下げて）くれ。」", 
        quiz: { question: "The advanced science book was heavily ___ so that very young children could read it.", options: ["dumbed down", "dwelt on", "ate out"], correctIndex: 0, explanation: "to simplify excessively." } 
      },
      { 
        pv: "Dump on", trope: "The Unfair Boss", cefr: "C1", icon: Trash2, 
        meaning: "To treat someone badly, criticize heavily, or tell them all your problems.", 
        meaningJP: "ひどく扱う、非難を浴びせる、（愚痴を）こぼす", 
        example: "Her highly toxic boss dumps on everyone whenever things go wrong.", 
        exampleJP: "彼女の非常に有毒なボスは、物事がうまくいかない時はいつでも全員に非難を浴びせる（ひどく扱う）。",
        vibes: ["Toxic workplaces", "Being the group therapist", "Unfair blame"], 
        vibesJP: ["有毒な職場", "グループのセラピストになる", "不当な非難"],
        storyline: "Whenever the company lost a major client, the arrogant director never took responsibility. Instead, he would aggressively dump on the junior staff, blaming them entirely for his own massive failures.", 
        storylineJP: "会社が大きなクライアントを失うたびに、傲慢なディレクターは決して責任を取らなかった。代わりに、彼はアグレッシブに若手スタッフに非難を浴びせ（ひどく扱い）、自分自身の巨大な失敗を完全に彼らのせいにした。", 
        quiz: { question: "It is incredibly exhausting when friends constantly ___ you with their endless drama.", options: ["dump on", "dwell upon", "eke out"], correctIndex: 0, explanation: "to treat badly or tell problems to." } 
      },
      { 
        pv: "Dwell on / upon", trope: "The Overthinker", cefr: "C1", icon: Clock, 
        meaning: "To spend a lot of time thinking or talking about something, usually negative.", 
        meaningJP: "（過去の失敗などを）くよくよ考える、長々とこだわる", 
        example: "It's entirely useless to constantly dwell on your past failures with absolute regret.", 
        exampleJP: "絶対的な後悔とともに過去の失敗を絶えずくよくよ考える（長々とこだわる）のは、全く無意味だ。",
        vibes: ["Midnight overthinking", "Stuck in the past", "Refusing to move on"], 
        vibesJP: ["深夜の考えすぎ", "過去に囚われる", "前に進むことを拒む"],
        storyline: "Ken lost the massive championship match by missing one single, incredibly easy shot. He locked himself in his dark room for weeks, obsessively dwelling on that one tiny mistake instead of practicing.", 
        storylineJP: "ケンは信じられないほど簡単なシュートを1本外したことで、巨大な優勝決定戦に敗れた。彼は何週間も暗い部屋に閉じこもり、練習する代わりに、ただその1つの小さなミスに執拗にくよくよと考え（こだわり）続けた。", 
        quiz: { question: "She wisely told him to stop agonizingly ___ his ex and try to move on.", options: ["dwelling on", "eating up", "falling apart"], correctIndex: 0, explanation: "to think too much about something." } 
      },
      { 
        pv: "Ease off", trope: "The Pressure Drop", cefr: "B2", icon: Activity, 
        meaning: "To reduce pressure, speed, or intensity.", 
        meaningJP: "（圧力やスピードが）和らぐ、緩む", 
        example: "She smoothly eased off the accelerator to let the speeding car slow down.", 
        exampleJP: "スピードを出している車を減速させるために、彼女はスムーズにアクセルを緩めた。",
        vibes: ["Taking a deep breath", "Slowing down", "Relieving tension"], 
        vibesJP: ["深呼吸する", "ペースを落とる", "緊張を和らげる"],
        storyline: "The intense, crushing deadlines at the tech firm had pushed everyone to the brink. Finally, after the massive product launch, the frantic pacing began to ease off, and the staff could actually breathe again.", 
        storylineJP: "テック企業の強烈で押しつぶされそうな締め切りは、全員を限界まで追い詰めていた。ついに大規模な製品のリリース後、狂ったようなペースが和らぎ（緩み）始め、スタッフは実際に再び呼吸できるようになった。", 
        quiz: { question: "The intense, pouring rain finally began to slowly ___ after three dark days.", options: ["ease off", "edge out", "embark on"], correctIndex: 0, explanation: "to reduce pressure or severity." } 
      },
      { 
        pv: "Ease up", trope: "The Stressed Teacher", cefr: "B2", icon: Smile, 
        meaning: "To relax, calm down, or become less severe.", 
        meaningJP: "リラックスする、落ち着く、厳しさを和らげる", 
        example: "She asked her incredibly strict teacher to ease up because she was completely stressed.", 
        exampleJP: "彼女は完全にストレスを感じていたので、信じられないほど厳しい先生に厳しさを和らげる（リラックスする）よう頼んだ。",
        vibes: ["Chilling out", "Lowering expectations", "A much-needed break"], 
        vibesJP: ["落ち着く", "期待値を下げる", "切実に必要な休息"],
        storyline: "The exam prep was absolutely brutal, with students studying 14 hours a day. Seeing them completely exhausted, Maki gently smiled. 'Alright everyone, let's ease up for today. Go home and get some serious rest.'", 
        storylineJP: "1日14時間も勉強する試験勉強は絶対に過酷だった。完全に疲れ切った彼らを見て、マキは優しく微笑んだ。「よしみんな、今日は厳しさを和らげよう（リラックスしよう）。家に帰ってしっかり休んで。」", 
        quiz: { question: "You are working far too hard; you seriously need to ___ before you collapse.", options: ["ease up", "egg on", "enter into"], correctIndex: 0, explanation: "to relax or calm down." } 
      },
      { 
        pv: "Eat away (at)", trope: "The Slow Destruction", cefr: "C1", icon: Trash2, 
        meaning: "To destroy or erode something slowly over a long period of time.", 
        meaningJP: "徐々にむしばむ、浸食する", 
        example: "The incredibly toxic guilt has been slowly eating away at him for years.", 
        exampleJP: "信じられないほど有毒な罪悪感が、何年もの間ゆっくりと彼をむしばんでいる。",
        vibes: ["Deep, dark regrets", "Rust and ruin", "Slow decay"], 
        vibesJP: ["深く暗い後悔", "錆と破滅", "ゆっくりとした腐敗"],
        storyline: "Sora had secretly cheated to win the gold medal. Nobody ever found out, but the massive, suffocating guilt slowly ate away at his conscience until he finally completely confessed in tears.", 
        storylineJP: "ソラは金メダルを取るために密かにズルをしていた。誰もそれに気づかなかったが、その巨大で息の詰まるような罪悪感が、彼がついに涙ながらに完全に告白するまで、ゆっくりと彼の良心をむしばんでいった。", 
        quiz: { question: "The powerful, crashing waves are completely ___ the beautiful coastal cliffs.", options: ["eating away at", "ebbing away", "edging up"], correctIndex: 0, explanation: "to destroy slowly." } 
      },
      { 
        pv: "Eat in", trope: "The Cozy Night", cefr: "A1", icon: Home, 
        meaning: "To eat at home instead of going to a restaurant.", 
        meaningJP: "家で食べる、自炊する", 
        example: "We were entirely too tired to go to a restaurant, so we simply ate in.", 
        exampleJP: "私たちは完全に疲れすぎてレストランに行けなかったので、単に家で食べた。",
        vibes: ["Ordering pizza", "Cozy home meals", "Saving money"], 
        vibesJP: ["ピザを注文する", "居心地の良い家の食事", "お金を節約する"],
        storyline: "The freezing, bitter wind howled outside the apartment. Kaito looked at the dark street, then at his warm, comfortable couch. 'I absolutely refuse to leave,' he declared. 'We are definitely eating in tonight.'", 
        storylineJP: "凍てつく厳しい風がアパートの外で吠えていた。海斗は暗い通りを見てから、暖かく快適なソファを見た。「絶対に外に出るのは拒否する」と彼は宣言した。「今夜は間違いなく家で食べるぞ。」", 
        quiz: { question: "I want to save my precious money, so I think I will just ___ tonight.", options: ["eat in", "ease up", "egg on"], correctIndex: 0, explanation: "to eat at home." } 
      }
    ],
   
    21: [
      { 
        pv: "Eat into", trope: "The Savings Drain", cefr: "C1", icon: TrendingDown, 
        meaning: "To use a valuable resource (like time or money) when you don't want to.", 
        meaningJP: "（資金や時間を）食いつぶす、侵食する", 
        example: "These incredibly expensive car repairs are severely eating into my college savings.", 
        exampleJP: "この信じられないほど高額な車の修理代が、私の大学の貯金を激しく食いつぶしている。",
        vibes: ["Financial panics", "Wasting precious time", "Losing resources"], 
        vibesJP: ["財政的なパニック", "貴重な時間を無駄にする", "資源を失う"],
        storyline: "Mika excitedly started a new hobby of collecting rare, vintage cameras. But the hobby was dangerously expensive, rapidly eating into the massive fund she had carefully saved for her dream trip to Europe.", 
        storylineJP: "ミカは希少なビンテージカメラを集めるという新しい趣味を興奮して始めた。しかしその趣味は危険なほど高額で、彼女がヨーロッパへの夢の旅行のために慎重に貯めた莫大な資金を急速に食いつぶしていた。", 
        quiz: { question: "This highly complex, utterly boring project is completely ___ my valuable free time.", options: ["eating into", "ending up", "entering into"], correctIndex: 0, explanation: "to use a valuable resource." } 
      },
      { 
        pv: "Eat out", trope: "The Lazy Cook", cefr: "A1", icon: ShoppingCart, 
        meaning: "To eat in a restaurant instead of at home.", 
        meaningJP: "外食する", 
        example: "We couldn't be bothered to cook at all, so we enthusiastically ate out last night.", 
        exampleJP: "料理をするのが全く面倒だったので、私たちは昨夜、熱狂的に外食した。",
        vibes: ["Weekend treats", "Fancy dinners", "Avoiding the kitchen"], 
        vibesJP: ["週末のご褒美", "豪華なディナー", "キッチンを避ける"],
        storyline: "The fridge was completely empty, and Kaito was utterly exhausted from his terrible 12-hour shift. 'I absolutely refuse to cook,' he announced loudly to his roommate. 'Get your best coat, we are definitely eating out tonight.'", 
        storylineJP: "冷蔵庫は完全に空っぽで、海斗はひどい12時間シフトで完全に疲れ果てていた。「料理なんて絶対に拒否する」と彼はルームメイトに大声で宣言した。「一番いい上着を着な、今夜は絶対に外食だ。」", 
        quiz: { question: "Since it's your very special birthday, let's highly celebrate and ___ at a fancy place.", options: ["eat out", "ebb away", "edge out"], correctIndex: 0, explanation: "to eat at a restaurant." } 
      },
      { 
        pv: "Eat up", trope: "The Gas Guzzler", cefr: "B1", icon: PlusSquare, 
        meaning: "To consume completely, or to use a vast amount of something.", 
        meaningJP: "食べ尽くす、（時間や燃料などを）完全に消費する", 
        example: "If you don't fully eat up your green vegetables, you absolutely won't get dessert.", 
        exampleJP: "緑の野菜を完全に食べ尽くさないなら、絶対にデザートはあげないわよ。",
        vibes: ["Clearing your plate fully", "A total time sink", "Wasting resources rapidly"], 
        vibesJP: ["お皿を完全に空にする", "完全な時間の浪費", "資源を急速に無駄にする"],
        storyline: "The highly demanding new video game was absolutely phenomenal, but incredibly addictive. Sora played it constantly, realizing too late that it had entirely eaten up his whole weekend, leaving zero time for his massive homework.", 
        storylineJP: "要求水準の非常に高い新しいビデオゲームは絶対に驚異的だったが、信じられないほど中毒性があった。ソラは絶えずそれをプレイし、それが彼の週末全体を完全に消費し（食い尽くし）、膨大な宿題の時間がゼロになっていることに気づくのが遅すぎた。", 
        quiz: { question: "The unexpected, massive car repairs completely ___ my entire carefully saved vacation fund.", options: ["ate up", "eyed up", "faced off"], correctIndex: 0, explanation: "to consume entirely." } 
      },
      { 
        pv: "Ebb away", trope: "The Fading Light", cefr: "C2", icon: CloudOff, 
        meaning: "To gradually disappear, decrease, or fade away.", 
        meaningJP: "（力や感情が）次第に衰える、消え去る", 
        example: "His vibrant, youthful energy slowly ebbed away as the severe illness progressed.", 
        exampleJP: "重い病気が進行するにつれ、彼の活気に満ちた若々しいエネルギーはゆっくりと衰えて（消え去って）いった。",
        vibes: ["Poetic sadness", "Losing strength", "Fading memories"], 
        vibesJP: ["詩的な悲しみ", "力を失う", "色褪せる記憶"],
        storyline: "The ancient king had ruled his massive empire with an iron fist for fifty years. But lying in his grand bed, his immense power finally began to quietly ebb away, leaving only a fragile, tired old man.", 
        storylineJP: "古代の王は50年間、巨大な帝国を鉄の拳で支配してきた。しかし豪華なベッドに横たわりながら、彼の絶大な権力はついに静かに衰え（消え去り）始め、ただのもろく疲れた老人だけが残された。", 
        quiz: { question: "As the sun set, the absolute, terrifying heat of the desert finally began to ___.", options: ["ebb away", "edge out", "eke out"], correctIndex: 0, explanation: "to disappear gradually." } 
      },
      { 
        pv: "Edge out", trope: "The Corporate Push", cefr: "C1", icon: LogOut, 
        meaning: "To gradually and carefully push someone out of a position or job.", 
        meaningJP: "じりじりと追い出す", 
        example: "The ruthless shareholders aggressively edged the founder out of the company.", 
        exampleJP: "冷酷な株主たちは、アグレッシブに創業者を会社からじりじりと追い出した。",
        vibes: ["Corporate takeovers", "Winning by an inch", "Strategic removal"], 
        vibesJP: ["企業の買収", "僅差で勝つ", "戦略的な排除"],
        storyline: "Mika and Yumi were fiercely competing for the lead role in the school play. Day by day, Mika stayed later, practiced harder, and slowly managed to flawlessly edge Yumi out, securing the absolute spotlight.", 
        storylineJP: "ミカとユミは学校劇の主役の座を激しく争っていた。日を追うごとにミカは遅くまで残り、より熱心に練習し、ゆっくりと見事にユミをじりじりと追い出し、絶対的なスポットライトを確保した。", 
        quiz: { question: "The ambitious new manager slowly ___ the older, experienced veterans.", options: ["edged out", "embarked on", "ended in"], correctIndex: 0, explanation: "to push someone out of a position." } 
      },
      { 
        pv: "Edge up", trope: "The Traffic Creep", cefr: "C1", icon: ChevronRight, 
        meaning: "To approach slowly and carefully.", 
        meaningJP: "じりじり近づく", 
        example: "She carefully edged up behind the massive bus at the red light.", 
        exampleJP: "赤信号で、彼女は巨大なバスの後ろに慎重にじりじりと近づいた。",
        vibes: ["Sneaking closer", "Inching forward", "Cautious movements"], 
        vibesJP: ["こっそり近づく", "少しずつ進む", "慎重な動き"],
        storyline: "The stealthy, highly dangerous panther crouched low in the tall grass. Its golden eyes locked on the entirely unaware prey, it slowly and silently edged up, waiting for the absolutely perfect moment to strike.", 
        storylineJP: "密かで非常に危険なヒョウが高い草むらに低く身をかがめた。その金色の目は全く気づいていない獲物にロックオンされ、完全に完璧な攻撃の瞬間を待ちながら、ゆっくりと静かにじりじりと近づいた。", 
        quiz: { question: "The nervous driver slowly ___ to the completely blind intersection.", options: ["edged up", "egged on", "entered into"], correctIndex: 0, explanation: "to approach slowly." } 
      },
      { 
        pv: "Egg on", trope: "The Bad Influence", cefr: "C2", icon: Zap, 
        meaning: "To strongly, actively encourage someone to do something bad, foolish, or dangerous.", 
        meaningJP: "（悪事などを）そそのかす、けしかける", 
        example: "He definitely wouldn't have wildly jumped if his stupid friends hadn't egged him on.", 
        exampleJP: "もしバカな友達が彼をそそのかして（けしかけて）いなかったら、彼は絶対に無謀に飛び込んだりしなかっただろう。",
        vibes: ["Peer pressure totally failing", "Being a terrible influence", "Encouraging a risky stunt"], 
        vibesJP: ["完全に失敗する同調圧力", "最悪の悪影響になる", "危険なスタントを奨励する"],
        storyline: "Leo was genuinely terrified of jumping from the massive, dangerously high cliff into the freezing lake. But his chaotic friends formed a circle, chanting his name and aggressively egging him on until he foolishly, blindly leaped.", 
        storylineJP: "レオは、危険なほど高い巨大な崖から凍える湖に飛び込むことを心底恐れていた。しかし彼のカオスな友人たちは円陣を組み、彼の名前を唱え、彼が愚かにも盲目的に飛び降りるまでアグレッシブに彼をそそのかした（けしかけた）。", 
        quiz: { question: "The highly aggressive crowd continuously ___ the angry fighters ___ to strike harder.", options: ["egged / on", "ended / up", "fell / for"], correctIndex: 0, explanation: "to encourage bad behavior." } 
      },
      { 
        pv: "Eke out", trope: "The Student Budget", cefr: "C2", icon: DollarSign, 
        meaning: "To make a limited supply of something (like money or food) last as long as possible.", 
        meaningJP: "（わずかなものを）少しずつ大切に使う、どうにか生計を立てる", 
        example: "Most poor students have to carefully eke out their incredibly tiny income.", 
        exampleJP: "ほとんどの貧しい学生は、信じられないほどわずかな収入を慎重に少しずつ大切に使わなければ（どうにか生計を立てなければ）ならない。",
        vibes: ["Eating instant noodles", "Stretching a budget", "Surviving the month"], 
        vibesJP: ["インスタントラーメンを食べる", "予算をやりくりする", "その月を生き延びる"],
        storyline: "After utterly failing his startup, Ken was completely broke. He lived in a tiny, freezing apartment, desperately trying to eke out a living by doing bizarre freelance jobs and eating only cheap, plain rice.", 
        storylineJP: "スタートアップに完全に失敗した後、ケンは完全に一文無しになった。彼は狭く凍えるようなアパートに住み、奇妙なフリーランスの仕事をし、安くて味のないご飯だけを食べて、死に物狂いでどうにか生計を立て（少しずつ大切に使い）ようとしていた。", 
        quiz: { question: "Stranded on the island, they had to miraculously ___ their tiny supply of fresh water.", options: ["eke out", "empty out", "enter for"], correctIndex: 0, explanation: "to make something last." } 
      },
      { 
        pv: "Embark on / upon", trope: "The Grand Adventure", cefr: "B2", icon: Map, 
        meaning: "To start a major, important new project, venture, or journey.", 
        meaningJP: "（新たな計画や冒険に）乗り出す、着手する", 
        example: "After graduating perfectly, she confidently embarked upon a completely new career.", 
        exampleJP: "完璧に卒業した後、彼女は自信満々に全く新しいキャリアに乗り出した（着手した）。",
        vibes: ["Starting an epic quest", "A new chapter", "Taking a massive leap"], 
        vibesJP: ["壮大な探求を始める", "新しい章", "大きな飛躍をする"],
        storyline: "Sora stared at the massive, completely blank canvas. Taking a deep breath, he picked up his finest brush and boldly embarked on what would become his absolute greatest, world-renowned masterpiece.", 
        storylineJP: "ソラは巨大で完全に真っ白なキャンバスを見つめた。深呼吸をして最高級の筆を手に取り、彼は後に彼の絶対的で世界的に有名な最高傑作となるものに大胆に乗り出した（着手した）。", 
        quiz: { question: "The incredibly ambitious tech company has officially ___ a highly risky global expansion.", options: ["embarked on", "ended in", "eyed up"], correctIndex: 0, explanation: "to start a project or venture." } 
      },
      { 
        pv: "Empty out", trope: "The Big Purge", cefr: "B1", icon: Trash2, 
        meaning: "To remove completely all the contents of a container or room.", 
        meaningJP: "中身を完全に空にする、すべて取り出す", 
        example: "I must completely empty out the stinking rubbish before I leave for work.", 
        exampleJP: "仕事に出かける前に、この悪臭を放つゴミを完全にすべて取り出さ（空にし）なければならない。",
        vibes: ["Moving day chaos", "Dumping out a backpack", "Deep cleaning"], 
        vibesJP: ["引っ越しの日のカオス", "バックパックの中身をぶちまける", "大掃除"],
        storyline: "Hina's massive purse was a chaotic black hole. Frustrated, she aggressively unzipped it and completely emptied it out onto the clean floor, revealing dozens of old receipts, lipsticks, and completely crushed snacks.", 
        storylineJP: "ヒナの巨大な財布はカオスなブラックホールだった。苛立った彼女はアグレッシブにジッパーを開け、きれいな床の上に中身を完全にすべて取り出し（空にし）、何十枚もの古いレシート、口紅、そして完全に潰れたスナックを露わにした。", 
        quiz: { question: "The strict teacher ordered the suspicious student to entirely ___ his pockets.", options: ["empty out", "end up", "enter into"], correctIndex: 0, explanation: "to empty something completely." } 
      },
      { 
        pv: "End in", trope: "The Tragic Finale", cefr: "B1", icon: XOctagon, 
        meaning: "To finish in a certain, often negative or specific way.", 
        meaningJP: "〜の結果に終わる", 
        example: "If you continue to foolishly ignore the strict rules, this will definitively end in tears.", 
        exampleJP: "このまま愚かにも厳格なルールを無視し続ければ、これは決定的に涙を流す結果に終わるだろう。",
        vibes: ["Forecasting disaster", "Inevitable outcomes", "A dramatic conclusion"], 
        vibesJP: ["災害を予測する", "避けられない結果", "ドラマチックな結末"],
        storyline: "The two incredibly stubborn business partners refused to politely compromise on a single issue. Their once-great, highly profitable tech empire tragically ended in a bitter, multi-million dollar lawsuit.", 
        storylineJP: "2人の信じられないほど頑固なビジネスパートナーは、たった一つの問題についても礼儀正しく妥協することを拒んだ。かつて偉大で高収益だった彼らのテック帝国は、悲劇的にも苦々しい数百万ドル規模の訴訟という結果に終わった。", 
        quiz: { question: "The brilliantly planned, massive bank robbery surprisingly ___ complete and utter failure.", options: ["ended in", "eyed up", "faced off"], correctIndex: 0, explanation: "to finish a certain way." } 
      },
      { 
        pv: "End up (with)", trope: "The Unplanned Journey", cefr: "A2", icon: Shuffle, 
        meaning: "To finally be in a particular place, state, or situation, often totally unexpectedly.", 
        meaningJP: "結局〜になる、最後には〜に行き着く", 
        example: "We got totally, hopelessly lost and ended up at a random beautiful beach.", 
        exampleJP: "私たちは完全に絶望的に迷子になり、最終的に（結局）ランダムで美しいビーチに行き着いた。",
        vibes: ["Wild, unexpected adventures", "Crazy plot twists", "Surprising final results"], 
        vibesJP: ["ワイルドで予期せぬ冒険", "クレイジーなどんでん返し", "驚くべき最終結果"],
        storyline: "They originally planned a quiet, utterly boring movie night. But after a series of highly chaotic events and a missed midnight train, they somehow ended up at an underground karaoke bar at 3 AM, screaming pop songs.", 
        storylineJP: "彼らは当初、静かで全く退屈な映画の夜を計画していた。しかし一連の非常にカオスな出来事と終電逃しの後、彼らはなぜか深夜3時に地下のカラオケバーに行き着き（結局〜になり）、ポップソングを絶叫していた。", 
        quiz: { question: "If you utterly refuse to study at all, you will inevitably ___ failing the entire class.", options: ["end up", "fall behind", "fathom out"], correctIndex: 0, explanation: "to eventually reach a state." } 
      },
      { 
        pv: "Enter for", trope: "The Big Tournament", cefr: "B1", icon: Award, 
        meaning: "To officially join or enter a formal competition or exam.", 
        meaningJP: "（競技や試験に）申し込む、参加する", 
        example: "They eagerly entered for the national championship but sadly weren't good enough.", 
        exampleJP: "彼らは熱心に全国大会に参加を申し込んだが、悲しいことに実力が足りなかった。",
        vibes: ["Signing the forms", "Chasing the trophy", "High stakes entry"], 
        vibesJP: ["書類にサインする", "トロフィーを追いかける", "リスクの高いエントリー"],
        storyline: "Ken had trained secretly in his garage for three exhausting years. Believing he was finally ready, he confidently marched into the stadium and proudly entered for the absolute biggest martial arts tournament in the country.", 
        storylineJP: "ケンはガレージで3年間、過酷な秘密の特訓を積んできた。ついに出番だと信じ、彼は自信満々にスタジアムに足を踏み入れ、国内で絶対的に最大の武術トーナメントに誇らしく参加を申し込んだ。", 
        quiz: { question: "I finally gathered enough pure courage to boldly ___ the extreme talent show.", options: ["enter for", "face up to", "faff about"], correctIndex: 0, explanation: "to join a competition." } 
      },
      { 
        pv: "Enter into", trope: "The Formal Agreement", cefr: "C1", icon: Book, 
        meaning: "To become formally involved in an agreement, discussion, or highly serious relationship.", 
        meaningJP: "（契約や交渉を）結ぶ、始める", 
        example: "They officially entered into a highly complex agreement with their biggest rivals.", 
        exampleJP: "彼らは最大のライバルと、非常に複雑な合意を正式に結んだ（始めた）。",
        vibes: ["Signing contracts", "Corporate alliances", "Serious commitments"], 
        vibesJP: ["契約にサインする", "企業の提携", "真剣なコミットメント"],
        storyline: "After six excruciatingly long months of intense, secret negotiations, the two rival superhero agencies finally sat down and officially entered into a legendary, unbreakable alliance to entirely protect the city.", 
        storylineJP: "6ヶ月間の耐え難いほど長く強烈で秘密の交渉の後、2つのライバルヒーロー機関はついに席に着き、都市を完全に守るための伝説的で壊れない同盟を正式に結んだ（始めた）。", 
        quiz: { question: "The CEO was incredibly hesitant to officially ___ such a massive, binding legal contract.", options: ["enter into", "eye up", "fall apart"], correctIndex: 0, explanation: "to become involved or accept." } 
      },
      { 
        pv: "Eye up", trope: "The Suspicious Glare", cefr: "C1", icon: Eye, 
        meaning: "To look very carefully at someone or something, often with suspicion or interest.", 
        meaningJP: "じろじろ見る、値踏みするように見る", 
        example: "The tough guy aggressively eyed the other man up because he was behaving suspiciously.", 
        exampleJP: "そのタフな男は、もう一人の男が怪しい行動をしていたため、アグレッシブに彼をじろじろと値踏みするように見た。",
        vibes: ["Sizing up an opponent", "Flirting from across the room", "Security checks"], 
        vibesJP: ["相手を値踏みする", "部屋の向こうからいちゃつく", "セキュリティチェック"],
        storyline: "The massive, incredibly intimidating bouncer stood at the velvet rope. He coldly eyed up every single person trying to enter the exclusive club, brutally turning away anyone who didn't look rich enough.", 
        storylineJP: "巨大で信じられないほど威圧的な用心棒がベルベットのロープの前に立っていた。彼は高級クラブに入ろうとするすべての人を冷酷にじろじろと値踏みするように見つめ、十分に裕福そうに見えない者を容赦なく追い返した。", 
        quiz: { question: "The hungry lion dangerously ___ the completely unaware gazelle from the tall grass.", options: ["eyed up", "faffed about", "fell back"], correctIndex: 0, explanation: "to look carefully at." } 
      },
      { 
        pv: "Face off", trope: "The Final Showdown", cefr: "C1", icon: XOctagon, 
        meaning: "To confront or compete directly against someone in a highly intense situation.", 
        meaningJP: "対決する、にらみ合う", 
        example: "The massive, dominant company faced off the new competition aggressively.", 
        exampleJP: "その巨大で支配的な企業は、新たな競争相手とアグレッシブに対決した。",
        vibes: ["High noon duels", "Sports rivalries", "Intense stare-downs"], 
        vibesJP: ["真昼の決闘", "スポーツのライバル関係", "激しいにらみ合い"],
        storyline: "The entire stadium was perfectly, absolutely silent. The two legendary boxers stepped into the very center of the bright ring and intensely faced off, their eyes locked in pure, undeniable hatred.", 
        storylineJP: "スタジアム全体が完璧に、絶対的に静まり返っていた。2人の伝説のボクサーが明るいリングのど真ん中に足を踏み入れ、純粋で否定できない憎しみで目を合わせ、激しく対決した（にらみ合った）。", 
        quiz: { question: "The two incredibly stubborn presidential candidates will finally ___ in a live television debate.", options: ["face off", "fall behind", "fend for"], correctIndex: 0, explanation: "to confront." } 
      },
      { 
        pv: "Face up to", trope: "The Reality Check", cefr: "C1", icon: Shield, 
        meaning: "To bravely accept and directly deal with a difficult fact or massive problem.", 
        meaningJP: "（困難な現実に）真正面から向き合う、認める", 
        example: "You desperately need to finally face up to your incredibly massive mistakes.", 
        exampleJP: "あなたはついに、自分の信じられないほど巨大な間違いに真正面から向き合う（認める）必要が絶対にある。",
        vibes: ["Taking total accountability", "Stopping the endless denial", "A harsh, brutal reality check"], 
        vibesJP: ["完全な説明責任を果たす", "終わりのない否定をやめる", "厳しく残酷な現実を直視する"],
        storyline: "Leo aggressively kept blaming his teammates for losing the huge championship. The wise coach pulled him aside and firmly said, 'You missed the final, crucial shot. It's truly time to completely face up to your own lack of practice.'", 
        storylineJP: "レオは巨大な優勝決定戦で負けたことをアグレッシブにチームメイトのせいにし続けていた。賢明なコーチは彼を脇へ呼び、きっぱりと言った。「お前が最後の極めて重要なシュートを外したんだ。自分自身の練習不足に完全に真正面から向き合う（認める）時だぞ。」", 
        quiz: { question: "He must bravely and honestly ___ the harsh reality that his business is entirely failing.", options: ["face up to", "fall apart", "feel up to"], correctIndex: 0, explanation: "to accept an unpleasant truth." } 
      },
      { 
        pv: "Faff about / around", trope: "The Time Waster", cefr: "C2", icon: Clock, 
        meaning: "To behave highly indecisively or waste time doing silly, unimportant things.", 
        meaningJP: "ダラダラする、もたもたする、無駄なことをする", 
        example: "He angrily told her to completely stop faffing about and finally make her mind up.", 
        exampleJP: "彼は彼女に、もたもた（ダラダラ）するのを完全にやめて、最終的に心を決めるよう怒って言った。",
        vibes: ["Unable to pick a restaurant", "Wasting a whole Sunday", "Endless indecision"], 
        vibesJP: ["レストランを決められない", "日曜日を丸一日無駄にする", "終わりのない優柔不断"],
        storyline: "The massive flight was boarding in exactly twenty minutes. Kaito was completely stressed out, entirely packed and ready by the door, while Mika was still casually faffing around trying to decide which perfectly matched sunglasses to pack.", 
        storylineJP: "巨大なフライトの搭乗はきっかり20分後だった。海斗は完全にストレスを感じ、ドアのそばで荷造りを終えて完璧に準備していたが、ミカはどの完璧に合うサングラスを持っていくか決めようと、まだ呑気にもたもたしていた（ダラダラしていた）。", 
        quiz: { question: "We don't have absolutely any time to ___ ; just choose a highly decent restaurant now!", options: ["faff about", "fall down", "fend off"], correctIndex: 0, explanation: "to behave indecisively." } 
      },
      { 
        pv: "Fall about", trope: "The Comedy Gold", cefr: "C2", icon: Smile, 
        meaning: "To laugh completely uncontrollably and intensely.", 
        meaningJP: "大爆笑する、笑い転げる", 
        example: "We entirely fell about when we heard the absolutely ridiculous thing she'd done.", 
        exampleJP: "彼女がやった絶対的に馬鹿げたことを聞いた時、私たちは完全に大爆笑した（笑い転げた）。",
        vibes: ["Crying from laughing", "A hilarious inside joke", "Losing your mind"], 
        vibesJP: ["笑い泣きする", "最高に面白い身内ネタ", "正気を失う"],
        storyline: "Sora tried to perform a highly dramatic, serious magic trick, but he accidentally pulled a completely rubber chicken out of his hat instead of a dove. The entire stunned audience fell about laughing for ten full minutes.", 
        storylineJP: "ソラは非常にドラマチックで真面目な手品を披露しようとしたが、ハトの代わりにうっかりゴムの鶏を帽子から引っ張り出してしまった。唖然とした観客全体が、丸10分間大爆笑した（笑い転げた）。", 
        quiz: { question: "The unexpectedly brilliant comedian had the entire crowded room ___ with pure joy.", options: ["falling about", "falling behind", "fathoming out"], correctIndex: 0, explanation: "to laugh a lot." } 
      },
      { 
        pv: "Fall apart", trope: "The Total Breakdown", cefr: "B2", icon: CloudOff, 
        meaning: "To break into tiny pieces, or to lose all emotional control completely.", 
        meaningJP: "壊れる、ボロボロになる、（精神的に）崩壊する", 
        example: "My extremely cheap headphones are literally already falling apart.", 
        exampleJP: "私の極端に安っぽいヘッドホンは、文字通りすでにボロボロに壊れかけている。",
        vibes: ["Deep emotional breakdowns", "Highly fragile objects", "Everything going totally wrong"], 
        vibesJP: ["深い感情の崩壊", "非常に壊れやすい物", "すべてが完全に間違った方向に行く"],
        storyline: "After flawlessly hiding her extreme stress for long months, Mika finally read her brutal rejection letter from the elite art school. Sitting alone on her bedroom floor, she completely fell apart, sobbing intensely for five hours.", 
        storylineJP: "極度のストレスを長い月日、完璧に隠し続けた後、ミカはついにエリート美術学校からの残酷な不合格通知を読んだ。寝室の床に一人座り込み、彼女は完全に精神的に崩壊し、5時間も激しく泣きじゃくった。", 
        quiz: { question: "The ancient, rotten wooden bridge safely began to dangerously ___ under his immense weight.", options: ["fall apart", "fall back on", "fend for"], correctIndex: 0, explanation: "to break into pieces or lose control." } 
      }
    ],
    
    22: [
      { 
        pv: "Fiddle about / around", trope: "The Tech Waster", cefr: "C1", icon: Cpu, 
        meaning: "To waste time doing silly things, or doing things unsuccessfully.", 
        meaningJP: "いじくり回す、無駄なことをして時間を潰す", 
        example: "We spent the whole afternoon fiddling about with the computer but couldn't get it to work.", 
        exampleJP: "午後中ずっとコンピューターをいじくり回していたが、動かすことはできなかった。",
        vibes: ["Procrastinating hard", "Trying to fix tech without a manual", "Aimless tinkering"], 
        vibesJP: ["激しく先延ばしにする", "マニュアルなしで機械を直そうとする", "目的のないいじくり回し"],
        storyline: "Sora had a massive history essay due in exactly three hours. Instead of intensely typing, he spent two incredibly agonizing hours just fiddling around with the absolute perfect font sizes and deeply aesthetic title page designs.", 
        storylineJP: "ソラはきっかり3時間後に巨大な歴史のエッセイを提出しなければならなかった。彼は猛烈にタイピングする代わりに、絶対的に完璧なフォントサイズと非常に美しいタイトルページのデザインをただいじくり回すことに、信じられないほど苦痛な2時間を費やした。", 
        quiz: { question: "Stop completely ___ with your highly distracting phone and pay attention!", options: ["fiddling around", "fighting back", "filling in"], correctIndex: 0, explanation: "to waste time doing silly things." } 
      },
      { 
        pv: "Fight back", trope: "The Epic Counterattack", cefr: "B2", icon: Shield, 
        meaning: "To defend yourself, resist an attack.", 
        meaningJP: "反撃する、抵抗する", 
        example: "The army attacked the town and the inhabitants fought back fiercely.", 
        exampleJP: "軍隊が町を攻撃し、住民たちは激しく反撃した。",
        vibes: ["Epic comebacks", "Refusing to yield", "The underdog rising"], 
        vibesJP: ["壮大な逆転劇", "屈することを拒む", "負け犬の反撃"],
        storyline: "The massive, dominant corporation ruthlessly sued the tiny, independent artist to steal her brilliant work. Instead of quietly giving up, she wildly gathered support on social media and fiercely fought back in court.", 
        storylineJP: "巨大で支配的な企業は、小さく独立したアーティストの素晴らしい作品を盗むために容赦なく彼女を訴えた。静かに諦める代わりに、彼女はSNSで熱狂的に支持を集め、法廷で激しく反撃した。", 
        quiz: { question: "Despite the incredibly unfair, harsh criticism, the brave leader actively ___.", options: ["fought back", "faded away", "fell apart"], correctIndex: 0, explanation: "to defend yourself or resist." } 
      },
      { 
        pv: "Fight it out", trope: "The Power Struggle", cefr: "C1", icon: Zap, 
        meaning: "To struggle to see who wins, both by arguing or fighting.", 
        meaningJP: "決着がつくまで戦う、徹底的に議論する", 
        example: "They're fighting it out to see who will become the next CEO.", 
        exampleJP: "誰が次のCEOになるかを決めるために、彼らは徹底的に議論している（決着がつくまで戦っている）。",
        vibes: ["A fierce debate", "Corporate power struggles", "No compromises"], 
        vibesJP: ["激しい討論", "企業の権力闘争", "妥協なし"],
        storyline: "The two lead designers had completely different, entirely opposing visions for the new character. They locked themselves in the meeting room for five hours, aggressively fighting it out until they reached a flawless compromise.", 
        storylineJP: "2人のリードデザイナーは、新キャラクターに対して完全に異なり全く対立するビジョンを持っていた。彼らは会議室に5時間閉じこもり、完璧な妥協点に達するまでアグレッシブに徹底的に議論した（決着がつくまで戦った）。", 
        quiz: { question: "The two highly stubborn rival teams will ___ on the field tomorrow.", options: ["fight it out", "figure on", "fill in"], correctIndex: 0, explanation: "to struggle to see who wins." } 
      },
      { 
        pv: "Fight off", trope: "The Immunity Boost", cefr: "B2", icon: Activity, 
        meaning: "To fight an attacker and force them back, or resist an illness.", 
        meaningJP: "撃退する、（病気などを）はねのける", 
        example: "The old lady managed to fight the muggers off and they didn't get her purse.", 
        exampleJP: "その老婦人はなんとか強盗を撃退し、彼らは彼女の財布を奪えなかった。",
        vibes: ["Drinking Vitamin C", "Overcoming sickness", "A skilled physical defense"], 
        vibesJP: ["ビタミンCを飲む", "病気を克服する", "熟練した物理的防御"],
        storyline: "Mika had a huge, extremely important concert on Friday. On Tuesday, she felt a terrifying, scratchy sore throat. She aggressively drank gallons of hot ginger tea and completely slept for two days, miraculously fighting off the nasty cold.", 
        storylineJP: "ミカは金曜日に巨大で極めて重要なコンサートを控えていた。火曜日、彼女は恐ろしくイガイガする喉の痛みを感じた。彼女はアグレッシブに大量の温かいジンジャーティーを飲み、2日間完全に眠り、奇跡的に厄介な風邪をはねのけた（撃退した）。", 
        quiz: { question: "I am desperately trying to warmly ___ a terrible, incredibly nasty flu.", options: ["fight off", "figure out", "fill out"], correctIndex: 0, explanation: "to resist an illness or attacker." } 
      },
      { 
        pv: "Figure on", trope: "The Master Planner", cefr: "C1", icon: Calendar, 
        meaning: "To plan or expect something to happen.", 
        meaningJP: "～を計画に入れる、当てにする、予期する", 
        example: "What job do you figure on doing when you finally graduate?", 
        exampleJP: "ついに卒業したら、どんな仕事に就くことを計画に入れている（予期している）の？",
        vibes: ["Calculating risks", "Strategic life choices", "Preparing for the future"], 
        vibesJP: ["リスクを計算する", "戦略的な人生の選択", "未来への準備"],
        storyline: "Kaito wanted to host a massive beach party. He brilliantly figured on about fifty people showing up, so he meticulously bought exactly enough expensive premium meat and ice-cold drinks to keep everyone entirely happy.", 
        storylineJP: "海斗は大規模なビーチパーティーを開きたかった。彼は見事に約50人が来ることを計画に入れ（予期し）、全員を完全に満足させるために、高価な高級肉と氷のように冷たい飲み物をきっちり十分に几帳面に買い揃えた。", 
        quiz: { question: "The smart organizers correctly ___ a massive crowd attending the festival.", options: ["figured on", "fished out", "fitted into"], correctIndex: 0, explanation: "to plan or expect." } 
      },
      { 
        pv: "Figure out", trope: "The Big Brain Moment", cefr: "B1", icon: Lightbulb, 
        meaning: "To find the answer to a problem.", 
        meaningJP: "解決する、理解する、解き明かす", 
        example: "The police couldn't figure out how the burglars had got into the warehouse.", 
        exampleJP: "警察は、強盗がどうやって倉庫に侵入したのかを解き明かす（理解する）ことができなかった。",
        vibes: ["Solving the hard puzzle", "The ultimate 'Aha!' moment", "Massive brain energy"], 
        vibesJP: ["難しいパズルを解く", "究極の「アハ！」体験", "巨大な脳のエネルギー"],
        storyline: "The intricately complex puzzle box had deeply frustrated Rin for three solid days. By meticulously analyzing the strange, hidden symbols, she suddenly grinned wildly. She had finally and completely figured out the secret locking mechanism.", 
        storylineJP: "複雑に入り組んだパズルボックスは、リンを丸3日間深く悩ませていた。奇妙で隠されたシンボルを几帳面に分析することで、彼女は突然大きくニヤリと笑った。彼女はついに、秘密のロック機構を完全に解き明かした（理解した）のだ。", 
        quiz: { question: "It took the brilliant, veteran detective long hours to ___ the clever murderer's motive.", options: ["figure out", "find out", "fit in"], correctIndex: 0, explanation: "to find the answer." } 
      },
      { 
        pv: "File away", trope: "The Organized Desk", cefr: "B2", icon: Book, 
        meaning: "To put a document in the correct place for storage in a filing system.", 
        meaningJP: "（書類を）整理して保管する", 
        example: "I filed a copy of the letter away for my records.", 
        exampleJP: "私は記録のために、手紙のコピーをきれいに整理して保管した。",
        vibes: ["Color-coded folders", "Office administration", "Immaculate organization"], 
        vibesJP: ["色分けされたフォルダ", "オフィスの管理", "完璧な整理整頓"],
        storyline: "The highly obsessive secretary didn't just throw papers on his desk. At exactly 5 PM every day, he meticulously sorted every single highly confidential contract and neatly filed them away into massive, color-coded steel cabinets.", 
        storylineJP: "非常に強迫観念の強い秘書は、机の上に書類をただ投げるようなことはしなかった。毎日きっかり午後5時、彼は極秘の契約書を一枚残らず几帳面に分類し、巨大な色分けされたスチール製キャビネットにきれいに整理して保管した。", 
        quiz: { question: "Please ensure you neatly ___ these highly important documents after signing them.", options: ["file away", "fire off", "finish up"], correctIndex: 0, explanation: "to store a document correctly." } 
      },
      { 
        pv: "File for", trope: "The Legal Battle", cefr: "B2", icon: Gavel, 
        meaning: "To apply for something legally, like divorce or bankruptcy.", 
        meaningJP: "（離婚や破産などを）法的に申請する", 
        example: "They tragically filed for divorce after just two years of marriage.", 
        exampleJP: "彼らは悲劇的にも、結婚からわずか2年で離婚を法的に申請した。",
        vibes: ["Signing official papers", "Lawyer meetings", "Going entirely bankrupt"], 
        vibesJP: ["公式な書類にサインする", "弁護士との打ち合わせ", "完全に自己破産する"],
        storyline: "The once-massive global tech company had entirely run out of money after a series of completely terrible investments. With zero options left, the utterly exhausted CEO officially walked into court to file for absolute bankruptcy.", 
        storylineJP: "かつて巨大だったグローバルテック企業は、一連の完全に最悪な投資の後、完全に資金が尽きた。選択肢がゼロになったため、完全に疲れ切ったCEOは正式に法廷に出向き、絶対的な自己破産を申請した。", 
        quiz: { question: "Due to the massive debt, the small business sadly had to ___ bankruptcy.", options: ["file for", "fit into", "flag down"], correctIndex: 0, explanation: "to apply for legally." } 
      },
      { 
        pv: "Fill in", trope: "The Bureaucracy Maze", cefr: "A2", icon: PenTool, 
        meaning: "To complete a form, or substitute someone at work.", 
        meaningJP: "（用紙に）記入する、代わりを務める", 
        example: "I carefully filled in the application form and posted it off.", 
        exampleJP: "私は申込用紙に丁寧に記入し、郵送した。",
        vibes: ["Doing endless paperwork", "Covering a shift", "Signing your life away"], 
        vibesJP: ["終わりのない書類仕事をする", "シフトの代わりを務める", "人生を捧げるサインをする"],
        storyline: "The completely exhausted receptionist sighed heavily. When Kaito asked to see the doctor, she blindly handed him a massive, terrifyingly thick stack of legal papers. 'You need to entirely fill these in before we can even speak to you.'", 
        storylineJP: "完全に疲れ切った受付係は重いため息をついた。海斗が医者に診てもらいたいと頼むと、彼女は盲目的に恐ろしく分厚い法的書類の巨大な束を彼に渡した。「私たちがあなたと話す前に、これらに完全に記入する必要があります。」", 
        quiz: { question: "You must fully ___ this extremely detailed application form with blue ink.", options: ["fill in", "find out", "fit into"], correctIndex: 0, explanation: "to complete a form." } 
      },
      { 
        pv: "Fill in on", trope: "The Secret Briefing", cefr: "C1", icon: MessageCircle, 
        meaning: "To give someone missing information or updates.", 
        meaningJP: "（最新の情報を）教える、耳に入れる", 
        example: "I'm sorry I missed the meeting; could you please fill me in on what happened?", 
        exampleJP: "会議に出られなくてすみません。何があったか最新の情報を教えて（耳に入れて）もらえませんか？",
        vibes: ["Catching up on gossip", "Quick office updates", "Spilling the tea"], 
        vibesJP: ["ゴシップの遅れを取り戻す", "オフィスの素早いアップデート", "秘密を漏らす（お茶をこぼす）"],
        storyline: "Sora had been out sick for three entire days. When he returned, the office felt incredibly tense. He immediately pulled his best friend aside and whispered, 'Quick, fill me in on all the crazy drama I completely missed.'", 
        storylineJP: "ソラは丸3日間病欠していた。彼が戻った時、オフィスは信じられないほど緊迫しているように感じた。彼はすぐに親友を脇に引き寄せ、「早く、俺が完全に見逃した狂ったドラマの最新情報を全部教えてくれ」と囁いた。", 
        quiz: { question: "Since you were utterly absent, let me thoroughly ___ you ___ the new rules.", options: ["fill / in on", "figure / out", "finish / off"], correctIndex: 0, explanation: "to give someone information." } 
      },
      { 
        pv: "Fill out", trope: "The Application Grind", cefr: "A2", icon: PenTool, 
        meaning: "To complete a form with information.", 
        meaningJP: "（用紙の空欄に）記入する", 
        example: "I successfully filled out the application form and mailed it.", 
        exampleJP: "私は申込用紙の空欄に記入し終え、それを郵送した。",
        vibes: ["Applying for passports", "Writing down personal info", "Endless checkboxes"], 
        vibesJP: ["パスポートを申請する", "個人情報を書き留める", "終わりのないチェックボックス"],
        storyline: "Rin sat in the depressingly gray immigration office for three hours. She was fiercely determined to get her visa, aggressively clicking her pen as she meticulously filled out twenty highly detailed pages of bureaucratic nonsense.", 
        storylineJP: "リンは憂鬱になるほど灰色の入国管理局のオフィスに3時間座っていた。彼女はビザを取得することを猛烈に決意し、ペンをアグレッシブにカチカチ鳴らしながら、20ページにも及ぶ非常に詳細で官僚的な無意味な書類（空欄）に几帳面に記入した。", 
        quiz: { question: "Please neatly ___ the entire survey so we can quickly process your request.", options: ["fill out", "filter out", "fire up"], correctIndex: 0, explanation: "to complete a form." } 
      },
      { 
        pv: "Fill up", trope: "The Tank Maximum", cefr: "B1", icon: PlusSquare, 
        meaning: "To fill something completely to the top.", 
        meaningJP: "満杯にする、満タンにする", 
        example: "I stopped at the busy garage and completely filled up with petrol.", 
        exampleJP: "忙しいガソリンスタンドに寄り、ガソリンを完全に満タンにした。",
        vibes: ["Road trip ready", "Pouring to the brim", "Hitting full capacity"], 
        vibesJP: ["ロードトリップの準備", "縁まで注ぐ", "満杯に達する"],
        storyline: "They were embarking on a massive, highly epic cross-country road trip through the deeply terrifying, totally empty desert. 'Listen entirely to me,' Kaito warned. 'We must completely fill up the gas tank at every single station, or we will utterly die out here.'", 
        storylineJP: "彼らは深く恐ろしく完全に空っぽの砂漠を抜ける、大規模で非常に壮大なクロスカントリーのロードトリップに出発しようとしていた。「俺の言うことを完全に聞け」海斗は警告した。「すべてのガソリンスタンドで完全にガソリンを満タンにしないと、俺たちはここで完全に死ぬぞ。」", 
        quiz: { question: "The extremely thirsty traveler eagerly ___ his large water bottle at the pure spring.", options: ["filled up", "fished out", "flogged off"], correctIndex: 0, explanation: "to fill completely." } 
      },
      { 
        pv: "Filter out", trope: "The Spam Blocker", cefr: "B2", icon: XOctagon, 
        meaning: "To remove something unwanted from a liquid, light, or data stream.", 
        meaningJP: "（不要なものを）取り除く、ろ過する", 
        example: "It perfectly filters out all the harsh impurities and chemicals in tap water.", 
        exampleJP: "それは、水道水の中のすべての有害な不純物や化学物質を完璧に取り除く（ろ過する）。",
        vibes: ["Checking the spam folder", "Using water purifiers", "Ignoring the haters"], 
        vibesJP: ["スパムフォルダをチェックする", "浄水器を使う", "アンチを無視する"],
        storyline: "Sora's professional email inbox was an absolute, terrifying disaster zone of useless newsletters. He spent an entire angry afternoon setting up complex digital rules to permanently filter out all the highly annoying daily spam.", 
        storylineJP: "ソラの仕事用メールの受信トレイは、役に立たないニュースレターの絶対的で恐ろしい災害地帯だった。彼は怒りに満ちた午後を丸ごと費やして複雑なデジタルルールを設定し、非常に鬱陶しい毎日のスパムを永久にすべて取り除いた（フィルタリングした）。", 
        quiz: { question: "The expensive, high-tech machine automatically ___ any dangerous toxic gases.", options: ["filters out", "fleshes out", "folds up"], correctIndex: 0, explanation: "to remove something unwanted." } 
      },
      { 
        pv: "Find out", trope: "The Shocking Discovery", cefr: "A1", icon: Eye, 
        meaning: "To discover information or the truth.", 
        meaningJP: "見つけ出す、事実を知る", 
        example: "I went to the grand library to find out all I could about the ancient history.", 
        exampleJP: "私は古代の歴史についてできる限りの事実を知る（見つけ出す）ために、大図書館へ行った。",
        vibes: ["Uncovering a deep secret", "Investigating a mystery", "Learning the harsh truth"], 
        vibesJP: ["深い秘密を暴く", "ミステリーを調査する", "厳しい真実を知る"],
        storyline: "For months, Ken heavily suspected his sneaky roommate was completely eating his expensive, imported snacks. He set up a tiny hidden camera and was absolutely furious to definitively find out he was totally right.", 
        storylineJP: "何ヶ月もの間、ケンは卑劣なルームメイトが自分の高価な輸入スナックを完全に食べていると強く疑っていた。彼は小さな隠しカメラを設置し、自分が完全に正しかったという事実を決定的に知り（見つけ出し）、絶対的に激怒した。", 
        quiz: { question: "The clever detective eventually managed to successfully ___ the true identity of the thief.", options: ["find out", "fit in", "fix up"], correctIndex: 0, explanation: "to discover." } 
      },
      { 
        pv: "Finish off", trope: "The Final Strike", cefr: "B2", icon: Zap, 
        meaning: "To finish completely, kill, or consume entirely.", 
        meaningJP: "完全に終わらせる、とどめを刺す、食べ（飲み）尽くす", 
        example: "They greedily finished off all the chocolates and had to go buy some more.", 
        exampleJP: "彼らは貪欲にすべてのチョコレートを食べ尽くし、もっと買いに行かなければならなかった。",
        vibes: ["Defeating the final boss", "Eating the last slice", "Completing a hard task"], 
        vibesJP: ["ラスボスを倒す", "最後の一切れを食べる", "困難なタスクを完了する"],
        storyline: "The massive, highly exhausting 50-page essay was nearly done. Gulping down his third intensely strong coffee at 4 AM, Leo viciously typed the final conclusion paragraph to completely finish it off before the sun aggressively rose.", 
        storylineJP: "巨大で非常に疲労困憊する50ページのエッセイはほぼ完成していた。午前4時に3杯目の強烈に濃いコーヒーを一気飲みし、レオは太陽がアグレッシブに昇る前に完全に終わらせるため、最後の結論の段落を猛烈にタイプした。", 
        quiz: { question: "The legendary, powerful warrior expertly ___ the terrifying dragon with one massive strike.", options: ["finished off", "faded away", "fell behind"], correctIndex: 0, explanation: "to finish completely or kill." } 
      },
      { 
        pv: "Finish up", trope: "The Unplanned Destination", cefr: "B2", icon: Map, 
        meaning: "To finally get somewhere, usually without planning to go there.", 
        meaningJP: "最終的に～にたどり着く、結局～で終わる", 
        example: "We simply went out for dinner and finished up dancing in a loud club.", 
        exampleJP: "私たちは単に夕食に出かけただけだったが、結局うるさいクラブで踊って終わった（最終的にたどり着いた）。",
        vibes: ["Crazy night outs", "Ending up somewhere strange", "Unplanned adventures"], 
        vibesJP: ["クレイジーな夜遊び", "変な場所に行き着く", "計画外の冒険"],
        storyline: "They originally set out to just completely peacefully study at the quiet library. But after running into a highly chaotic group of old friends, they somehow entirely finished up at a loud, neon-lit bowling alley at midnight.", 
        storylineJP: "彼らは当初、静かな図書館で完全に平和に勉強することだけを計画して出発した。しかし非常にカオスな昔の友人グループに出くわした後、彼らはなぜか深夜にうるさくネオンが輝くボウリング場に最終的にたどり着いていた。", 
        quiz: { question: "If you constantly ignore the strict map, you will definitely ___ completely lost.", options: ["finish up", "farm out", "feel up to"], correctIndex: 0, explanation: "to finally get somewhere." } 
      },
      { 
        pv: "Finish with", trope: "The Clean Break", cefr: "B2", icon: XCircle, 
        meaning: "To end a relationship, or stop dealing with someone/something.", 
        meaningJP: "（関係を）終わらせる、見切りをつける、（使用を）終える", 
        example: "She decidedly finished with him a few months ago after the massive argument.", 
        exampleJP: "あの大喧嘩の後、彼女は数ヶ月前に彼と決定的に見切りをつけた（関係を終わらせた）。",
        vibes: ["A brutal breakup", "Handing back a borrowed item", "Cutting toxic ties"], 
        vibesJP: ["残酷な別れ", "借りたものを返す", "有害な関係を絶つ"],
        storyline: "The arrogant coworker had entirely completely stolen her absolutely brilliant marketing idea. Maki smiled completely sweetly, but in her mind, she had completely finished with him. She blocked his emails and never spoke to him again.", 
        storylineJP: "傲慢な同僚は彼女の絶対的に素晴らしいマーケティングのアイデアを完全に全て盗んだ。マキは完全に甘く微笑んだが、心の中では彼に完全に見切りをつけて（関係を終わらせて）いた。彼女は彼のメールをブロックし、二度と口を利かなかった。", 
        quiz: { question: "Are you entirely ___ that useful reference book, or do you still severely need it?", options: ["finished with", "fired off", "focused on"], correctIndex: 0, explanation: "to end relationship or stop using." } 
      },
      { 
        pv: "Fire away", trope: "The Open Floor", cefr: "C1", icon: Mic2, 
        meaning: "To tell someone they can begin asking questions.", 
        meaningJP: "（質問を）さあどうぞ、どんどん言って", 
        example: "What exactly do you want to know? Fire away and I'll tell you absolutely everything.", 
        exampleJP: "正確には何が知りたいんだい？さあどうぞ（どんどん言って）、全部教えてあげるよ。",
        vibes: ["Press conferences", "Confident speakers", "Ready for anything"], 
        vibesJP: ["記者会見", "自信に満ちたスピーカー", "どんなことにも準備ができている"],
        storyline: "The genius developer stood on the bright stage, presenting the entirely revolutionary new smartphone. He smiled warmly at the massive crowd of highly eager journalists. 'I know you have a hundred questions. Fire away!'", 
        storylineJP: "天才開発者は明るいステージに立ち、完全に革命的な新しいスマートフォンを発表した。彼は非常に熱心なジャーナリストの巨大な群衆に向かって温かく微笑んだ。「質問が100個あるのは分かっています。さあ、どんどんどうぞ！」", 
        quiz: { question: "If anyone has any urgent questions about the new complex policy, please just ___.", options: ["fire away", "flake out", "flip out"], correctIndex: 0, explanation: "to ask questions." } 
      },
      { 
        pv: "Fire off", trope: "The Angry Email", cefr: "C1", icon: MessageCircle, 
        meaning: "To send quickly, angrily or many (letters, emails), or to shoot a weapon.", 
        meaningJP: "（怒りのメールなどを）矢継ぎ早に送る、発砲する", 
        example: "He aggressively fired off an email loudly complaining about the terrible report.", 
        exampleJP: "彼はそのひどい報告書について大声で文句を言うメールを、アグレッシブに矢継ぎ早に送った。",
        vibes: ["Rage typing", "Sending aggressive texts", "A barrage of complaints"], 
        vibesJP: ["怒りのタイピング", "攻撃的なテキストを送る", "クレームの集中砲火"],
        storyline: "The arrogant airline completely lost her highly expensive, irreplaceable luggage. Furious and utterly exhausted, Mika sat in the empty airport and violently fired off three absolutely scathing complaint emails to their useless corporate office.", 
        storylineJP: "傲慢な航空会社は、彼女の非常に高価でかけがえのない荷物を完全に紛失した。激怒し完全に疲れ切ったミカは、誰もいない空港に座り、彼らの役に立たない本社宛てに絶対的に痛烈なクレームメールを3通、暴力的に矢継ぎ早に送った。", 
        quiz: { question: "Without even calmly thinking, the angry boss ___ a highly offensive message to the team.", options: ["fired off", "figured out", "filled in"], correctIndex: 0, explanation: "to send quickly or angrily." } 
      },
      { 
        pv: "Fire up", trope: "The Motivation Speech", cefr: "B2", icon: Flame, 
        meaning: "To start a machine/computer, or excite/become extremely excited.", 
        meaningJP: "（パソコンなどを）起動する、興奮させる、気合を入れる", 
        example: "Everyone was completely fired up and entirely desperate to get it finished in time.", 
        exampleJP: "全員が完全に気合を入れて（興奮して）、時間内に終わらせようと完全に必死になっていた。",
        vibes: ["Pre-game hype", "Booting up the gaming PC", "Getting entirely pumped"], 
        vibesJP: ["試合前の興奮", "ゲーミングPCを起動する", "完全に熱くなる"],
        storyline: "The underdog team was deeply losing by a massive twenty points at halftime. The passionate, legendary coach slammed the locker room door and delivered an incredibly intense, roaring speech that completely fired up the entirely exhausted players.", 
        storylineJP: "その無名チームはハーフタイムに巨大な20点差で深く負けていた。情熱的で伝説的なコーチはロッカールームのドアをバンと閉め、完全に疲れ切った選手たちを完全に興奮させ気合を入れる、信じられないほど強烈で吠えるようなスピーチをした。", 
        quiz: { question: "The legendary, powerful rock band completely ___ the massive stadium crowd.", options: ["fired up", "fathomed out", "flicked through"], correctIndex: 0, explanation: "to excite or become excited." } 
      }
    ],
    
    23: [
      { 
        pv: "Firm up", trope: "The Final Handshake", cefr: "C1", icon: CheckCircle2, 
        meaning: "To make things clearer in a negotiation or discussion.", 
        meaningJP: "（計画や契約の）詳細を固める、明確にする", 
        example: "We urgently need to firm up some vital aspects of the contract before we officially sign it.", 
        exampleJP: "正式に署名する前に、契約のいくつかの極めて重要な側面を至急固める（明確にする）必要がある。",
        vibes: ["Closing the deal", "Corporate negotiations", "Getting things in writing"], 
        vibesJP: ["取引をまとめる", "企業の交渉", "文書化する"],
        storyline: "The two rival tech giants had been casually discussing a massive merger for months. Realizing the deadline was extremely close, the stressed lawyers met to definitively firm up the final, incredibly complex details.", 
        storylineJP: "2つのライバルテック巨人は何ヶ月も前から巨大な合併についてカジュアルに話し合っていた。締め切りが極めて近いと悟り、ストレスを抱えた弁護士たちは、最終的な信じられないほど複雑な詳細を決定的に固める（明確にする）ために集まった。", 
        quiz: { question: "Before we can safely proceed, we absolutely must completely ___ the extremely vague plans.", options: ["firm up", "fall through", "finish off"], correctIndex: 0, explanation: "to make things clearer in an arrangement." } 
      },
      { 
        pv: "Fish for", trope: "The Compliment Seeker", cefr: "C1", icon: Fish, 
        meaning: "To try to get some information or to get someone to say something (like praise).", 
        meaningJP: "（情報や褒め言葉を）引き出そうとする、探る", 
        example: "He's incredibly annoying because he's always blindly fishing for compliments.", 
        exampleJP: "彼はいつも盲目的に褒め言葉を引き出そうとしている（探っている）ので、信じられないほど鬱陶しい。",
        vibes: ["Seeking validation", "Dropping subtle hints", "Fishing for praise"], 
        vibesJP: ["承認を求める", "さりげないヒントを出す", "称賛を求める"],
        storyline: "Leo spent an absolutely absurd amount of money on a highly flashy, neon sports car. Whenever he parked, he would slowly walk around it, constantly complaining it was 'too dusty' just to aggressively fish for compliments from jealous strangers.", 
        storylineJP: "レオは非常に派手なネオンカラーのスポーツカーに絶対的に馬鹿げた大金を費やした。駐車するたびに、彼は嫉妬する見知らぬ人からの褒め言葉をアグレッシブに引き出そうとする（探る）ためだけに、車の周りをゆっくり歩き「埃っぽすぎる」と絶えず文句を言っていた。", 
        quiz: { question: "The sneaky journalist kept cleverly ___ deeply secret information during the interview.", options: ["fishing for", "fending off", "falling for"], correctIndex: 0, explanation: "to try to get information." } 
      },
      { 
        pv: "Fish out", trope: "The Deep Dive", cefr: "B2", icon: Search, 
        meaning: "To remove something from a bag, pocket, or water.", 
        meaningJP: "（ポケットや水の中から）引っ張り出す、探し出す", 
        example: "She blindly reached into her massive handbag and successfully fished some coins out.", 
        exampleJP: "彼女は巨大なハンドバッグに盲目的に手を突っ込み、見事にいくつかの硬貨を引っ張り出した（探し出した）。",
        vibes: ["Finding lost keys", "Retrieving dropped phones", "Digging in a purse"], 
        vibesJP: ["失くした鍵を見つける", "落としたスマホを回収する", "財布の中をあさる"],
        storyline: "While walking on the incredibly beautiful, sunlit bridge, Kaito tragically dropped his highly expensive phone straight into the rushing river below. He spent three utterly miserable hours trying to creatively fish it out with a completely useless net.", 
        storylineJP: "信じられないほど美しく陽の当たる橋の上を歩いている時、海斗は悲劇的にも非常に高価なスマホを真下の激流に落としてしまった。彼は完全に役に立たない網でそれを独創的に引っ張り出そう（探し出そう）と、全くもって惨めな3時間を費やした。", 
        quiz: { question: "After a long struggle, he miraculously ___ the shiny wedding ring ___ of the deep lake.", options: ["fished / out", "filled / up", "forced / down"], correctIndex: 0, explanation: "to remove from a bag or water." } 
      },
      { 
        pv: "Fit in", trope: "The New Kid", cefr: "B1", icon: Users, 
        meaning: "To get on well in a group of people, or have enough time/space.", 
        meaningJP: "（集団に）溶け込む、馴染む、スケジュールに組み込む", 
        example: "I didn't easily fit in with the other arrogant people working there so I ultimately left.", 
        exampleJP: "私はそこで働く他の傲慢な人々に簡単に馴染めなかった（溶け込めなかった）ので、最終的に辞めた。",
        vibes: ["Trying to belong", "The new kid at school", "Finding your tribe"], 
        vibesJP: ["帰属しようとする", "学校の転校生", "自分の仲間を見つける"],
        storyline: "When Sora transferred to the incredibly elite, strict private academy, his wildly bright pink hair and loud skateboard made him entirely stand out. He terribly struggled to flawlessly fit in with the completely highly-strung, wealthy students.", 
        storylineJP: "ソラが信じられないほどエリートで厳格な私立アカデミーに転校した時、彼の非常に鮮やかなピンクの髪とうるさいスケートボードは彼を完全に目立たせた。彼は、完全に神経質で裕福な生徒たちの中に完璧に溶け込む（馴染む）のにひどく苦労した。", 
        quiz: { question: "The awkward teenager tried incredibly hard to socially ___ with the popular group.", options: ["fit in", "freak out", "front for"], correctIndex: 0, explanation: "to get on in a group." } 
      },
      { 
        pv: "Fit into", trope: "The Tight Squeeze", cefr: "B2", icon: CheckCircle2, 
        meaning: "To become part of something, or be small enough to wear something.", 
        meaningJP: "～の一部になる、当てはまる、収まる", 
        example: "Their entirely radical ideas completely didn't fit into our traditional plans.", 
        exampleJP: "彼らの全く過激なアイデアは、私たちの伝統的な計画には完全に当てはまらなかった（収まらなかった）。",
        vibes: ["Puzzle pieces connecting", "Matching a strict aesthetic", "Aligning perfectly"], 
        vibesJP: ["パズルのピースが繋がる", "厳格な美学に合わせる", "完璧に整列する"],
        storyline: "The massive, highly ambitious architectural design was utterly beautiful. However, the arrogant lead engineer coldly rejected it. 'It's incredibly pretty,' he said, 'but it simply doesn't seamlessly fit into our incredibly strict, low-budget parameters.'", 
        storylineJP: "巨大で非常に野心的な建築デザインは全くもって美しかった。しかし傲慢なチーフエンジニアはそれを冷酷に却下した。「信じられないほど綺麗だが」と彼は言った。「我々の信じられないほど厳格で低予算な条件には、どうしてもシームレスに当てはまらない（収まらない）のだ。」", 
        quiz: { question: "This highly strange piece of ancient evidence does not ___ the current scientific theory.", options: ["fit into", "flare up", "floor it"], correctIndex: 0, explanation: "to become part of." } 
      },
      { 
        pv: "Fit out / up", trope: "The Gear Check", cefr: "C1", icon: Package, 
        meaning: "To provide with necessary equipment, or to frame someone (make look guilty).", 
        meaningJP: "装備を整える、設備を備え付ける、（人を）無実の罪に陥れる", 
        example: "They perfectly fitted out the massive, expensive yacht for the grueling global race.", 
        exampleJP: "彼らは過酷な世界規模のレースのために、その巨大で高価なヨットの装備を完璧に整えた。",
        vibes: ["Arming up for a mission", "Setting up a trap", "Equipping a team"], 
        vibesJP: ["ミッションのために武装する", "罠を仕掛ける", "チームに装備を供給する"],
        storyline: "The elite, highly secret spy agency was preparing for an absolutely impossible mission. Before sending the fearless agents into the deeply hostile territory, the tech genius meticulously fitted them out with the most highly advanced, invisible gadgets.", 
        storylineJP: "エリートの極秘スパイ機関は、絶対に不可能なミッションの準備をしていた。恐れを知らないエージェントを深く敵対的な領土に送り込む前に、技術の天才は最も高度で目に見えないガジェットで彼らの装備を几帳面に整えた。", 
        quiz: { question: "The corrupt, entirely ruthless police dangerously ___ him ___ for a crime he didn't commit.", options: ["fitted / up", "fended / off", "folded / up"], correctIndex: 0, explanation: "to provide equipment or frame someone." } 
      },
      { 
        pv: "Fix up", trope: "The Event Planner", cefr: "B2", icon: Calendar, 
        meaning: "To make an arrangement, or repair something.", 
        meaningJP: "（会合などを）取り決める、手配する、修理する", 
        example: "He efficiently fixed up an important appointment for me to see a highly skilled specialist.", 
        exampleJP: "彼は私が非常に熟練した専門家に会えるよう、重要な予約を効率よく取り決めて（手配して）くれた。",
        vibes: ["Scheduling a meeting", "Organizing a blind date", "Making solid plans"], 
        vibesJP: ["会議のスケジュールを立てる", "ブラインドデートを企画する", "確固たる計画を立てる"],
        storyline: "Kaito knew his two absolutely deeply awkward best friends were completely, undeniably perfect for each other. Playing matchmaker, he secretly fixed up a highly romantic, incredibly fancy dinner reservation for them without telling either one.", 
        storylineJP: "海斗は、自分の絶対に深く不器用な親友二人が互いにとって完全に、否定できないほど完璧であることを知っていた。恋のキューピッドを気取って、彼は二人には内緒で、非常にロマンチックで信じられないほど豪華なディナーの予約を密かに手配した。", 
        quiz: { question: "The highly efficient secretary easily ___ a crucial meeting with the busy CEO.", options: ["fixed up", "flaked out", "flogged off"], correctIndex: 0, explanation: "to make an arrangement." } 
      },
      { 
        pv: "Fizzle out", trope: "The Disappointing End", cefr: "C1", icon: TrendingDown, 
        meaning: "To end in an unsuccessful or highly anticlimactic way.", 
        meaningJP: "立ち消えになる、尻すぼみに終わる", 
        example: "The massive campaign started well, but entirely fizzled out when they ran out of money.", 
        exampleJP: "その大規模なキャンペーンは順調に始まったが、資金が尽きると完全に立ち消えになった（尻すぼみに終わった）。",
        vibes: ["Losing momentum completely", "A terrible movie ending", "The hype dying fast"], 
        vibesJP: ["完全に勢いを失う", "ひどい映画の結末", "熱狂が急速に死ぬ"],
        storyline: "The massive, highly publicized protest started with thousands of incredibly angry, screaming people. But as the freezing rain brutally started to pour heavily, the intense energy completely died, and the entire movement utterly fizzled out by noon.", 
        storylineJP: "大規模で大々的に報道された抗議活動は、何千人もの信じられないほど怒り叫ぶ人々で始まった。しかし凍えるような雨が残酷にも激しく降り始めると、強烈なエネルギーは完全に死に、その運動全体は正午までに完全に立ち消えになった（尻すぼみに終わった）。", 
        quiz: { question: "The incredibly exciting new tech startup completely ___ after only six short months.", options: ["fizzled out", "fleshed out", "flicked through"], correctIndex: 0, explanation: "to end unsuccessfully." } 
      },
      { 
        pv: "Flag down", trope: "The Desperate Passenger", cefr: "B2", icon: Activity, 
        meaning: "To signal at a vehicle to get it to stop.", 
        meaningJP: "（車などを）合図して止める", 
        example: "The police officer aggressively flagged the speeding car down because it didn't have its headlights on.", 
        exampleJP: "その警察官は、スピード違反の車がヘッドライトをつけていなかったため、アグレッシブに合図して止めた。",
        vibes: ["Waving for a taxi", "Emergency stops", "Standing in the rain"], 
        vibesJP: ["タクシーに手を振る", "緊急停車", "雨の中に立つ"],
        storyline: "The old, rusty van completely broke down in the middle of the terrifyingly dark, totally empty desert road. Panicking and entirely out of water, Sora desperately jumped and waved his bright red jacket, fiercely trying to flag down a passing truck.", 
        storylineJP: "古く錆びたバンが、恐ろしく暗く完全に空っぽの砂漠の道の真ん中で完全に故障した。パニックになり水も完全に尽きたソラは、必死にジャンプして真っ赤なジャケットを振り回し、通りすがりのトラックをどうにか合図して止めようと激しく試みた。", 
        quiz: { question: "The terrified, soaked hiker managed to successfully ___ a massive rescue helicopter.", options: ["flag down", "flip out", "fold up"], correctIndex: 0, explanation: "to signal a vehicle to stop." } 
      },
      { 
        pv: "Flag up", trope: "The Crucial Warning", cefr: "C1", icon: AlertTriangle, 
        meaning: "To raise an issue, or deeply highlight its utmost importance.", 
        meaningJP: "（問題として）指摘する、注意を喚起する", 
        example: "We absolutely should flag up these terrible working conditions at the vital meeting.", 
        exampleJP: "私たちは極めて重要な会議で、このひどい労働条件を絶対に問題として指摘する（注意喚起する）べきだ。",
        vibes: ["Reporting a bug", "Raising a red flag", "Whistleblowing"], 
        vibesJP: ["バグを報告する", "危険信号を上げる", "内部告発"],
        storyline: "The junior engineer noticed a tiny, deeply hidden flaw in the bridge's massive design. Knowing it could collapse, she boldly flagged up the terrifying issue to the incredibly arrogant board of directors, utterly refusing to be silenced.", 
        storylineJP: "若手エンジニアは、橋の巨大な設計の中に深く隠された小さな欠陥に気づいた。崩落する可能性があると知っていた彼女は、完全に沈黙させられることを拒絶し、信じられないほど傲慢な取締役会にその恐ろしい問題を大胆に指摘した（注意喚起した）。", 
        quiz: { question: "The strict auditor completely ___ several highly suspicious errors in the financial report.", options: ["flagged up", "flaked out", "fleshed out"], correctIndex: 0, explanation: "to raise an issue or highlight." } 
      },
      { 
        pv: "Flake out", trope: "The Exhausted Sleep", cefr: "C1", icon: CloudOff, 
        meaning: "To fall asleep heavily from absolute exhaustion.", 
        meaningJP: "疲れ果てて眠りこける、バタンキューと寝る", 
        example: "I brutally worked till midnight then entirely flaked out on the hard floor.", 
        exampleJP: "深夜まで残酷に働き、その後硬い床の上で完全に疲れ果てて眠りこけた（バタンキューと寝た）。",
        vibes: ["Zero energy left", "Sleeping in your clothes", "Complete bodily shutdown"], 
        vibesJP: ["エネルギーがゼロ", "服を着たまま寝る", "完全な身体のシャットダウン"],
        storyline: "After a grueling, absolutely soul-crushing 16-hour shift at the busy hospital, Maki barely managed to unlock her front door. She didn't even make it to her warm bed; she just completely flaked out heavily on the living room rug.", 
        storylineJP: "忙しい病院での過酷で完全に魂を削るような16時間シフトの後、マキはどうにか玄関の鍵を開けた。彼女は温かいベッドにたどり着くことすらできず、リビングのラグの上で完全に疲れ果てて重く眠りこけた。", 
        quiz: { question: "Totally exhausted from the long mountain hike, he deeply ___ on the tiny sofa.", options: ["flaked out", "figured on", "followed up"], correctIndex: 0, explanation: "to fall asleep from exhaustion." } 
      },
      { 
        pv: "Flame out", trope: "The Spectacular Burnout", cefr: "C2", icon: XOctagon, 
        meaning: "To fail entirely, often spectacularly or publicly.", 
        meaningJP: "（派手に）失敗する、燃え尽きる", 
        example: "The incredibly hyped company totally flamed out in the massive global recession.", 
        exampleJP: "その信じられないほど話題になっていた企業は、大規模な世界的不況の中で完全に派手に失敗した（燃え尽きた）。",
        vibes: ["A sudden crash", "Failing after massive hype", "A disastrous ending"], 
        vibesJP: ["突然のクラッシュ", "大熱狂の後の失敗", "破滅的な結末"],
        storyline: "The visionary young CEO promised to utterly revolutionize the entire transportation industry. But after burning through an unbelievable three billion dollars in six months with zero results, the massive company completely flamed out, bankrupting everyone.", 
        storylineJP: "先見の明がある若いCEOは、交通産業全体を完全に革命すると約束した。しかし6ヶ月で信じられないほどの30億ドルを消費し結果がゼロだった後、巨大な会社は完全に派手に失敗し（燃え尽き）、全員を破産させた。", 
        quiz: { question: "Despite the endless, aggressive marketing, the highly expensive new product utterly ___.", options: ["flamed out", "flicked through", "folded up"], correctIndex: 0, explanation: "to fail." } 
      },
      { 
        pv: "Flare up", trope: "The Sudden Eruption", cefr: "C1", icon: Flame, 
        meaning: "When trouble, violence, or an illness suddenly appears or worsens.", 
        meaningJP: "（怒りや病気が）急に燃え上がる、再発する", 
        example: "The bitter argument violently flared up when he was incredibly rude to them.", 
        exampleJP: "彼が信じられないほど無礼な態度をとった時、その苦々しい口論は暴力的に急に燃え上がった。",
        vibes: ["Sudden intense anger", "Old injuries hurting", "A riot starting"], 
        vibesJP: ["突然の激しい怒り", "古傷が痛む", "暴動の始まり"],
        storyline: "The massive peace talks seemed to be going perfectly. But when one arrogant diplomat made a highly insulting, careless joke about the border, intense, utterly undeniable anger instantly flared up, completely destroying the negotiations.", 
        storylineJP: "大規模な和平交渉は完璧に進んでいるように見えた。しかし一人の傲慢な外交官が国境について非常に侮辱的で不注意なジョークを飛ばした時、強烈で全く否定できない怒りが瞬時に燃え上がり、交渉を完全に破壊した。", 
        quiz: { question: "My extremely painful, old back injury aggressively ___ whenever it gets highly cold.", options: ["flares up", "fleshes out", "folds up"], correctIndex: 0, explanation: "to suddenly appear or worsen." } 
      },
      { 
        pv: "Flesh out", trope: "The Detailed Planner", cefr: "C1", icon: PlusSquare, 
        meaning: "To add more incredibly deep details or information to a plan.", 
        meaningJP: "（計画やアイデアに）肉付けする、具体化する", 
        example: "The recent, massive government report fully fleshed out the tiny draft proposals.", 
        exampleJP: "最近の巨大な政府の報告書は、その小さな草案に完全に肉付けした（具体化した）。",
        vibes: ["Expanding an outline", "Adding rich details", "Building a master plan"], 
        vibesJP: ["アウトラインを広げる", "豊かな詳細を追加する", "マスタープランを構築する"],
        storyline: "Sora had a brilliantly wild, incredibly creative idea for a fantasy novel. But it was just a rough, messy sketch. He spent the entire snowy winter locked in his room, meticulously fleshing out the deeply complex characters and massive world.", 
        storylineJP: "ソラはファンタジー小説の、見事にワイルドで信じられないほどクリエイティブなアイデアを持っていた。しかしそれはただの荒く散らかったスケッチだった。彼は雪の降る冬の間ずっと部屋に閉じこもり、深く複雑なキャラクターと巨大な世界を几帳面に肉付けし（具体化し）た。", 
        quiz: { question: "The strict publisher asked the author to thoroughly ___ the entirely weak ending.", options: ["flesh out", "flog off", "freak out"], correctIndex: 0, explanation: "to add details." } 
      },
      { 
        pv: "Flick through", trope: "The Magazine Skimmer", cefr: "B2", icon: BookOpen, 
        meaning: "To look through something highly quickly, like a book or TV channels.", 
        meaningJP: "パラパラとめくって見る、ざっと目を通す", 
        example: "I casually flicked through the thick magazine and easily decided to buy it.", 
        exampleJP: "私はその分厚い雑誌を何気なくパラパラとめくって見て、簡単に買うことを決めた。",
        vibes: ["Skimming a heavy textbook", "Looking at pictures only", "Waiting room reading"], 
        vibesJP: ["重い教科書をざっと読む", "絵だけを見る", "待合室での読書"],
        storyline: "Waiting nervously in the terrifyingly quiet dentist's office, Kaito grabbed a completely outdated fashion magazine. He mindlessly flicked through the incredibly glossy pages, absolutely entirely not registering a single printed word.", 
        storylineJP: "恐ろしいほど静かな歯医者の待合室で緊張しながら待ち、海斗は完全に時代遅れのファッション雑誌を掴んだ。彼は信じられないほど光沢のあるページを何も考えずにパラパラとめくって見て、印刷された言葉を一つも絶対的に全く認識していなかった。", 
        quiz: { question: "I didn't thoroughly read the deeply complex report; I just quickly ___ it.", options: ["flicked through", "flew at", "folded up"], correctIndex: 0, explanation: "to look through quickly." } 
      },
      { 
        pv: "Flip off", trope: "The Road Rage", cefr: "C2", icon: Angry, 
        meaning: "To extend your middle finger as a highly rude gesture of absolute contempt.", 
        meaningJP: "中指を立てる", 
        example: "When the corrupt police were walking away, he wildly flipped them off.", 
        exampleJP: "腐敗した警察が立ち去る時、彼は荒々しく彼らに向かって中指を立てた。",
        vibes: ["Terrible road rage", "Disrespecting authority", "Starting a street fight"], 
        vibesJP: ["ひどいロードレイジ", "権威を軽視する", "ストリートファイトを始める"],
        storyline: "The incredibly aggressive sports car violently cut Leo off on the dangerous highway, nearly causing a fatal crash. Furious, Leo rolled down his window and fiercely flipped the arrogant driver off, screaming at the top of his lungs.", 
        storylineJP: "信じられないほどアグレッシブなスポーツカーが危険な高速道路でレオの前に暴力的に割り込み、あわや致命的な衝突事故を起こしかけた。激怒したレオは窓を開け、傲慢な運転手に激しく中指を立て、声を限りに叫んだ。", 
        quiz: { question: "The angry protester fearlessly ___ the heavily armored riot squad.", options: ["flipped off", "fobbed off", "focused on"], correctIndex: 0, explanation: "to extend the middle finger." } 
      },
      { 
        pv: "Flip out", trope: "The Rage Monster", cefr: "C1", icon: Zap, 
        meaning: "To become very excited and entirely lose emotional control (often with anger).", 
        meaningJP: "（怒りや興奮で）ブチ切れる、パニックになる", 
        example: "He completely flipped out when he miraculously won the impossible final.", 
        exampleJP: "奇跡的に不可能な決勝戦に勝った時、彼は完全にパニックになった（興奮でブチ切れた）。",
        vibes: ["Losing your absolute mind", "Screaming in joy or rage", "Zero emotional control"], 
        vibesJP: ["完全に正気を失う", "喜びや怒りで叫ぶ", "感情のコントロールがゼロ"],
        storyline: "Leo meticulously built a massive, incredibly fragile 5,000-piece Lego castle over three agonizing months. When his oblivious dog happily bounded in and completely smashed it to pieces, Leo absolutely flipped out, screaming at the sky.", 
        storylineJP: "レオは苦痛な3ヶ月をかけて、巨大で信じられないほどもろい5,000ピースのレゴの城を几帳面に作り上げた。彼の何も知らない犬が嬉しそうに飛び込んできてそれを完全に粉々に打ち砕いた時、レオは絶対にブチ切れ、空に向かって絶叫した。", 
        quiz: { question: "When she completely ruined his highly expensive laptop, he totally ___.", options: ["flipped out", "fleshed out", "followed up"], correctIndex: 0, explanation: "to lose control or become very excited." } 
      },
      { 
        pv: "Flog off", trope: "The Fire Sale", cefr: "C2", icon: DollarSign, 
        meaning: "To sell something incredibly cheaply to entirely get rid of it.", 
        meaningJP: "（不要なものを）安値で売り払う、たたき売る", 
        example: "The corrupt council flogged off the beautiful land cheaply to a rich developer.", 
        exampleJP: "その腐敗した議会は、美しい土地を裕福な開発業者に安値で売り払った（たたき売った）。",
        vibes: ["Garage sales", "Desperate for quick cash", "Getting rid of junk"], 
        vibesJP: ["ガレージセール", "早急な現金を切望する", "ガラクタを処分する"],
        storyline: "After his incredibly messy, highly dramatic divorce, Kaito entirely hated living in the massive house. Filled with chaotic anger, he ruthlessly flogged off all the expensive, antique furniture for virtually nothing just to entirely erase the painful memories.", 
        storylineJP: "信じられないほど散らかって非常にドラマチックな離婚の後、海斗はその巨大な家に住むことを完全に嫌悪した。カオスな怒りに満ち、彼は痛ましい記憶を完全に消し去るためだけに、すべての高価なアンティーク家具を実質タダ同然で容赦なくたたき売った。", 
        quiz: { question: "The desperate, bankrupt company aggressively ___ all its remaining valuable assets.", options: ["flogged off", "flaked out", "fended for"], correctIndex: 0, explanation: "to sell cheaply." } 
      },
      { 
        pv: "Floor it", trope: "The Getaway Driver", cefr: "C1", icon: Activity, 
        meaning: "To drive a vehicle as incredibly fast as absolute possible.", 
        meaningJP: "アクセルをベタ踏みする、猛スピードで走る", 
        example: "She fearlessly floored it when the terrifying police sirens suddenly arrived.", 
        exampleJP: "恐ろしい警察のサイレンが突然聞こえてきた時、彼女は恐れずにアクセルをベタ踏みした（猛スピードで走った）。",
        vibes: ["Action movie car chases", "Running from the cops", "Speeding on the highway"], 
        vibesJP: ["アクション映画のカーチェイス", "警察から逃げる", "高速道路でスピードを出す"],
        storyline: "The massive, terrifyingly loud bank alarm instantly blared into the quiet night. The robbers violently threw the heavy bags of stolen cash into the rusty van, screaming at the nervous getaway driver to absolutely floor it before the police appeared.", 
        storylineJP: "巨大で恐ろしくうるさい銀行の警報が瞬時に静かな夜に鳴り響いた。強盗たちは盗んだ現金の重い袋を錆びたバンに暴力的に放り込み、警察が現れる前にアクセルをベタ踏みしろと緊張した逃走車の運転手に絶叫した。", 
        quiz: { question: "Realizing he was completely late for the crucial wedding, he aggressively ___.", options: ["floored it", "fleshed it out", "flicked it through"], correctIndex: 0, explanation: "to drive very fast." } 
      },
      { 
        pv: "Flounce out", trope: "The Dramatic Exit", cefr: "C2", icon: LogOut, 
        meaning: "To leave a place highly angrily or in a wildly dramatic manner.", 
        meaningJP: "怒って（大げさに）出て行く", 
        example: "He childishly flounced out when the harsh press started heavily criticising him.", 
        exampleJP: "厳しいマスコミが彼を激しく批判し始めた時、彼は子供っぽく怒って（大げさに）出て行った。",
        vibes: ["Storming out like a diva", "Slamming doors", "Absolute theatrical rage"], 
        vibesJP: ["ディーバのように怒って飛び出す", "ドアをバタンと閉める", "絶対的な演劇的怒り"],
        storyline: "The highly arrogant, extremely demanding lead actress didn't get the exact flavor of premium sparkling water she specifically requested. Throwing her expensive script entirely across the room, she dramatically flounced out of the busy studio, halting all production.", 
        storylineJP: "非常に傲慢で極めて要求の多い主演女優は、彼女が特別に要求したまさにその味の高級炭酸水を手に入れられなかった。高価な台本を部屋の向こうに完全に放り投げ、彼女はドラマチックに怒って忙しいスタジオから出て行き、すべての制作を停止させた。", 
        quiz: { question: "Insulted by the totally unfair comment, the diva immediately ___ of the room.", options: ["flounced out", "folded up", "freaked out"], correctIndex: 0, explanation: "to leave angrily." } 
      }
    ],

    24: [
      { 
        pv: "Fluff up", trope: "The Perfect Pillow", cefr: "B2", icon: Wind, 
        meaning: "To shake or pat a cushion so that it beautifully fills with air.", 
        meaningJP: "（クッションなどを）ふんわりさせる、ふくらませる", 
        example: "He perfectly fluffed up the huge pillow before completely going to bed.", 
        exampleJP: "彼は完全にベッドに入る前に、巨大な枕を完璧にふんわりさせた。",
        vibes: ["Making the bed perfectly", "Luxury hotel service", "Cozy winter nights"], 
        vibesJP: ["ベッドを完璧に整える", "高級ホテルのサービス", "居心地の良い冬の夜"],
        storyline: "Mika had spent a terrifyingly exhausting 14 hours entirely on her feet. Returning to her pristine apartment, she carefully fluffed up her massive, incredibly soft feather pillows, preparing to sink into absolute, undeniable heaven.", 
        storylineJP: "ミカは恐ろしく疲労困憊する14時間を完全に立ちっぱなしで過ごした。清潔なアパートに戻り、彼女は絶対的で否定できない天国に沈み込む準備をしながら、巨大で信じられないほど柔らかい羽毛枕を慎重にふんわりとさせた。", 
        quiz: { question: "The elegant hotel maid gently ___ the incredibly soft pillows on the grand bed.", options: ["fluffed up", "flogged off", "fleshed out"], correctIndex: 0, explanation: "to shake to fill with air." } 
      },
      { 
        pv: "Fly around", trope: "The Gossip Mill", cefr: "B2", icon: Wind, 
        meaning: "To circulate (rumors, stories, etc.).", 
        meaningJP: "（噂などが）飛び交う、広まる", 
        example: "There are a lot of absolutely wild stories flying around about her mysterious past.", 
        exampleJP: "彼女の謎めいた過去について、絶対的にワイルドな話（噂）がたくさん飛び交っている。",
        vibes: ["Spilling the tea", "Office gossip spreading", "Whispers in the hallway"], 
        vibesJP: ["秘密を漏らす（お茶をこぼす）", "オフィスのゴシップが広まる", "廊下でのささやき"],
        storyline: "When the incredibly strict, untouchable CEO suddenly resigned overnight, utterly chaotic, completely unverified rumors immediately started flying around the panicked office about a massive, secret scandal.", 
        storylineJP: "信じられないほど厳格でアンタッチャブルなCEOが一夜にして突然辞任した時、パニックに陥ったオフィスでは、大規模な秘密のスキャンダルに関する完全に未確認の全くカオスな噂が即座に飛び交い始めた。", 
        quiz: { question: "There have been a lot of highly strange rumors continuously ___ the busy school today.", options: ["flying around", "falling out", "fading away"], correctIndex: 0, explanation: "to circulate rumors." } 
      },
      { 
        pv: "Fly at", trope: "The Sudden Attack", cefr: "C1", icon: Angry, 
        meaning: "To attack, or severely criticise/shout incredibly angrily.", 
        meaningJP: "飛びかかる、激しく非難する", 
        example: "He viciously flew at them for entirely not trying hard enough.", 
        exampleJP: "彼は彼らが全く十分に努力していないとして、悪意を持って激しく非難した（飛びかかった）。",
        vibes: ["A vicious dog attacking", "A boss losing their temper", "Sudden verbal abuse"], 
        vibesJP: ["凶暴な犬の攻撃", "上司がキレる", "突然の言葉の暴力"],
        storyline: "The massive, highly sensitive project failed completely because of one lazy intern. The normally incredibly calm, quiet manager utterly lost his mind, completely flying at the terrified intern with a roar that shook the entire office floor.", 
        storylineJP: "その巨大で非常に機密性の高いプロジェクトは、一人の怠惰なインターンのせいで完全に失敗した。普段は信じられないほど穏やかで静かなマネージャーは完全に正気を失い、オフィスフロア全体を揺るがすような咆哮とともに、怯えるインターンに完全に激しく非難した（飛びかかった）。", 
        quiz: { question: "The vicious, incredibly angry guard dog fiercely ___ the completely unaware postman.", options: ["flew at", "fell behind", "fished for"], correctIndex: 0, explanation: "to attack." } 
      },
      { 
        pv: "Fly by", trope: "The Blinking Clock", cefr: "B1", icon: Clock, 
        meaning: "When time mysteriously appears to move incredibly quickly.", 
        meaningJP: "（時間が）あっという間に過ぎる", 
        example: "As I rapidly get older, the precious years just seem to entirely fly by.", 
        exampleJP: "急速に年をとるにつれ、貴重な年月はただ完全にあっという間に過ぎていくように思える。",
        vibes: ["Nostalgic realizations", "Having too much fun", "Wondering where the day went"], 
        vibesJP: ["ノスタルジックな気づき", "楽しみすぎる", "一日がどこへ行ったのか不思議に思う"],
        storyline: "They were completely utterly absorbed in playing their deeply favorite video game together. When Kaito finally checked the clock, he gasped in sheer shock. Ten full hours had miraculously flown by, and the bright sun was already rising.", 
        storylineJP: "彼らは深くお気に入りのビデオゲームを一緒にプレイすることに完全に全く没頭していた。海斗がついに時計を見た時、彼は純粋なショックで息を呑んだ。丸10時間が奇跡的にあっという間に過ぎており、明るい太陽がすでに昇っていたのだ。", 
        quiz: { question: "When you are genuinely having an absolutely amazing time, the long hours just ___.", options: ["fly by", "fall off", "fizzle out"], correctIndex: 0, explanation: "for time to move quickly." } 
      },
      { 
        pv: "Fly into", trope: "The Instant Rage", cefr: "B2", icon: Zap, 
        meaning: "To change your profound emotion utterly quickly, especially to extreme anger.", 
        meaningJP: "（急に怒りやパニックなどに）陥る、急変する", 
        example: "He instantly flew into an absolute, terrifying rage.", 
        exampleJP: "彼は瞬時に絶対的で恐ろしい怒りに急変した（陥った）。",
        vibes: ["Flipping the switch", "Unpredictable tempers", "A sudden explosion"], 
        vibesJP: ["スイッチが入る", "予測不可能な気性", "突然の爆発"],
        storyline: "The strict teacher was speaking completely calmly about the lovely weather. But the absolute second a student's phone loudly rang, she terrifyingly flew into a massive rage, entirely screaming and throwing the heavy chalk at the wall.", 
        storylineJP: "厳格な教師は素晴らしい天気について完全に穏やかに話していた。しかし生徒のスマホが大きく鳴った絶対的な瞬間、彼女は恐ろしいほど巨大な怒りに急変し（陥り）、完全に絶叫して重いチョークを壁に投げつけた。", 
        quiz: { question: "Upon seeing the highly disrespectful, completely ruined painting, the artist ___ a fury.", options: ["flew into", "folded up", "freaked out"], correctIndex: 0, explanation: "to change emotion quickly." } 
      },
      { 
        pv: "Fob off", trope: "The Shady Salesman", cefr: "C1", icon: Ghost, 
        meaning: "To deceive someone, or violently make someone accept a completely false excuse.", 
        meaningJP: "（嘘や言い訳で）ごまかす、騙す", 
        example: "He utterly fobbed us off with a really stupid, entirely unbelievable excuse.", 
        exampleJP: "彼は本当に馬鹿げた、全く信じられない言い訳で私たちを完全にごまかした（騙した）。",
        vibes: ["Dodging responsibility", "Lying to customers", "Selling fake items"], 
        vibesJP: ["責任を逃れる", "客に嘘をつく", "偽物を売る"],
        storyline: "The shiny new smartphone entirely broke after exactly one single day. When Sora angrily returned to the shady store, the arrogant clerk ruthlessly tried to fob him off by incredibly claiming Sora had held it completely wrong.", 
        storylineJP: "ピカピカの新しいスマホがきっかり1日で完全に壊れた。ソラが怒って胡散臭い店に戻ると、傲慢な店員は、ソラが完全に間違った持ち方をしたのだと信じられない主張をして、彼を容赦なくごまかそう（騙そう）とした。", 
        quiz: { question: "The totally corrupt politician cleverly ___ the angry journalists ___ with fake promises.", options: ["fobbed / off", "fronted / for", "fueled / up"], correctIndex: 0, explanation: "to deceive someone." } 
      },
      { 
        pv: "Focus on", trope: "The Laser Vision", cefr: "A2", icon: Eye, 
        meaning: "To concentrate absolutely intensely.", 
        meaningJP: "集中する、焦点を合わせる", 
        example: "The incredibly detailed report fully focuses on the massive company's weak points.", 
        exampleJP: "その信じられないほど詳細な報告書は、巨大企業の弱点に完全に焦点を当てている（集中している）。",
        vibes: ["Deep study sessions", "Ignoring all distractions", "Laser-like attention"], 
        vibesJP: ["深い勉強のセッション", "すべての気を散らすものを無視する", "レーザーのような注意力"],
        storyline: "The entire chaotic office was screaming, phones were endlessly ringing, and alarms blared. But Rin put on her noise-canceling headphones, stared directly at her glowing screen, and managed to flawlessly focus on completely writing her vital, game-changing code.", 
        storylineJP: "カオスなオフィス全体が叫び声を上げ、電話は果てしなく鳴り響き、警報が鳴っていた。しかしリンはノイズキャンセリングヘッドホンをつけ、光る画面を直接見つめ、極めて重要で形勢を逆転させるコードを完全に書き上げることに見事に集中した。", 
        quiz: { question: "You desperately need to entirely ___ the incredibly important task right in front of you.", options: ["focus on", "front for", "fold up"], correctIndex: 0, explanation: "to concentrate." } 
      },
      { 
        pv: "Fold up", trope: "The Origami Master", cefr: "B1", icon: Package, 
        meaning: "To make a sheet of paper or physical object smaller by meticulously folding.", 
        meaningJP: "折りたたむ", 
        example: "Darren carefully folded up the extremely secret letter and put it in a tiny envelope.", 
        exampleJP: "ダレンは極秘の手紙を慎重に折りたたみ、小さな封筒に入れた。",
        vibes: ["Packing away chairs", "Secret paper notes", "Neat organization"], 
        vibesJP: ["椅子を片付ける", "秘密の紙のメモ", "きちんとした整理整頓"],
        storyline: "The highly secret, completely illegal map was entirely too dangerous to carry openly. Sora meticulously folded it up into an incredibly tiny, unnoticeable square and slipped it deeply into the hidden lining of his heavy winter boot.", 
        storylineJP: "その非常に秘密で完全に違法な地図は、公然と持ち歩くにはあまりにも危険すぎた。ソラはそれを几帳面に折りたたんで信じられないほど小さく目立たない四角形にし、厚手の冬用ブーツの隠された裏地に深く滑り込ませた。", 
        quiz: { question: "Please carefully ___ the massive, complex map before you try to put it in your pocket.", options: ["fold up", "flesh out", "fire off"], correctIndex: 0, explanation: "to make smaller by folding." } 
      },
      { 
        pv: "Follow on", trope: "The Second Group", cefr: "B2", icon: Footprints, 
        meaning: "To leave to meet someone after they have already left the place you're at.", 
        meaningJP: "（先に行った人の）後を追う、後から行く", 
        example: "He completely left an hour ago and I'll definitively be following on very soon.", 
        exampleJP: "彼は完全に1時間前に出発した。私も絶対にもうすぐ後から行く（後を追う）よ。",
        vibes: ["Catching up to the party", "Walking behind", "Meeting up later"], 
        vibesJP: ["パーティーに追いつく", "後ろを歩く", "後で合流する"],
        storyline: "The main, highly enthusiastic group had already hiked up the massive, intimidating mountain at dawn. Ken, who had terribly overslept, texted them frantically. 'Don't completely wait for me! I'll follow on as soon as I finish this coffee!'", 
        storylineJP: "非常に熱狂的なメインのグループは、夜明けにすでに巨大で威圧的な山をハイキングし始めていた。ひどく寝坊したケンは彼らに狂ったようにメールを送った。「完全に俺を待たなくていいよ！このコーヒーを飲み終えたらすぐに後から行くから！」", 
        quiz: { question: "You guys confidently go inside the dark cinema first; I will safely ___ in five minutes.", options: ["follow on", "fall behind", "freak out"], correctIndex: 0, explanation: "to leave to meet someone later." } 
      },
      { 
        pv: "Follow through", trope: "The Closer", cefr: "C1", icon: Target, 
        meaning: "To do absolutely what is truly necessary to complete something or make it fully successful.", 
        meaningJP: "最後までやり通す、実行に移す", 
        example: "The massive project entirely went wrong when the lazy staff completely failed to follow through.", 
        exampleJP: "怠惰なスタッフが完全に最後までやり通す（実行に移す）ことに失敗した時、巨大なプロジェクトは完全に失敗に終わった。",
        vibes: ["Keeping promises", "Executing the final step", "Not giving up"], 
        vibesJP: ["約束を守る", "最終ステップを実行する", "諦めない"],
        storyline: "The arrogant politician made a hundred incredibly flashy, massive promises during his loud campaign. However, once he was actually elected, he entirely failed to follow through on a single one, completely betraying all the hopeful voters.", 
        storylineJP: "傲慢な政治家は、騒がしい選挙戦の間に100もの信じられないほど派手で大規模な約束をした。しかし実際に当選すると、彼はただの1つも最後まで実行に移さず、希望を抱いた有権者全員を完全に裏切った。", 
        quiz: { question: "It is absolutely crucial that you brilliantly ___ and completely finish the difficult plan.", options: ["follow through", "fend off", "filter out"], correctIndex: 0, explanation: "to complete something successfully." } 
      },
      { 
        pv: "Follow up", trope: "The Double Check", cefr: "B2", icon: Search, 
        meaning: "To comprehensively do something to check or improve an earlier vital action.", 
        meaningJP: "追跡調査する、さらに追及する、フォローする", 
        example: "He highly professionally followed up the intense meeting with a deeply detailed report.", 
        exampleJP: "彼は激しい会議の後、深く詳細な報告書で非常にプロフェッショナルにフォローした（追及した）。",
        vibes: ["Sending the 'just checking in' email", "Police investigations", "Being thorough"], 
        vibesJP: ["「確認だけです」というメールを送る", "警察の捜査", "徹底している"],
        storyline: "The brilliant detective interviewed the highly nervous suspect, but something entirely didn't feel right. The next morning, she ruthlessly followed up by secretly checking all his bank records, uncovering a massive, undeniable web of lies.", 
        storylineJP: "優秀な刑事は非常に緊張した容疑者に事情聴取したが、何かが全くしっくりこなかった。翌朝、彼女は密かに彼のすべての銀行記録をチェックして容赦なく追跡調査し、大規模で否定できない嘘の網を暴き出した。", 
        quiz: { question: "The dedicated doctor decided to carefully ___ on her fragile patient's slow recovery.", options: ["follow up", "fall back", "farm out"], correctIndex: 0, explanation: "to check or improve an earlier action." } 
      },
      { 
        pv: "Fool around", trope: "The Class Clowns", cefr: "B2", icon: Smile, 
        meaning: "To absolutely not be serious, or to be entirely unfaithful.", 
        meaningJP: "ふざける、浮気する", 
        example: "The strict teacher was deeply angry because the entire class were foolishly fooling around.", 
        exampleJP: "クラス全体が愚かにもふざけ回っていたため、厳格な教師は深く怒っていた。",
        vibes: ["Throwing paper airplanes", "Infidelity scandals", "Joking too much"], 
        vibesJP: ["紙飛行機を投げる", "不倫スキャンダル", "冗談を言いすぎる"],
        storyline: "The incredibly strict chemistry lab was an absolutely highly dangerous place. When Leo and Ken started wildly fooling around with the highly explosive chemicals, the furious teacher entirely kicked them out of the classroom forever.", 
        storylineJP: "信じられないほど厳格な化学の実験室は絶対的に非常に危険な場所だった。レオとケンが非常に爆発性の高い化学物質で激しくふざけ始めた時、激怒した教師は彼らを永久に教室から完全に追い出した。", 
        quiz: { question: "Please completely stop ___ with that highly dangerous, sharp equipment!", options: ["fooling around", "flying by", "fleshing out"], correctIndex: 0, explanation: "to not be serious." } 
      },
      { 
        pv: "Forge ahead", trope: "The Unstoppable Train", cefr: "C1", icon: Zap, 
        meaning: "To make a lot of massive progress in an incredibly short time, or move forwards quickly.", 
        meaningJP: "急速に前進する、どんどん進める", 
        example: "We've been unstoppably forging ahead with the massive work and should be finished well before the strict deadline.", 
        exampleJP: "私たちは止められないほど急速に巨大な仕事を前進させており、厳格な締め切りよりずっと前に終わるはずだ。",
        vibes: ["Crushing productivity", "Ignoring all obstacles", "Full steam ahead"], 
        vibesJP: ["圧倒的な生産性", "すべての障害を無視する", "全速前進"],
        storyline: "Despite the massive, utterly terrifying economic recession that completely destroyed their rivals, the innovative, tiny startup fearlessly forged ahead, incredibly launching three entirely revolutionary apps in a single year.", 
        storylineJP: "ライバルを完全に破壊した大規模で全く恐ろしい景気後退にもかかわらず、革新的で小さなスタートアップは恐れることなく急速に前進し、単一の年に完全に革命的なアプリを信じられないことに3つもリリースした。", 
        quiz: { question: "Despite the incredibly massive opposition, the bold leader decisively ___ with her brilliant plan.", options: ["forged ahead", "faded away", "fell apart"], correctIndex: 0, explanation: "to make progress quickly." } 
      },
      { 
        pv: "Freak out", trope: "The Panic Attack", cefr: "B2", icon: AlertTriangle, 
        meaning: "To become utterly disturbed, wildly anxious, or intensely angry.", 
        meaningJP: "パニックになる、ひどく取り乱す", 
        example: "She completely freaked out entirely when she tragically didn't get the perfect grades to get into university.", 
        exampleJP: "大学に入るための完璧な成績を悲劇的にも取れなかった時、彼女は完全にパニックになり（ひどく取り乱し）た。",
        vibes: ["Losing your mind", "Overwhelming anxiety", "Screaming in shock"], 
        vibesJP: ["正気を失う", "圧倒的な不安", "ショックで叫ぶ"],
        storyline: "Kaito was casually swimming in the deeply beautiful, dark blue ocean. Suddenly, something incredibly large and utterly slimy brushed entirely against his leg. He absolutely freaked out, screaming wildly and frantically swimming back to the safe shore.", 
        storylineJP: "海斗は深く美しい紺碧の海で呑気に泳いでいた。突然、信じられないほど大きく完全にぬるぬるした何かが彼の足に完全に触れた。彼は絶対にパニックになり、激しく叫びながら狂ったように安全な岸へと泳いで戻った。", 
        quiz: { question: "He totally ___ when he suddenly realized he entirely lost his extremely expensive phone.", options: ["freaked out", "fleshed out", "folded up"], correctIndex: 0, explanation: "to become disturbed or anxious." } 
      },
      { 
        pv: "Free up", trope: "The Schedule Clearer", cefr: "B2", icon: Clock, 
        meaning: "To definitively make money or precious time completely available by not using it elsewhere.", 
        meaningJP: "（時間や資金を）空ける、確保する", 
        example: "If we entirely get the grueling work done tonight, it will totally free up the weekend to go beautifully away.", 
        exampleJP: "今夜この過酷な仕事を完全に終わらせれば、週末に素晴らしく出かけるための時間を完全に確保できる（空けられる）。",
        vibes: ["Clearing the calendar", "Deleting old files", "Finding extra cash"], 
        vibesJP: ["カレンダーを空ける", "古いファイルを削除する", "余分な現金を見つける"],
        storyline: "Mika's computer was incredibly, agonizingly slow because the massive hard drive was totally full. She spent an absolutely exhausting night deleting thousands of old, blurry photos just to entirely free up enough precious space for her new software.", 
        storylineJP: "ミカのコンピュータは巨大なハードドライブが完全に一杯だったため、信じられないほど、苦痛なほど遅かった。彼女は新しいソフトウェアのために十分な貴重なスペースを完全に空ける（確保する）ためだけに、何千枚もの古くぼやけた写真を削除する絶対に疲労困憊する夜を過ごした。", 
        quiz: { question: "I canceled the completely useless, boring meeting to entirely ___ my busy afternoon.", options: ["free up", "fall for", "figure out"], correctIndex: 0, explanation: "to make available." } 
      },
      { 
        pv: "Freeze out", trope: "The Cold Shoulder", cefr: "C1", icon: XOctagon, 
        meaning: "To absolutely shut out or brutally exclude by deeply unfriendly treatment.", 
        meaningJP: "冷遇して追い出す、仲間外れにする", 
        example: "The toxic group cruelly tried to completely freeze me out of the important conversation.", 
        exampleJP: "その有毒なグループは残酷にも、私を重要な会話から完全に冷遇して締め出そう（仲間外れにしよう）とした。",
        vibes: ["Mean girls", "Toxic office politics", "The silent treatment"], 
        vibesJP: ["意地悪な女の子たち", "有毒な社内政治", "無視という仕打ち"],
        storyline: "When Maki refused to illegally lie on the massive corporate report, her completely corrupt colleagues entirely turned on her. They stopped sending her crucial emails and ruthlessly froze her out of all the highly important decisions.", 
        storylineJP: "マキが巨大な企業レポートで違法に嘘をつくことを拒否した時、完全に腐敗した同僚たちは完全に彼女に牙を剥いた。彼らは彼女に極めて重要なメールを送るのをやめ、非常に重要な決定のすべてから容赦なく彼女を冷遇して仲間外れにした。", 
        quiz: { question: "The cruel, popular clique deliberately tried to utterly ___ the completely new student.", options: ["freeze out", "freak out", "flick through"], correctIndex: 0, explanation: "to exclude by unfriendly treatment." } 
      },
      { 
        pv: "Freeze over", trope: "The Ice Age", cefr: "B2", icon: CloudOff, 
        meaning: "To become completely and solidly covered with thick ice (lake, river, pond, etc).", 
        meaningJP: "（湖や川が）完全に凍りつく", 
        example: "The brutal winter was intensely severe and the massive lake entirely froze over.", 
        exampleJP: "過酷な冬は強烈に厳しく、巨大な湖は完全に凍りついた。",
        vibes: ["Ice skating on a pond", "Bitterly cold winters", "A frozen wasteland"], 
        vibesJP: ["池でのアイススケート", "凍てつくほど寒い冬", "凍てついた荒れ地"],
        storyline: "The completely isolated, ancient village was terrified. The winter had arrived weeks incredibly early, and the massive, rushing river completely froze over overnight, destroying their only absolute chance to entirely sail away.", 
        storylineJP: "完全に孤立した古代の村は恐怖に怯えていた。冬が数週間も信じられないほど早く到来し、巨大な激流が一夜にして完全に凍りつき、彼らが完全に船で逃げる唯一の絶対的なチャンスを破壊した。", 
        quiz: { question: "The incredibly harsh, freezing temperatures caused the deep pond to entirely ___.", options: ["freeze over", "freshen up", "frighten off"], correctIndex: 0, explanation: "to become covered with ice." } 
      },
      { 
        pv: "Freeze up", trope: "The Paralyzing Fear", cefr: "C1", icon: Lock, 
        meaning: "To be entirely paralyzed with sheer fear, or for a machine to completely stop moving.", 
        meaningJP: "恐怖で固まる、（機械が）凍りついて動かなくなる", 
        example: "We entirely froze up when we shockingly heard the glass window aggressively break.", 
        exampleJP: "ガラス窓がアグレッシブに割れる音を衝撃的に聞いた時、私たちは完全に恐怖で固まった。",
        vibes: ["The blue screen of death", "Deer in headlights", "Absolute panic"], 
        vibesJP: ["死のブルースクリーン", "ヘッドライトにすくむ鹿", "絶対的なパニック"],
        storyline: "Mika had completely memorized her incredibly important, massive piano solo perfectly. But when she walked onto the brightly lit stage and saw three thousand staring eyes, she completely froze up, utterly unable to move a single finger.", 
        storylineJP: "ミカは非常に重要で巨大なピアノのソロを完璧に完全に暗記していた。しかし明るく照らされたステージに歩み出て、3000のじっと見つめる目を見た時、彼女は恐怖で完全に固まり、指一本全く動かすことができなかった。", 
        quiz: { question: "The deeply terrified, utterly shocked witness entirely ___ when the cruel suspect entered.", options: ["froze up", "folded up", "followed on"], correctIndex: 0, explanation: "to be paralyzed with fear." } 
      },
      { 
        pv: "Freshen up", trope: "The Quick Glow-Up", cefr: "B1", icon: Droplets, 
        meaning: "To wash extremely quickly and highly improve your overall appearance.", 
        meaningJP: "さっぱりする、身なりを整える", 
        example: "I'm hastily going to the clean bathroom to fully freshen up before they finally arrive.", 
        exampleJP: "彼らがついに到着する前に、私は完全に身なりを整える（さっぱりする）ために急いで清潔なトイレに行く。",
        vibes: ["Splashing water on your face", "Fixing makeup", "A quick reset"], 
        vibesJP: ["顔に水をかける", "メイクを直す", "素早いリセット"],
        storyline: "After the incredibly grueling, utterly exhausting 12-hour flight, Sora felt completely disgusting. Before meeting his highly important clients, he dashed into the tiny airport bathroom to aggressively splash cold water on his face and deeply freshen up.", 
        storylineJP: "信じられないほど過酷で全く疲労困憊する12時間のフライトの後、ソラは完全に最悪な気分だった。非常に重要なクライアントに会う前に、彼は小さな空港のトイレに駆け込み、アグレッシブに冷たい水を顔に浴びて深くさっぱりとした（身なりを整えた）。", 
        quiz: { question: "Please give me exactly five minutes to completely ___ after my terribly sweaty run.", options: ["freshen up", "fall apart", "forge ahead"], correctIndex: 0, explanation: "to wash quickly and improve appearance." } 
      },
      { 
        pv: "Frighten off", trope: "The Guard Dog", cefr: "B2", icon: AlertTriangle, 
        meaning: "To intensely scare someone so much that they completely run away.", 
        meaningJP: "怖がらせて追い払う", 
        example: "The incredibly vicious Doberman guard-dog successfully scared the sneaky burglars away.", 
        exampleJP: "信じられないほど凶暴なドーベルマンの番犬は、卑劣な強盗を見事に怖がらせて追い払った。",
        vibes: ["Intimidating completely", "Scaring away intruders", "Looking utterly terrifying"], 
        vibesJP: ["完全に威圧する", "侵入者を脅かして追い払う", "全く恐ろしく見える"],
        storyline: "The massive, heavily tattooed bouncer stood completely silently at the club entrance with his arms crossed. His absolutely terrifying, stone-cold glare was more than enough to instantly frighten off any incredibly drunk troublemakers.", 
        storylineJP: "巨大でがっつりタトゥーの入った用心棒は、腕を組んでクラブの入り口に完全に無言で立っていた。彼の絶対的に恐ろしい、石のように冷たい睨みは、信じられないほど酔っ払ったトラブルメーカーを瞬時に怖がらせて追い払うのに十分すぎるほどだった。", 
        quiz: { question: "The shockingly loud, highly aggressive alarm managed to successfully ___ the sneaky thieves.", options: ["frighten off", "fill out", "focus on"], correctIndex: 0, explanation: "to scare someone away." } 
      }
    ],
    
    25: [
      { 
        pv: "Front for", trope: "The Shadow Puppet", cefr: "C2", icon: Shield, 
        meaning: "To officially represent someone, especially when completely covering deeply illegal activities.", 
        meaningJP: "（悪事などの）隠れみのになる、表向きの顔になる", 
        example: "The highly suspicious, wealthy solicitor knowingly fronts for a vast number of cruel criminal gangs.", 
        exampleJP: "その非常に疑わしく裕福な弁護士は、膨大な数の残酷な犯罪ギャングの隠れみの（表向きの顔）に意図的になっている。",
        vibes: ["Mafia fronts", "Money laundering covers", "Secret syndicates"], 
        vibesJP: ["マフィアのフロント企業", "マネーロンダリングの隠れみの", "秘密のシンジケート"],
        storyline: "The tiny, incredibly quiet Italian restaurant never ever seemed to have any actual real customers, yet they claimed entirely massive, impossible profits. The brilliant detective soon realized the totally innocent-looking owner was actually heavily fronting for a deeply dangerous global syndicate.", 
        storylineJP: "その小さく信じられないほど静かなイタリアンレストランには、実際の客が全くいないように見えたが、彼らは完全に莫大で不可能な利益を主張していた。優秀な刑事はすぐに、完全に無実に見えるオーナーが、実は深く危険な世界的組織の強固な隠れみのになっていることに気づいた。", 
        quiz: { question: "The seemingly completely legitimate business is actually secretly ___ a massive criminal organization.", options: ["fronting for", "falling for", "feeding off"], correctIndex: 0, explanation: "to cover illegal activities." } 
      },
      { 
        pv: "Front out", trope: "The Unflinching Stare", cefr: "C2", icon: Eye, 
        meaning: "To confidently face up to someone and powerfully withstand intense criticism.", 
        meaningJP: "（非難や批判に）堂々と立ち向かう、平然と振る舞う", 
        example: "He aggressively accused her of terribly lying, but she absolutely flawlessly fronted him out.", 
        exampleJP: "彼は彼女がひどい嘘をついているとアグレッシブに非難したが、彼女は絶対的に完璧に彼に堂々と立ち向かった（平然と振る舞った）。",
        vibes: ["Never blinking first", "Handling absolute pressure", "A stoic defense"], 
        vibesJP: ["決して先に瞬きしない", "絶対的なプレッシャーに対処する", "禁欲的な防御"],
        storyline: "The hostile press ruthlessly bombarded the politician with incredibly brutal, extremely highly aggressive questions about the sudden massive scandal. Refusing to completely sweat or break eye contact, she completely fronted them out, coolly denying absolutely everything.", 
        storylineJP: "敵対的なマスコミは、突然の巨大なスキャンダルについて、信じられないほど残酷で極めてアグレッシブな質問で政治家を容赦なく猛攻撃した。完全に汗をかいたり目を逸らしたりすることを拒絶し、彼女は完全に堂々と立ち向かい、すべてを冷ややかに否定した。", 
        quiz: { question: "Despite the incredibly loud, entirely angry accusations, the CEO stoically ___ the furious crowd.", options: ["fronted out", "flipped off", "freaked out"], correctIndex: 0, explanation: "to withstand criticism." } 
      },
      { 
        pv: "Front up", trope: "The Brief Appearance", cefr: "C1", icon: User, 
        meaning: "To appear somewhere briefly, or advance cash for something.", 
        meaningJP: "（少しだけ）顔を出す、前払いする", 
        example: "I absolutely hate these deeply boring corporate occasions, but I'll briefly front up for the first quiet half.", 
        exampleJP: "私はこういう深く退屈な会社の行事が絶対に嫌いだが、最初の静かな半分だけ少し顔を出すつもりだ。",
        vibes: ["Making a quick cameo", "Paying upfront", "Doing the bare minimum"], 
        vibesJP: ["素早いカメオ出演", "前払いする", "最低限のことだけをする"],
        storyline: "Sora entirely utterly despised loud, crowded high-society parties, but his incredibly strict boss demanded he absolutely attend. 'Fine,' Sora muttered angrily. 'I'll completely front up for exactly twenty agonizing minutes to take a picture, then I'm immediately leaving.'", 
        storylineJP: "ソラはうるさく混み合った上流階級のパーティーを完全に全く軽蔑していたが、信じられないほど厳格な上司は彼に絶対に参加するよう要求した。「分かったよ」ソラは怒って呟いた。「きっかり20分の苦痛な間だけ完全に顔を出して写真を撮ったら、すぐに帰るからな。」", 
        quiz: { question: "She didn't want to entirely stay, so she just quickly ___ to drop off the massive gift.", options: ["fronted up", "flew at", "fueled up"], correctIndex: 0, explanation: "to appear somewhere for a short time." } 
      },
      { 
        pv: "Frown on / upon", trope: "The Strict Judge", cefr: "B2", icon: Angry, 
        meaning: "To entirely disapprove of something heavily.", 
        meaningJP: "難色を示す、快く思わない", 
        example: "The deeply conservative CEO highly firmly frowns on any staff members making personal phone calls at work.", 
        exampleJP: "深く保守的なCEOは、スタッフが職場で私用の電話をかけることに非常に固く難色を示している。",
        vibes: ["Strict rules", "Traditional mindsets", "Disapproving glares"], 
        vibesJP: ["厳格なルール", "伝統的な考え方", "不満げな睨み"],
        storyline: "In the highly traditional, incredibly ancient village, entirely radically dying your hair bright neon blue was deeply considered an absolute, undeniable sin. The strict elders deeply frowned upon such deeply wild modern fashion, treating it like a terrible crime.", 
        storylineJP: "非常に伝統的で信じられないほど古代の村では、髪を鮮やかなネオンブルーに完全に過激に染めることは、絶対的で否定できない罪と深く考えられていた。厳格な長老たちはそのような深くワイルドな現代ファッションに深く難色を示し、それをひどい犯罪のように扱った。", 
        quiz: { question: "The extremely strict, terribly old-fashioned academy strongly ___ students wearing totally casual clothes.", options: ["frowns upon", "fronts for", "falls for"], correctIndex: 0, explanation: "to disapprove." } 
      },
      { 
        pv: "Fuel up", trope: "The Pit Stop", cefr: "B1", icon: Zap, 
        meaning: "To put petrol or other necessary fuel into a vehicle entirely.", 
        meaningJP: "燃料を補給する", 
        example: "We prudently stopped to completely fuel up before the heavy car utterly ran out.", 
        exampleJP: "重い車が完全にガス欠になる前に、私たちは慎重に車を止めて完全に燃料を補給した。",
        vibes: ["Gas station snacks", "Long road trips", "Filling the tank"], 
        vibesJP: ["ガソリンスタンドのスナック", "長いロードトリップ", "タンクを満タンにする"],
        storyline: "They were bravely embarking on a massive, highly epic cross-country road trip through the deeply terrifying, totally empty desert. 'Listen entirely to me,' Kaito warned strictly. 'We must completely fuel up at every single station, or we will utterly die out here.'", 
        storylineJP: "彼らは深く恐ろしく完全に空っぽの砂漠を抜ける、大規模で非常に壮大なクロスカントリーのロードトリップに勇敢に出発しようとしていた。「俺の言うことを完全に聞け」海斗は厳しく警告した。「すべてのガソリンスタンドで完全に燃料を補給しないと、俺たちはここで完全に死ぬぞ。」", 
        quiz: { question: "Before confidently entering the incredibly vast, absolutely empty desert, you must completely ___.", options: ["fuel up", "flake out", "flare up"], correctIndex: 0, explanation: "to put fuel into a vehicle." } 
      },
      { 
        pv: "Gad around", trope: "The Weekend Wanderer", cefr: "C1", icon: Footprints, 
        meaning: "To casually visit completely different places entirely for sheer pleasure.", 
        meaningJP: "あちこち遊び回る、気ままに遊び歩く", 
        example: "I enthusiastically spent the entire bright afternoon just carelessly gadding about in the lively West End.", 
        exampleJP: "私は熱狂的に、明るい午後を丸ごと活気あるウェストエンドでただ無頓着にあちこち遊び回って過ごした。",
        vibes: ["Window shopping", "Lazy Sunday strolls", "Exploring the city"], 
        vibesJP: ["ウィンドウショッピング", "怠惰な日曜の散歩", "街を探索する"],
        storyline: "After completely finishing her massive, totally exhausting final exams, Mika spent the entire bright, beautifully sunny weekend simply gadding around the trendy downtown boutiques with absolutely zero strict plans or deep worries.", 
        storylineJP: "巨大で完全に疲れ果てる期末試験を完全に終えた後、ミカは明るく見事に晴れた週末を丸ごと、全く何の厳格な計画も深い心配事もなく、トレンディなダウンタウンのブティックをただあちこち気ままに遊び回って過ごした。", 
        quiz: { question: "I have absolutely no massive responsibilities today, so I'm just going to safely ___ the beautiful city.", options: ["gad around", "get down", "give in"], correctIndex: 0, explanation: "to visit different places for pleasure." } 
      },
      { 
        pv: "Gag for", trope: "The Utter Thirst", cefr: "C2", icon: Droplets, 
        meaning: "To extremely desperately want something a lot.", 
        meaningJP: "～が喉から手が出るほど欲しい、～したくてたまらない", 
        example: "I'm absolutely totally gagging for a freezing cold drink right now.", 
        exampleJP: "今、凍えるほど冷たい飲み物が絶対に完全に喉から手が出るほど欲しい。",
        vibes: ["Dying for a coffee", "Intense cravings", "Extreme thirst"], 
        vibesJP: ["コーヒーが死ぬほど欲しい", "強烈な渇望", "極度の喉の渇き"],
        storyline: "After running an utterly grueling, incredibly brutal ten-mile marathon in the completely scorching, blazing summer heat, Sora completely collapsed heavily onto the dry grass. 'I am literally entirely gagging for an ice-cold sports drink,' he gasped weakly.", 
        storylineJP: "完全に焼け付くような燃えるような夏の暑さの中、全く過酷で信じられないほど残酷な10マイルのマラソンを走った後、ソラは乾いた芝生の上に完全に重く崩れ落ちた。「文字通り氷のように冷たいスポーツドリンクが完全に喉から手が出るほど欲しいよ」と彼は弱々しく息を切らした。", 
        quiz: { question: "After the incredibly long, deeply exhausting hike, I am entirely ___ a hot shower.", options: ["gagging for", "gadding around", "gearing up"], correctIndex: 0, explanation: "to want something a lot." } 
      },
      { 
        pv: "Gang up on", trope: "The Bully Squad", cefr: "B2", icon: Users, 
        meaning: "To severely harass, heavily bully, or totally attack someone in a united group.", 
        meaningJP: "（集団で）よってたかっていじめる、攻撃する", 
        example: "They cruelly ganged up on him entirely because of the utterly strange way he spoke.", 
        exampleJP: "彼の全く奇妙な話し方のせいで、彼らは完全に彼をよってたかって残酷にいじめた。",
        vibes: ["Toxic schoolyards", "Online mob mentality", "Unfair fights"], 
        vibesJP: ["有毒な校庭", "オンラインの群集心理", "不公平な戦い"],
        storyline: "The highly toxic group of incredibly popular girls entirely hated Maki simply because she was far much smarter. They cruelly, aggressively ganged up on her every single day, relentlessly leaving utterly mean, terrible notes on her tiny desk.", 
        storylineJP: "非常に人気のある女子たちの極めて有毒なグループは、マキがはるかに賢いという理由だけで彼女を完全に嫌悪していた。彼女たちは毎日残酷かつアグレッシブによってたかって彼女をいじめ、彼女の小さな机に完全に意地悪でひどいメモを容赦なく残した。", 
        quiz: { question: "It is incredibly cowardly to maliciously ___ one single, totally defenseless person.", options: ["gang up on", "get across", "go along with"], correctIndex: 0, explanation: "to harass as a group." } 
      },
      { 
        pv: "Gear towards", trope: "The Target Audience", cefr: "C1", icon: Target, 
        meaning: "To brilliantly organise or arrange something entirely for a highly particular purpose or audience.", 
        meaningJP: "～に向けて調整する、～向けにする", 
        example: "The massive, highly ambitious project is specifically entirely geared towards older, retired people.", 
        exampleJP: "その巨大で非常に野心的なプロジェクトは、特別に完全に高齢の退職者に向けて調整されている。",
        vibes: ["Marketing strategies", "Customizing content", "Targeted ads"], 
        vibesJP: ["マーケティング戦略", "コンテンツのカスタマイズ", "ターゲット広告"],
        storyline: "The totally brilliant software developers completely redesigned their highly confusing app. Instead of utterly confusing tech jargon, they entirely geared the new, incredibly simple interface purely towards absolute beginners who had zero coding experience.", 
        storylineJP: "全くもって優秀なソフトウェア開発者たちは、非常に分かりにくいアプリを完全に再設計した。全く混乱する専門用語の代わりに、彼らはその新しく信じられないほどシンプルなインターフェースを、コーディング経験がゼロの完全な初心者に向けて純粋に完全に調整した。", 
        quiz: { question: "This highly complex, incredibly advanced textbook is strictly ___ university-level students.", options: ["geared towards", "gotten round to", "given up on"], correctIndex: 0, explanation: "to organize for a specific audience." } 
      },
      { 
        pv: "Gear up", trope: "The Pre-Game Prep", cefr: "B2", icon: Settings, 
        meaning: "To deeply get completely ready for a highly busy period or massive event.", 
        meaningJP: "準備を整える、態勢を整える", 
        example: "The massive shops are aggressively gearing up for the incredibly chaotic New Year sales.", 
        exampleJP: "巨大な店舗は、信じられないほどカオスな新年のセールのためにアグレッシブに態勢を整えている。",
        vibes: ["Training montages", "Pre-launch panic", "Getting the team ready"], 
        vibesJP: ["トレーニングのモンタージュ", "発売前のパニック", "チームの準備を整える"],
        storyline: "The highly anticipated, massively important global product launch was only a deeply terrifying three days away. The completely exhausted marketing team aggressively geared up, frantically drinking gallons of incredibly strong coffee to miraculously survive the final, brutal stretch.", 
        storylineJP: "待ちに待った、極めて重要な世界規模の製品リリースまで、深く恐ろしいことにあとわずか3日だった。完全に疲れ切ったマーケティングチームはアグレッシブに態勢を整え、過酷なラストスパートを奇跡的に生き延びるために信じられないほど濃いコーヒーを狂ったように大量に飲んだ。", 
        quiz: { question: "The deeply dedicated athletes are fiercely ___ for the highly demanding championship.", options: ["gearing up", "giving in", "going down"], correctIndex: 0, explanation: "to get ready for an event." } 
      },
      { 
        pv: "Geek out", trope: "The Nerd Flex", cefr: "B2", icon: Cpu, 
        meaning: "To enthusiastically talk at incredible length about a highly niche, entirely specific topic.", 
        meaningJP: "（オタクのように）熱く語る、マニアックな話で盛り上がる", 
        example: "Henry always totally geeks out at parties and absolutely bores all the people who completely don't know much about specific computers.", 
        exampleJP: "ヘンリーはいつもパーティーで完全にマニアックな話で熱く語り、特定のコンピューターについて全く詳しくない人々を絶対的に退屈させる。",
        vibes: ["Talking about lore", "Explaining complex specs", "Nerd passion"], 
        vibesJP: ["設定（ロア）について語る", "複雑なスペックを説明する", "オタクの情熱"],
        storyline: "When the brand new, incredibly advanced graphics card was finally officially announced, Sora entirely lost his absolute mind. He completely geeked out for three solid hours on the massive group chat, extensively explaining utterly complex frame rates to his deeply confused friends.", 
        storylineJP: "真新しく信じられないほど高度なグラフィックカードがついに正式に発表された時、ソラは完全に正気を失った。彼は巨大なグループチャットで丸3時間完全にマニアックな話で熱く語り、深く混乱している友人たちに全く複雑なフレームレートを徹底的に説明した。", 
        quiz: { question: "Whenever the highly specific topic of vintage comic books completely comes up, he inevitably ___.", options: ["geeks out", "gets away", "gives up"], correctIndex: 0, explanation: "to talk enthusiastically about a niche topic." } 
      },
      { 
        pv: "Get about", trope: "The Social Butterfly", cefr: "B2", icon: Users, 
        meaning: "To widely visit many places, intensely walk around, or for shocking news to become incredibly known.", 
        meaningJP: "動き回る、あちこち飛び回る、（噂が）広まる", 
        example: "It definitely didn't take long for the massive, highly shocking news to get about—everyone is entirely talking about it.", 
        exampleJP: "その巨大で非常に衝撃的なニュースが広まるのに間違いなく時間はかからなかった。誰もが完全にその話をしている。",
        vibes: ["Traveling the world", "Gossip spreading fast", "Being highly active"], 
        vibesJP: ["世界を旅する", "ゴシップが早く広まる", "非常にアクティブである"],
        storyline: "Despite being an incredibly fragile, totally ancient ninety years old, Sora's highly energetic grandfather entirely refused to just miserably sit at home. He incredibly got about the extremely busy city every single day, loudly visiting absolutely all of his old, grumpy friends.", 
        storylineJP: "信じられないほどもろく完全に古代の90歳であるにもかかわらず、ソラの非常にエネルギッシュな祖父は、ただ惨めに家に座っていることを完全に拒否した。彼は毎日信じられないほど忙しい街をあちこち動き回り、不機嫌な古い友人たちを全員大声で訪ね歩いた。", 
        quiz: { question: "The utterly scandalous, highly juicy rumor incredibly managed to quickly ___ the entire quiet office.", options: ["get about", "give in", "go under"], correctIndex: 0, explanation: "to visit places or become known." } 
      },
      { 
        pv: "Get across", trope: "The Communication Struggle", cefr: "B2", icon: MessageCircle, 
        meaning: "To highly successfully communicate, or to totally move from one distinct side to another.", 
        meaningJP: "（考えなどを）理解させる、伝える、渡る", 
        example: "I genuinely just utterly couldn't get my extremely important message across at the incredibly loud meeting.", 
        exampleJP: "信じられないほどうるさい会議で、私の極めて重要なメッセージを全く理解させ（伝え）られなかった。",
        vibes: ["Language barriers", "Explaining hard concepts", "Finally being understood"], 
        vibesJP: ["言葉の壁", "難しい概念を説明する", "ついに理解される"],
        storyline: "The highly brilliant, totally eccentric scientist had an absolutely revolutionary idea to completely save the entire planet. But she was terribly awkward and entirely failed to get her deeply complex theory across to the profoundly stupid, utterly impatient politicians.", 
        storylineJP: "非常に優秀で完全に風変わりな科学者は、惑星全体を完全に救う絶対的に革命的なアイデアを持っていた。しかし彼女はひどく不器用で、その深く複雑な理論を、全くもって愚かで全く短気な政治家たちに理解させる（伝える）ことに完全に失敗した。", 
        quiz: { question: "He incredibly used highly simple, colorful diagrams to clearly ___ his deeply complex point.", options: ["get across", "get along", "get over"], correctIndex: 0, explanation: "to communicate successfully." } 
      },
      { 
        pv: "Get after", trope: "The Taskmaster", cefr: "B2", icon: AlertCircle, 
        meaning: "To heavily nag or intensely exhort someone, or to aggressively chase.", 
        meaningJP: "（人に）うるさく言う、急かす、追跡する", 
        example: "You absolutely should aggressively get after them to finally finish the completely delayed work.", 
        exampleJP: "完全に遅れている仕事を最終的に終わらせるために、絶対に彼らにアグレッシブにうるさく急かすべきだ。",
        vibes: ["A nagging boss", "Police chases", "Keeping the team on track"], 
        vibesJP: ["口うるさい上司", "警察の追跡", "チームを軌道に乗せる"],
        storyline: "The utterly massive, incredibly vital project was totally completely falling behind. The highly furious manager realized the junior team was just entirely faffing around, so she aggressively got after them, completely demanding totally immediate, perfect results before noon.", 
        storylineJP: "全く巨大で信じられないほど極めて重要なプロジェクトは完全に遅れをとっていた。非常に激怒したマネージャーは若手チームがただ完全にダラダラしていることに気づき、正午までに完全に即時で完璧な結果を完全に要求して、彼らにアグレッシブにうるさく急かした。", 
        quiz: { question: "If the entirely lazy workers stop completely, you must fiercely ___ them to work.", options: ["get after", "gad around", "give in"], correctIndex: 0, explanation: "to nag or chase." } 
      },
      { 
        pv: "Get ahead", trope: "The Corporate Climber", cefr: "B2", icon: TrendingUp, 
        meaning: "To massively progress, or to utterly move in front of.", 
        meaningJP: "出世する、成功する、前に出る", 
        example: "Nowadays, you definitely deeply need highly advanced IT skills if you truly want to absolutely get ahead.", 
        exampleJP: "今日では、もし本当に絶対に出世したい（成功したい）なら、非常に高度なITスキルが間違いなく深く必要だ。",
        vibes: ["Hustling hard", "Climbing the ladder", "Outperforming rivals"], 
        vibesJP: ["一生懸命ハッスルする", "出世の階段を登る", "ライバルを凌駕する"],
        storyline: "Mika was utterly determined to wildly succeed. While her deeply lazy colleagues completely slacked off every single evening, she stayed incredibly late, fiercely studying absolutely complex market trends, desperately fighting to completely get ahead in the highly ruthless firm.", 
        storylineJP: "ミカは熱狂的に成功することを完全に決意していた。深く怠惰な同僚たちが毎晩完全にサボっている間、彼女は信じられないほど遅くまで残り、絶対に複雑な市場動向を激しく勉強し、非常に冷酷な企業で完全に出世するために必死に戦った。", 
        quiz: { question: "If you utterly refuse to actively work extremely hard, you will never realistically ___.", options: ["get ahead", "get by", "give up"], correctIndex: 0, explanation: "to progress." } 
      },
      { 
        pv: "Get along", trope: "The Smooth Harmony", cefr: "A2", icon: Heart, 
        meaning: "To have a deeply good relationship, miraculously progress, or to finally leave.", 
        meaningJP: "仲良くやっていく、進展する、立ち去る", 
        example: "Why don't you two entirely get along? You're absolutely always bitterly arguing.", 
        exampleJP: "どうして君たち二人は全く仲良くやっていけないんだ？絶対いつも苦々しく口論しているじゃないか。",
        vibes: ["Best friends", "A peaceful workplace", "Saying goodbye"], 
        vibesJP: ["親友", "平和な職場", "別れを告げる"],
        storyline: "They were entirely polar opposites. Kaito was wildly loud and incredibly chaotic, while Ken was utterly silent and deeply organized. Yet, incredibly, they managed to get along absolutely perfectly, completely balancing each other's massive, terrible flaws out.", 
        storylineJP: "彼らは完全に対極だった。海斗は熱狂的にうるさく信じられないほどカオスで、ケンは全く無口で深く几帳面だった。しかし信じられないことに、彼らは互いの巨大でひどい欠点を完全に補い合い、絶対的に完璧に仲良くやっていくことができた。", 
        quiz: { question: "Despite their incredibly massive, deep differences, the two completely strange roommates wonderfully ___.", options: ["get along", "give in", "go off"], correctIndex: 0, explanation: "to have a good relationship." } 
      },
      { 
        pv: "Get around", trope: "The Expert Dodger", cefr: "B2", icon: Wind, 
        meaning: "To completely avoid a problem, brilliantly become known, or successfully persuade someone.", 
        meaningJP: "（問題を）うまく避ける、広まる、（人を）説得する", 
        example: "It'll be incredibly tricky, but we will definitely find a deeply clever way to get around the highly strict regulations.", 
        exampleJP: "信じられないほど厄介だろうが、その非常に厳格な規制をうまく避ける深く賢い方法を間違いなく見つけるだろう。",
        vibes: ["Finding a loophole", "Persuading the boss", "Rumors flying"], 
        vibesJP: ["抜け穴を見つける", "上司を説得する", "噂が飛び交う"],
        storyline: "The utterly massive, incredibly heavy steel security door completely blocked their path. The highly nervous rookie panicked, but the veteran thief simply grinned widely. 'Don't worry,' she whispered. 'I know a highly secret, incredibly sneaky way to easily get around the entire alarm system.'", 
        storylineJP: "全くもって巨大で信じられないほど重い鋼鉄のセキュリティドアが彼らの道を完全に塞いでいた。非常に緊張した新人はパニックになったが、ベテランの泥棒はただ大きくニヤリと笑った。「心配しないで」と彼女は囁いた。「警報システム全体を簡単にうまく避ける、非常に秘密で信じられないほど卑劣な方法を知ってるわ。」", 
        quiz: { question: "The highly clever lawyer easily managed to entirely ___ the utterly massive legal issue.", options: ["get around", "get across", "give away"], correctIndex: 0, explanation: "to avoid a problem." } 
      },
      { 
        pv: "Get at", trope: "The Hidden Meaning", cefr: "B2", icon: HelpCircle, 
        meaning: "To strongly mean or try to say something (usually totally indirectly), or to heavily criticize.", 
        meaningJP: "～を言おうとする、非難する、手が届く", 
        example: "What exactly do you think she's truly getting at? I've absolutely no idea what she truly, deeply wants.", 
        exampleJP: "彼女が本当に何を言おうとしていると正確には思う？彼女が本当に深く何を望んでいるのか、私には絶対に見当もつかない。",
        vibes: ["Cryptic messages", "Bosses nagging", "Trying to understand"], 
        vibesJP: ["不可解なメッセージ", "口うるさい上司", "理解しようとする"],
        storyline: "The totally arrogant director spoke in incredibly long, highly confusing, deeply metaphorical, entirely pointless riddles for a full hour. Completely utterly exhausted, Sora finally aggressively snapped. 'Please, just entirely stop talking in endless circles! What exactly are you actually getting at?!'", 
        storylineJP: "完全に傲慢なディレクターは、丸1時間、信じられないほど長く非常に混乱する、深く比喩的で完全に無意味な謎掛けで話した。完全に全く疲れ切ったソラはついにアグレッシブにキレた。「お願いだから、終わりのない回りくどい話し方を完全にやめてください！一体何を実際に言おうとしてるんですか？！」", 
        quiz: { question: "I entirely do not comprehend the incredibly complex point you are constantly ___.", options: ["getting at", "giving off", "going over"], correctIndex: 0, explanation: "to mean or try to say." } 
      },
      { 
        pv: "Get away", trope: "The Great Escape", cefr: "A2", icon: Map, 
        meaning: "To highly successfully escape, or go on an amazing holiday/for a short break.", 
        meaningJP: "逃げる、休暇をとる", 
        example: "We absolutely desperately love to completely get away from everything and totally relax in the quiet country.", 
        exampleJP: "私たちはすべてから完全に逃げ出し（休暇をとり）、静かな田舎で完全にリラックスすることを絶対に死に物狂いで愛している。",
        vibes: ["Fleeing the scene", "Tropical vacations", "Escaping the daily grind"], 
        vibesJP: ["現場から逃走する", "トロピカルな休暇", "日々の苦労から逃れる"],
        storyline: "The massive, incredibly loud, totally endless city noise had completely destroyed her frayed nerves. Utterly desperate for absolute silence, Mika deeply turned off her phone, hastily packed a tiny bag, and desperately got away to an incredibly remote, deeply peaceful mountain cabin.", 
        storylineJP: "巨大で信じられないほどうるさく、完全に終わりのない都会の騒音は彼女のすり減った神経を完全に破壊していた。絶対的な静寂を全くもって死に物狂いで求め、ミカはスマホの電源を深く切り、急いで小さなバッグに荷物を詰め、信じられないほど人里離れた深く平和な山小屋へと必死に休暇をとって逃避した。", 
        quiz: { question: "The incredibly sneaky, highly dangerous bank robbers flawlessly managed to ___.", options: ["get away", "get along", "give up"], correctIndex: 0, explanation: "to escape or go on holiday." } 
      },
      { 
        pv: "Get away with", trope: "The Smooth Criminal", cefr: "B2", icon: Ghost, 
        meaning: "To totally not get caught, criticised or completely punished for doing something totally wrong.", 
        meaningJP: "（悪事などを）やってのける、罰を逃れる", 
        example: "The utterly brazen, entirely fearless thieves got away with two incredibly priceless Picassos, which were never, ever found.", 
        exampleJP: "全く厚かましく完全に恐れを知らない泥棒たちは、信じられないほど貴重なピカソの絵を2点見事に盗み（やってのけ）、それは二度と発見されなかった。",
        vibes: ["Getting off scot-free", "Lying successfully", "Breaking the rules"], 
        vibesJP: ["無傷で逃れる", "見事に嘘をつく", "ルールを破る"],
        storyline: "Leo entirely totally forgot to write the massive, highly crucial 50-page final essay. In absolute pure terror and panic, he confidently submitted a highly corrupted, totally unreadable file. Incredibly, the completely utterly exhausted professor didn't thoroughly check, and Leo fully got away with his extremely brazen lie.", 
        storylineJP: "レオは巨大で極めて重要な50ページの最終エッセイを書くのを完全に全く忘れていた。絶対的な純粋な恐怖とパニックの中、彼は非常に破損した完全に読めないファイルを自信満々に提出した。信じられないことに、完全に全く疲れ切った教授は徹底的に確認せず、レオは彼の極めて厚かましい嘘を完全に見事にやってのけた（罰を逃れた）。", 
        quiz: { question: "I totally cannot believe he actually miraculously managed to ___ entirely cheating on the massive test.", options: ["get away with", "get back at", "give in to"], correctIndex: 0, explanation: "to escape punishment for doing wrong." } 
      }
    ],

    26: [
      { 
        pv: "Get away!", trope: "The Disbelieving Friend", cefr: "C2", icon: MessageCircle, 
        meaning: "An expression used to show that you do not believe what someone has just said.", 
        meaningJP: "まさか！、嘘でしょ！", 
        example: "'I passed the impossible exam.' 'Get away! You couldn't have passed.'", 
        exampleJP: "「あの不可能な試験に受かったんだ」「まさか！受かるわけないよ」",
        vibes: ["Pure shock", "Informal disbelief", "British slang vibes"], 
        vibesJP: ["純粋なショック", "カジュアルな不信感", "イギリス英語的な響き"],
        storyline: "Kaito told his friends he had just won the lottery. Leo looked at the crumpled ticket, laughed loudly, and shouted, 'Get away! You've been pranking us all day!'", 
        storylineJP: "海斗は宝くじに当たったと友人に話した。レオはくしゃくしゃのくじを見て大笑いし、「嘘だろ！一日中俺たちをからかってるな！」と叫んだ。", 
        quiz: { question: "'I just met a famous Hollywood star!' '___! They aren't even in the country.'", options: ["Get away", "Get along", "Get back"], correctIndex: 0, explanation: "an expression of disbelief." } 
      },
      { 
        pv: "Get back", trope: "The Return", cefr: "A2", icon: Undo2, 
        meaning: "To return to a place after being somewhere else.", 
        meaningJP: "戻る、帰宅する", 
        example: "The train was held up so we didn't get back home until midnight.", 
        exampleJP: "電車が遅れたので、真夜中まで家に帰れなかった。",
        vibes: ["Returning home", "Commuter delays", "Back to reality"], 
        vibesJP: ["帰宅", "通勤の遅延", "現実に戻る"],
        storyline: "After a magical weekend at the beach, Hina and Mika finally managed to get back to the city, feeling utterly exhausted but incredibly happy.", 
        storylineJP: "ビーチで魔法のような週末を過ごした後、ヒナとミカはようやく街に戻ってきた。疲れ果ててはいたが、信じられないほど幸せな気分だった。", 
        quiz: { question: "What exact time do you think you will ___ from your business trip?", options: ["get back", "get across", "get ahead"], correctIndex: 0, explanation: "to return to a place." } 
      },
      { 
        pv: "Get back at", trope: "The Sweet Revenge", cefr: "B2", icon: Zap, 
        meaning: "To take revenge on someone for something they have done to you.", 
        meaningJP: "仕返しする、復讐する", 
        example: "I'll get back at her for landing me in so much trouble.", 
        exampleJP: "私をあんなトラブルに巻き込んだんだから、彼女に仕返ししてやる。",
        vibes: ["Plotting revenge", "Score settling", "Petty drama"], 
        vibesJP: ["復讐を企む", "決着をつける", "些細なドラマ"],
        storyline: "Leo was furious because Ken had eaten his expensive dessert. He decided to get back at him by hiding Ken's favorite gaming controller for a whole week.", 
        storylineJP: "レオはケンが彼の高価なデザートを食べてしまったので激怒した。彼はケンの大好きなゲームコントローラーを一週間隠して仕返しすることに決めた。", 
        quiz: { question: "She spent months planning how to ___ the rival who stole her idea.", options: ["get back at", "get behind", "get by"], correctIndex: 0, explanation: "to take revenge." } 
      },
      { 
        pv: "Get back into", trope: "The Re-entry", cefr: "B1", icon: RefreshCw, 
        meaning: "To start doing something again after you have stopped for a period of time.", 
        meaningJP: "（習慣などを）再開する、再び熱中する", 
        example: "I lost interest for a while, but I'm slowly getting back into my piano lessons.", 
        exampleJP: "しばらく興味を失っていたが、ゆっくりとピアノのレッスンを再開している。",
        vibes: ["Restarting a hobby", "Post-break motivation", "Finding old passions"], 
        vibesJP: ["趣味の再開", "休み明けのモチベーション", "昔の情熱を取り戻す"],
        storyline: "After focusing on work all winter, Sora decided to get back into painting. He bought new brushes and felt a sudden burst of creative energy.", 
        storylineJP: "冬の間ずっと仕事に集中していたソラは、絵を描くことを再開することに決めた。彼は新しい筆を買い、創造的なエネルギーが突然湧いてくるのを感じた。", 
        quiz: { question: "I really need to ___ a healthy exercise routine after the long holiday.", options: ["get back into", "get along in", "get away from"], correctIndex: 0, explanation: "to start doing something again." } 
      },
      { 
        pv: "Get back to", trope: "The Follow-up", cefr: "B2", icon: MessageSquare, 
        meaning: "To contact someone later to give them information or respond to a message.", 
        meaningJP: "（後で）連絡し直す、返事をする", 
        example: "I'll get back to you as soon as I hear any news from the manager.", 
        exampleJP: "マネージャーからニュースを聞き次第、すぐに折り返し連絡します。",
        vibes: ["Professional courtesy", "Response pending", "Closing the loop"], 
        vibesJP: ["プロとしての礼儀", "返答待ち", "完結させる"],
        storyline: "Mika sent a frantic email to the support team. A few hours later, they promised to get back to her once they had thoroughly investigated the server crash.", 
        storylineJP: "ミカはサポートチームに必死のメールを送った。数時間後、サーバーのクラッシュを徹底的に調査した上で折り返し連絡すると返信があった。", 
        quiz: { question: "Please give me an hour to check the data, and I will ___ you.", options: ["get back to", "get around to", "get down to"], correctIndex: 0, explanation: "to contact someone later with an answer." } 
      },
      { 
        pv: "Get back together", trope: "The Second Chance", cefr: "B1", icon: Heart, 
        meaning: "To start a romantic relationship again with someone you were with before.", 
        meaningJP: "（恋人と）よりを戻す、復縁する", 
        example: "We split up a few months ago but finally got back together last week.", 
        exampleJP: "数ヶ月前に別れたけれど、先週ついに復縁した。",
        vibes: ["On-again, off-again", "Romantic reunions", "Forgiving the past"], 
        vibesJP: ["くっついたり離れたり", "ロマンチックな再会", "過去を許す"],
        storyline: "After a highly dramatic breakup that crushed their friends' hearts, Kaito and Rin realized they couldn't live apart and decided to get back together.", 
        storylineJP: "友人たちの心を痛めたドラマチックな破局の後、海斗とリンは離れてはいられないと気づき、よりを戻すことに決めた。", 
        quiz: { question: "The fans were incredibly happy to hear the famous couple had ___.", options: ["got back together", "got around to", "got along with"], correctIndex: 0, explanation: "to restart a relationship." } 
      },
      { 
        pv: "Get behind", trope: "The United Support", cefr: "B2", icon: Users, 
        meaning: "To support a person, team, or idea.", 
        meaningJP: "支持する、後押しする", 
        example: "All the students got behind the teacher when the principal tried to fire her.", 
        exampleJP: "校長が彼女を解雇しようとした時、生徒全員がその先生を支持した。",
        vibes: ["Team loyalty", "Political backing", "Standing together"], 
        vibesJP: ["チームへの忠誠", "政治的後押し", "団結"],
        storyline: "The student council proposed a wildly expensive festival. Surprisingly, the entire school got behind the idea, eager to have a massive party.", 
        storylineJP: "生徒会は非常に高額な学園祭を提案した。驚くべきことに、盛大なパーティーを熱望する全校生徒がそのアイデアを支持した。", 
        quiz: { question: "If we want this project to succeed, we all need to ___ the new strategy.", options: ["get behind", "get around", "get away"], correctIndex: 0, explanation: "to support someone or something." } 
      },
      { 
        pv: "Get behind with", trope: "The Overdue Bill", cefr: "C1", icon: Clock, 
        meaning: "To fail to make payments or finish work on time.", 
        meaningJP: "（支払いなどが）滞る、遅れる", 
        example: "If you get behind with mortgage payments, you might lose your home.", 
        exampleJP: "住宅ローンの支払いが滞ると、家を失うかもしれない。",
        vibes: ["Financial stress", "Mountain of work", "Playing catch-up"], 
        vibesJP: ["金銭的ストレス", "仕事の山", "遅れを取り戻す"],
        storyline: "Ken spent too much time gadding around in Tokyo and accidentally got behind with his university assignments, forcing him to stay awake for three days straight.", 
        storylineJP: "ケンは東京であちこち遊び回りすぎて、うっかり大学の課題が遅れてしまい、3日連続で起きている羽目になった。", 
        quiz: { question: "She was so busy traveling that she started to ___ her rent.", options: ["get behind with", "get in on", "get onto"], correctIndex: 0, explanation: "to fail to do something on time." } 
      },
      { 
        pv: "Get by", trope: "The Bare Minimum", cefr: "B1", icon: DollarSign, 
        meaning: "To have just enough money or resources to survive, or to not be noticed (of errors).", 
        meaningJP: "なんとかやっていく、切り抜ける、見逃される", 
        example: "They're finding it increasingly difficult to get by on such a tiny salary.", 
        exampleJP: "そんなわずかな給料でやっていくのは、ますます難しくなっていると感じている。",
        vibes: ["Minimalist survival", "Tight budgets", "Making do"], 
        vibesJP: ["最低限の生存", "厳しい予算", "間に合わせる"],
        storyline: "Mika's part-time job paid very little, but she managed to get by by strictly cutting back on expensive coffee and eating mostly ramen.", 
        storylineJP: "ミカのアルバイトの給料は非常に安かったが、高いコーヒーを厳しく切り詰め、主にラーメンを食べることでなんとかやっていくことができた。", 
        quiz: { question: "I don't need a fortune; I just want enough money to ___.", options: ["get by", "get along", "get across"], correctIndex: 0, explanation: "to manage with enough money to survive." } 
      },
      { 
        pv: "Get down", trope: "The Mood Sinker / Recording", cefr: "B2", icon: TrendingDown, 
        meaning: "To make someone feel depressed, or to write something down.", 
        meaningJP: "落ち込ませる、書き留める、降りる", 
        example: "The miserable winter weather really gets me down sometimes.", 
        exampleJP: "冬の惨めな天気のせいで、時々本当に落ち込んでしまう。",
        vibes: ["Seasonal blues", "Taking notes", "Heavy atmosphere"], 
        vibesJP: ["冬の憂鬱", "メモを取る", "重苦しい雰囲気"],
        storyline: "The constant criticism from his arrogant boss was starting to get Sora down, making him wonder if he should just chuck in his job entirely.", 
        storylineJP: "傲慢な上司からの絶え間ない批判がソラを落ち込ませ始めており、彼は仕事を完全に辞めてしまおうかと考え始めていた。", 
        quiz: { question: "Quick! ___ everything the witness says before they forget the details.", options: ["Get down", "Get after", "Get ahead"], correctIndex: 0, explanation: "to write something down." } 
      },
      { 
        pv: "Get down to", trope: "The Serious Start", cefr: "B2", icon: Zap, 
        meaning: "To finally start working on something seriously or give it your full attention.", 
        meaningJP: "（仕事などに）本腰を入れて取りかかる", 
        example: "I find it extremely difficult to get down to doing my revision for exams.", 
        exampleJP: "試験勉強に本腰を入れて取りかかるのは、非常に難しいと感じる。",
        vibes: ["Focus mode", "End of procrastination", "Grinding time"], 
        vibesJP: ["集中モード", "先延ばしの終了", "踏ん張り時"],
        storyline: "After faffing about for two hours choosing a playlist, Leo finally managed to get down to writing his final report just as the sun went down.", 
        storylineJP: "プレイリストを選ぶのに2時間もダラダラした後、レオは日が沈む頃にようやく最終レポートの執筆に本腰を入れることができた。", 
        quiz: { question: "Enough small talk—let's ___ business and discuss the contract.", options: ["get down to", "get ahead of", "get around to"], correctIndex: 0, explanation: "to start doing something seriously." } 
      },
      { 
        pv: "Get in", trope: "The Arrival / Election", cefr: "A2", icon: CheckCircle2, 
        meaning: "To arrive at a place, or to be elected/accepted into a university.", 
        meaningJP: "到着する、当選する、入学を許可される", 
        example: "Her plane gets in at 2am, so we'll have to pick her up very early.", 
        exampleJP: "彼女の飛行機は午前2時に到着するので、とても早く迎えに行かなければならない。",
        vibes: ["Landing at an airport", "Election night", "Getting the acceptance letter"], 
        vibesJP: ["空港への着陸", "選挙の夜", "合格通知を受け取る"],
        storyline: "Sora had been nervous for weeks, but he cried with joy when he found out he had finally managed to get in to the most prestigious art college in the country.", 
        storylineJP: "ソラは何週間も緊張していたが、国内で最も権威のある美術大学についに入学を許可された（合格した）と知って、嬉し涙を流した。", 
        quiz: { question: "The current government ___ with a very small majority in the last election.", options: ["got in", "got about", "got across"], correctIndex: 0, explanation: "to be elected." } 
      },
      { 
        pv: "Get in on", trope: "The Opportunist", cefr: "C1", icon: UserPlus, 
        meaning: "To become involved in something that other people are doing, often to gain an advantage.", 
        meaningJP: "（利益などのために）参加する、一枚噛む", 
        example: "The massive tech company tried to get in on our niche market.", 
        exampleJP: "その巨大テック企業は、私たちのニッチな市場に一枚噛もう（参加しよう）とした。",
        vibes: ["Chasing trends", "Strategic involvement", "Not wanting to miss out"], 
        vibesJP: ["トレンドを追う", "戦略的関与", "取り残されたくない"],
        storyline: "When Kaito started a successful vintage clothing business, all his greedy acquaintances suddenly wanted to get in on the action and invest.", 
        storylineJP: "海斗がビンテージ衣料のビジネスで成功し始めると、強欲な知り合いたちが突然その活動に一枚噛もう（参加しよう）として投資したがった。", 
        quiz: { question: "Everyone wanted to ___ the secret investment before the prices skyrocketed.", options: ["get in on", "get away with", "get back to"], correctIndex: 0, explanation: "to become involved in something." } 
      },
      { 
        pv: "Get in with", trope: "The Social Climber", cefr: "C1", icon: Users, 
        meaning: "To become friendly with someone, especially to gain an advantage for yourself.", 
        meaningJP: "（有利になるように）近づく、取り入る", 
        example: "He's trying to get in with the bosses in the hope of getting a promotion.", 
        exampleJP: "彼は昇進を期待して、上司たちに取り入ろう（近づこう）としている。",
        vibes: ["Networking aggressively", "Ingratiating oneself", "Calculated friendships"], 
        vibesJP: ["アグレッシブな人脈作り", "自分を売り込む", "計算された友情"],
        storyline: "Leo spent months trying to get in with the elite group of designers at the firm, attending every single one of their expensive parties to show off his skills.", 
        storylineJP: "レオは自分のスキルを見せつけるために、会社のデザイナーのエリートグループに近づこう（取り入ろう）と数ヶ月を費やし、彼らの高価なパーティーすべてに出席した。", 
        quiz: { question: "It's often helpful to ___ the right people if you want to succeed quickly.", options: ["get in with", "get after", "get behind"], correctIndex: 0, explanation: "to become friendly for advantage." } 
      },
      { 
        pv: "Get into", trope: "The Obsessive Habit", cefr: "B1", icon: RefreshCw, 
        meaning: "To become interested in something, or to start a habit/way of behaving.", 
        meaningJP: "夢中になる、慣れる、～の状態になる", 
        example: "It took me ages to get into the habit of driving on the left side of the road.", 
        exampleJP: "道路の左側を運転する習慣に慣れるまで、ずいぶん時間がかかった。",
        vibes: ["New obsession", "Acquiring habits", "Developing skills"], 
        vibesJP: ["新しい執着", "習慣の習得", "スキルの発達"],
        storyline: "Hina recently managed to get into electronic music, and now her entire apartment is filled with expensive synthesizers and flashing lights.", 
        storylineJP: "ヒナは最近電子音楽に夢中になり、今や彼女のアパート全体が高価なシンセサイザーと点滅するライトで埋め尽くされている。", 
        quiz: { question: "I've really started to ___ photography since I bought this new camera.", options: ["get into", "get through", "get out of"], correctIndex: 0, explanation: "to become interested or involved." } 
      },
      { 
        pv: "Get it", trope: "The Looming Scolding", cefr: "C1", icon: AlertTriangle, 
        meaning: "To be punished or scolded for something you have done wrong.", 
        meaningJP: "叱られる、ひどい目に遭う", 
        example: "If you don't stop that right now, you'll really get it when dad comes home!", 
        exampleJP: "今すぐそれをやめないと、お父さんが帰ってきたら本当にひどく叱られる（ひどい目に遭う）ぞ！",
        vibes: ["Impending doom", "Strict warnings", "Facing the music"], 
        vibesJP: ["差し迫った破滅", "厳重な警告", "報いを受ける"],
        storyline: "Leo accidentally smashed the principal's favorite ceramic vase. His friends whispered, 'Oh man, you are absolutely going to get it when she finds out!'", 
        storylineJP: "レオは校長先生のお気に入りの陶器の花瓶をうっかり粉砕してしまった。友人たちは「うわあ、彼女に知られたら絶対ひどく叱られる（ひどい目に遭う）ぞ！」と囁いた。", 
        quiz: { question: "You're going to ___ if you keep ignoring the strict office rules.", options: ["get it", "get off", "get up"], correctIndex: 0, explanation: "to be punished or scolded." } 
      },
      { 
        pv: "Get it together", trope: "The Life Overhaul", cefr: "B2", icon: Heart, 
        meaning: "To organize your life or emotions effectively to achieve your goals.", 
        meaningJP: "しっかりする、自制する、身辺を整理する", 
        example: "If I don't get it together soon, I will never reach my professional targets.", 
        exampleJP: "早くしっかりしないと、仕事の目標を達成することは決してできないだろう。",
        vibes: ["Self-improvement", "Ending the chaos", "Emotional control"], 
        vibesJP: ["自己改善", "カオスの終了", "感情のコントロール"],
        storyline: "Mika had been crying for days over her breakup. Finally, she wiped her tears, looked in the mirror, and told herself she had to get it together and finish her thesis.", 
        storylineJP: "ミカは失恋で何日も泣いていた。ついに彼女は涙を拭き、鏡を見て、自分にしっかりして卒業論文を完成させなければならないと言い聞かせた。", 
        quiz: { question: "You need to ___ and stop wasting your time on silly distractions.", options: ["get it together", "get it on", "get it off"], correctIndex: 0, explanation: "to organize oneself effectively." } 
      },
      { 
        pv: "Get off", trope: "The Lucky Escape", cefr: "B2", icon: Shield, 
        meaning: "To escape punishment, or to finish/leave work.", 
        meaningJP: "（罰を）免れる、仕事を終える、降りる", 
        example: "He got off on a technicality and walked out of the court a free man.", 
        exampleJP: "彼は法的な不備を突いて罰を免れ、自由の身として法廷を後にした。",
        vibes: ["Avoiding jail time", "Clocking out", "Friday feelings"], 
        vibesJP: ["刑務所を避ける", "退勤", "金曜日の気分"],
        storyline: "Leo was caught speeding by the strict police, but miraculously, he managed to get off with just a tiny warning because it was his first offense.", 
        storylineJP: "レオは厳格な警察にスピード違反で捕まったが、奇跡的に、初犯だったためわずかな警告だけで罰を免れることができた。", 
        quiz: { question: "I'm hoping to ___ early on Friday so we can beat the rush hour traffic.", options: ["get off", "get up", "get on"], correctIndex: 0, explanation: "to leave work." } 
      },
      { 
        pv: "Get off on", trope: "The Twisted Thrill", cefr: "C2", icon: Zap, 
        meaning: "To find something incredibly exciting or pleasurable, often in a strange or offensive way.", 
        meaningJP: "～に興奮する、～を（異常に）楽しむ", 
        example: "The arrogant bully seems to get off on making other people feel small.", 
        exampleJP: "その傲慢ないじめっ子は、他人を惨めな気持ちにさせることに興奮している（を異常に楽しんでいる）ようだ。",
        vibes: ["Power trips", "Weird obsessions", "Thrill seeking"], 
        vibesJP: ["権力欲", "奇妙な執着", "スリルを求める"],
        storyline: "The toxic director was famously cruel. He seemed to get off on screaming at his actors until they cried, believing it made the performance more 'real'.", 
        storylineJP: "その有毒な監督は残酷なことで有名だった。彼は俳優たちが泣くまで怒鳴りつけることに興奮している（を異常に楽しんでいる）ようで、それが演技をより「リアル」にすると信じていた。", 
        quiz: { question: "Some highly competitive people ___ the absolute pressure of dangerous risks.", options: ["get off on", "get away from", "get around to"], correctIndex: 0, explanation: "to find pleasure or excitement in something." } 
      },
      { 
        pv: "Get on", trope: "The Boarding / Progress", cefr: "A2", icon: Map, 
        meaning: "To enter a bus or train, or to make progress in a task.", 
        meaningJP: "（バスなどに）乗る、進捗させる、仲良くする", 
        example: "How are you getting on with your incredibly difficult Spanish lessons?", 
        exampleJP: "信じられないほど難しいスペイン語のレッスンの進み具合（進捗）はどうだい？",
        vibes: ["Commuting", "Daily grind", "Steady improvement"], 
        vibesJP: ["通勤", "日々の仕事", "着実な改善"],
        storyline: "The train was pulling out of the station. Kaito had to sprint and jump to get on at the last second, nearly dropping his heavy laptop in the process.", 
        storylineJP: "電車が駅を出発しようとしていた。海斗は最後の瞬間に乗るために全力疾走してジャンプしなければならず、その過程で重いノートパソコンを落としそうになった。", 
        quiz: { question: "We ___ the bus at the busy station and went straight to the city center.", options: ["got on", "got off", "got up"], correctIndex: 0, explanation: "to enter a vehicle." } 
      }
    ]
  };

const EPISODE_LIST = Array.from({ length: 26 }, (_, i) => i + 1);

  useEffect(() => {
    setIsFlipped(false);
    setIsVibesFlipped(false);
    setIsExampleFlipped(false);
  }, [promptLang]);

  const allDataWithEp = Object.entries(batches).flatMap(([ep, items]) => 
    items.map(item => ({ ...item, epNum: ep }))
  );

  let displayData = [];
  
  if (searchQuery.trim() !== '') {
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
    displayData = allDataWithEp.filter(item => {
      return searchTerms.every(term => {
        const isShortWord = term.length <= 3 && /^[a-z]+$/.test(term);
        const matchPV = isShortWord 
          ? new RegExp(`\\b${term}\\b`, 'i').test(item.pv) 
          : item.pv.toLowerCase().includes(term);          
        return matchPV;
      });
    });
  } else {
    const currentBatchRaw = batches[episode] || batches[1] || [];
    displayData = cefrFilter === 'ALL' ? currentBatchRaw : currentBatchRaw.filter(item => item?.cefr === cefrFilter);
  }

  const current = displayData[index] || displayData[0] || null;
  const availableLevelsInBatch = ['ALL', ...new Set((searchQuery ? allDataWithEp : (batches[episode] || [])).map(item => item?.cefr).filter(Boolean))].sort();

  const handleNext = () => { setIsRevealed(false); setIndex(prev => (prev >= displayData.length - 1 ? 0 : prev + 1)); };
  const handlePrev = () => { setIsRevealed(false); setIndex(prev => (prev <= 0 ? displayData.length - 1 : prev - 1)); };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayData.length]);
  
  const selectEpisode = (num) => { 
    setEpisode(num); 
    setSearchQuery('');
    setIndex(0); 
    setCefrFilter('ALL'); 
    setIsRevealed(false); 
    setIsEpOpen(false); 
  };
  
  const handleFilterChange = (level) => { setCefrFilter(level); setIndex(0); setIsRevealed(false); setIsCefrOpen(false); };
  const markAsCorrect = () => { if(current) setCorrectlyAnswered(prev => new Set(prev).add(`${current.pv}-${current.trope}`)); };
  const isCurrentCorrect = current ? correctlyAnswered.has(`${current.pv}-${current.trope}`) : false;
  const CurrentIcon = current ? (current.icon || Sparkles) : Search;

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-[#1A1A1A] p-4 md:p-8 lg:p-12 font-sans selection:bg-yellow-300 overflow-x-hidden flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col h-full">
        
        <header className="mb-6 md:mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 shrink-0">
          <div className="flex-1 max-w-full lg:max-w-sm">
            <div className="flex items-center gap-3 mb-2 font-bold flex-wrap">
              <div className="relative">
                <button onClick={() => setIsEpOpen(!isEpOpen)} className="bg-black text-white px-3 md:px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-all shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 font-bold text-[10px] md:text-xs">
                  <Play size={12} fill="currentColor" />
                  <span className="uppercase tracking-widest">
                    {searchQuery ? (current ? `FOUND IN EP ${current.epNum}` : 'SEARCHING') : `EPISODE ${episode < 10 ? `0${episode}` : episode}`}
                  </span>
                  <ChevronDown size={12} className={`transition-transform ${isEpOpen ? 'rotate-180' : ''}`} />
                </button>
                {isEpOpen && (
                  <div className="absolute top-full mt-2 left-0 z-[120] bg-white border-4 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-1 min-w-[140px] animate-in slide-in-from-top-2 text-black max-h-48 md:max-h-64 overflow-y-auto">
                    {EPISODE_LIST.map(n => (<button key={n} onClick={() => selectEpisode(n)} className={`w-full text-left px-3 py-2 text-[9px] md:text-[10px] font-black uppercase hover:bg-yellow-300 rounded-lg transition-colors border-b last:border-b-0 border-black/5 ${episode === n && !searchQuery ? 'bg-yellow-100' : ''}`}>Episode {n < 10 ? `0${n}` : n}</button>))}
                  </div>
                )}
              </div>
              <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400">
                {searchQuery ? 'GLOBAL SEARCH' : 'PROGRESS'}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase leading-none text-black">Story <span className="text-blue-600">PV</span> Guide</h1>
              
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                {/* PV? ボタン を左にする */}
                <button onClick={() => setShowExplanation(true)} className="flex items-center gap-2 bg-white border-2 border-black px-2 py-1 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px]">
                  <HelpCircle size={14} className="text-blue-600" />
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-none">PV?</span>
                </button>

                {/* CEFR Level Filter を右にする */}
                <div className="relative">
                  <button 
                    onClick={() => setIsCefrOpen(!isCefrOpen)} 
                    disabled={!!searchQuery} 
                    className={`flex items-center gap-1 md:gap-2 border-2 border-black px-2 md:px-3 py-1 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px] ${searchQuery ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : (cefrFilter !== 'ALL' ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-yellow-300')}`}
                    title="Filter by CEFR Level"
                  >
                    <Filter size={14} className={searchQuery ? 'text-gray-400' : (cefrFilter !== 'ALL' ? 'text-white' : 'text-blue-600')} />
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-none hidden sm:inline-block">
                      {cefrFilter === 'ALL' ? 'CEFR' : `Lvl ${cefrFilter}`}
                    </span>
                    <ChevronDown size={12} className={`transition-transform ${isCefrOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isCefrOpen && !searchQuery && (
                    <div className="absolute top-full left-0 mt-2 z-[120] bg-white border-4 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-1 min-w-[120px] animate-in slide-in-from-top-2 text-black text-left">
                      {availableLevelsInBatch.map((level) => (
                        <button 
                          key={level} 
                          onClick={() => handleFilterChange(level)} 
                          className={`w-full text-left px-3 py-2 text-[9px] md:text-[10px] font-black uppercase hover:bg-yellow-300 rounded-lg transition-colors border-b last:border-b-0 border-black/5 ${cefrFilter === level ? 'bg-yellow-100' : ''}`}
                        >
                          {level === 'ALL' ? 'ALL LEVELS' : `Level ${level}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl w-full flex flex-col gap-4">
            <div className="w-full relative">
               <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400"><Search size={16} /></div>
               <input
                 type="text"
                 placeholder="SEARCH PV..."
                 value={searchQuery}
                 onChange={(e) => { setSearchQuery(e.target.value); setIndex(0); setIsRevealed(false); }}
                 className="w-full pl-11 pr-8 py-2.5 rounded-xl border-2 border-black font-black text-sm uppercase transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50 placeholder-gray-400"
               />
               {searchQuery && ( <button onClick={() => {setSearchQuery(''); setIndex(0);}} className="absolute inset-y-0 right-4 flex items-center"><X size={18} className="text-gray-400 hover:text-red-500" /></button> )}
            </div>
            {current && (
              <div className="w-full bg-white border-4 border-black p-3 md:p-4 rounded-xl md:rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col justify-center min-h-[4rem]">
                <div className="flex items-center gap-2 mb-1 uppercase font-bold text-gray-400"><Languages size={12} /><span className="text-[9px] tracking-widest font-bold">{promptLang === 'EN' ? 'Concept' : '意味のヒント'}</span></div>
                <p className="text-sm md:text-xl font-black italic text-gray-800 leading-snug line-clamp-2">{promptLang === 'EN' ? current.meaning : current.meaningJP}</p>
              </div>
            )}
          </div>

          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 shrink-0">
             <div className="flex flex-col items-end gap-2">
                 {/* ⚙️ システム設定（管理者モード切り替え）ボタン */}
                 <button 
                   onClick={() => {
                     if (isAdminMode) {
                       setIsAdminMode(false); // ログアウト
                     } else {
                       setShowAdminLogin(true); // パスワード画面表示
                     }
                   }} 
                   className={`p-1.5 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px] ${isAdminMode ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                   title={isAdminMode ? "Exit Admin Mode" : "System Settings"}
                 >
                   <Settings size={14} className={`${isAdminMode ? 'animate-spin-slow' : ''}`} />
                 </button>
                 
                 {/* EN / JP ボタン */}
                 <div className="flex items-center gap-1 bg-black p-1 rounded-full border-2 border-black">
                    <button onClick={() => setPromptLang('EN')} className={`px-3 md:px-5 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase transition-all ${promptLang === 'EN' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>EN</button>
                    <button onClick={() => setPromptLang('JP')} className={`px-3 md:px-5 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase transition-all ${promptLang === 'JP' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>JP</button>
                 </div>
             </div>
             
             {current && (
               <div className="flex gap-2 mt-auto">
                  <button onClick={handlePrev} className="w-10 h-10 md:w-12 md:h-12 border-2 border-black rounded-full flex items-center justify-center bg-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-black hover:text-white active:translate-y-0.5 active:shadow-none transition-all"><ChevronLeft size={20} /></button>
                  <button onClick={handleNext} className="w-10 h-10 md:w-12 md:h-12 border-2 border-black rounded-full flex items-center justify-center bg-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-black hover:text-white active:translate-y-0.5 active:shadow-none transition-all"><ChevronRight size={20} /></button>
               </div>
             )}
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1 min-h-0">
          {!current ? (
            <div className="lg:col-span-12 bg-white border-4 border-black rounded-[2.5rem] p-10 md:p-20 text-center shadow-[10px_10px_0_0_rgba(0,0,0,1)] flex flex-col items-center justify-center">
               <Search size={48} className="text-gray-200 mb-4" />
               <h2 className="text-2xl font-black italic uppercase tracking-tighter text-black mb-2">No Matches!</h2>
               <button onClick={() => setSearchQuery('')} className="mt-4 bg-black text-white px-6 py-2 rounded-full font-black text-xs uppercase hover:bg-yellow-300 hover:text-black">Clear Search</button>
            </div>
          ) : (
            <>
              <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8 order-1">
                <div className="w-full max-w-2xl mx-auto shrink-0">
                   <AnimeFrame 
                     pv={current.pv} 
                     trope={current.trope} 
                     storyline={current.storyline} 
                     storylineJP={current.storylineJP} 
                     primaryLang={promptLang} 
                     customBgUrl={customBgUrls[getDocId(current.pv)]} 
                     onUpdateBgUrl={handleUpdateBgUrl} 
                     isAdmin={isAdminMode}
                   />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {/* Context Vibes Flip Card */}
                  <div onClick={() => setIsVibesFlipped(!isVibesFlipped)} className="relative w-full cursor-pointer h-48 md:h-56" style={{ perspective: '1000px' }}>
                    <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: isVibesFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                      <div className={`absolute inset-0 p-4 md:p-6 rounded-2xl md:rounded-3xl border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col text-black text-left h-full ${promptLang === 'EN' ? 'bg-yellow-300' : 'bg-orange-100'}`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                        <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Lightbulb size={16} className="opacity-50" /><h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest">{promptLang === 'EN' ? 'Context Vibes' : 'Vibes (JP)'}</h3></div><RefreshCw size={12} className="opacity-30" /></div>
                        <div className="space-y-2 overflow-y-auto">{(promptLang === 'EN' ? current.vibes : (current.vibesJP || [])).map((vibe, i) => (<div key={i} className="flex gap-2 items-start font-black uppercase text-sm md:text-base lg:text-xl leading-tight italic tracking-tight"><div className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0"></div><p>{vibe}</p></div>))}</div>
                      </div>
                      <div className={`absolute inset-0 p-4 md:p-6 rounded-2xl md:rounded-3xl border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col text-black text-left h-full ${promptLang === 'EN' ? 'bg-orange-100' : 'bg-yellow-300'}`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Lightbulb size={16} className="opacity-50" /><h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest">{promptLang === 'EN' ? 'Vibes (JP)' : 'Context Vibes'}</h3></div><RefreshCw size={12} className="opacity-30" /></div>
                        <div className="space-y-2 overflow-y-auto">{(promptLang === 'EN' ? (current.vibesJP || []) : current.vibes).map((vibe, i) => (<div key={i} className="flex gap-2 items-start font-black uppercase text-sm md:text-base lg:text-xl leading-tight italic tracking-tight"><div className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0"></div><p>{vibe}</p></div>))}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Meaning/Concept Flip Card */}
                  <div onClick={() => setIsFlipped(!isFlipped)} className="relative w-full cursor-pointer h-48 md:h-56" style={{ perspective: '1000px' }}>
                    <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                      <div className={`absolute inset-0 p-4 md:p-6 rounded-2xl md:rounded-3xl border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col justify-center text-left ${promptLang === 'EN' ? 'bg-white text-black' : 'bg-blue-50 border-blue-500'}`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                        <div className="flex justify-between items-start mb-2"><h3 className="text-[9px] md:text-[11px] font-black uppercase tracking-widest opacity-40">{promptLang === 'EN' ? 'Meaning (EN)' : '意味 (JP)'}</h3><RefreshCw size={12} className="opacity-20" /></div>
                        <p className="text-sm md:text-base lg:text-xl font-black italic leading-snug line-clamp-4">{promptLang === 'EN' ? current.meaning : current.meaningJP}</p>
                      </div>
                      <div className={`absolute inset-0 p-4 md:p-6 rounded-2xl md:rounded-3xl border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col justify-center text-left ${promptLang === 'EN' ? 'bg-blue-50 border-blue-500' : 'bg-white text-black'}`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <div className="flex justify-between items-start mb-2"><h3 className="text-[9px] md:text-[11px] font-black uppercase tracking-widest opacity-40">{promptLang === 'EN' ? '意味 (JP)' : 'Meaning (EN)'}</h3><RefreshCw size={12} className="opacity-20" /></div>
                        <p className="text-sm md:text-base lg:text-xl font-black italic leading-snug line-clamp-4">{promptLang === 'EN' ? current.meaningJP : current.meaning}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Section */}
              <div className="lg:col-span-4 h-full flex flex-col gap-6 w-full order-2 lg:order-2">
                <div className="bg-black text-white p-6 md:p-8 rounded-[2rem] relative overflow-hidden border-4 border-black flex-1 flex flex-col min-h-[300px]">
                   <div className="absolute top-0 right-0 p-4 opacity-10 text-white pointer-events-none"><CurrentIcon size={80} /></div>
                   <div className="relative z-10 flex flex-col text-left h-full">
                     <div className="w-10 h-1 bg-white/30 mb-6 rounded-full shrink-0"></div>
                     <div className="mb-6 shrink-0">
                       <p className="text-[10px] md:text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Target Phrasal Verb</p>
                       {isRevealed ? (
                         <button onClick={() => setIsRevealed(false)} className="w-full text-left">
                           <h2 className="text-4xl md:text-5xl lg:text-6xl font-black italic mb-1 leading-none uppercase tracking-tighter text-yellow-300 animate-in fade-in slide-in-from-left-4">{current.pv}</h2>
                           <span className="text-[9px] uppercase font-black opacity-30 flex items-center gap-1"><EyeOff size={10} /> Tap to Hide</span>
                         </button>
                       ) : (
                         <button onClick={() => setIsRevealed(true)} className="group flex items-center gap-3 bg-white/10 hover:bg-white/15 p-4 rounded-2xl border-2 border-dashed border-white/20 w-full text-left transition-all">
                           <div className="bg-white/20 p-2 rounded-xl group-hover:bg-yellow-300 group-hover:text-black transition-colors"><Eye size={18} /></div>
                           <div><span className="block text-xl md:text-2xl font-black tracking-tighter italic opacity-40 leading-none mb-1">?????</span><span className="text-[8px] md:text-[9px] uppercase font-black opacity-30">Tap to Reveal</span></div>
                         </button>
                       )}
                     </div>
                     
                     <div className="flex-1 flex flex-col min-h-0 border-t border-white/10 pt-4">
                       <p className="text-[10px] md:text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Target Example</p>
                       {isRevealed ? (
                         <div onClick={() => setIsExampleFlipped(!isExampleFlipped)} className="relative w-full cursor-pointer group flex-1 min-h-0" style={{ perspective: '1000px' }}>
                           <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: isExampleFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)' }}>
                             <div className="absolute inset-0 bg-white/5 p-4 rounded-xl border-l-4 border-yellow-300 italic text-sm md:text-lg lg:text-xl leading-relaxed text-white font-bold overflow-y-auto" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                               <span>"{promptLang === 'EN' ? current.example : (current.exampleJP || '---')}"</span>
                             </div>
                             <div className="absolute inset-0 bg-blue-900/40 p-4 rounded-xl border-l-4 border-blue-400 italic text-sm md:text-lg lg:text-xl leading-relaxed text-white font-bold overflow-y-auto" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}>
                               <span>"{promptLang === 'EN' ? (current.exampleJP || '---') : current.example}"</span>
                             </div>
                           </div>
                         </div>
                       ) : (
                         <div className="bg-white/5 p-6 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 flex-1">
                            <Lock size={16} className="text-white/10" /><span className="text-[10px] font-black uppercase opacity-20 tracking-widest italic text-center">Hidden</span>
                         </div>
                       )}
                     </div>
                   </div>
                </div>

                <div className="flex flex-col gap-3 shrink-0">
                   <button onClick={() => setShowQuiz(true)} className="w-full bg-white px-5 py-3 rounded-full border-4 border-black font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all text-black">
                      <Heart size={16} fill={isCurrentCorrect ? "#FF69B4" : "white"} color={isCurrentCorrect ? "#FF69B4" : "black"} className="transition-all duration-300" /> 
                      <span>{isCurrentCorrect ? "Challenge Clear!" : "Try Mini Quiz"}</span>
                   </button>
                   <div className="flex gap-3 w-full">
                     <div className="flex-1 bg-white px-3 py-2 rounded-full border-4 border-black font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 text-black"><Award size={14} className="text-blue-600" /> CEFR {current.cefr}</div>
                     <div className="bg-black text-white px-5 py-2 rounded-full border-4 border-black font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center justify-center">{index + 1} / {displayData.length}</div>
                   </div>
                </div>
              </div>
            </>
          )}
        </main>

        <footer className="mt-8 pb-8 shrink-0 w-full max-w-4xl mx-auto">
          {displayData.length > 0 && (
            <div className="flex justify-center gap-1.5 mb-4 flex-wrap max-w-full overflow-hidden">
              {displayData.map((_, i) => (
                <button key={i} onClick={() => { setIndex(i); setIsRevealed(false); }} className={`h-1.5 transition-all rounded-full border border-black/20 ${i === index ? 'w-8 md:w-10 bg-black' : 'w-1.5 bg-gray-300'}`} />
              ))}
            </div>
          )}
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-gray-300 italic text-center font-bold px-4">Total Phrasal Verbs: {allDataWithEp.length} // Maki's Classroom Edition</p>
        </footer>
      </div>

      <PVExplanation isOpen={showExplanation} onClose={() => setShowExplanation(false)} />
      {current && <PVQuiz isOpen={showQuiz} onClose={() => setShowQuiz(false)} pv={current.pv} quiz={current.quiz} onCorrectAnswer={markAsCorrect} />}
      
      {/* 管理者ログイン用モーダル */}
      <AdminLoginModal 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
        onLoginSuccess={() => {
          setIsAdminMode(true);
          setShowAdminLogin(false);
        }} 
      />
    </div>
  );
};

export default App;
