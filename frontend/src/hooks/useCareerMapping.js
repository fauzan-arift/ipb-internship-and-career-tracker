import { useState, useEffect, useCallback } from 'react';
import { studentService } from '@/services/studentService';

/**
 * Hook untuk mengambil data career mapping dari backend.
 * GET /api/v1/students/career-mapping
 *
 * Returns:
 *   data       — { faculty, major, grand_total_students, last_updated, company_distributions[] }
 *   isLoading  — true saat fetch pertama berlangsung
 *   error      — string pesan error jika gagal, null jika berhasil
 *   refresh()  — trigger refetch manual
 */
export function useCareerMapping() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCareerMapping = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await studentService.getCareerMapping();
      setData(result);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(', '));
      } else {
        setError('Gagal memuat data career mapping.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCareerMapping();
  }, [fetchCareerMapping]);

  return { data, isLoading, error, refresh: fetchCareerMapping };
}
