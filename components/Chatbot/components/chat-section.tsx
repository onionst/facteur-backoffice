'use client';

import { useChat } from 'ai/react';
import { ChatInput, ChatMessages } from './ui/chat';
import Page from '@/components/Page/Page';
import { MODEL } from '@/constants/model';
import { SETTINGS } from '@/constants/settings';

export default function ChatSection() {
  const { messages, input, isLoading, handleSubmit, handleInputChange, reload, stop, setMessages } = useChat({
    api: SETTINGS.PUBLIC_CHATBOT_URL
  });

  return (
    <Page>
      <div className="w-full h-min ds-messages-width">
        <div className="w-full space-between ds-messages-width__container">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            reload={reload}
            stop={stop}
            onQuestion={question => {
              // @ts-ignore
              setMessages([...messages, { role: 'user', content: question }]);
              reload();
            }}
          />
          <div className="ds-rel w-full">
            <ChatInput
              input={input}
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
              // @ts-ignore
              multiModal={MODEL === 'gpt-4-vision-preview'}
            />
          </div>
        </div>
      </div>
    </Page>
  );
}
