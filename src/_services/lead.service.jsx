import request from '../_helpers/requests';
import { _MEMBER } from '../_helpers/apis';
import axios from 'axios';


const deleteLead = (data) =>{
  alert("Are  you sure you want to delete this record?");
    axios.delete("http://localhost:8000/leads/"+data?.id) .then(alert("successfully deleted"))
    window.location.reload();
 
};

const fetchLeads = () => {
  axios.get('http://localhost:8000/leads');
};
const fetchLeadById = (id) => {
//  return request(`${_MEMBER}/${id}`);
};

const createLead = (data) => {
    axios
      .post("http://localhost:8000/leads", data, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then(function (response) {
        alert("Successfully added");
        clearFields();
      })
      .catch(function (error) {
        console.error(error);
      });
};

const editLead = (id,data) => {
  axios
    .put("http://localhost:8000/leads/"+id, data, {
      headers: {
        "content-type": "application/json",
      },
    })
    .then(function (response) {
      alert("Successfully updated");
    })
    .catch(function (error) {
      console.error(error);
    });
};

export const leadService = {
  fetchLeads,
  fetchLeadById,
  createLead,
  deleteLead,
  editLead,
};