'use client';

import Image from 'next/image';
import { Message } from './chat-messages';

export default function ChatAvatar(message: Message) {
  if (message.role === 'user') {
    return (
      <div className="flex h-10 w-15 shrink-0 select-none items-center justify-center rounded-md  bg-white text-black">
        <Image className="rounded-md" src="/users.svg" alt="question Logo" width={30} height={30} priority />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-15 shrink-0 select-none items-center justify-center rounded-md  bg-white text-black">
      <Image src="/e-logo.png" alt="EFCSN Logo" width={50} height={50} priority />
    </div>
  );
}
