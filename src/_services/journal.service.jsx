import request from '../_helpers/requests';
import { Journal_URL } from '../_helpers/apis';

const fetchJournals = (params) => {
    return request(Journal_URL, { params })
}

const createJournal = (data) => {
    return request.post(Journal_URL, data);
}
const getJournal = (id) => {
    return request(`${Journal_URL}/${id}`);
}

const updateJournal = (code, data) => {
    return request.put(`${Journal_URL}/${code}`, data);
}
export const journalService = {
    fetchJournals,
    createJournal,
    getJournal,
    updateJournal
}
