import { describe, expect, it } from 'vitest';

import { AuthService } from '../src/auth/service.js';
import { DemoVerificationAdapter } from '../src/auth/demo-verification-adapter.js';
import { InMemoryAuthRepository } from '../src/auth/repository.js';

function createService(now = new Date('2026-10-24T12:00:00.000Z')) {
  const repository = new InMemoryAuthRepository();
  const verification = new DemoVerificationAdapter();
  return {
    repository,
    verification,
    service: new AuthService(repository, verification, () => now),
  };
}

describe('AuthService', () => {
  it('registers an unverified account and verifies possession of the contact', async () => {
    const { repository, service, verification } = createService();
    const registration = await service.register({
      email: 'paciente@example.test',
      password: 'Uma-senha-segura-2026',
    });

    expect(registration.status).toBe('verification_required');
    const code = verification.peekCode('paciente@example.test');
    await service.verifyContact({ email: 'paciente@example.test', code });

    expect((await repository.findAccountByEmail('paciente@example.test'))?.verifiedAt)
      .toBeInstanceOf(Date);
  });

  it('requires password and does not authenticate with CPF alone', async () => {
    const { service } = createService();
    await expect(service.signIn({ cpf: '52998224725' } as never)).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('returns the same neutral response for existing and unknown recovery contacts', async () => {
    const { service } = createService();
    await service.register({
      email: 'paciente@example.test',
      password: 'Uma-senha-segura-2026',
    });

    await expect(service.startRecovery('paciente@example.test')).resolves.toEqual({
      status: 'recovery_requested',
    });
    await expect(service.startRecovery('desconhecido@example.test')).resolves.toEqual({
      status: 'recovery_requested',
    });
  });

  it('completes recovery with a verified code and rotates the password', async () => {
    const { service, verification } = createService();
    await service.register({
      email: 'paciente@example.test',
      password: 'Uma-senha-segura-2026',
    });
    await service.verifyContact({
      email: 'paciente@example.test',
      code: verification.peekCode('paciente@example.test'),
    });
    await service.startRecovery('paciente@example.test');

    await service.completeRecovery({
      email: 'paciente@example.test',
      code: verification.peekCode('paciente@example.test'),
      newPassword: 'Outra-senha-segura-2026',
    });

    await expect(
      service.signIn({
        email: 'paciente@example.test',
        password: 'Outra-senha-segura-2026',
      }),
    ).resolves.toMatchObject({ patientId: expect.any(String) });
  });
});
