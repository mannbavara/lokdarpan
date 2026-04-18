import { apiRequest } from './api';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  is_system: boolean;
  org_id: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

class RoleService {
  private readonly baseEndpoint = '/roles/';

  async getRoles(): Promise<Role[]> {
    return apiRequest<Role[]>(this.baseEndpoint);
  }

  async getRole(id: string): Promise<Role> {
    return apiRequest<Role>(`${this.baseEndpoint}${id}`);
  }

  async createRole(data: CreateRoleRequest): Promise<Role> {
    return apiRequest<Role>(this.baseEndpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRole(id: string, data: UpdateRoleRequest): Promise<Role> {
    return apiRequest<Role>(`${this.baseEndpoint}${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRole(id: string): Promise<void> {
    return apiRequest<void>(`${this.baseEndpoint}${id}`, {
      method: 'DELETE',
    });
  }

  async cloneRole(id: string): Promise<Role> {
    return apiRequest<Role>(`${this.baseEndpoint}${id}/clone`, {
      method: 'POST',
    });
  }

  async getPermissions(): Promise<string[]> {
    return apiRequest<string[]>(`${this.baseEndpoint}permissions`);
  }

  async getRoleHistory(id: string): Promise<any[]> {
    return apiRequest<any[]>(`${this.baseEndpoint}${id}/history`);
  }
}

const roleService = new RoleService();
export default roleService;
