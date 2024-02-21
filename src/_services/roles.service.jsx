import request from '../_helpers/requests';
import { PERMISSIONS, ROLES, ROLES_V2 } from '../_helpers/apis';

const fetchAllRoles = () => {
  return request(ROLES_V2);
};

const createRole = (values) => {
  return request.post(ROLES, values);
};

const createRoleV2 = (values) => {
  return request.post(ROLES_V2, values);
};

const editRole = (id, data) => {
  return request.put(`${ROLES_V2}/${id}`, data);
};
const deleteRole = (id) => {
  return request.delete(`${ROLES}/${id}`);
};

const updateRolePermissions = (id, permissionType, values) => {
  return request.put(`${ROLES}/${id}/permissions/${permissionType}`, values);
};

const updateModuleRolePermissions = (id, values) => {
  return request.put(`${ROLES}/${id}/module-permissions`, values);
};

const fetchRolePermissions = (id, params) => {
  return request(`${ROLES}/${id}/permissions`, { params });
};

const fetchModuleRolePermissions = (id) => {
  return request(`${ROLES}/${id}/module-permissions`);
};

// Permissions
const createRolePermissions = (data) => {
  return request.post(PERMISSIONS, data);
};

const getPermissions = (roleId) => {
  return request.get(`${PERMISSIONS}/${roleId}`);
};

export const rolesService = {
  fetchAllRoles,
  createRole,
  createRoleV2,
  editRole,
  deleteRole,
  updateRolePermissions,
  fetchRolePermissions,
  fetchModuleRolePermissions,
  updateModuleRolePermissions,
  createRolePermissions,
  getPermissions,
};
