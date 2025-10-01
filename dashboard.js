document.addEventListener("DOMContentLoaded", async function () {
    // Retrieve token and points from localStorage
    const token = localStorage.getItem('token');
    const points=localStorage.getItem('points')
    // Check if the user is logged in (i.e., if token exists)
    if (!token) {
        alert('You need to log in first.');
        // Redirect the user to the login page if not authenticated
        window.location.href = 'login.html';
        return;
    }

    try {
        // Fetch request to the server to access protected dashboard information
        const response = await fetch('http://localhost:8000/api/protected', {
            headers: {
                // Include the authorization header with the user's token
                'Authorization': `Bearer ${token}`
            }
        });

        // Check if the server response is successful
        if (response.ok) {
            // Parse the JSON response from the server
            const data = await response.json();
            // Dynamically update the dashboard with user-specific information
            document.querySelector('.dashboard-info').innerHTML = `
                <h3>Welcome, ${data.user.name}</h3>
                <p>Email: ${data.user.email}</p>
                <p> Keep going!</p>
            `;
        } else {
            // If there's an issue with the response, alert the user
            alert('Error fetching dashboard information.');
        }
    } catch (error) {
        // Log any network or server errors to the console
        console.error('Error:', error);
    }
});
