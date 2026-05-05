const API_BASE ='http://localhost:5000';

const handleResponse = async (response: Response) => {
  if (response.status === 204 || response.status === 205) {
    return {};
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    return {};
  }

  if (!response.ok) {
    throw new Error(data?.message || `Authentication failed (${response.status})`);
  }

  return data;
};

export const signup = async (payload: {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  role?: string;
  yearsOfExperience?: number;
  availability?: string;
  specialization?: string[];
  hourlyRate?: number;
  profileImage?: string;
}) => {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const login = async (payload: { email: string; password: string }) => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const fetchProfile = async (token: string) => {
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

export const logout = async (token?: string) => {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};