import React, { useState, useEffect, useMemo } from 'react';
import { getUsers } from '../services/api';
import { User } from '../types';
import SearchBar from '../components/SearchBar';
import UserTable from '../components/UserTable';
import { useDebounce } from '../hooks/useDebounce';

export default function Dashboard() {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const debouncedSearch = useDebounce(search, 300);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      setUserList(response.data);
    } catch (err) {
      setError('Unable to load user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Reset page on search/sort
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortConfig]);

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...userList];

    // Search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof User];
        let bValue: any = b[sortConfig.key as keyof User];

        if (sortConfig.key === 'company.name') {
          aValue = a.company.name;
          bValue = b.company.name;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [userList, debouncedSearch, sortConfig]);

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentUsers = filteredAndSortedUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-8 py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600">
          User Directory Dashboard
        </h1>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Table */}
      {currentUsers.length === 0 ? (
        <p className="text-center text-gray-500">No users found</p>
      ) : (
        <UserTable users={currentUsers} />
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">
          Showing {filteredAndSortedUsers.length === 0 ? 0 : startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredAndSortedUsers.length)} of{" "}
          {filteredAndSortedUsers.length} results
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? "bg-blue-500 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}