import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiSend, FiMoon, FiSun, FiUpload, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { IoShieldCheckmark } from 'react-icons/io5';
import { MdOutlineSearch, MdOutlineBuild, MdOutlineCalendarMonth, MdOutlineContactSupport, MdDirectionsCar, MdBusiness, MdCarRepair, MdCalendarToday, MdSettings, MdFingerprint } from 'react-icons/md';
import config from '../config';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour! Je suis votre assistant chatbot de Suzuki House of Cars. Comment puis-je vous aider aujourd'hui?",
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
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get logo URL from config or use default
  const logoUrl = (typeof window !== 'undefined' && window.suzukiChatbotConfig?.logoUrl) || 'suzuli_logo.png';

  const quickActions = [];

  // Debug: Log API URL on mount
  useEffect(() => {
    console.log('🔧 Suzuki Chatbot Config:', {
      apiUrl: config.apiUrl,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
    // Clear old chat history to ensure French greeting
    localStorage.removeItem('suzuki-chat-history');
    const theme = localStorage.getItem('suzuki-theme');
    const verified = localStorage.getItem('suzuki-verified');
    const vehicle = localStorage.getItem('suzuki-vehicle');
    
    if (theme === 'dark') setIsDark(true);
    if (verified === 'true') setIsVerified(true);
    if (vehicle) {
      try {
        setVehicleInfo(JSON.parse(vehicle));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('suzuki-chat-history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('suzuki-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleFileSelect = (file) => {
    if (!file) return;
    
    const validTypes = [
      'image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif',
      'image/bmp', 'image/tiff', 'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      setVerificationError('Format non supporté. Utilisez PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF, SVG, PDF, DOC, DOCX.');
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

    setUploadedFile(file);
    setVerificationError('');
    verifyDocument(file);
  };

  const verifyDocument = async (file) => {
    setIsVerifying(true);
    setVerificationError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadUrl = `${config.apiUrl}/verification/upload`;
      console.log('📤 Uploading to:', uploadUrl);
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });
      
      console.log('✅ Upload response status:', response.status);
      const data = await response.json();
      console.log('📊 Upload response data:', data);
      
      if (data.success) {
        setVehicleInfo(data.vehicleInfo);
        setShowVehicleCard(true);
        localStorage.setItem('suzuki-verified', 'true');
        localStorage.setItem('suzuki-vehicle', JSON.stringify(data.vehicleInfo));
        
        // Store upload count
        if (data.uploadCount) {
          localStorage.setItem('suzuki-upload-count', data.uploadCount.toString());
        }
      } else {
        // Check if limit reached
        if (data.limitReached) {
          setVerificationError(`⚠️ ${data.message}\n\nVous avez utilisé ${data.uploadCount || 3}/3 téléchargements ce mois-ci.\nLa limite se réinitialise le 1er du mois prochain.`);
        } else {
          setVerificationError(data.message || 'Seules les cartes grises Suzuki sont acceptées.');
        }
        setUploadedFile(null);
      }
      setIsVerifying(false);
    } catch (error) {
      console.error('❌ Upload error:', error);
      setVerificationError('Erreur de connexion. Veuillez réessayer.');
      setUploadedFile(null);
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

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const chatUrl = `${config.apiUrl}/chat/message`;
      console.log('💬 Sending message to:', chatUrl);
      
      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          vehicle: vehicleInfo
        })
      });
      
      console.log('✅ Chat response status:', response.status);
      const data = await response.json();
      console.log('📊 Chat response data:', data);
      const botResponse = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    } catch (error) {
      console.error('❌ Chat error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "Désolé, erreur de connexion. Veuillez réessayer.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    const actionMessages = {
      search: "Nheb nfasakh 3la pièce",
      maintenance: "Chnowa el maintenance li lazem?",
      appointment: "Nheb nakheth rendez-vous",
      contact: "Kifech najjem nousel bikom?"
    };
    setInputValue(actionMessages[action]);
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
      <div className={`verification-modal ${isDark ? 'dark' : ''}`}>
        <div className="verification-card">
          <div className="verification-header" style={{ background: 'linear-gradient(to bottom right, #f8fafc, #e0f2fe)', padding: '48px 30px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={logoUrl} alt="Suzuki Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', background: 'linear-gradient(90deg, #1a73e8 0%, #7c4dff 50%, #c2185b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '4px' }}>Suzuki AI Assistant</h1>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Votre expert intelligent en pièces de rechanges</p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Bonjour merci de télécharger votre carte grise Suzuki</p>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
              📊 Limite: 3 téléchargements par mois
            </p>
          </div>

          <div className="verification-content">
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
                  <div className="spinner"></div>
                  <p>Analyse en cours...</p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>Extraction des informations du véhicule</p>
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
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`chat-bubble ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <FiMessageCircle className="bubble-icon" />
        <div className="bubble-badge">1</div>
        <div className="bubble-pulse"></div>
      </div>

      <div className={`chat-container ${isOpen ? 'open' : ''} ${isDark ? 'dark' : ''}`}>
        <div className="chat-header">
          <div className="header-content">
            <div className="header-logo">
              <div className="logo-circle">
                <img src={logoUrl} alt="Suzuki" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              </div>
              <div className="header-text">
                <h3>Suzuki AI Assistant</h3>
                <span className="status">
                  <span className="status-dot"></span>
                  En ligne
                </span>
              </div>
            </div>
            <button className="theme-btn" onClick={() => setIsDark(!isDark)}>
              {isDark ? <FiSun /> : <FiMoon />}
            </button>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <FiX />
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-content">
                <p>{msg.text}</p>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
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
          <button className="send-btn" onClick={handleSend} disabled={!inputValue.trim()}>
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
