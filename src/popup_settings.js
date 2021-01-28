chrome.storage.local.get(['settings'], ({ settings = {} }) => {
	document.getElementById('pause_automation_checkbox').checked = settings.pauseAutomation || false;
});

const pauseAutomationCheckbox = document.getElementById('pause_automation_checkbox');
pauseAutomationCheckbox.addEventListener('change', e => {
	chrome.storage.local.get(['settings'], ({ settings = {} }) => {
		settings.pauseAutomation = e.target.checked;
		chrome.storage.local.set({ settings });
	});
});
