'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import type { FavoritesList } from '@/types/favoritesList';

export default function FavoritesListsPage() {
  const { user } = useUser();
  const [lists, setLists] = useState<FavoritesList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lists');
      if (!response.ok) {
        throw new Error('Failed to fetch lists');
      }
      const data = await response.json();
      setLists(data.lists);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lists');
    } finally {
      setLoading(false);
    }
  };

  const createList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      setCreating(true);
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newListTitle.trim(),
          description: newListDescription.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create list');
      }

      const data = await response.json();
      setLists([data.list, ...lists]);
      setNewListTitle('');
      setNewListDescription('');
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create list');
    } finally {
      setCreating(false);
    }
  };

  const generateShareLink = async (listId: string) => {
    try {
      const response = await fetch(`/api/lists/${listId}/share`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate share link');
      }

      const data = await response.json();
      const shareUrl = `${window.location.origin}/list/${data.shareUuid}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);

      // Update the list with the new share UUID
      setLists(
        lists.map((list) =>
          list.id === listId ? { ...list, shareUuid: data.shareUuid } : list
        )
      );

      alert(`Share link copied to clipboard!\n${shareUrl}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate share link'
      );
    }
  };

  const deleteList = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this list?')) return;

    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete list');
      }

      setLists(lists.filter((list) => list.id !== listId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete list');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading your favorites lists...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Favorites Lists</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New List
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Create New Favorites List
            </h2>
            <form onSubmit={createList}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  List Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Client: Thompson Family"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="e.g., Luxury homes under $2M"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newListTitle.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lists Grid */}
      {lists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            You haven&apos;t created any favorites lists yet.
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First List
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {list.title}
                </h3>
                {list.description && (
                  <p className="text-gray-600 text-sm">{list.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{list._count.properties} properties</span>
                <span>{new Date(list.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => generateShareLink(list.id)}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                >
                  {list.shareUuid ? 'Copy Share Link' : 'Generate Share Link'}
                </button>

                {list.shareUuid && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>Public URL:</strong>
                    <br />
                    {window.location.origin}/list/{list.shareUuid}
                  </div>
                )}

                <button
                  onClick={() => deleteList(list.id)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                >
                  Delete List
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
