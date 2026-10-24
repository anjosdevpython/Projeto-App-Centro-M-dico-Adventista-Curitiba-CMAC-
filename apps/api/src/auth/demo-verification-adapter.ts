import { createHash, randomInt } from 'node:crypto';

import type { VerificationPort } from './verification-port.js';

interface IssuedCode {
  hash: string;
  attempts: number;
}

export class DemoVerificationAdapter implements VerificationPort {
  readonly #codes = new Map<string, IssuedCode>();
  readonly #plainCodes = new Map<string, string>();

  async issue(contact: string): Promise<void> {
    const code = randomInt(100_000, 1_000_000).toString();
    this.#codes.set(contact, { hash: digest(code), attempts: 0 });
    this.#plainCodes.set(contact, code);
  }

  async consume(contact: string, code: string): Promise<boolean> {
    const issued = this.#codes.get(contact);
    if (!issued || issued.attempts >= 5) return false;
    issued.attempts += 1;
    if (digest(code) !== issued.hash) return false;
    this.#codes.delete(contact);
    this.#plainCodes.delete(contact);
    return true;
  }

  peekCode(contact: string): string {
    const code = this.#plainCodes.get(contact);
    if (!code) throw new Error('No demo verification code was issued');
    return code;
  }
}

function digest(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
