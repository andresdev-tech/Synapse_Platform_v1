'use client';
import { useAuth } from '../../lib/AuthContext';
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('@/components/dashboard/roles/AdminDashboard'), { ssr: false });
const CoordinadorDashboard = dynamic(() => import('@/components/dashboard/roles/CoordinadorDashboard'), { ssr: false });
const ProfesorDashboard = dynamic(() => import('@/components/dashboard/roles/ProfesorDashboard'), { ssr: false });
const AprendizDashboard = dynamic(() => import('@/components/dashboard/roles/AprendizDashboard'), { ssr: false });

export default function DashboardPage() {
  const { loading, isAdmin, isProfesor, usuario } = useAuth();
  const esCoordinador = usuario?.rol?.toLowerCase() === 'coordinador';
  const esAprendiz = usuario?.rol?.toLowerCase() === 'aprendiz';

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isAdmin() || usuario?.rol?.toUpperCase() === 'ADMINISTRADOR' || usuario?.rol?.toUpperCase() === 'ADMIN') return <AdminDashboard />;
  if (esCoordinador || usuario?.rol?.toUpperCase() === 'COORDINADOR') return <CoordinadorDashboard />;
  if (isProfesor() || usuario?.rol?.toUpperCase() === 'PROFESOR') return <ProfesorDashboard />;
  
  // Por defecto (Aprendiz o UNKNOWN) igual que el Sidebar
  return <AprendizDashboard />;
}
