import { Algorithm, hash, verify, Version } from '@node-rs/argon2';

const options = {
  algorithm: Algorithm.Argon2id,
  version: Version.V0x13,
  memoryCost: 65_536,
  timeCost: 3,
  parallelism: 1,
  outputLen: 32,
};

export function hashPassword(password: string): Promise<string> {
  return hash(password, options);
}

export function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  return verify(passwordHash, password, options);
}
