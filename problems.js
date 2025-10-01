document.addEventListener('DOMContentLoaded', async function () {
    const points = parseInt(localStorage.getItem('points')) || 0; // Default to 0 if points are not set
    console.log(points);

    try {
        const response = await fetch('http://localhost:8000/api/problems');
        if (!response.ok) {
            throw new Error('Failed to fetch problems');
        }
        const problems = await response.json();
        console.log('Problems fetched:', problems);

        const problemList = document.getElementById('problem-list');
        const difficultySelect = document.getElementById('difficulty-select');

        function renderProblems(filteredProblems) {
            problemList.innerHTML = '';
            if (filteredProblems.length === 0) {
                problemList.innerHTML = `<p>No problems available for the selected difficulty.</p>`;
                return;
            }

            filteredProblems.forEach(problem => {
                const problemItem = document.createElement('div');
                problemItem.classList.add('problem-item');

                const button = document.createElement('button');
                button.innerText = 'Solve';
                button.addEventListener('click', () => {
                    if ((problem.difficulty === 'Medium' && points < 20) || (problem.difficulty === 'Hard' && points < 60)) {
                        showToaster(`You have ${points} Points. 
                             You need at least ${problem.difficulty === 'Medium' ? '20' : '60'} points to solve ${problem.difficulty.toLowerCase()}-level problems.`);
                    } else {
                        window.location.href = `compiler.html?problemId=${problem._id}`;
                    }
                });

                problemItem.innerHTML = `
                    <h4>${problem.title}</h4>
                    <p><strong>Difficulty:</strong> ${problem.difficulty}</p>
                    <p>${problem.description}</p>
                `;
                problemItem.appendChild(button);
                problemList.appendChild(problemItem);
            });
        }

        renderProblems(problems);

        difficultySelect.addEventListener('change', () => {
            const selectedDifficulty = difficultySelect.value;
            const filteredProblems = selectedDifficulty === 'All' ? problems : problems.filter(problem => problem.difficulty === selectedDifficulty);
            renderProblems(filteredProblems);
        });
    } catch (error) {
        console.error('Error fetching problems:', error);
    }
});

function showToaster(message) {
    const toaster = document.createElement('div');
    toaster.className = 'toaster';
    toaster.innerText = message;
    document.body.appendChild(toaster);
    setTimeout(() => {
        toaster.remove();
    }, 3000);
}
