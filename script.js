(function () {
	document.addEventListener('DOMContentLoaded', function () {
		const form = document.getElementById('moodForm');
		if (!form) return;

		form.addEventListener('submit', function (e) {
			e.preventDefault();

			const data = {
				moodText: document.getElementById('moodInput')?.value || '',
				date: document.getElementById('dateInput')?.value || '',
				mood: document.getElementById('moodSelect')?.value || '',
				submittedAt: new Date().toISOString()
			};

			// Read existing entries from localStorage
			const key = 'gloom_moodEntries';
			const raw = localStorage.getItem(key);
			const entries = raw ? JSON.parse(raw) : [];

			entries.push(data);
			localStorage.setItem(key, JSON.stringify(entries));

			// Simple user feedback
			alert('Saved — check your browser\'s localStorage (key: ' + key + ')');

			// Optionally clear the form
			form.reset();

			// Re-render entries below the form if present
			if (document.getElementById('entriesList')) {
				renderEntries('entriesList');
			}
		});
	});
})();

// Helpers to manage and render entries
function getEntries() {
	const key = 'gloom_moodEntries';
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : [];
	} catch (e) {
		return [];
	}
}

function renderEntries(containerId) {
	const container = document.getElementById(containerId);
	if (!container) return;

	const entries = getEntries();
	if (!entries.length) {
		container.innerHTML = '<p>No entries yet.</p>';
		return;
	}

	const list = document.createElement('div');
	list.className = 'entries-list';

	entries.slice().reverse().forEach(function (entry) {
		const card = document.createElement('div');
		card.className = 'entry-card';

		const when = document.createElement('div');
		when.className = 'entry-date';
		when.textContent = entry.date ? entry.date : (entry.submittedAt ? new Date(entry.submittedAt).toLocaleString() : '');

		const mood = document.createElement('div');
		mood.className = 'entry-mood';
		mood.textContent = entry.mood || '';

		const text = document.createElement('div');
		text.className = 'entry-text';
		text.textContent = entry.moodText || '';

		card.appendChild(when);
		card.appendChild(mood);
		card.appendChild(text);
		list.appendChild(card);
	});

	container.innerHTML = '';
	container.appendChild(list);
}

// Auto-render on pages that include the container
document.addEventListener('DOMContentLoaded', function () {
	if (document.getElementById('entriesList')) {
		renderEntries('entriesList');
	}
	if (document.getElementById('entriesPage')) {
		renderEntries('entriesList');
	}
});

