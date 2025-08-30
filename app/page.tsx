// I need to use state and effects, so I'm marking this as a Client Component.
"use client";

import { useState, useEffect } from 'react';
import initialData from './lib/data.json';
import Comment from '@/component/comment';
import NewCommentForm from '@/component/NewCommentForm';
import { rubik } from '@/app/fonts';
import { CommentData, User } from '@/app/lib/types';

export default function Home() {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [currentUser] = useState<User>(initialData.currentUser);

  // --- LOCALSTORAGE INTEGRATION ---
  useEffect(() => {    // this is for loading
    const savedComments = localStorage.getItem('interactive-comments');
    if (savedComments && savedComments !== '[]') {
      setComments(JSON.parse(savedComments));
    } else {
      setComments(initialData.comments as CommentData[]);
    }
  }, []);

  useEffect(() => {    // this is for saving
    if (comments.length > 0) {
      localStorage.setItem('interactive-comments', JSON.stringify(comments));
    }
  }, [comments]);

  // --- CREATE (Top-level comment) ---
  const addComment = (content: string) => {
    const newComment: CommentData = {
      id: Date.now(),
      content,
      createdAt: "Just now",
      score: 0,
      user: currentUser,
      replies: [],
    };
    setComments([...comments, newComment]);
  };

  // --- REWRITTEN FUNCTIONS USING IMMUTABLE .map() APPROACH ---

  const addReply = (content: string, replyingToId: number) => {
    const newReply: CommentData = {
      id: Date.now(),
      content,
      createdAt: "Just now",
      score: 0,
      user: currentUser,
      replies: [],
      replyingTo: ''
    };

    
    const addReplyRecursive = (commentList: CommentData[]): CommentData[] => {
      return commentList.map(comment => {
        if (comment.id === replyingToId) {
          
          newReply.replyingTo = comment.user.username;
          
          return { ...comment, replies: [...comment.replies, newReply] };
        }
        if (comment.replies && comment.replies.length > 0) {
          
          
          return { ...comment, replies: addReplyRecursive(comment.replies) };
        }
        
        return comment;
      });
    };
    
    setComments(addReplyRecursive(comments));
  };

  const deleteComment = (commentId: number) => {

    const filterOutComment = (commentList: CommentData[]): CommentData[] => {
      return commentList.filter(comment => {
        if (comment.id === commentId) {
          return false;
        }
        if (comment.replies && comment.replies.length > 0) {
          comment.replies = filterOutComment(comment.replies);
        }
        return true;
      });
    };
    setComments(filterOutComment([...comments]));
  };

  const updateComment = (commentId: number, newContent: string) => {
    const updateRecursive = (commentList: CommentData[]): CommentData[] => {
      return commentList.map(comment => {
        if (comment.id === commentId) {
          
          return { ...comment, content: newContent };
        }
        if (comment.replies && comment.replies.length > 0) {
          
          return { ...comment, replies: updateRecursive(comment.replies) };
        }
        return comment;
      });
    };
    setComments(updateRecursive(comments));
  };

  const updateScore = (commentId: number, direction: 'up' | 'down') => {
    const updateScoreRecursive = (commentList: CommentData[]): CommentData[] => {
      return commentList.map(comment => {
        if (comment.id === commentId) {
        
          const newScore = direction === 'up' ? comment.score + 1 : comment.score - 1;
          return { ...comment, score: newScore };
        }
        if (comment.replies && comment.replies.length > 0) {
          // Not it. Check its replies.
          return { ...comment, replies: updateScoreRecursive(comment.replies) };
        }
        return comment;
      });
    };
    setComments(updateScoreRecursive(comments));
  };

  // --- RENDER ---
  return (
    <main className={`${rubik.className} bg-slate-100 min-h-screen py-8 px-4`}>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onDelete={deleteComment}
              onUpdate={updateComment}
              onReply={addReply}
              onUpdateScore={updateScore}
            />
          ))}
        </div>
        <div className="mt-4">
          <NewCommentForm
            currentUser={currentUser}
            handleSubmit={addComment}
            buttonText="Send"
          />
        </div>
      </div>
    </main>
  );
}