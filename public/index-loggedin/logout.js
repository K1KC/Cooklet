function Logout() {
    fetch('/api/logout', {
        method: 'GET'
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'Logged out successfully') {
            alert('Logged out successfully!');
            window.location.href = '../index.html'; // Redirect to the index page or login page
        } else {
            alert('Logout failed');
        }
    })
    .catch(error => {
        console.error('Error logging out:', error);
        alert('Logout failed');
    });
}