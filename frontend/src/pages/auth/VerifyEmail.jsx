import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '@/api/axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Sedang memverifikasi email kamu...');
  const hasRequestedRef = useRef(false);

  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  useEffect(() => {
    if (hasRequestedRef.current) {
      return;
    }
    hasRequestedRef.current = true;

    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token verifikasi tidak ditemukan.');
        return;
      }

      try {
        const res = await api.get('/auth/verify-email', {
          params: { token },
        });
        setStatus('success');
        setMessage(res.data?.message || 'Email berhasil diverifikasi. Kamu bisa login sekarang.');
      } catch (err) {
        const detail = err.response?.data?.detail || '';
        if (typeof detail === 'string' && detail.toLowerCase().includes('token sudah digunakan')) {
          setStatus('success');
          setMessage('Email sudah pernah diverifikasi sebelumnya. Kamu bisa langsung login.');
          return;
        }

        setStatus('error');
        setMessage(detail || 'Verifikasi gagal atau token tidak valid.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-0">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Verifikasi Email</h2>

        {status === 'loading' && <p className="text-gray-600">{message}</p>}

        {status === 'success' && (
          <>
            <p className="bg-green-100 text-green-700 p-4 rounded text-sm mb-4">{message}</p>
            <Link to="/login" className="btn-primary inline-block">
              Lanjut ke Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="bg-red-100 text-red-700 p-4 rounded text-sm mb-4">{message}</p>
            <div className="flex gap-4 justify-center">
              <Link to="/" className="px-4 py-3.5 rounded border border-gray-300 hover:bg-gray-50">
                Kembali ke Home
              </Link>
              <Link to="/login" className="btn-primary inline-block">
                Ke Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
