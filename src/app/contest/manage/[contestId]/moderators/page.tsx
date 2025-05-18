"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface Moderator {
  id: string;
  username: string;
  profilePicture?: string;
  role: string;
}

function ModeratorsPage() {
  const params = useParams();
  const contestId = params?.contestId as string;

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Add state for image errors
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Fetch existing moderators
  useEffect(() => {
    const fetchModerators = async () => {
      try {
        const res = await fetch(`/api/contest/moderators/${contestId}`);
        const data = await res.json();
        if (data.success) {
          setModerators(data.moderators);
        } else {
          toast.error(data.message || "Failed to fetch moderators");
        }
      } catch (error) {
        console.error("Error fetching moderators:", error);
        toast.error("Error fetching moderators");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModerators();
  }, [contestId]);

  const handleAddModerator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setLoading(true);
    try {
      // Determine if input is email or username
      const isEmail = inputValue.includes('@');
      
      const res = await fetch(`/api/contest/add-moderators/${contestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(isEmail ? { email: inputValue } : { username: inputValue }),
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success("Moderator added successfully!");
        setInputValue("");
        
        // Refresh the moderators list
        const updatedRes = await fetch(`/api/contest/moderators/${contestId}`);
        const updatedData = await updatedRes.json();
        if (updatedData.success) {
          setModerators(updatedData.moderators);
        }
      } else {
        toast.error(data.message || "Failed to add moderator");
      }
    } catch (err) {
      toast.error("Error adding moderator");
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditModerator = async (moderatorId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/contest/edit-moderator/${contestId}/${moderatorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success("Moderator role updated successfully!");
        
        // Update the moderator in the local state
        setModerators(prev => 
          prev.map(mod => 
            mod.id === moderatorId ? { ...mod, role: newRole } : mod
          )
        );
      } else {
        toast.error(data.message || "Failed to update moderator");
      }
    } catch (err) {
      toast.error("Error updating moderator");
    }
  };
  
  const handleRemoveModerator = async (moderatorId: string) => {
    // Don't allow removing the owner
    const moderator = moderators.find(mod => mod.id === moderatorId);
    if (moderator?.role === 'owner') {
      toast.error("Cannot remove the contest owner");
      return;
    }
    
    // Confirm before removing
    if (!window.confirm(`Are you sure you want to remove ${moderator?.username} as a moderator?`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/contest/delete-moderator/${contestId}/${moderatorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success("Moderator removed successfully");
        // Update the moderators list
        setModerators(moderators.filter(mod => mod.id !== moderatorId));
      } else {
        toast.error(data.message || "Failed to remove moderator");
      }
    } catch (err) {
      console.error("Error removing moderator:", err);
      toast.error("Error removing moderator");
    }
  };
  
  const handleImageError = (moderatorId: string) => {
    setImageErrors(prev => ({...prev, [moderatorId]: true}));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Modify Existing Moderators</h1>
        <p className="text-gray-400 mb-8">Users with moderator access can edit your contest.</p>
        
        {/* Add moderator section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Add Moderators</h2>
          <form onSubmit={handleAddModerator} className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Email or username"
              className="flex-1 p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              Add
            </button>
          </form>
        </div>
        
        {/* Current moderators section */}
        <h2 className="text-xl font-semibold mb-4">Current Moderators</h2>
        
        {isLoading ? (
          <div className="text-center py-8">Loading moderators...</div>
        ) : moderators.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No moderators found</div>
        ) : (
          <div className="space-y-4">
            {moderators.map((moderator) => (
              <div key={moderator.id} className="flex items-center gap-4 p-4 bg-[#1e293b] rounded-lg border border-blue-800">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-blue-800 flex items-center justify-center">
                  {moderator.profilePicture && !imageErrors[moderator.id] ? (
                    <Image 
                      src={moderator.profilePicture}
                      alt={moderator.username}
                      fill
                      sizes="40px"
                      className="object-cover"
                      onError={() => handleImageError(moderator.id)}
                    />
                  ) : (
                    <span className="text-lg font-bold">{moderator.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{moderator.username}</div>
                  <div className="text-sm text-gray-400">{moderator.role}</div>
                </div>
                
                {/* Action buttons for moderators */}
                {moderator.role !== 'owner' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRemoveModerator(moderator.id)}
                      className="text-red-400 hover:text-red-500 p-2 transition-colors"
                      title="Remove moderator"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                    </button>
                    
                    {/* Only show edit button for moderators (not owners) */}
                    <button
                      onClick={() => {
                        // Currently we only support the "moderator" role, but in the future you might
                        // add more roles like "admin", "viewer", etc.
                        const newRole = moderator.role === "moderator" ? "admin-moderator" : "moderator";
                        handleEditModerator(moderator.id, newRole);
                      }}
                      className="text-blue-400 hover:text-blue-500 p-2 transition-colors"
                      title="Change moderator role"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModeratorsPage;