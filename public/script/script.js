const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', loginUser);

async function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json());

    if (result.status === 'ok') {
        localStorage.setItem('token', result.token)
        alert('success')
        location.replace("/data")
    } else {
        alert(result.data)
    }
}

async function checkToken(token) {
    const result = await fetch('/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token
        })
    }).then((res) => res.json());

    if (result.status === 'error') {
        localStorage.removeItem('token')
        location.replace("/")
    }
}

