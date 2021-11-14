export const axios = require("axios");

export const jwtToken = localStorage.getItem("Authorization");

axios.interceptors.request.use(
    function(config) {
        if (jwtToken) {
            config.headers["Authorization"] = "Token " + jwtToken;
        }
        return config;
    },
    function(err) {
        return Promise.reject(err);
    }
);
