import axios from 'axios';

// Clase servicio para operaciones CRUD con la API
const API_URL = 'https://testsuite.foxxum.com/strapi123456/api';
class IssueService {
  // GETS (Read)
  // Método auxiliar para traer la categoría de un issue
  getIssueCategoryAux(appId) {
    return axios.get(`${API_URL}/apps/${appId}?populate=deep`);
  }

  // Traer de la API las categorías posibles para un issue
  getIssueCategories() {
    return axios.get(`${API_URL}/Issue-Categories`);
  }

  // PUT (Update)
  // Actualizar los issues de una app existente seleccionada por su id
  addNewIssue(id, issues) {
    return axios.put(`${API_URL}/apps/${id}`, { data: { issues } });
  }
}

export default new IssueService();
