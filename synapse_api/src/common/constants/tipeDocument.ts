export const tipoDocumento = (documentId: string) => {

    switch (documentId) {
        case '01a02b36-efbe-71cd-afd4-25d0e387b42b':
            return 'Cédula de ciudadanía';
        case '01a02b37-677e-740f-a51d-fecec6108083':
            return 'Tarjeta de identidad';
        case '01a02b37-9d84-764b-a374-10c4ae08ea2d':
            return 'Cédula de extranjería';
        case '01a02b37-b11a-75ed-9f51-f1cb6fd1cd14':
            return 'Passport';
        default:
            return 'Otro';
    }
};