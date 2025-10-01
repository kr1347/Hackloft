document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('leaderboard-table').getElementsByTagName('tbody')[0];

    // Fetch leaderboard data
    fetch('http://localhost:8000/api/auth/leaderboard')
        .then(response => response.json()) // Convert response to JSON
        .then(users => {
            // Iterate over each user in the leaderboard data
            users.forEach((user, index) => {
                // Create a new row in the table
                const row = tableBody.insertRow();
                // Insert cells for rank, name, points, and challenge button
                const rankCell = row.insertCell(0);
                const nameCell = row.insertCell(1);
                const pointsCell = row.insertCell(2);
                const challengeCell = row.insertCell(3);

                 // Populate rank, name, and points with user data
                rankCell.textContent = index + 1;
                nameCell.textContent = user.name;
                pointsCell.textContent = user.points;

                // Create a challenge button for each user
                const challengeButton = document.createElement('button');
                challengeButton.textContent = 'Challenge';// Set button label
                challengeButton.onclick = () => showChallengeModal(user._id, user.name);// Set click event to show the challenge modal
                challengeCell.appendChild(challengeButton);// Add the button to the cell
            });
        })
        .catch(error => console.error('Error loading the leaderboard:', error));// Log error if leaderboard data fails to load

    // Fetch problems for the dropdown
    fetch('http://localhost:8000/api/problems')
        .then(response => response.json())
        .then(problems => {
            window.problems = problems; // Store problems globally to use later
            const problemSelect = document.getElementById('problemSelect');// Get the problem dropdown element
            // Populate the dropdown with problem options
            problems.forEach(problem => {
                let option = new Option(problem.title, problem._id);// Create a new option element
                problemSelect.appendChild(option);// Add the option to the dropdown
            });
        })
        .catch(error => console.error('Error loading problems:', error));// Log error if problem data fails to load
});
// Function to display the challenge modal when a user is challenged
function showChallengeModal(challengeeId, challengeeName) {
    const modal = document.getElementById('challengeModal');// Get the challenge modal element
    const challengeHeader = document.getElementById('challengeHeader');// Get the modal's header element
    // Update the modal's header to show the name of the user being challenged
    challengeHeader.textContent = `Challenge ${challengeeName}`;
      // Display the modal
    modal.style.display = 'block';

    // Set up the submit button to send the challenge when clicked
    const submitButton = document.getElementById('submitChallenge');
    submitButton.onclick = () => sendChallenge(challengeeId);// Call sendChallenge with the challengee's ID
}

// Function to send the challenge to the backend API
function sendChallenge(challengeeId) {
    const challengerId = localStorage.getItem('id'); // Assume you store user ID in localStorage
    const problemId = document.getElementById('problemSelect').value;// Get the selected problem from the dropdown

// Send a POST request to the backend API to create a new challenge
    fetch('http://localhost:8000/api/challenge/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'// Set the request content type to JSON
        },
        body: JSON.stringify({ challengerId, challengeeId, problemId })// Send the challenger ID, challengee ID, and problem ID in the request body
    })
    .then(response => {
        if (response.ok) {
            // If the request is successful, show a success message and close the modal
            alert('Challenge sent successfully!');
            document.getElementById('challengeModal').style.display = 'none';
        } else {
            // If the request fails, display the error message returned by the server
            response.json().then(data => alert(data.message));
        }
    })
    .catch(error => {
        // Log any network or other errors and show an error message to the user
        console.error('Error sending challenge:', error);
        alert('Failed to send challenge. Please try again later.');
    });
}

