"use client";

import { useState } from 'react';
import Image from 'next/image';
import { CommentData, User } from '@/app/lib/types';
import NewCommentForm from './NewCommentForm';

type CommentProps = {
  comment: CommentData;
  currentUser: User;
  onDelete: (id: number) => void;
  onUpdate: (id: number, content: string) => void;
  onReply: (content: string, replyingToId: number) => void;
  onUpdateScore: (id: number, direction: 'up' | 'down') => void;
};

export default function Comment({ comment, currentUser, onDelete, onUpdate, onReply, onUpdateScore }: CommentProps) {
  // --- INTERNAL UI STATE ---
  // To track if the user is currently replying or editing this specific comment.
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // This state will hold the text while editing.
  const [editText, setEditText] = useState(comment.content);
  
  const isCurrentUser = comment.user.username === currentUser.username;
  const imagePath = comment.user.image.png.replace('./', '/');

  const handleReplySubmit = (content: string) => {
    onReply(content, comment.id); // Call the main reply function from the parent
    setIsReplying(false); // Close the reply form after submitting
  };
  
  const handleUpdateSubmit = () => {
    onUpdate(comment.id, editText);
    setIsEditing(false); 
  };
  
  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm flex flex-col sm:flex-row gap-5">
        {/* Vote Counter */}
        <div className="hidden sm:flex flex-col items-center bg-slate-100 rounded-lg p-2 h-fit">
          <button onClick={() => onUpdateScore(comment.id, 'up')} className="text-indigo-300 font-bold hover:text-indigo-600">+</button>
          <span className="text-indigo-600 font-bold my-2 text-lg">{comment.score}</span>
          <button onClick={() => onUpdateScore(comment.id, 'down')} className="text-indigo-300 font-bold hover:text-indigo-600">-</button>
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between">
            {/* ... (user info header) ... */}
            <div className="flex items-center gap-4">
              <Image 
                src={imagePath} 
                alt={comment.user.username} 
                width={32} 
                height={32} 
                className="rounded-full" 
              />
              <span className="font-bold text-slate-800">{comment.user.username}</span>
              {isCurrentUser && (
                <span className="bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-sm">you</span>
              )}
              <span className="text-slate-500">{comment.createdAt}</span>
            </div>

             <div className="hidden sm:flex items-center gap-6">
              {isCurrentUser ? (
                <>
                  <button onClick={() => onDelete(comment.id)} className="flex items-center gap-2 text-red-500 font-bold hover:text-red-300">
                    <Image src="/icon-delete.svg" alt="" width={12} height={14} /> Delete
                  </button>
                  <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-300">
                    <Image src="/icon-edit.svg" alt="" width={14} height={14} /> Edit
                  </button>
                </>
              ) : (
                <button onClick={() => setIsReplying(!isReplying)} className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-300">
                  <Image src="/icon-reply.svg" alt="" width={14} height={12} /> Reply
                </button>
              )}
            </div>
          </div>
          
          {/* --- CONDITIONAL EDITING VIEW --- */}
          {isEditing ? (
            <div className="mt-4">
              <textarea 
                className="w-full border border-slate-200 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button 
                onClick={handleUpdateSubmit}
                className="bg-indigo-600 text-white font-medium uppercase px-8 py-3 rounded-lg hover:bg-indigo-400 float-right mt-2"
              >
                Update
              </button>
            </div>
          ) : (
            <p className="text-slate-500 mt-4">
              {comment.replyingTo && <span className="font-bold text-indigo-600">@{comment.replyingTo} </span>}
              {comment.content}
            </p>
          )}

          {/* ... (Mobile bottom bar with onClick handlers) ... */}
        </div>
      </div>
      
      {/* --- CONDITIONAL REPLY FORM --- */}
      {isReplying && (
        <div className="mt-4">
          <NewCommentForm 
            currentUser={currentUser} 
            handleSubmit={handleReplySubmit}
            buttonText="Reply"
          />
        </div>
      )}

      {/* --- REPLIES SECTION --- */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-4 sm:pl-8 mt-4 border-l-2 border-slate-200 space-y-4">
          {comment.replies.map((reply) => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              currentUser={currentUser}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onReply={onReply}
              onUpdateScore={onUpdateScore}
            />
          ))}
        </div>
      )}
    </>
  );
}