const API_URL = 'http://localhost:3000';

async function postLogin(usr, pwd, map) {
    const result = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username : usr,
            password : pwd,
            stroke : map
        })
    });
    return await result.json();
}

async function createUser(usr, pwd, map) {
    const result = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username : usr,
            password : pwd,
            stroke : map
        })
    });
    return await result.json();
}