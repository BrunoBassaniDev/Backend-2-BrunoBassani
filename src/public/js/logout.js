document.getElementById('logoutButton').addEventListener('click', async () => {
    const response = await fetch('/api/sessions/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (data.status === 'success') {
        window.location.href = data.redirectUrl;
    } else {
        alert(data.message);
    }
});