
var wonBy = ""; // Global variable to store the winner's information

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const problemId = urlParams.get("problemId");
    const challengeId = urlParams.get("challengeId");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id"); // Assume user ID is stored on login
    const email = localStorage.getItem("email");
    const source = urlParams.get("source");
    

    console.log("Problem ID:", problemId);
    console.log("Source:", source);

    if (!token || token === "null" || token === "undefined") {
        alert("You must be logged in to access this page. Please log in and try again.");
        return;
    }

    // Fetch problem details from the server
    loadProblemDetails(problemId);

    document.getElementById("run-code-btn").addEventListener("click", async () => {
        if (!window.editor) {
            alert("The code editor is not fully loaded. Please refresh the page and try again.");
            return;
        }

        const code = window.editor.getValue();
        console.log(code)
        const language = document.getElementById("language-selector").value;
console.log(language)
        // Map language to Judge0 API language IDs
        const languageMap = {
            python: 71, // Python (version 3.8.1)
            javascript: 63, // JavaScript (Node.js 12.14.0)
            cpp: 54, // C++ (GCC 9.2.0)
            java: 62, // Java (OpenJDK 13.0.1)
        };

        if (!languageMap[language]) {
            alert("Unsupported language selected. Please try again.");
            return;
        }

        const customInput = document.getElementById("custom-input")?.value || "";

        // Call handleCompile with the selected language, code, and custom input
        handleCompile(languageMap[language], code, customInput);
    });

    document.getElementById("submit-btn").addEventListener("click", async () => {
        const difficulty = problemData.find(
            (problem) =>
                problem.title === document.getElementById("problem-title").textContent
        ).difficulty;
        const pointsEarned = difficulty === "Easy" ? 10 : difficulty === "Medium" ? 20 : 40;
        const updatedPoints = parseInt(localStorage.getItem("points")) + pointsEarned;

        console.log("Points Earned:", pointsEarned);
        console.log("Updated Points:", updatedPoints);

        if (challengeId && source === "challenger") {
            try {
                const challengeResponse = await fetch(
                    `http://localhost:8000/api/challenge/get/${challengeId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const challengeData = await challengeResponse.json();
                wonBy = challengeData[0].wonBy;

                if (challengeData[0].wonBy) {
                    alert(`This challenge has already been solved by ${challengeData[0].wonBy}.`);
                    window.location.href = "leader.html";
                    return;
                }
            } catch (error) {
                console.error("Error fetching challenge details:", error);
                alert("An error occurred while checking challenge status. Please try again.");
                return;
            }
        }

        if (!wonBy) {
            try {
                const response = await fetch("http://localhost:8000/api/auth/updatePoints", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId, points: updatedPoints }),
                });

                if (response.ok) {
                    alert("Points updated successfully!");
                    localStorage.setItem("points", updatedPoints);
                    window.location.href = "leader.html";

                    if (challengeId) {
                        const updateChallengeResponse = await fetch(
                            `http://localhost:8000/api/challenge/${challengeId}/won`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ wonBy: email }),
                            }
                        );

                        if (!updateChallengeResponse.ok) {
                            const errorData = await updateChallengeResponse.json();
                            console.error("Failed to mark challenge as won:", errorData.message);
                            alert("Failed to update challenge status. Please try again.");
                            return;
                        }
                    }
                } else {
                    const errorData = await response.json();
                    console.error("Failed to update points:", errorData.message);
                    alert("Failed to update points. Please try again.");
                }
            } catch (error) {
                console.error("Error while updating points:", error);
                alert(
                    "An error occurred while updating points. Please check your connection and try again."
                );
            }
        }
    });
});

async function loadProblemDetails(problemId) {
    try {
        const response = await fetch(`http://localhost:8000/api/problems/${problemId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const problem = await response.json();

        if (problem) {
            document.getElementById("problem-title").textContent = problem.title;
            document.getElementById("problem-description").textContent = problem.description;
            document.getElementById("problem-sample-input").textContent = problem.sampleInput;
            document.getElementById("problem-sample-output").textContent = problem.sampleOutput;
        } else {
            document.getElementById("problem-title").textContent = "Problem not found";
        }
    } catch (error) {
        console.error("Error fetching problem details:", error);
        document.getElementById("problem-title").textContent = "Error loading problem details";
    }
}

const handleCompile = (languageId, code, customInput) => {
    setProcessing(true);

    const formData = {
        language_id: languageId,
        source_code: btoa(code),
        stdin: btoa(customInput),
    };

    const options = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions",
        params: { base64_encoded: "true", fields: "*" },
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": "26f397d828msh57887dad54691fap13b5e9jsnd60485118279",
        },
        data: formData,
    };

    axios.request(options)
        .then((response) => {
            const token = response.data.token;
            checkStatus(token);
        })
        .catch((error) => {
            console.error("Error during compile request:", error);
            alert("An error occurred while compiling the code. Please try again.");
            setProcessing(false);
        });
};

const checkStatus = (token) => {
    const options = {
        method: "GET",
        url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        params: { base64_encoded: "true", fields: "*" },
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": "26f397d828msh57887dad54691fap13b5e9jsnd60485118279",
        },
    };

    const interval = setInterval(() => {
        axios
            .request(options)
            .then((response) => {
                const { status, stdout, stderr, compile_output } = response.data;

                if (status.description !== "In Queue") {
                    clearInterval(interval);
                    setProcessing(false);

                    const output = stdout
                        ? atob(stdout)
                        : compile_output
                        ? atob(compile_output)
                        : stderr
                        ? atob(stderr)
                        : "Unknown error.";

                    document.getElementById("output").textContent = output;
                    console.log(output,"output is here")
                    const problemTitle = document.getElementById('problem-title').textContent;
                    const currentProblem = problemData.find(problem => problem.title === problemTitle);
                    console.log(
                        currentProblem.sampleOutput,
                        output,
                        currentProblem.sampleOutput.trim()===output.trim())
            if(currentProblem.sampleOutput.trim()==output.trim()){
                    document.getElementById('output').textContent = currentProblem.sampleOutput;
                    document.getElementById('submit-btn').disabled = false; // Enable submit button
                    
            }
            else{
                document.getElementById('submit-btn').disabled = true; // Enable submit button
                alert("it does not match the output")

            }
                }
            })
            .catch((error) => {
                console.error("Error checking status:", error);
                clearInterval(interval);
                setProcessing(false);
            });
    }, 2000);
};

const setProcessing = (isProcessing) => {
    const runButton = document.getElementById("run-code-btn");
    runButton.disabled = isProcessing;
    runButton.textContent = isProcessing ? "Running..." : "Run Code";
};
