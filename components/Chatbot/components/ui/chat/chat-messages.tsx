import { useEffect, useRef } from 'react';
import { CheckCircle } from 'react-feather';
import ChatItem from './chat-item';
import Column from '@/bases/Column/Column';

export interface Message {
  id: string;
  content: string;
  role: string;
}

export default function ChatMessages({
  messages,

  onQuestion
}: {
  messages: Message[];
  isLoading?: boolean;
  stop?: () => void;
  reload?: () => void;
  onQuestion: (text: string) => void;
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages?.length]);

  return (
    <Column align="CENTER">
      <div>
        <div className="w-ful flex flex-col gap-6">
          <div className="ds-message--left">
            <div className="ds-message--left-avatar">
              <CheckCircle size={18} color="#FFF" />
            </div>
            <div className="ds-message-welcome">
              <div
                className="break-words ds-message--left-t"
                dangerouslySetInnerHTML={{
                  __html: 'Hey! im the EFCSN EE24 Chatbot! Ask me anything about the EE24 repository.'
                }}
              />

              <div className="ds-message-welcome__questions">
                <button
                  onClick={() => onQuestion('What lies do you have about gender violence in Spain?')}
                  className="ds-message-welcome__questions-item"
                >
                  What lies do you have about gender violence in Spain?
                </button>
                <button
                  onClick={() => onQuestion('What did Ayuso say about climate change?')}
                  className="ds-message-welcome__questions-item"
                >
                  What did Ayuso say about climate change?
                </button>
                <button
                  onClick={() => onQuestion("What were the most notorious hoaxes during Pedro Sánchez's inauguration?")}
                  className="ds-message-welcome__questions-item"
                >
                  What were the most notorious hoaxes during Pedro {"Sánchez's"} inauguration?
                </button>
                <button
                  onClick={() => onQuestion('Do Moroccans live off public subsidies?')}
                  className="ds-message-welcome__questions-item"
                >
                  Do Moroccans live off public subsidies?
                </button>
              </div>
            </div>
          </div>
          {messages.map((m: Message) => (
            <ChatItem key={m.id} {...m} />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </Column>
  );
}
