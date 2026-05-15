import { useState, useMemo } from 'react';
import dummyApplicants from '@/data/dummyApplicants';

const ITEMS_PER_PAGE = 5;

function useApplicants() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return dummyApplicants;
    return dummyApplicants.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.major.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const from = (page - 1) * ITEMS_PER_PAGE + 1;
  const to = Math.min(page * ITEMS_PER_PAGE, total);

  const items = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function handleSetSearchQuery(q) {
    setSearchQuery(q);
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
    setSearchQuery: handleSetSearchQuery,
  };
}

export default useApplicants;