// user.js

// Function to handle user data and problem-solving count
function updateUserSolvedCount(email) {
    let userSolvedData = JSON.parse(localStorage.getItem('userSolvedData')) || {};
    userSolvedData[email] = (userSolvedData[email] || 0) + 1;
    localStorage.setItem('userSolvedData', JSON.stringify(userSolvedData));

    // Check if the user has reached their problem-solving limit
    if (userSolvedData[email] > 1) {
        alert('You have reached your problem-solving limit. Please upgrade to premium to continue solving more problems.');
        window.location.href = '/upgrade.html'; // Redirect to the upgrade page
    }
}

// Function to get the count of solved problems for a specific user
function getUserSolvedCount(email) {
    let userSolvedData = JSON.parse(localStorage.getItem('userSolvedData')) || {};
    return userSolvedData[email] || 0;
}

// Usage example (assuming `userEmail` is retrieved from the logged-in user's info)
const userEmail = localStorage.getItem('userEmail'); // Ensure this is set during login
console.log(`Problems solved by ${userEmail}: ${getUserSolvedCount(userEmail)}`);
