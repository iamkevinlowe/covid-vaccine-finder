import { EVENTS } from './constants';
const { SETTINGS_CHANGED } = EVENTS;

chrome.runtime.onMessage.addListener(message => {
	if (
		typeof message !== 'object'
		|| message.event !== SETTINGS_CHANGED
		|| typeof message.key === 'undefined'
	) {
		return;
	}

	if (message.key === 'interval') {
		loadSettings();
	}
});

const editSettingsButton = document.getElementById('edit_settings_button');
editSettingsButton.addEventListener('click', () => {
	document.getElementById('settings_section').classList.add('form_active');
	toggleInputs(true);
});

const settingsFormCancelButton = document.getElementById('settings_form_cancel_button');
settingsFormCancelButton.addEventListener('click', () => resetForm());

const settingsForm = document.getElementById('settings_form');
settingsForm.addEventListener('submit', e => {
	e.preventDefault();

	chrome.storage.local.get(['settings'], ({ settings = {} }) => {
		const {
			pause_automation_checkbox,
			interval_input
		} = e.target.elements;

		settings.pauseAutomation = pause_automation_checkbox.checked;
		settings.interval = interval_input.value;

		chrome.storage.local.set({ settings }, () => {
			chrome.runtime.sendMessage({
				event: SETTINGS_CHANGED,
				key: 'interval'
			});

			resetForm();
		});
	});
});

const toggleInputs = enable => {
	if (enable) {
		document.getElementById('pause_automation_checkbox').removeAttribute('disabled');
		document.getElementById('interval_input').removeAttribute('disabled');
	} else {
		document.getElementById('pause_automation_checkbox').setAttribute('disabled', 'disabled');
		document.getElementById('interval_input').setAttribute('disabled', 'disabled');
	}
};

const loadSettings = () => {
	chrome.storage.local.get(['settings'], ({ settings = {} }) => {
		document.getElementById('pause_automation_checkbox').checked = settings.pauseAutomation || false;
		document.getElementById('interval_input').value = settings.interval || 0;
	});
};

const resetForm = () => {
	document.getElementById('settings_section').classList.remove('form_active');
	toggleInputs(false);
	loadSettings();
};

resetForm();
