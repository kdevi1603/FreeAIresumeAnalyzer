import React from 'react';
import { renderToString } from 'react-dom/server';
import AiAgentChat from './frontend/src/components/studio/AiAgentChat.jsx';

try {
  const html = renderToString(React.createElement(AiAgentChat, {
    resumeData: {},
    chatMessages: [{ sender: 'bot', text: 'Hello' }],
    onSendMessage: () => {},
    isTyping: false,
    autoFixMessage: null,
    onApplyFix: () => {}
  }));
  console.log('SUCCESS');
} catch (e) {
  console.error('ERROR:', e);
}
