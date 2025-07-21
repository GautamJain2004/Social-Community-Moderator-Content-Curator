const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Mock AI analysis functions - in a real app you'd call actual AI APIs
async function analyzeText(text) {
  // In a real implementation, you'd call an API like Perspective API or similar
  // This is a simplified mock implementation
  const toxicWords = ['hate', 'stupid', 'idiot', 'kill', 'attack'];
  const toxicCount = toxicWords.filter(word => 
    text.toLowerCase().includes(word.toLowerCase())
  ).length;
  
  const toxicityScore = Math.min(1, toxicCount * 0.2 + Math.random() * 0.1);
  
  // Simple sentiment analysis (positive/negative)
  const positiveWords = ['love', 'great', 'awesome', 'happy', 'good'];
  const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'angry'];
  
  const positiveCount = positiveWords.filter(word => 
    text.toLowerCase().includes(word.toLowerCase())
  ).length;
  
  const negativeCount = negativeWords.filter(word => 
    text.toLowerCase().includes(word.toLowerCase())
  ).length;
  
  const sentiment = (positiveCount - negativeCount) / 5;
  
  return {
    toxicity: toxicityScore,
    sentiment: sentiment
  };
}

async function analyzeImage(imageUrl) {
  // In a real implementation, you'd call an API like Google Cloud Vision or similar
  // This is a simplified mock implementation
  const inappropriate = Math.random() > 0.8; // 20% chance of being inappropriate
  
  return {
    inappropriate,
    labels: ['person', 'outdoor', 'nature'], // mock labels
    safeSearch: {
      adult: inappropriate,
      violence: false,
      racy: inappropriate
    }
  };
}

module.exports = {
  analyzeText,
  analyzeImage
};