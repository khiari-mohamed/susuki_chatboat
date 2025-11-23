import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const initChatbot = () => {
  let container = document.getElementById('suzuki-chatbot-root');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'suzuki-chatbot-root';
    document.body.appendChild(container);
  }

  const root = ReactDOM.createRoot(container);
  root.render(<App />);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}

export default initChatbot;
