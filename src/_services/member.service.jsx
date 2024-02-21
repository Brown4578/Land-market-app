
import request from '../_helpers/requests';
import { _MEMBER } from '../_helpers/apis';

const fetchMembers = (params) => {
  return request(_MEMBER, { params });
};
const fetchMemberById = (id) => {
  return request(`${_MEMBER}/${id}`);
};

const createMember = (data) => {
  return request.post(_MEMBER, data);
};

export const memberService = {
  fetchMembers,
  fetchMemberById,
  createMember,
};
