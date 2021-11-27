export const axios = require("axios");

export const jwtToken = localStorage.getItem("Authorization");

axios.interceptors.request.use(
    function(config) {
        if (jwtToken) {
            config.headers["Authorization"] = "Token " + jwtToken;
            config.headers["Content-Type"] = "application/json";
            config.headers["Access-Control-Allow-Origin"] = '*';
        }
        return config;
    },
    function(err) {
        return Promise.reject(err);
    }
);
