import { ACCESS_TOKEN, API_BASE_URL } from '../constants/auth'

const request = async options => {
    const headers = new Headers({
        "Content-Type": "application/json"
    });

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append(
            "Authorization",
            "Bearer " + localStorage.getItem(ACCESS_TOKEN)
        );
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    const response = await fetch(options.url, options);
    const json = await response.json();
    if (!response.ok) {
        return Promise.reject(json);
    }
    return json;
};


export function dsdsad(loginRequest) {
    return request({
        url: `${API_BASE_URL}/api/movies/feature`,
        method: "POST",
        body: JSON.stringify(loginRequest)
    });
}

export function getFeaturedMovies() {

    return request({
        url: `${API_BASE_URL}/api/movies/feature`,
        method: "GET"
    });

}