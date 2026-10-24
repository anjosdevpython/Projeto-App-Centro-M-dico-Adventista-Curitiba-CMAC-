export interface PatientPrincipal {
  patientId: string;
  sessionId: string;
}

export class ResourceNotFoundError extends Error {
  readonly code = 'NOT_FOUND';
}

export function authorizePatientResource(
  principal: PatientPrincipal,
  ownerPatientId: string,
): true {
  if (principal.patientId !== ownerPatientId) {
    throw new ResourceNotFoundError('Recurso não encontrado.');
  }
  return true;
}
