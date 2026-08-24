const fs = require('fs');
let apiFile = 'src/lib/api.ts';
let code = fs.readFileSync(apiFile, 'utf8');

if (!code.includes('crearGrupo:')) {
  code = code.replace(
    "obtenerGruposPorPrograma: (programaId: number) =>",
    "crearGrupo: (programaId: string, data: any) => api.post(`/grupos/programa/${programaId}`, data),\n    obtenerGruposPorPrograma: (programaId: number) =>"
  );
}

if (!code.includes('asignarHorario:')) {
  code = code.replace(
    "asignarProfesor: (programaId: number, usuarioId: number) =>",
    "asignarHorario: (programaId: string, data: any) => api.post(`/programas/${programaId}/horarios`, data),\n    asignarProfesor: (programaId: number, usuarioId: number) =>"
  );
}

fs.writeFileSync(apiFile, code);
