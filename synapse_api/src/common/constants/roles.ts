/**
 * Helper function to get role name from role ID
 * @param roleId - The role ID
 * @returns The role name as a string
 */
export const getRoleName = (roleId: string) => {
  switch (roleId) {
    case '01a02b36-efbe-71cd-afd4-25d0e387b42b':
      return 'Aprendiz';
    case '2':
      return 'Estudiante';
    case '01a02b37-677e-740f-a51d-fecec6108083':
      return 'Profesor';
    case '01a02b37-9d84-764b-a374-10c4ae08ea2d':
      return 'Coordinador';
    case '01a02b37-b11a-75ed-9f51-f1cb6fd1cd14':
      return 'Administrador';
    default:
      return 'UNKNOWN';
  }
};


export const GetRoleNameCort = (id: string) => {
  switch (id) {
    case '01a02b36-efbe-71cd-afd4-25d0e387b42b':
      return 'Aprendiz';
    case '01a02b37-677e-740f-a51d-fecec6108083':
      return 'Estudiante';
    case '01a02b37-677e-740f-a51d-fecec6108083':
      return 'PROFESOR';
    case '01a02b37-9d84-764b-a374-10c4ae08ea2d':
      return 'COORDINADOR';
    case '01a02b37-b11a-75ed-9f51-f1cb6fd1cd14':
      return 'ADMIN';
    default:
      return 'UNKNOWN';
  }
};

/**
 * Roles enum for type safety
 */
export const Roles = (id: string): string => {
  switch (id) {
    case '1':
      return 'Aprendiz';
    case '2':
      return 'Estudiante';
    case '3':
      return 'PROFESOR';
    case '4':
      return 'COORDINADOR';
    case '5':
      return 'ADMIN';
    default:
      return 'UNKNOWN';
  }
};
