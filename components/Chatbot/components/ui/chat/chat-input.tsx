'use client';
import { MessageCircle } from 'react-feather';
import Button from '@/bases/Button/Button';
import { Input } from '@/bases/Input';

export interface ChatInputProps {
  /** The current value of the input */
  input?: string;
  /** An input/textarea-ready onChange handler to control the value of the input */
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Form submission handler to automatically reset input and append a user message  */
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  multiModal?: boolean;
}

export default function ChatInput(props: ChatInputProps) {
  return (
    <>
      <form onSubmit={props.handleSubmit} className="ds-form">
        <Input placeholder="Ask anything" value={props.input} onChange={props.handleInputChange} />
        <Button theme="CTA" loading={props.isLoading} type="submit">
          Send message <MessageCircle size={16} />
        </Button>
      </form>
    </>
  );
}
