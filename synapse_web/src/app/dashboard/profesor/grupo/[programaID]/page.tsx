'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { profesorAPI } from '../../../../../lib/api';
import {
  ArrowLeft, Users, AlertTriangle, CheckCircle,
  Search, ShieldOff, X, Minus, Plus, Home
} from 'lucide-react';

interface Aprendiz {
  inscripcion_id: number;
  estado: string;
  total_faltas: number;
  limite_faltas: number;
  suspendido: boolean;
  fecha_inscripcion: string;
  usuario_id: number;
  nombres: string;
  apellidos: string;
  correo_electronico: string;
  numero_documento: string;
  tipo_documento: string;
}

export default function GrupoProfesorPage() {
  const { programaId } = useParams();
  const router = useRouter();

  const [grupo, setGrupo]             = useState<Aprendiz[]>([]);
  const [loading, setLoading]         = useState(true);
  const [busqueda, setBusqueda]       = useState('');
  const [seleccionado, setSeleccionado] = useState<Aprendiz | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje]         = useState('');
  const [tipoMensaje, setTipoMensaje] = useState<'info' | 'success' | 'error'>('info');

  const [nuevasFaltas, setNuevasFaltas] = useState(0);
  const [procesando, setProcesando]     = useState(false);

  useEffect(() => { cargar(); }, [programaId]);

  const cargar = async () => {
    try {
      const res = await profesorAPI.obtenerGrupo(Number(programaId));
      setGrupo(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (texto: string, tipo: 'info' | 'success' | 'error' = 'info') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(''), 5000);
  };

  const filtrados = grupo.filter(a =>
    `${a.nombres} ${a.apellidos} ${a.numero_documento} ${a.correo_electronico}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const abrirFaltas = (a: Aprendiz) => {
    setSeleccionado(a);
    setNuevasFaltas(a.total_faltas);
    setModalAbierto(true);
  };

  const guardarFaltas = async () => {
    if (!seleccionado) return;
    setProcesando(true);
    try {
      const res = await profesorAPI.actualizarFaltas(seleccionado.inscripcion_id, nuevasFaltas);
      if (res.data.suspendido && !seleccionado.suspendido) {
        mostrarMensaje(`⚠️ ${seleccionado.nombres} alcanzó el límite de faltas. Se notificó al coordinador por correo.`, 'error');
      } else {
        mostrarMensaje('Asistencia registrada correctamente.', 'success');
      }
      setModalAbierto(false);
      cargar();
    } catch (err: any) {
      mostrarMensaje(err.response?.data?.message || 'Error al actualizar.', 'error');
    } finally {
      setProcesando(false);
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const mensajeClases = {
    info:    'bg-blue-900/30 border-blue-500/30 text-blue-300',
    success: 'bg-indigo-900/30 border-indigo-500/30 text-indigo-300',
    error:   'bg-red-900/30 border-red-500/30 text-red-300',
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">

      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between">
        <button onClick={() => router.push('/dashboard/profesor')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 text-sm font-semibold transition-colors">
          <ArrowLeft size={18} /> Volver a mis cursos
        </button>
        <button onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 text-sm font-semibold transition-colors">
          <Home size={18} /> Dashboard Principal
        </button>
      </div>

      <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Grupo del Curso</h1>
            <p className="text-indigo-400 text-sm mt-1 font-medium">{filtrados.length} aprendices activos</p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3  w-full sm:w-80 backdrop-blur-md focus-within:border-indigo-500/50 transition-colors">
            <Search size={18} className="text-slate-500" />
            <input className="flex-1 bg-transparent text-sm text-slate-900 focus:outline-none placeholder-slate-500"
              placeholder="Buscar aprendiz..."
              value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          </div>
        </div>

        {mensaje && (
          <div className={`mb-6 border rounded-[1.25rem] px-5 py-4 text-sm font-medium flex items-center justify-between shadow-lg ${mensajeClases[tipoMensaje]}`}>
            <div className="flex items-center gap-3">
              {tipoMensaje === 'success' && <CheckCircle size={18} className="text-indigo-400" />}
              {tipoMensaje === 'error' && <AlertTriangle size={18} className="text-red-400" />}
              {tipoMensaje === 'info' && <AlertTriangle size={18} className="text-blue-400" />}
              {mensaje}
            </div>
            <button onClick={() => setMensaje('')} className="hover:opacity-70 transition-opacity"><X size={16} /></button>
          </div>
        )}

        {filtrados.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-200 p-12 text-center backdrop-blur-xl shadow-md">
            <Users size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No se encontraron aprendices.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtrados.map((a) => (
              <div key={a.inscripcion_id}
                className={`rounded-[1.5rem] border shadow-md p-5 sm:p-6 transition-all hover:-translate-y-0.5
                  ${a.suspendido 
                    ? 'bg-red-950/20 border-red-500/20 hover:border-red-500/40' 
                    : 'bg-white border-slate-200 hover:border-indigo-500/30'}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center text-sm font-bold flex-shrink-0 
                      ${a.suspendido ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'}`}>
                      {a.nombres.charAt(0)}{a.apellidos.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-base truncate">
                          {a.nombres} {a.apellidos}
                        </h3>
                        {a.suspendido && (
                          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-md font-bold flex-shrink-0">
                            <ShieldOff size={12} /> Condicionado
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><Mail size={12} /> {a.correo_electronico}</span>
                        <span className="hidden sm:inline text-slate-600">•</span>
                        <span className="font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded text-slate-600">{a.tipo_documento} {a.numero_documento}</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => abrirFaltas(a)}
                    className={`flex items-center gap-4 text-left flex-shrink-0 px-5 py-3 rounded-[1.25rem] transition-colors border w-full sm:w-auto
                      ${a.total_faltas >= a.limite_faltas 
                        ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20' 
                        : 'bg-slate-50 hover:bg-slate-800 border-transparent hover:border-indigo-500/20'}`}>
                    <div>
                      <div className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-0.5">Asistencia</div>
                      <div className="text-xs font-medium text-slate-500">Clic para registrar</div>
                    </div>
                    <div className={`text-3xl font-extrabold ${a.total_faltas >= a.limite_faltas ? 'text-red-400' : 'text-slate-900'}`}>
                      {a.total_faltas}<span className="text-sm font-medium text-slate-500 ml-1">/ {a.limite_faltas}</span>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FALTAS */}
      {modalAbierto && seleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-slate-50 border border-slate-200 rounded-[2rem] shadow-md w-full max-w-sm p-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-400"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-slate-900 text-xl">Registrar Asistencia</h3>
              <button onClick={() => setModalAbierto(false)} className="text-slate-500 hover:text-slate-900 transition-colors bg-slate-900 w-8 h-8 rounded-full flex items-center justify-center"><X size={18} /></button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 text-center">
              <p className="text-slate-900 font-bold">{seleccionado.nombres} {seleccionado.apellidos}</p>
              <p className="text-slate-500 text-xs mt-1">{seleccionado.correo_electronico}</p>
            </div>

            <div className="flex items-center justify-center gap-5 mb-6">
              <button onClick={() => setNuevasFaltas(Math.max(0, nuevasFaltas - 1))}
                className="w-12 h-12 bg-slate-900 hover:bg-slate-800 border border-slate-200 rounded-2xl flex items-center justify-center transition-colors ">
                <Minus size={20} className="text-slate-600" />
              </button>
              
              <div className="relative">
                <input type="number" min={0}
                  className={`w-24 bg-slate-900 text-center text-4xl font-extrabold border-2 rounded-[1.25rem] py-3 focus:outline-none  transition-colors
                    ${nuevasFaltas >= seleccionado.limite_faltas ? 'border-red-500/50 text-red-400 focus:border-red-400' : 'border-indigo-500/30 text-slate-900 focus:border-indigo-500'}`}
                  value={nuevasFaltas}
                  onChange={e => setNuevasFaltas(Math.max(0, parseInt(e.target.value) || 0))} />
              </div>

              <button onClick={() => setNuevasFaltas(nuevasFaltas + 1)}
                className="w-12 h-12 bg-slate-900 hover:bg-slate-800 border border-slate-200 rounded-2xl flex items-center justify-center transition-colors ">
                <Plus size={20} className="text-slate-600" />
              </button>
            </div>

            <div className="text-center mb-6">
              <span className="inline-block bg-slate-900 px-3 py-1.5 rounded-lg text-xs text-slate-500 border border-slate-200">
                Límite permitido: <strong className="text-slate-900">{seleccionado.limite_faltas} faltas</strong>
              </span>
            </div>

            {nuevasFaltas >= seleccionado.limite_faltas && (
              <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-4 mb-6 text-xs text-red-300 flex items-start gap-3 ">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-red-400" />
                <p className="leading-relaxed">Al guardar esta asistencia, el aprendiz quedará condicionado y se le notificará automáticamente por correo.</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button onClick={() => setModalAbierto(false)} className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-900 font-semibold py-3.5 rounded-full transition-colors border border-slate-200">Cancelar</button>
              <button onClick={guardarFaltas} disabled={procesando} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-slate-900 font-bold py-3.5 rounded-full transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                {procesando ? 'Guardando...' : 'Guardar Faltas'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}