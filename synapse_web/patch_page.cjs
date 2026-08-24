const fs = require('fs');
const file = 'src/app/dashboard/coordinador/grupo/[programaId]/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add states for new modals
if (!code.includes('modalCrearGrupo')) {
  code = code.replace(
    "const [mostrarModal, setMostrarModal] = useState(false);",
    `const [mostrarModal, setMostrarModal] = useState(false);
  const [modalCrearGrupo, setModalCrearGrupo] = useState(false);
  const [modalHorario, setModalHorario] = useState(false);
  const [nuevoGrupo, setNuevoGrupo] = useState({ nombre: '', materia: '', capacidad_maxima: 30 });
  const [nuevoHorario, setNuevoHorario] = useState({ modalidad: 'Presencial', jornada: 'Diurna', horarios_json: {} });`
  );
}

// 2. Add functions to submit
if (!code.includes('crearNuevoGrupo')) {
  code = code.replace(
    "const cargarDatos = async () => {",
    `const crearNuevoGrupo = async () => {
    try {
      setLoading(true);
      await gruposAPI.crearGrupo(programaId, nuevoGrupo);
      setExito('Grupo creado exitosamente');
      setModalCrearGrupo(false);
      cargarDatos();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al crear grupo');
      setLoading(false);
    }
  };

  const guardarHorario = async () => {
    try {
      setLoading(true);
      await gruposAPI.asignarHorario(programaId, nuevoHorario);
      setExito('Horario asignado exitosamente');
      setModalHorario(false);
      cargarDatos();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al asignar horario');
      setLoading(false);
    }
  };

  const cargarDatos = async () => {`
  );
}

// 3. Add buttons
if (!code.includes('Crear Nuevo Grupo')) {
  code = code.replace(
    "<h1 className=\"text-2xl sm:text-4xl font-bold text-gray-900 mb-2\">Gestor de Grupos</h1>",
    `<div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Gestor de Grupos</h1>
            <div className="flex gap-2">
              <button onClick={() => setModalHorario(true)} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-200 transition">Configurar Horario</button>
              <button onClick={() => setModalCrearGrupo(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">Crear Nuevo Grupo</button>
            </div>
          </div>`
  );
}

// 4. Add modals
if (!code.includes('MODAL CREAR GRUPO')) {
  const modalUI = `
      {/* MODAL CREAR GRUPO */}
      {modalCrearGrupo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-xl mb-4">Crear Nuevo Grupo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Grupo</label>
                <input type="text" className="w-full border rounded-lg p-2" placeholder="Ej. Ficha 255432" value={nuevoGrupo.nombre} onChange={e => setNuevoGrupo({...nuevoGrupo, nombre: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad / Materia</label>
                <input type="text" className="w-full border rounded-lg p-2" placeholder="Ej. General" value={nuevoGrupo.materia} onChange={e => setNuevoGrupo({...nuevoGrupo, materia: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Máxima</label>
                <input type="number" className="w-full border rounded-lg p-2" value={nuevoGrupo.capacidad_maxima} onChange={e => setNuevoGrupo({...nuevoGrupo, capacidad_maxima: Number(e.target.value)})} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setModalCrearGrupo(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
              <button onClick={crearNuevoGrupo} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Crear Grupo</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HORARIOS */}
      {modalHorario && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-xl mb-4">Configurar Horario del Programa</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                <select className="w-full border rounded-lg p-2" value={nuevoHorario.modalidad} onChange={e => setNuevoHorario({...nuevoHorario, modalidad: e.target.value})}>
                  <option value="Presencial">Presencial</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Mixta">Mixta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jornada</label>
                <select className="w-full border rounded-lg p-2" value={nuevoHorario.jornada} onChange={e => setNuevoHorario({...nuevoHorario, jornada: e.target.value})}>
                  <option value="Diurna">Diurna</option>
                  <option value="Nocturna">Nocturna</option>
                  <option value="Fines de Semana">Fines de Semana</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setModalHorario(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
              <button onClick={guardarHorario} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Guardar Horario</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
  
  // replace the last '    </div>\n  );\n}' with the modal UI + closing
  const parts = code.split('    </div>\n  );\n}');
  if (parts.length > 1) {
    code = parts[0] + modalUI;
  }
}

fs.writeFileSync(file, code);
