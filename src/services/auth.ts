import { API_BASE_URL } from '../config/environment';

interface LoginResponse {
  token?: string;
  isAdmin?: boolean;
  message?: string;
}

function readMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;

  const candidate = payload as Record<string, unknown>;
  if (typeof candidate.message === 'string' && candidate.message.trim()) {
    return candidate.message.trim();
  }
  if (typeof candidate.error === 'string' && candidate.error.trim()) {
    return candidate.error.trim();
  }
  return null;
}

export async function loginAdmin(email: string, password: string): Promise<string> {
  if (!API_BASE_URL) {
    throw new Error('O endereço do Adan-Stella não foi configurado.');
  }

  let response: Response;

  try {
    response = await fetch(API_BASE_URL + '/api/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });
  } catch {
    throw new Error('Não foi possível alcançar o Adan-Stella. Confira a conexão e o endereço HTTPS.');
  }

  const payload = await response.json().catch(() => null) as LoginResponse | null;

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('E-mail ou senha inválidos.');
    }
    throw new Error(
      readMessage(payload) ||
      'O Adan-Stella respondeu com HTTP ' + response.status + '.'
    );
  }

  if (!payload || typeof payload.token !== 'string' || !payload.token) {
    throw new Error('O Adan-Stella não retornou um token de autenticação válido.');
  }

  // O cadastro público do Adan-Stella cria contas comuns. O Ventol só aceita
  // contas já promovidas a administradoras no banco local do backend.
  if (payload.isAdmin !== true) {
    throw new Error('Esta conta não tem permissão para controlar o robô. É necessário um usuário administrador do Adan-Stella.');
  }

  return payload.token;
}
