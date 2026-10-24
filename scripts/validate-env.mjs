const appEnvironments = new Set(['development', 'demo', 'homologation', 'production']);
const soulMvAdapters = new Set(['demo', 'http']);

/** @typedef {Record<string, string | undefined>} EnvironmentInput */

/**
 * @param {EnvironmentInput} input
 * @param {string} key
 * @param {number} [minimumLength]
 */
function requireText(input, key, minimumLength = 1) {
  const value = input[key];
  if (typeof value !== 'string' || value.trim().length < minimumLength) {
    throw new Error(`${key} is required`);
  }
  return value.trim();
}

/**
 * @param {EnvironmentInput} input
 * @param {string} key
 * @param {string[]} protocols
 */
function requireUrl(input, key, protocols) {
  const value = requireText(input, key);
  const parsed = new URL(value);
  if (!protocols.includes(parsed.protocol)) {
    throw new Error(`${key} must use ${protocols.join(' or ')}`);
  }
  return value;
}

/** @param {EnvironmentInput} input */
export function validateEnv(input) {
  const appEnv = requireText(input, 'APP_ENV');
  if (!appEnvironments.has(appEnv)) {
    throw new Error('APP_ENV must be development, demo, homologation, or production');
  }

  const soulMvAdapter = requireText(input, 'SOUL_MV_ADAPTER');
  if (!soulMvAdapters.has(soulMvAdapter)) {
    throw new Error('SOUL_MV_ADAPTER must be demo or http');
  }

  const result = {
    appEnv,
    databaseUrl: requireUrl(input, 'DATABASE_URL', ['postgres:', 'postgresql:']),
    sessionSecret: requireText(input, 'SESSION_SECRET', 32),
    publicOrigin: requireUrl(input, 'PUBLIC_ORIGIN', ['http:', 'https:']),
    soulMvAdapter,
  };

  if (soulMvAdapter === 'http') {
    return {
      ...result,
      soulMvBaseUrl: requireUrl(input, 'SOUL_MV_BASE_URL', ['https:']),
      soulMvAuthToken: requireText(input, 'SOUL_MV_AUTH_TOKEN', 16),
    };
  }

  return result;
}

if (import.meta.url === `file:///${process.argv[1]?.replaceAll('\\', '/')}`) {
  validateEnv(process.env);
  process.stdout.write('Environment configuration is valid.\n');
}
