import axios from 'axios';

// Clase servicio para operaciones CRUD con la API
const API_URL = 'https://testsuite.foxxum.com/strapi123456/api';
class AppService{
    /* Operaciones CRUD => Create - Read - Update - Delete */
    // GETS (Read)
    // Traer todas las apps
    getAllApps(){
        return axios.get(`${API_URL}/apps?populate=*`)
    }

    // Traer una app por su id
    getApp(id){
        return axios.get(`${API_URL}/apps?filters[id][$eq]=${id}&populate=*`)
    }

    // Traer todos los países
    // Al haber 250 países y sólo poder traer 100 por petición debo hacer 3 peticiones
    getCountries1(){
        return axios.get(`${API_URL}/countries?pagination[pageSize]=100`)
    }
    getCountries2(){
        return axios.get(`${API_URL}/countries?pagination[pageSize]=100&pagination[page]=2`)
    }
    getCountries3(){
        return axios.get(`${API_URL}/countries?pagination[pageSize]=100&pagination[page]=3`)
    }

    // Traer todas las categorías
    getCategories(){
        return axios.get(`${API_URL}/app-categories`)
    }

    // Traer todos los players
    getPlayers(){
        return axios.get(`${API_URL}/players`)
    }

    // Traer todos los dispositivos
    getDevices(){
        return axios.get(`${API_URL}/devices`)
    }

    // Traer todos los idiomas
    // Al haber 184 idiomas y sólo poder traer 100 por petición debo hacer 2 peticiones
    getLanguages1(){
        return axios.get(`${API_URL}/languages?pagination[pageSize]=100`)
    }
    getLanguages2(){
        return axios.get(`${API_URL}/languages?pagination[pageSize]=100&pagination[page]=2`)
    }

    // POST (Create)
    // Añadir nueva app
    addNewApp(app){
        return axios.post(`${API_URL}/apps`, {data:app})
    }

    // PUT (Update)
    // Actualizar los campos de una app existente seleccionada por su id
    updateApp(id, app){
        return axios.put(`${API_URL}/apps/${id}`, {data:app})
    }

    // DELETE (Delete)
    deleteApp(id){
        return axios.delete(`${API_URL}/apps/${id}`)
    }
}

export default new AppService();