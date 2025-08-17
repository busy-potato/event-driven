document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refreshBtn');

    // Function to render vote tallies
    const renderDashboard = () => {
        const electionData = JSON.parse(localStorage.getItem('electionData'));

        if (!electionData || electionData.votedIDs.length === 0) {
            document.getElementById('dashboard-content').innerHTML = '<p>No votes have been cast yet.</p>';
            return;
        }

        const { votes } = electionData;

        for (const position in votes) {
            const tallyList = document.getElementById(`${position}-tally`);
            if (tallyList) {
                tallyList.innerHTML = ''; // Clear previous results
                const candidates = votes[position];
                for (const candidate in candidates) {
                    const voteCount = candidates[candidate];
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `${candidate} <span>${voteCount}</span>`;
                    tallyList.appendChild(listItem);
                }
            }
        }
    };

    // Utility function for delayed execution
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Async function to handle storage event with a delay
    const handleStorageChange = async (event) => {
        if (event.key === 'electionData') {
            console.log('LocalStorage changed. Updating dashboard in 500ms...');
            await sleep(500); // Wait for 500ms
            renderDashboard();
            console.log('Dashboard updated.');
        }
    };

    // Initial render on page load
    renderDashboard();

    // Manual refresh button
    refreshBtn.addEventListener('click', renderDashboard);

    // Listen for real-time updates from the voting page
    window.addEventListener('storage', handleStorageChange);
});
