const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:8000/chat/message';
const vehicle = {
  marque: 'SUZUKI',
  modele: 'S-PRESSO',
  annee: 2024,
  immatriculation: '243TUNIS4698'
};

// Test conversations to review manually
const conversations = [
  {
    title: 'Test 1: Plaquette frein (multi-turn)',
    messages: ['plaquette frein', 'avant', '48500M62S50']
  },
  {
    title: 'Test 2: Batterie',
    messages: ['batterie']
  },
  {
    title: 'Test 3: Filtre (should ask clarification)',
    messages: ['filtre']
  },
  {
    title: 'Test 4: Retroviseur (should ask clarification)',
    messages: ['retroviseur']
  },
  {
    title: 'Test 5: Amortisseur (multi-turn)',
    messages: ['amortisseur', 'avant', 'gauche']
  },
  {
    title: 'Test 6: Typo - plakete',
    messages: ['plakete']
  },
  {
    title: 'Test 7: Typo - batrie',
    messages: ['batrie']
  },
  {
    title: 'Test 8: Typo - amorto',
    messages: ['amorto']
  },
  {
    title: 'Test 9: Reference search',
    messages: ['16510M65L10']
  },
  {
    title: 'Test 10: Cache soupape',
    messages: ['cache soupape']
  },
  {
    title: 'Test 11: Support batterie (accessory)',
    messages: ['support batterie']
  },
  {
    title: 'Test 12: Sangle batterie (accessory)',
    messages: ['sangle batterie']
  },
  {
    title: 'Test 13: Cache retroviseur (accessory)',
    messages: ['cache retroviseur']
  },
  {
    title: 'Test 14: Joint cache soupape (accessory)',
    messages: ['joint cache soupape']
  },
  {
    title: 'Test 15: Boitier filtre (accessory)',
    messages: ['boitier filtre']
  },
  {
    title: 'Test 16: Toc amortisseur (accessory)',
    messages: ['toc amortisseur']
  },
  {
    title: 'Test 17: Clip plaquette frein (accessory)',
    messages: ['clip plaquette frein']
  }
];

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

async function sendMessage(message, sessionId) {
  try {
    const response = await axios.post(API_URL, {
      message,
      vehicle,
      sessionId
    });
    return {
      success: true,
      response: response.data.response,
      sessionId: response.data.sessionId,
      intent: response.data.intent,
      productsFound: response.data.metadata?.productsFound || 0
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runConversation(conversation) {
  console.log('\n' + '='.repeat(80));
  console.log(`📱 ${conversation.title}`);
  console.log('='.repeat(80));
  
  let sessionId = null;
  
  for (const message of conversation.messages) {
    // User message
    console.log(`\n👤 YOU`);
    console.log(`${formatTime()}`);
    console.log(message);
    
    // Wait a bit to simulate typing
    await new Promise(r => setTimeout(r, 500));
    
    // Bot response
    const result = await sendMessage(message, sessionId);
    sessionId = result.sessionId;
    
    console.log(`\n🤖 CHATBOT`);
    console.log(`${formatTime()}`);
    
    if (result.success) {
      console.log(result.response);
      console.log(`\n[Intent: ${result.intent}, Products: ${result.productsFound}]`);
    } else {
      console.log(`❌ Error: ${result.error}`);
    }
    
    // Wait before next message
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n' + '='.repeat(80));
}

async function runAllTests() {
  console.log('🎯 MANUAL REVIEW - Chatbot Conversations');
  console.log('Review each conversation like the frontend\n');
  
  for (const conversation of conversations) {
    await runConversation(conversation);
    
    // Pause between conversations
    console.log('\n⏸️  Press Ctrl+C to stop, or wait 2 seconds for next test...\n');
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n✅ All conversations completed!');
  console.log('Review the responses above to verify chatbot behavior.');
}

runAllTests().catch(console.error);
