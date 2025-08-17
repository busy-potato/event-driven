document.addEventListener('DOMContentLoaded', () => {
    const positions = document.querySelectorAll('.position-group');
    const submitVoteBtn = document.getElementById('submitVoteBtn');
    const userIdInput = document.getElementById('userId');
    const messageArea = document.getElementById('messageArea');

    const initialData = {
        votedIDs: [],
        votes: {
            presidents: { "Candidate A": 0, "Candidate B": 0 },
            vicePresidents: { "Candidate C": 0, "Candidate D": 0 },
            treasurers: { "Candidate E": 0, "Candidate F": 0 },
            secretaries: { "Candidate G": 0, "Candidate H": 0 },
            pios: { "Candidate I": 0, "Candidate J": 0 }
        }
    };

    // Initialize localStorage if it doesn't exist
    if (!localStorage.getItem('electionData')) {
        localStorage.setItem('electionData', JSON.stringify(initialData));
    }

    // Event listener for candidate selection
    positions.forEach(position => {
        position.addEventListener('click', (event) => {
            if (event.target.classList.contains('candidate-btn')) {
                // Deselect other buttons in the same group
                const buttons = position.querySelectorAll('.candidate-btn');
                buttons.forEach(btn => btn.classList.remove('selected'));
                // Select the clicked button
                event.target.classList.add('selected');
            }
        });
    });

    // Event listener for the submit button
    submitVoteBtn.addEventListener('click', () => {
        const userId = userIdInput.value.trim();
        const electionData = JSON.parse(localStorage.getItem('electionData'));
        
        // --- Validation Checks ---
        // 1. Check if User ID is empty
        if (!userId) {
            displayMessage('User ID Number is required.', 'error');
            return;
        }

        // 2. Check if User ID has already voted
        if (electionData.votedIDs.includes(userId)) {
            displayMessage('This User ID has already voted.', 'error');
            return;
        }

        // 3. Check if one candidate is selected for each position
        const selectedCandidates = document.querySelectorAll('.candidate-btn.selected');
        if (selectedCandidates.length !== positions.length) {
            displayMessage('You must select one candidate for each position.', 'error');
            return;
        }

        // --- Process Vote ---
        selectedCandidates.forEach(candidate => {
            const position = candidate.parentElement.dataset.position;
            const candidateName = candidate.textContent;
            if (electionData.votes[position] && electionData.votes[position][candidateName] !== undefined) {
                electionData.votes[position][candidateName]++;
            }
        });

        // Add user ID to the voted list
        electionData.votedIDs.push(userId);

        // Save updated data to localStorage
        localStorage.setItem('electionData', JSON.stringify(electionData));

        // --- Finalize ---
        displayMessage('Your vote has been successfully submitted!', 'success');
        clearForm();
    });

    function displayMessage(message, type) {
        messageArea.textContent = message;
        messageArea.className = type; // 'success' or 'error'
    }

    function clearForm() {
        userIdInput.value = '';
        const selectedButtons = document.querySelectorAll('.candidate-btn.selected');
        selectedButtons.forEach(btn => btn.classList.remove('selected'));
    }
});
