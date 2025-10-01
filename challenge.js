document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the user's ID from localStorage
    const userId = localStorage.getItem('id'); // Assume user ID is stored in localStorage

    // Fetch received challenges
    fetch(`http://localhost:8000/api/challenge/${userId}`)
        .then(response => response.json())// Parse the response as JSON
        .then(challenges => {
            // Get the container for received challenges and populate it
            const container = document.getElementById('challenges-container');
            populateChallenges(challenges, container, true);// true indicates received challenges
        })
        .catch(error => console.error('Error loading received challenges:', error));

    // Fetch sent challenges
    fetch(`http://localhost:8000/api/challenge/c/${userId}`)
        .then(response => response.json())
        .then(challenges => {
            // Get the container for sent challenges and populate it
            const container = document.getElementById('challenges-container-for-challenger');
            populateChallenges(challenges, container, false);// false indicates sent challenges
        })
        .catch(error => console.error('Error loading sent challenges:', error));
});

// Function to populate challenges in the given container
// isReceived determines if the challenge is received or sent
function populateChallenges(challenges, container, isReceived) {
    // If no challenges are found, show a message
    if (challenges.length === 0) {
        container.innerHTML = '<p>No challenges found.</p>';
    } else {
        // Loop through each challenge and create the necessary HTML structure
        challenges.forEach(challenge => {
            const div = document.createElement('div');
            div.className = 'challenge-item';// Apply a CSS class for styling
            // Populate the challenge details
            div.innerHTML = `
                <strong>From:</strong> ${challenge.challengerId.name}<br>
                <strong>To:</strong> ${challenge.challengeeId.name}<br>
                <strong>Problem:</strong> ${challenge.problemId.title}<br>
                <strong>Status:</strong> ${challenge.status}<br>
            `;
            // If it's a received challenge and the status is pending, show the accept/solve buttons
            if (isReceived && challenge.status === 'pending') {
                div.innerHTML += `
                    <button id="accept-${challenge._id}">Accept Challenge</button>
                    <button id="solve-${challenge._id}" style="display: none;">Solve Challenge</button>
                `;
            // If the challenge is sent and accepted, show the "View Problem" button
            } else if (!isReceived && challenge.status == 'accepted') {
                div.innerHTML += `<button onclick="window.location.href = 'compiler.html?problemId=${challenge.problemId._id}&source=challenger&challengeId=${challenge._id}'">View Problem</button>`;
            }
            // If the challenge is accepted, show the "View Problem" button (for both received/sent)
            else if (challenge.status=='accepted'){
                div.innerHTML += `<button onclick="window.location.href = 'compiler.html?problemId=${challenge.problemId._id}&source=challenger&challengeId=${challenge._id}'">View Problem</button>`;

            }
            // Append the div to the container
            container.appendChild(div);
            if (isReceived) { // Ensure this is called after the div is appended to container
                addChallengeEventListeners(challenge, isReceived);
            }
        });
    }
}

// Function to add event listeners to accept and solve buttons
function addChallengeEventListeners(challenge, isReceived) {
    // Add event listener to accept the challenge
    const acceptBtn = document.getElementById(`accept-${challenge._id}`);
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            // Send a PUT request to accept the challenge
            fetch(`http://localhost:8000/api/challenge/${challenge._id}/accept`, {
                method: 'PUT'
            })
            .then(response => response.json())
            .then(data => {
                // Display success message and show the solve button
                alert(data.message);
                document.getElementById(`solve-${challenge._id}`).style.display = 'block';
                this.style.display = 'none';// Hide the accept button
            })
            .catch(error => {
                // Handle any errors during the accept process
                console.error('Error accepting challenge:', error);
                alert('Failed to accept challenge.');
            });
        });
    }

    // If it's a received challenge, add event listener to the solve button
    if (isReceived) {
        const solveBtn = document.getElementById(`solve-${challenge._id}`);
        if (solveBtn) {
            solveBtn.addEventListener('click', () => {
                // Redirect to the problem-solving page
                window.location.href = `compiler.html?problemId=${challenge.problemId._id}`;
            });
        }
    }
}
