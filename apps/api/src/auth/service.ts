import { hashPassword, verifyPassword } from './password.js';
import type { AuthRepository, SessionRecord } from './repository.js';
import { addHours } from './time.js';
import type { VerificationPort } from './verification-port.js';

interface RegistrationInput {
  email: string;
  password: string;
}

interface VerificationInput {
  email: string;
  code: string;
}

interface SignInInput {
  email?: string;
  password?: string;
}

interface CompleteRecoveryInput {
  email: string;
  code: string;
  newPassword: string;
}

export class AuthError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly verification: VerificationPort,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async register(input: RegistrationInput): Promise<{ status: 'verification_required' }> {
    const email = normalizeEmail(input.email);
    validatePassword(input.password);
    if (await this.repository.findAccountByEmail(email)) {
      throw new AuthError('ACCOUNT_EXISTS', 'Não foi possível criar o acesso.');
    }
    await this.repository.createAccount({
      email,
      passwordHash: await hashPassword(input.password),
    });
    await this.verification.issue(email);
    return { status: 'verification_required' };
  }

  async verifyContact(input: VerificationInput): Promise<{ status: 'verified' }> {
    const email = normalizeEmail(input.email);
    const account = await this.repository.findAccountByEmail(email);
    if (!account || !(await this.verification.consume(email, input.code))) {
      throw new AuthError('INVALID_VERIFICATION', 'Código inválido ou expirado.');
    }
    await this.repository.markVerified(account.id, this.now());
    return { status: 'verified' };
  }

  async signIn(input: SignInInput): Promise<SessionRecord> {
    if (!input.email || !input.password) {
      throw new AuthError('INVALID_CREDENTIALS', 'Credenciais inválidas.');
    }
    const account = await this.repository.findAccountByEmail(normalizeEmail(input.email));
    if (
      !account?.verifiedAt ||
      !(await verifyPassword(account.passwordHash, input.password))
    ) {
      throw new AuthError('INVALID_CREDENTIALS', 'Credenciais inválidas.');
    }
    return this.repository.createSession(account.id, addHours(this.now(), 12));
  }

  async signOut(sessionId: string): Promise<void> {
    await this.repository.revokeSession(sessionId, this.now());
  }

  async startRecovery(contact: string): Promise<{ status: 'recovery_requested' }> {
    const email = normalizeEmail(contact);
    if (await this.repository.findAccountByEmail(email)) {
      await this.verification.issue(email);
    }
    return { status: 'recovery_requested' };
  }

  async completeRecovery(
    input: CompleteRecoveryInput,
  ): Promise<{ status: 'password_updated' }> {
    const email = normalizeEmail(input.email);
    validatePassword(input.newPassword);
    const account = await this.repository.findAccountByEmail(email);
    if (!account || !(await this.verification.consume(email, input.code))) {
      throw new AuthError('INVALID_VERIFICATION', 'Código inválido ou expirado.');
    }
    await this.repository.updatePassword(
      account.id,
      await hashPassword(input.newPassword),
    );
    return { status: 'password_updated' };
  }
}

function normalizeEmail(value: string): string {
  const email = value.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AuthError('INVALID_CONTACT', 'Informe um e-mail válido.');
  }
  return email;
}

function validatePassword(value: string): void {
  if (value.length < 12) {
    throw new AuthError('WEAK_PASSWORD', 'Use uma senha com pelo menos 12 caracteres.');
  }
}
