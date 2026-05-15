import { useEffect, useState, useCallback } from 'react';
import hrService from '@/services/hrService';

export function useHRs({ initialSearch = '', initialPage = 1, initialLimit = 10 } = {}) {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const payload = await hrService.listHRInternships({ page, limit, search: searchQuery });
      setItems(payload.items || []);
      setTotal(payload.total ?? 0);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Gagal memuat data HR.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    items,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    page,
    setPage,
    limit,
    setLimit,
    total,
    refresh: fetch,
  };
}

export default useHRs;
