import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSend, FiMoon, FiSun, FiUpload, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { IoShieldCheckmark } from 'react-icons/io5';
import { MdOutlineSearch, MdOutlineBuild, MdOutlineCalendarMonth, MdOutlineContactSupport, MdDirectionsCar, MdBusiness, MdCarRepair, MdCalendarToday, MdSettings, MdFingerprint } from 'react-icons/md';
import config from '../config';
import './ChatWidget.css';

// Agentic robot-bubble icon matching the blue gradient chat launcher aesthetic
const RobotBubbleIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    className="bubble-icon"
  >
    <defs>
      <mask id="rb-mask">
        <rect width="32" height="32" fill="white" />
        {/* Eye cutouts — background gradient shows through */}
        <circle cx="12" cy="13" r="2.3" fill="black" />
        <circle cx="20" cy="13" r="2.3" fill="black" />
      </mask>
    </defs>
    {/* Left headphone / ear cup */}
    <rect x="1" y="11.5" width="3.5" height="6" rx="1.75" fill="white" />
    {/* Right headphone / ear cup */}
    <rect x="27.5" y="11.5" width="3.5" height="6" rx="1.75" fill="white" />
    {/* Speech bubble body + tail, with eye holes punched via mask */}
    <g mask="url(#rb-mask)">
      <circle cx="16" cy="13" r="10" fill="white" />
      <path d="M13 22.5 L16 27.5 L19 22.5 Z" fill="white" />
    </g>
  </svg>
);

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour! Je suis votre assistant AI de Suzuki Tunisie. Quelles pièces de rechange vous cherchez aujourd'hui?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [showVehicleCard, setShowVehicleCard] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const verifyTimeoutRef = useRef(null);

  // Get logo URL from config or use default
  const logoUrl = (typeof window !== 'undefined' && window.suzukiChatbotConfig?.logoUrl) || '/suzuli_logo.png';

  const quickActions = [];

  // Debug: Log API URL on mount
  useEffect(() => {
    console.log('🔧 Suzuki Chatbot Config:', {
      apiUrl: config.apiUrl,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

    // Suppress Chrome extension errors
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.('message channel closed')) return;
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
    const theme = localStorage.getItem('suzuki-theme');
    if (theme === 'dark') setIsDark(true);
    sessionStorage.clear();

    // Cleanup any pending verify transition on unmount
    return () => {
      if (verifyTimeoutRef.current) clearTimeout(verifyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
    // Messages are server-side — no need to persist to sessionStorage
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('suzuki-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleFileSelect = (file) => {
    if (!file) return;
    
    // Reset file input to allow re-uploading same filename
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    const validTypes = [
      'image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif',
      'image/bmp', 'image/tiff', 'image/heic', 'image/heif',
      'application/pdf'
    ];
    
    if (!validTypes.includes(file.type)) {
      setVerificationError('Format non supporté. Utilisez PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF, HEIC, ou PDF.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setVerificationError('Fichier trop volumineux. Maximum 15MB.');
      return;
    }
    
    if (file.size === 0) {
      setVerificationError('Le fichier est vide.');
      return;
    }

    // Create image preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }

    setUploadedFile(file);
    setVerificationError('');
    setUploadProgress(0);
    verifyDocument(file);
  };

  const verifyDocument = async (file) => {
    setIsVerifying(true);
    setVerificationError('');

    console.log('🔍 Verifying file:', {
      name: file.name,
      size: file.size,
      type: file.mimetype || file.type,
      lastModified: file.lastModified,
      timestamp: new Date().toISOString()
    });

    let progressInterval = null;
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadUrl = `${config.apiUrl}/verification/upload`;
      console.log('📤 Uploading to:', uploadUrl);

      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      progressInterval = null;
      setUploadProgress(95);

      console.log('📤 Upload response status:', response.status);

      // Handle non-JSON responses (Nginx 413, 502, etc.)
      // Note: Backend may return 201 with success:false - handle in data check below
      if (!response.ok && response.status !== 400 && response.status !== 201) {
        if (response.status === 413) {
          throw new Error('Fichier trop volumineux pour le serveur. Maximum 15MB.');
        }
        throw new Error(`Erreur serveur (${response.status}). Veuillez réessayer.`);
      }

      const data = await response.json().catch(() => {
        throw new Error('Réponse serveur invalide. Veuillez réessayer.');
      });
      console.log('📊 Upload response data:', data);
      
      setUploadProgress(100);
      
      if (data.success) {
        setVehicleInfo(data.vehicleInfo);
        
        // Use a ref-tracked timeout so we can cancel on unmount
        const tid = setTimeout(() => {
          setIsVerified(true);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              text: 'VEHICLE_INFO',
              vehicleData: data.vehicleInfo,
              sender: 'bot',
              timestamp: new Date(),
            },
          ]);
        }, 500);
        // Store timeout id for cleanup
        verifyTimeoutRef.current = tid;
      } else {
        // ========== RATE LIMITING ERROR (TEMPORARILY DISABLED FOR TESTING) ==========
        // TODO: UNCOMMENT FOR PRODUCTION
        // if (data.limitReached) {
        //   setVerificationError(
        //     `⚠️ ${data.message}\n\nVous avez utilisé ${data.uploadCount || 3}/3 téléchargements ce mois-ci.\nLa limite se réinitialise le 1er du mois prochain.`
        //   );
        // } else {
        //   setVerificationError(data.message || 'Seules les cartes grises Suzuki sont acceptées.');
        // }
        // ========== END RATE LIMITING ERROR ==========
        setVerificationError(data.message || 'Seules les cartes grises Suzuki sont acceptées.');
        setUploadedFile(null);
        setImagePreview(null);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      setVerificationError(error.message || 'Erreur de connexion. Veuillez réessayer.');
      setUploadedFile(null);
      setImagePreview(null);
      setUploadProgress(0);
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      setIsVerifying(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || inputValue.trim();
    if (!textToSend) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideText) setInputValue('');
    setIsTyping(true);

    try {
      const chatUrl = `${config.apiUrl}/chat/message`;
      console.log('💬 Sending to:', chatUrl, { message: textToSend, sessionId });

      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          vehicle: vehicleInfo,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Chat response:', data);

      // Persist sessionId for conversation continuity
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      // Build bot message — attach clarification payload if present
      const botMessage = {
        id: Date.now() + 1,
        text: data.response || data.message || 'Réponse reçue',
        sender: 'bot',
        timestamp: new Date(),
        isClarification: data.intent === 'CLARIFICATION_NEEDED',
        products: data.products || [],
        intent: data.intent,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('❌ Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `Désolé, erreur de connexion : ${error.message}. Veuillez réessayer.`,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClarificationClick = (variant) => {
    // Strip leading bullet "• " if present
    const clean = variant.replace(/^[•\-\s]+/, '').trim();
    handleSend(clean);
  };

  // Parse clarification variants out of bot message text
  // Backend sends: "merci de préciser ...\n• Avant\n• Arrière"
  const parseClarificationVariants = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const variants = lines
      .filter((l) => /^[•\-]\s/.test(l.trim()))
      .map((l) => l.replace(/^[•\-\s]+/, '').trim())
      .filter(Boolean);
    return variants.length >= 2 ? variants : null;
  };

  // Highlight price and stock status in bot response text
  const formatBotText = (text) => {
    if (!text) return '';
    // Step 1: Escape HTML entities first — prevents XSS even if backend echoes user input
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    // Step 2: Apply visual enhancements on the now-safe string
    let formatted = escaped.replace(
      /(\d+[.,]\d{3})\s*TND/g,
      '<span class="price-tag">$1 TND</span>'
    );
    formatted = formatted.replace(
      /\b(Disponible)\b/g,
      '<span class="status-disponible">$1</span>'
    );
    formatted = formatted.replace(
      /\b(Indisponible)\b/g,
      '<span class="status-indisponible">$1</span>'
    );
    // Step 3: Convert newlines to <br> (safe after escaping)
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  };

  const handleQuickAction = (action) => {
    const actionMessages = {
      search: 'Je cherche une pièce de rechange',
      maintenance: "Quel est l'entretien recommandé ?",
      appointment: 'Je voudrais prendre un rendez-vous',
      contact: 'Comment puis-je vous contacter ?',
    };
    const text = actionMessages[action];
    if (text) handleSend(text);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' });
  };

  if (showVehicleCard && vehicleInfo) {
    return (
      <div className={`verification-modal ${isDark ? 'dark' : ''}`}>
        <div className="vehicle-card">
          <div className="vehicle-header">
            <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '12px' }}>
              <img src={logoUrl} alt="Suzuki" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <FiCheckCircle className="success-icon" style={{ width: '48px', height: '48px' }} />
            <h2>Véhicule identifié</h2>
          </div>
          
          <div className="vehicle-info">
            <div className="vehicle-brand">
              <IoShieldCheckmark className="brand-icon" />
              <div>
                <h3>SUZUKI {vehicleInfo.modele} {vehicleInfo.annee}</h3>
                <p className="vehicle-model">{vehicleInfo.modele}</p>
              </div>
            </div>

            <div className="vehicle-details">
              <div className="vehicle-table">
                <div className="table-row">
                  <div className="table-cell">
                    <MdDirectionsCar className="table-icon" />
                    <span className="table-label">Immatriculation</span>
                  </div>
                  <div className="table-cell">
                    <span className="table-value">{vehicleInfo.immatriculation}</span>
                  </div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell">
                    <MdBusiness className="table-icon" />
                    <span className="table-label">Marque</span>
                  </div>
                  <div className="table-cell">
                    <span className="table-value">{vehicleInfo.marque}</span>
                  </div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell">
                    <MdCarRepair className="table-icon" />
                    <span className="table-label">Modèle</span>
                  </div>
                  <div className="table-cell">
                    <span className="table-value">{vehicleInfo.modele}</span>
                  </div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell">
                    <MdCalendarToday className="table-icon" />
                    <span className="table-label">Année</span>
                  </div>
                  <div className="table-cell">
                    <span className="table-value">{vehicleInfo.annee}</span>
                  </div>
                </div>
                
                {vehicleInfo.type && (
                  <div className="table-row">
                    <div className="table-cell">
                      <MdSettings className="table-icon" />
                      <span className="table-label">Type</span>
                    </div>
                    <div className="table-cell">
                      <span className="table-value">{vehicleInfo.type}</span>
                    </div>
                  </div>
                )}
                
                {vehicleInfo.vin && (
                  <div className="table-row">
                    <div className="table-cell">
                      <MdFingerprint className="table-icon" />
                      <span className="table-label">VIN</span>
                    </div>
                    <div className="table-cell">
                      <span className="table-value vin-code">{vehicleInfo.vin}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="vehicle-footer">
            <p>Merci !</p>
            <p className="footer-subtitle">Demandez vos pièces de rechange en toute simplicité.</p>
            <button className="continue-btn" onClick={() => { 
              setShowVehicleCard(false); 
              setIsVerified(true);
              // Add welcome message with vehicle info
              const welcomeMessage = {
                id: Date.now(),
                text: `Parfait ! Votre ${vehicleInfo.marque} ${vehicleInfo.modele} (${vehicleInfo.immatriculation}) est maintenant enregistré. Demandez-moi vos pièces de rechange !`,
                sender: 'bot',
                timestamp: new Date()
              };
              setMessages(prev => [...prev, welcomeMessage]);
            }}>
              Continuer vers le chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <>
        <div className={`chat-bubble ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
          <RobotBubbleIcon />
          <div className="bubble-badge">1</div>
          <div className="bubble-pulse"></div>
        </div>

        <div className={`chat-container ${isOpen ? 'open' : ''} ${isDark ? 'dark' : ''}`}>
          <div className="chat-header">
            <div className="header-content">
              <div className="header-logo">
                <div className="logo-circle">
                  <img src={logoUrl} alt="Suzuki" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                </div>
                <div className="header-text">
                  <h3>Suzuki AI Assistant</h3>
                  <span className="status">
                    <span className="status-dot"></span>
                    Vérification requise
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="theme-btn" onClick={() => setIsDark(!isDark)}>
                  {isDark ? <FiSun /> : <FiMoon />}
                </button>
                <button className="close-btn" onClick={() => setIsOpen(false)}>
                  <FiX />
                </button>
              </div>
            </div>
          </div>

          <div className="verification-content-inline">
            <div className="verification-header-inline">
              <h3 style={{ color: 'var(--suzuki-blue)' }}>Votre expert intelligent en pièces de rechanges</h3>
              <p>Bonjour merci de télécharger votre carte grise Suzuki</p>
              {/* ========== RATE LIMITING UI (TEMPORARILY DISABLED FOR TESTING) ========== */}
              {/* TODO: UNCOMMENT FOR PRODUCTION */}
              {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                <MdOutlineCalendarMonth style={{ color: 'var(--suzuki-red)', fontSize: '16px' }} />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Limite: 3 téléchargements par mois</p>
              </div> */}
              {/* ========== END RATE LIMITING UI ========== */}
            </div>

            <div 
              className={`upload-zone ${isDragging ? 'dragging' : ''} ${uploadedFile ? 'uploaded' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isVerifying && fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*,.png,.jpg,.jpeg,.webp,.pdf"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />
              
              {isVerifying ? (
                <div className="upload-status">
                  {imagePreview && (
                    <div
                      className="upload-preview"
                      style={{
                        opacity: uploadProgress >= 95 ? 0 : 1,
                        transition: 'opacity 0.4s ease',
                        pointerEvents: 'none',
                      }}
                    >
                      <img src={imagePreview} alt="Aperçu carte grise" />
                    </div>
                  )}
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="progress-text">{uploadProgress}%</p>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                    {uploadProgress < 30 ? 'Téléchargement...' : 
                     uploadProgress < 95 ? 'Analyse en cours...' : 
                     'Extraction des informations...'}
                  </p>
                </div>
              ) : uploadedFile ? (
                <div className="upload-status">
                  <FiCheckCircle className="status-icon success" />
                  <p>{uploadedFile.name}</p>
                </div>
              ) : (
                <>
                  <FiUpload className="upload-icon" />
                  <p className="upload-title">téléchargez votre carte grise</p>
                  <p className="upload-subtitle">PNG, JPG, JPEG, WEBP, PDF • Glissez-déposez ou cliquez</p>
                </>
              )}
            </div>

            {verificationError && (
              <div className="error-message">
                <FiXCircle />
                <span>{verificationError}</span>
              </div>
            )}
          </div>

          <div className="chat-footer">
            <span>Powered by Suzuki AI</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`chat-bubble ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <RobotBubbleIcon />
        <div className="bubble-badge">1</div>
        <div className="bubble-pulse"></div>
      </div>

      <div className={`chat-container ${isOpen ? 'open' : ''} ${isDark ? 'dark' : ''}`}>
        <div className="chat-header">
          <div className="header-content">
            <div className="header-logo">
              <div className="logo-circle">
                <img src={logoUrl} alt="Suzuki" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              </div>
              <div className="header-text">
                <h3>Suzuki AI Assistant</h3>
                <span className="status">
                  <span className="status-dot"></span>
                  En ligne
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="theme-btn" onClick={() => setIsDark(!isDark)}>
                {isDark ? <FiSun /> : <FiMoon />}
              </button>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <FiX />
              </button>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.sender === 'bot' && (
                <div className="bot-avatar">
                  <img src={logoUrl} alt="Suzuki" />
                </div>
              )}
              {msg.text === 'VEHICLE_INFO' ? (
                <div className="message-content vehicle-info-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <FiCheckCircle style={{ color: '#10b981', fontSize: '20px' }} />
                    <strong>Véhicule identifié!</strong>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MdBusiness style={{ color: '#3b82f6', fontSize: '18px' }} />
                      <span><strong>Marque:</strong> {msg.vehicleData.marque}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MdCarRepair style={{ color: '#3b82f6', fontSize: '18px' }} />
                      <span><strong>Modèle:</strong> {msg.vehicleData.modele}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MdCalendarToday style={{ color: '#3b82f6', fontSize: '18px' }} />
                      <span><strong>Année:</strong> {msg.vehicleData.annee}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MdDirectionsCar style={{ color: '#3b82f6', fontSize: '18px' }} />
                      <span><strong>Immatriculation:</strong> {msg.vehicleData.immatriculation}</span>
                    </div>
                  </div>
                  <p style={{ marginTop: '12px', color: '#64748b' }}>Parfait ! Demandez-moi vos pièces de rechange !</p>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
              ) : msg.sender === 'user' ? (
                // User messages: plain text only — never dangerouslySetInnerHTML (XSS risk)
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
              ) : (
                // Bot messages: formatted HTML with price/status highlighting
                <div className={`message-content ${msg.isClarification ? 'clarification-message' : ''}`}>
                  <p
                    dangerouslySetInnerHTML={{ __html: formatBotText(msg.text) }}
                  />
                  {/* Clarification buttons — render when bot asks for position/side/type */}
                  {(() => {
                    const variants = msg.isClarification
                      ? parseClarificationVariants(msg.text)
                      : null;
                    return variants ? (
                      <div className="clarification-buttons">
                        {variants.map((v, i) => (
                          <button
                            key={i}
                            className="clarification-btn"
                            onClick={() => handleClarificationClick(v)}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    ) : null;
                  })()}
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-content typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-actions">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button key={idx} className="quick-action-btn" onClick={() => handleQuickAction(action.action)}>
                <Icon className="action-icon" />
                <span className="action-text">{action.text}</span>
              </button>
            );
          })}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Écrivez votre message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={() => handleSend()} disabled={!inputValue.trim()}>
            <FiSend />
          </button>
        </div>

        <div className="chat-footer">
          <span>Powered by Suzuki AI</span>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;