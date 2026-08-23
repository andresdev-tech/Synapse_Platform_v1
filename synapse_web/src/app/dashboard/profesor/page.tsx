'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { profesorAPI } from '../../../lib/api';
import {
  GraduationCap, BookOpen, ChevronRight, Users,
  ShieldAlert, Mail, Sparkles, AlertCircle, ArrowLeft
} from 'lucide-react';

interface Programa {
  id: number;
  nombre: string;
  sector: string;
}

interface ProgramaConDatos extends Programa {
  totalAprendices: number;
  totalCondicionados: number;
}

export default function ProfesorPage() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [programas, setProgramas] = useState<ProgramaConDatos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuario && usuario.rol !== 'Profesor' && usuario.rol !== 'Administrador') {
      router.push('/dashboard');
      return;
    }
    cargar();
  }, [usuario]);

  const cargar = async () => {
    try {
      const res = await profesorAPI.misProgramas();
      const base: Programa[] = res.data;

      const conDatos = await Promise.all(
        base.map(async (p) => {
          try {
            const grupoRes = await profesorAPI.obtenerGrupo(p.id);
            const grupo = grupoRes.data as any[];
            return {
              ...p,
              totalAprendices: grupo.length,
              totalCondicionados: grupo.filter((a) => a.suspendido).length,
            };
          } catch {
            return { ...p, totalAprendices: 0, totalCondicionados: 0 };
          }
        })
      );
      setProgramas(conDatos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalCursos = programas.length;
  const totalAprendices = programas.reduce((acc, p) => acc + p.totalAprendices, 0);
  const totalCondicionados = programas.reduce((acc, p) => acc + p.totalCondicionados, 0);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* ── HERO BANNER ──────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-4 sm:px-8 py-8 sm:py-12 shadow-md border-b border-indigo-500/10">
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-white/10 blur-3xl opacity-60" />
        <div className="absolute -bottom-14 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="max-w-5xl mx-auto relative z-10">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors text-sm font-semibold mb-6 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full border border-white/20 w-fit">
            <ArrowLeft size={16} /> Volver al Dashboard
          </button>
          <div className="flex items-center gap-2 mb-3 text-white text-sm font-semibold uppercase tracking-[0.2em]">
            <GraduationCap size={16} />
            Panel Docente
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight text-white drop-shadow-sm">
            Hola, <span className="text-white">{usuario?.nombres}</span>
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl font-medium">
            Consulta tus cursos asignados, registra la asistencia y haz seguimiento a tus aprendices desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto space-y-8 -mt-8 relative z-20">

        {/* ── ESTADÍSTICAS ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Cursos a cargo',      value: totalCursos,        icon: BookOpen,    bg: 'bg-indigo-100',   color: 'text-white' },
            { label: 'Aprendices totales',  value: totalAprendices,    icon: Users,       bg: 'bg-blue-100',   color: 'text-blue-600' },
            { label: 'Condicionados',       value: totalCondicionados, icon: ShieldAlert, bg: totalCondicionados > 0 ? 'bg-red-500/20' : 'bg-slate-100', color: totalCondicionados > 0 ? 'text-red-400' : 'text-slate-500' },
          ].map(({ label, value, icon: Icon, bg, color }) => (
            <div key={label} className="bg-slate-50/80 backdrop-blur-xl rounded-[1.75rem] border border-slate-200 shadow-md p-5 hover:-translate-y-1 transform transition">
              <div className={`w-14 h-14 rounded-3xl flex items-center justify-center mb-4 ${bg} `}>
                <Icon size={24} className={color} />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{value}</div>
              <div className="text-slate-500 text-xs mt-0.5 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        {/* ── MIS CURSOS ────────────────────────────────── */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Tus Cursos</h2>

          {programas.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-md p-12 text-center backdrop-blur-xl">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6  border border-slate-200">
                <BookOpen size={36} className="text-slate-400 opacity-80" />
              </div>
              <h3 className="text-slate-900 text-lg font-bold mb-2">Aún no tienes cursos asignados</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                Cuando un Coordinador te asigne un programa, aparecerá aquí junto con la lista de
                aprendices y el control de asistencia.
              </p>
              <a
                href="mailto:admin@nexus.edu.co?subject=Solicitud%20de%20asignaci%C3%B3n%20de%20curso"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-full transition-colors shadow-lg shadow-indigo-500/20"
              >
                <Mail size={16} />
                Solicitar asignación al administrador
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {programas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => router.push(`/dashboard/profesor/grupo/${p.id}`)}
                  className="bg-white rounded-[1.75rem] border border-slate-200 shadow-md p-6 text-left hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all group backdrop-blur-xl flex flex-col h-full"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className="bg-indigo-500/10 p-3 rounded-2xl group-hover:bg-indigo-500/20 transition-colors  border border-indigo-500/10">
                      <GraduationCap size={24} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 mt-1">
                      <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-100 transition-colors">{p.nombre}</h3>
                      <span className="text-xs text-slate-500 mt-1 inline-block bg-slate-800 px-2 py-0.5 rounded-md">{p.sector}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6 pt-4 border-t border-slate-200 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                      <Users size={14} className="text-indigo-400" />
                      <span className="font-semibold text-slate-900">{p.totalAprendices}</span> aprendices
                    </div>
                    {p.totalCondicionados > 0 && (
                      <div className="flex items-center gap-2 text-xs text-red-300 bg-red-950/30 border border-red-900/30 px-3 py-1.5 rounded-lg font-medium">
                        <AlertCircle size={14} className="text-red-400" />
                        {p.totalCondicionados} en riesgo
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between w-full text-sm font-semibold text-indigo-400 group-hover:text-white transition-colors">
                    <span>Gestionar grupo</span>
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:translate-x-1 transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── BANNER MOTIVACIONAL ───────────────────────── */}
        {programas.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center gap-5 text-white border border-transparent shadow-lg backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="bg-indigo-500/20 p-4 rounded-2xl flex-shrink-0 border border-indigo-500/30 z-10 ">
              <Sparkles size={28} className="text-white" />
            </div>
            <div className="z-10 text-center sm:text-left">
              <h3 className="font-extrabold text-lg text-indigo-100">Mantén la asistencia al día</h3>
              <p className="text-blue-100/70 text-sm mt-1 max-w-2xl leading-relaxed">
                Registrar las faltas a tiempo permite detectar de forma temprana a los aprendices en riesgo de condicionamiento, mejorando la retención escolar.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}