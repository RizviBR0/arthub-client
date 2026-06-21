"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { FiMessageSquare, FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function CommentsSection({ artworkId }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New comment state
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit comment state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    isDanger: true,
    onConfirm: () => {}
  });

  const closeConfirmModal = () => {
    setConfirmModalState(prev => ({ ...prev, isOpen: false }));
  };

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/artworks/${artworkId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  }, [artworkId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (artworkId) fetchComments();
  }, [artworkId, fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ artworkId, text: newComment })
      });

      if (!res.ok) throw new Error("Failed to add comment");
      
      const data = await res.json();
      setComments([data.comment, ...comments]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (id) => {
    setConfirmModalState({
      isOpen: true,
      title: "Delete Comment",
      message: "Are you sure you want to delete your comment?",
      confirmText: "Delete",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/comments/${id}`, {
            method: "DELETE",
            credentials: "include"
          });

          if (!res.ok) throw new Error("Failed to delete");
          
          setComments(comments.filter(c => c._id !== id));
          toast.success("Comment deleted");
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete comment");
        }
      }
    });
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: editText })
      });

      if (!res.ok) throw new Error("Failed to update");
      
      setComments(comments.map(c => 
        c._id === id ? { ...c, text: editText, editedAt: new Date().toISOString() } : c
      ));
      
      setEditingId(null);
      setEditText("");
      toast.success("Comment updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update comment");
    }
  };

  return (
    <div className="mt-16 border-t border-[#e8ddd1] pt-12">
      <h3 className="text-2xl font-bold text-[#3d3029] font-serif mb-8 flex items-center gap-3">
        <FiMessageSquare /> Discussion ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <div className="mb-10 bg-[#faf8f5] p-6 rounded-xl border border-[#e8ddd1]">
        {user ? (
          <form onSubmit={handleAddComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts on this artwork..."
              rows="3"
              className="w-full px-4 py-3 border border-[#d4c3b3] rounded-lg focus:outline-none focus:border-[#b07c5b] focus:ring-1 focus:ring-[#b07c5b] transition-colors resize-none mb-3"
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-6 py-2.5 bg-[#3d3029] text-white rounded-md font-medium hover:bg-[#2d2522] transition-colors disabled:opacity-70"
              >
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-[#7a6e64] mb-3">You must be logged in to join the discussion.</p>
            <Link 
              href="/signin" 
              className="inline-block px-6 py-2 border-2 border-[#b07c5b] text-[#b07c5b] rounded-md font-medium hover:bg-[#faf5ef] transition-colors"
            >
              Sign In to Comment
            </Link>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-[#ece5de] rounded-xl w-full"></div>
            <div className="h-20 bg-[#ece5de] rounded-xl w-full"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-[#7a6e64] italic text-center py-8">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-white p-5 rounded-xl border border-[#e8ddd1] shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold text-[#3d3029]">{comment.userName}</span>
                  <span className="text-xs text-[#a89888] ml-3">
                    {new Date(comment.createdAt).toLocaleDateString()} 
                    {comment.editedAt && " (edited)"}
                  </span>
                </div>
                
                {/* Edit/Delete Controls */}
                {user && user.id === comment.userId && editingId !== comment._id && (
                  <div className="flex gap-2 text-[#a89888]">
                    <button onClick={() => handleStartEdit(comment)} className="hover:text-[#b07c5b] transition-colors" title="Edit">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteComment(comment._id)} className="hover:text-red-500 transition-colors" title="Delete">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Editing Mode vs View Mode */}
              {editingId === comment._id ? (
                <div className="mt-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-[#b07c5b] rounded-md focus:outline-none mb-2 text-[#5a4d42]"
                  ></textarea>
                  <div className="flex justify-end gap-2">
                    <button onClick={handleCancelEdit} className="p-2 text-[#7a6e64] hover:bg-[#faf8f5] rounded-md" title="Cancel">
                      <FiX />
                    </button>
                    <button onClick={() => handleSaveEdit(comment._id)} disabled={!editText.trim()} className="p-2 text-green-600 hover:bg-green-50 rounded-md" title="Save">
                      <FiCheck />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[#5a4d42] whitespace-pre-wrap">{comment.text}</p>
              )}
            </div>
          ))
        )}
      </div>
      <ConfirmModal {...confirmModalState} onClose={closeConfirmModal} />
    </div>
  );
}
