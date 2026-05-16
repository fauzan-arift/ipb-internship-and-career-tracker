import { useState, useEffect, useCallback } from 'react';
import { hrApplicationService } from '@/services/hrApplicationService';

const ITEMS_PER_PAGE = 5;

function useApplicants() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
      };
      if (statusFilter) {
        params.status = statusFilter;
      }
      
      const data = await hrApplicationService.getAllApplicants(params);
      
      const mappedItems = data.items.map(item => ({
        id: item.id,
        name: item.student.full_name,
        major: item.student.major,
        appliedDate: item.application_time ? new Date(item.application_time).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric'
        }) : '-',
        status: item.status,
        internshipTitle: item.internship_title,
      }));

      let finalItems = mappedItems;
      
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        finalItems = mappedItems.filter(
          (a) =>
            a.name?.toLowerCase().includes(q) ||
            a.major?.toLowerCase().includes(q) ||
            a.status?.toLowerCase().includes(q) ||
            a.internshipTitle?.toLowerCase().includes(q)
        );
      }

      setItems(finalItems);
      setTotal(data.total);
      setTotalPages(data.total_pages || Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (err) {
      console.error('Failed to fetch applicants:', err);
      setError(err.message || 'Gagal memuat data pelamar');
      setItems([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchQuery]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const from = total === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const to = Math.min(page * ITEMS_PER_PAGE, total);

  function handleSetSearchQuery(q) {
    setSearchQuery(q);
    setPage(1);
  }

  function handleSetStatusFilter(status) {
    setStatusFilter(status);
    setPage(1);
  }

  return {
    items,
    total,
    totalPages,
    page,
    from,
    to,
    setPage,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
    loading,
    error,
    refetch: fetchApplicants
  };
}

export default useApplicants;