const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const iconClose = document.querySelector(".icon-close");

registerLink.addEventListener("click", () => {
    wrapper.classList.add("active");
});

loginLink.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

// btnPopup.addEventListener("click", () => {
//   wrapper.classList.add("active-popup");
// });

iconClose.addEventListener("click", () => {
    wrapper.classList.remove("active-popup");
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                const user = data.user;
                console.log('Login successful', data);
                alert('Login successful! Redirecting to homepage...');
                window.location.href = "../index-loggedin/L-index.html";
            } else {
                alert(data.msg || 'Login failed');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Login failed');
        }
    });

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confpass').value;
        const agreeCheck = document.getElementById("agree-check");

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (!agreeCheck.checked)
        {
            alert('You must agree to our terms and conditions!');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                // Handle successful registration
                console.log('Registration successful', data);
                alert('Registration successful! Navigate back to the login page');
            } else {
                alert(data.msg || 'Registration failed');
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('Registration failed');
        }
    });

    const logoutButton = document.getElementById('logout-HL');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/logout', {
                    method: 'GET'
                });
                if (response.ok) {
                    alert('Logged out successfully!');
                    window.location.href = '../public/index.html';
                } else {
                    alert('Logout failed');
                }
            } catch (error) {
                console.error('Error logging out:', error);
                alert('Logout failed');
            }
        });
    }
});
