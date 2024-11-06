const axios = require('axios');
const { log } = require("nyx-logger");

let sessionIdApi;

function generateId() {
    const min = 100000;
    const max = 999999;

    const randomId = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomId.toString();
}

async function connexionApi() {
    try {
        const url = 'http://localhost:3000/api/create-session';
        const response = await axios.post(url);

        if (response.data.sessionId) {
            sessionIdApi = response.data.sessionId;
            log("info", `ID: ${sessionIdApi}`);

            const loginResponse = await loginConnexion(sessionIdApi);
            log("info", `${loginResponse}`);

            const isValid = await validateConnexion(sessionIdApi);
            if (isValid) {
                log("info", "Validated Session Successfuly.");
            } else {
                log("fatal", "La session n'est pas valide.");
            }
        } else {
            log("fatal", "ID de session manquant dans la réponse.");
        }
    } catch (error) {
        log("fatal", `Erreur lors de la connexion API : ${error.message}`);
    }
}

async function checkApiStatus() {
    try {
        const response = await axios.post('http://localhost:3000/api/check-status', { sessionIdApi });
        return response.data.valid;
    } catch (error) {
        log("info", "API 🔴")
        return false;
    }
}

async function validateConnexion(sessionId) {
    try {
        const url = 'http://localhost:3000/api/validate-session';
        const response = await axios.post(url, { sessionId }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const isValid = response.data.valid;
        return isValid === true;
    } catch (error) {
        log("fatal", `Erreur lors de la validation de la session : ${error.message}`);
        return false;
    }
}

async function loginConnexion(sessionId) {
    try {
        const url = 'http://localhost:3000/api/login';
        const response = await axios.post(url, { sessionId }, {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data.message;
    } catch (error) {
        log("fatal", `Erreur lors du login : ${error.message}`);
        return null;
    }
}

async function logoutUser(sessionId) {
    try {
        const url = 'http://localhost:3000/api/logout';
        const response = await axios.post(url, { sessionId }, {
            headers: { 'Content-Type': 'application/json' }
        });

        log("info", `Déconnexion réussie : ${response.data.message}`);
        return response.data.message;
    } catch (error) {
        log("fatal", `Erreur lors de la déconnexion : ${error.message}`);
        return null;
    }
}
module.exports = { connexionApi, validateConnexion, loginConnexion, logoutUser, checkApiStatus, sessionIdApi };
