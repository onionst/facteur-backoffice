import { MessageCircle } from 'react-feather';
import Frame from '@/components/Frame/Frame';
import Header from '@/components/Header/Header';
import Wrapper from '@/components/Wrapper/Wrapper';
import { SETTINGS } from '@/constants/settings';

export default function Chatbot() {
  return (
    <>
      <Header icon={<MessageCircle />} title="Chatbot" />
      <Wrapper>
        <Frame src={SETTINGS.PUBLIC_CHATBOT_URL} />
      </Wrapper>
    </>
  );
}
