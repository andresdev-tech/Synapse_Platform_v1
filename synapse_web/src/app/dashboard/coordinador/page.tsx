'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { coordinadorAPI, usuariosAPI, programasAPI } from '../../../lib/api';
import { Users, BookOpen, ChevronRight, LayoutGrid, Sparkles, ArrowRightCircle, UserPlus, X, User } from 'lucide-react';

interface Programa {
  id: number;
  nombre: string;
  sector: string;
  activo: boolean;
  total_grupos?: number;
  aprendices_asignados?: number;
  inscripciones_pendientes?: number;
}

export default function CoordinadorPage() {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);

  // States for Assign Professor
  const [modalProfesoresOpen, setModalProfesoresOpen] = useState(false);
  const [profesoresList, setProfesoresList] = useState<any[]>([]);
  const [selectedProgramaId, setSelectedProgramaId] = useState<string>('');
  const [selectedProfesorId, setSelectedProfesorId] = useState<string>('');
  const [procesandoAsignacion, setProcesandoAsignacion] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');

  useEffect(() => {
    const cargarProgramas = async () => {
      try {
        const response = await programasAPI.listar();
        setProgramas(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarProgramas();
  }, []);

  const abrirModalAsignacion = async () => {
    setModalProfesoresOpen(true);
    setMensajeModal('');
    try {
      const res = await usuariosAPI.listarTodos();
      // El backend devuelve { success: true, data: [...] } o [...] dependiendo de la versión
      const lista = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const profes = lista.filter((u: any) => 
        u.rol_nombre?.toLowerCase() === 'profesor' || 
        u.roles?.nombre?.toLowerCase() === 'profesor' ||
        String(u.rol_id) === '3' || 
        u.rol === 'Profesor'
      );
      setProfesoresList(profes);
    } catch (error) {
      console.error("Error al cargar profesores", error);
      setMensajeModal("No se pudieron cargar los profesores.");
    }
  };

  const asignarProfesor = async () => {
    if (!selectedProgramaId || !selectedProfesorId) {
      setMensajeModal('Por favor selecciona un programa y un profesor.');
      return;
    }
    setProcesandoAsignacion(true);
    setMensajeModal('');
    try {
      // Usamos string para mantener el UUID
      await programasAPI.asignarProfesor(selectedProgramaId as any, selectedProfesorId as any);
      setMensajeModal('¡Profesor asignado correctamente!');
      setTimeout(() => setModalProfesoresOpen(false), 2000);
    } catch (error: any) {
      setMensajeModal(error.response?.data?.message || 'Error al asignar el profesor.');
    } finally {
      setProcesandoAsignacion(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-500 border-t-white mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Cargando el panel del coordinador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-10">
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 sm:h-96 bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 opacity-90 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12">
          <div className="rounded-[1.5rem] sm:rounded-[2rem] bg-white/90 shadow-2xl border border-white/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-sky-800 font-semibold mb-2 sm:mb-3">Coordinador</p>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-slate-900 leading-tight">Bienvenido de nuevo, Coordinador</h1>
                <p className="mt-2 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg text-slate-600">Administra tus programas, asigna aprendices y revisa el estado de grupos desde un panel claro y moderno.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 w-full lg:w-auto">
                <div className="rounded-2xl sm:rounded-3xl bg-slate-900/95 p-3 sm:p-5 text-white shadow-xl">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Programas</p>
                  <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold">{programas.length}</p>
                </div>
                <div className="rounded-2xl sm:rounded-3xl bg-sky-500/95 p-3 sm:p-5 text-white shadow-xl">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-100">Sectores</p>
                  <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold">{new Set(programas.map((programa) => programa.sector)).size}</p>
                </div>
                <div className="rounded-2xl sm:rounded-3xl bg-violet-500/95 p-3 sm:p-5 text-white shadow-xl">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-100">Modalidades</p>
                  <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold">3</p>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="rounded-2xl sm:rounded-3xl bg-slate-50 p-4 sm:p-6 shadow-lg border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4 sm:mb-5 text-slate-800">
                    <div className="rounded-2xl bg-sky-100 p-2 sm:p-3 text-sky-600">
                      <LayoutGrid size={20} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-slate-500">Estado general</p>
                      <h2 className="text-xl sm:text-2xl font-semibold">Visión general de tus programas</h2>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-slate-600">Revisa la carga de trabajo de cada programa y accede directo a la gestión de grupos desde los atajos más importantes.</p>
                </div>
              </div>

              <div className="rounded-2xl sm:rounded-3xl bg-slate-900 p-4 sm:p-6 shadow-xl border border-white/10 text-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div className="rounded-2xl bg-white/10 p-2 sm:p-3 text-cyan-200">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-slate-300">Consejo rápido</p>
                      <h2 className="text-xl sm:text-2xl font-semibold">Optimiza tus grupos</h2>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-slate-300">Usa las tarjetas de programa para ver métricas rápidas, luego entra a cada grupo y gestiona expulsiones, suspensiones o reasignaciones.</p>
                </div>
              </div>

              <div className="rounded-2xl sm:rounded-3xl bg-indigo-600 p-4 sm:p-6 shadow-xl border border-white/10 text-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div className="rounded-2xl bg-white/10 p-2 sm:p-3 text-indigo-200">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-indigo-200">Docentes</p>
                      <h2 className="text-xl sm:text-2xl font-semibold">Asignar Profesores</h2>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-indigo-100">Vincula a los docentes con los programas de formación para que puedan gestionar sus grupos y calificaciones.</p>
                </div>
                <button onClick={abrirModalAsignacion} className="mt-4 sm:mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-600 shadow-md transition hover:bg-slate-100">
                  <UserPlus size={18} /> Asignar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {programas.map(programa => (
            <div key={programa.id} className="group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 bg-white shadow-2xl transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-32 sm:h-40 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 opacity-90"></div>
              <div className="relative p-4 sm:p-6 pt-12 sm:pt-16">
                <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-slate-200">{programa.sector}</p>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{programa.nombre}</h2>
                  </div>
                  <div className="rounded-2xl sm:rounded-3xl bg-white/95 p-2 sm:p-3 shadow-sm text-slate-900">
                    <BookOpen size={18} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="rounded-2xl sm:rounded-3xl bg-slate-50 p-3 sm:p-4 border border-slate-200">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Grupos</p>
                    <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-slate-900">{programa.total_grupos ?? 0}</p>
                  </div>
                  <div className="rounded-2xl sm:rounded-3xl bg-slate-50 p-3 sm:p-4 border border-slate-200">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Aprendices</p>
                    <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-slate-900">{programa.aprendices_asignados ?? 0}</p>
                  </div>
                </div>

                <div className="rounded-2xl sm:rounded-3xl bg-slate-50 p-3 sm:p-4 border border-slate-200 mb-4 sm:mb-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Pendientes</p>
                  <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-slate-900">{programa.inscripciones_pendientes ?? 0}</p>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Link href={`/dashboard/coordinador/grupo/${programa.id}`}>
                    <button className="w-full inline-flex items-center justify-center gap-2 rounded-2xl sm:rounded-3xl bg-slate-900 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-slate-800">
                      <ArrowRightCircle size={16} /> Gestionar programa
                    </button>
                  </Link>
                  <Link href={`/dashboard/coordinador/grupo/${programa.id}`}>
                    <button className="w-full inline-flex items-center justify-center gap-2 rounded-2xl sm:rounded-3xl bg-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
                      <ChevronRight size={16} /> Ver grupos
                    </button>
                  </Link>
                </div>

                <div className="mt-4 sm:mt-6 flex items-center justify-between text-xs sm:text-sm font-medium">
                  <span className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 ${programa.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {programa.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="text-slate-400">Coordinación</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* MODAL ASIGNAR PROFESORES */}
      {modalProfesoresOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">Asignar Profesor</h3>
                <p className="text-indigo-200 text-sm mt-1">Vincula un docente a un programa</p>
              </div>
              <button onClick={() => setModalProfesoresOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              {mensajeModal && (
                <div className={`p-3 rounded-xl text-sm font-medium mb-4 ${mensajeModal.includes('correctamente') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {mensajeModal}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Programa</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    value={selectedProgramaId}
                    onChange={(e) => setSelectedProgramaId(e.target.value)}
                  >
                    <option value="">Selecciona un programa...</option>
                    {programas.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Profesor</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    value={selectedProfesorId}
                    onChange={(e) => setSelectedProfesorId(e.target.value)}
                  >
                    <option value="">Selecciona un docente...</option>
                    {profesoresList.map(p => (
                      <option key={p.id} value={p.id}>{p.nombres} {p.apellidos} - {p.numero_documento}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={() => setModalProfesoresOpen(false)} className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
                  Cancelar
                </button>
                <button 
                  onClick={asignarProfesor}
                  disabled={procesandoAsignacion}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {procesandoAsignacion ? 'Asignando...' : 'Asignar Docente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}