import { apiRequest } from './api';

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  role_id?: string; // or expand to Role object if needed
  role?: {
    id: string;
    name: string;
    permissions: string[];
    is_system: boolean;
  };
  department?: string;
  primary_department_id?: string;
  secondary_department_id?: string;
  primary_department?: { id: string; name: string; abbreviation: string };
  secondary_department?: { id: string; name: string; abbreviation: string };
  job_title?: string;
  org_id: string;
}

export interface UserUpdateMeRequest {
  full_name?: string;
  email?: string;
  password?: string;
  primary_department_id?: string;
  secondary_department_id?: string;
  job_title?: string;
}

export interface UserUpdateRequest {
  email?: string;
  password?: string;
  full_name?: string;
  is_active?: boolean;
  primary_department_id?: string;
  secondary_department_id?: string;
  job_title?: string;
}

export interface InviteUserRequest {
  email: string;
  role_id: string;
}

export interface AcceptInviteRequest {
  token: string;
  email: string;
  password: string;
  full_name: string;
}

export interface Invitation {
  id: string;
  invited_email: string;
  role_id: string;
  invited_by: string;
  created_at: string;
  expires_at: string;
  status: string;
  org_id: string;
  token?: string;
}

class UserService {
  private readonly baseEndpoint = '/users/';

  async getUsers(role_id?: string, is_active?: boolean, search?: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (role_id) params.append('role_id', role_id);
    if (is_active !== undefined) params.append('is_active', String(is_active));
    if (search) params.append('search', search);

    return apiRequest<User[]>(`${this.baseEndpoint}?${params.toString()}`);
  }

  async getUser(id: string): Promise<User> {
    return apiRequest<User>(`${this.baseEndpoint}${id}`);
  }

  async getMe(): Promise<User> {
    return apiRequest<User>(`${this.baseEndpoint}me`);
  }

  async updateMe(data: UserUpdateMeRequest): Promise<User> {
    return apiRequest<User>(`${this.baseEndpoint}me`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: UserUpdateRequest): Promise<User> {
    return apiRequest<User>(`${this.baseEndpoint}${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async inviteUser(data: InviteUserRequest): Promise<any> {
    return apiRequest(`${this.baseEndpoint}invite`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async acceptInvite(data: AcceptInviteRequest): Promise<User> {
    return apiRequest(`${this.baseEndpoint}accept-invite`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUserRole(userId: string, roleId: string): Promise<User> {
    return apiRequest<User>(`${this.baseEndpoint}${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role_id: roleId }),
    });
  }

  async getUserRoleHistory(userId: string): Promise<any[]> {
    return apiRequest<any[]>(`${this.baseEndpoint}${userId}/role-history`);
  }

  async getInvitations(): Promise<Invitation[]> {
    return apiRequest<Invitation[]>(`${this.baseEndpoint}invitations`);
  }
}

const userService = new UserService();
export default userService;
