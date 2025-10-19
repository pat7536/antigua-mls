'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserRole } from '@/contexts/UserRoleContext';
import type { FavoritesList } from '@/types/favoritesList';

type AddToListButtonProps = {
  propertyId: string;
};

export default function AddToListButton({ propertyId }: AddToListButtonProps) {
  const { isSignedIn } = useUser();
  const { role } = useUserRole();
  const [lists, setLists] = useState<FavoritesList[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');

  // Only show for realtors
  if (!isSignedIn || (role !== 'realtor' && role !== 'admin')) {
    return null;
  }

  useEffect(() => {
    if (showModal) {
      fetchLists();
    }
  }, [showModal]);

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/lists');
      if (response.ok) {
        const data = await response.json();
        setLists(data.lists);
      }
    } catch (error) {
      console.error('Failed to fetch lists:', error);
    }
  };

  const addToList = async (listId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lists/${listId}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          note: selectedNote.trim() || undefined,
        }),
      });

      if (response.ok) {
        alert('Property added to list!');
        setShowModal(false);
        setSelectedNote('');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add property');
      }
    } catch (error) {
      alert('Failed to add property to list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowModal(true);
        }}
        className="w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
      >
        Add to List
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add to Favorites List</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optional Note
              </label>
              <textarea
                value={selectedNote}
                onChange={(e) => setSelectedNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="e.g., Great view, needs minor repairs..."
              />
            </div>

            {lists.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">
                  You don&apos;t have any favorites lists yet.
                </p>
                <button
                  onClick={() => {
                    setShowModal(false);
                    window.location.href = '/dashboard/favorites-lists';
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create a List
                </button>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Select a list:
                </h3>
                {lists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => addToList(list.id)}
                    disabled={loading}
                    className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <div className="font-medium text-gray-900">
                      {list.title}
                    </div>
                    {list.description && (
                      <div className="text-sm text-gray-600">
                        {list.description}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {list._count.properties} properties
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedNote('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
