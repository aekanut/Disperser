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