'use client';
import { useEffect } from 'react';
export default function AdminRedirect() {
  useEffect(() => {
    window.location.href = 'https://quantalyze.up.railway.app/admin';
  }, []);
  return <div>Redirecting to admin...</div>;
}
