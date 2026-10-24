export interface VerificationPort {
  issue(contact: string): Promise<void>;
  consume(contact: string, code: string): Promise<boolean>;
}
