'use client';

import { CheckCircle, User } from 'react-feather';
import { Message } from './chat-messages';

export default function ChatItem(message: Message) {
  if (message.role === 'user') {
    return (
      <div className="ds-message--right">
        <div className="break-words ds-message--right-t" dangerouslySetInnerHTML={{ __html: message.content }} />
        <div className="ds-message--right-avatar">
          <User size={18} color="#252f4a" />
        </div>
      </div>
    );
  }

  return (
    <div className="ds-message--left">
      <div className="ds-message--left-avatar">
        <CheckCircle size={18} color="#FFF" />
      </div>
      <div className="break-words ds-message--left-t" dangerouslySetInnerHTML={{ __html: message.content }} />
    </div>
  );
}
