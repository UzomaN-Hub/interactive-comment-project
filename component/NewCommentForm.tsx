"use client";

import { useState } from 'react';
import Image from 'next/image';
import { User } from '@/app/lib/types'; 

type NewCommentFormProps = {
  currentUser: User;
  handleSubmit: (content: string) => void;
  buttonText: string;
};

export default function NewCommentForm({ currentUser, handleSubmit, buttonText }: NewCommentFormProps) {
  const [content, setContent] = useState('');
  const imagePath = currentUser.image.png.replace('./', '/');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === '') return;
    handleSubmit(content);
    setContent('');
  };

  // --- FEATURE: Handle Ctrl+Enter Submission ---
  // I'm creating a function to handle keyboard events inside the textarea.
  // It receives a KeyboardEvent object, which I'll call `e`.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      
      e.preventDefault();

      
      if (content.trim() === '') return;
      handleSubmit(content);
      setContent('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <form onSubmit={onSubmit} className="flex items-start gap-4">
        <Image src={imagePath} alt={currentUser.username} width={40} height={40} className="rounded-full" />
        <textarea
          className="flex-grow border border-slate-200 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white font-medium uppercase px-8 py-3 rounded-lg hover:bg-indigo-400"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}