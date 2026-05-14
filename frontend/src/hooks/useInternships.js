import { useEffect, useState, useCallback } from 'react';
import internshipService from '@/services/internshipService';

export function useInternships({ initialSearch = '' } = {}) {
  const [internships, setInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  const fetchInternships = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const payload = await internshipService.listActiveInternships({
        page,
        limit,
        search: searchQuery,
      });

      setInternships(payload.items || []);
      setTotal(payload.total ?? 0);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Gagal memuat lowongan magang.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  return {
    internships,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    page,
    setPage,
    limit,
    total,
    refresh: fetchInternships,
  };
}
