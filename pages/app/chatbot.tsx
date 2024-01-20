import { MessageCircle } from 'react-feather';
import ChatSection from '@/components/Chatbot/components/chat-section';
import Header from '@/components/Header/Header';
import Wrapper from '@/components/Wrapper/Wrapper';

export default function Chatbot() {
  return (
    <>
      <Header icon={<MessageCircle />} title="Chatbot" />
      <Wrapper>
        <ChatSection />
      </Wrapper>
    </>
  );
}
