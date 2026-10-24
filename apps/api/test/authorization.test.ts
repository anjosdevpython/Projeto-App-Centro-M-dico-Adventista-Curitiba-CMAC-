import { describe, expect, it } from 'vitest';

import { authorizePatientResource } from '../src/auth/authorize-patient.js';

describe('authorizePatientResource', () => {
  it('allows the owner', () => {
    expect(
      authorizePatientResource(
        { patientId: 'patient-a', sessionId: 'session-a' },
        'patient-a',
      ),
    ).toBe(true);
  });

  it('denies another patient without revealing the resource', () => {
    expect(() =>
      authorizePatientResource(
        { patientId: 'patient-a', sessionId: 'session-a' },
        'patient-b',
      ),
    ).toThrowError(expect.objectContaining({ code: 'NOT_FOUND' }));
  });
});
