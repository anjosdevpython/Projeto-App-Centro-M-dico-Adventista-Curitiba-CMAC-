import { randomUUID } from 'node:crypto';

export interface AccountRecord {
  id: string;
  email: string;
  passwordHash: string;
  verifiedAt: Date | null;
}

export interface SessionRecord {
  id: string;
  patientId: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface AuthRepository {
  createAccount(input: Omit<AccountRecord, 'id' | 'verifiedAt'>): Promise<AccountRecord>;
  findAccountByEmail(email: string): Promise<AccountRecord | undefined>;
  markVerified(accountId: string, verifiedAt: Date): Promise<void>;
  updatePassword(accountId: string, passwordHash: string): Promise<void>;
  createSession(patientId: string, expiresAt: Date): Promise<SessionRecord>;
  revokeSession(sessionId: string, revokedAt: Date): Promise<void>;
}

export class InMemoryAuthRepository implements AuthRepository {
  readonly #accounts = new Map<string, AccountRecord>();
  readonly #sessions = new Map<string, SessionRecord>();

  async createAccount(
    input: Omit<AccountRecord, 'id' | 'verifiedAt'>,
  ): Promise<AccountRecord> {
    const account = { ...input, id: randomUUID(), verifiedAt: null };
    this.#accounts.set(account.email, account);
    return account;
  }

  async findAccountByEmail(email: string): Promise<AccountRecord | undefined> {
    return this.#accounts.get(email);
  }

  async markVerified(accountId: string, verifiedAt: Date): Promise<void> {
    for (const [email, account] of this.#accounts) {
      if (account.id === accountId) {
        this.#accounts.set(email, { ...account, verifiedAt });
        return;
      }
    }
  }

  async updatePassword(accountId: string, passwordHash: string): Promise<void> {
    for (const [email, account] of this.#accounts) {
      if (account.id === accountId) {
        this.#accounts.set(email, { ...account, passwordHash });
        return;
      }
    }
  }

  async createSession(patientId: string, expiresAt: Date): Promise<SessionRecord> {
    const session = { id: randomUUID(), patientId, expiresAt, revokedAt: null };
    this.#sessions.set(session.id, session);
    return session;
  }

  async revokeSession(sessionId: string, revokedAt: Date): Promise<void> {
    const session = this.#sessions.get(sessionId);
    if (session) this.#sessions.set(sessionId, { ...session, revokedAt });
  }
}
