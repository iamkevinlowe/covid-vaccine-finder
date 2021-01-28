import { PAGE_URLS } from './constants';

const findAppointmentsSection = document.getElementById('find_appointments_section');
findAppointmentsSection.addEventListener('click', e => {
	if (e.target && e.target.matches('button.find_appointments_button')) {
		const { county } = e.target.dataset;
		openPageForCounty(county);
	}
});

const openPageForCounty = county => {
	if (typeof PAGE_URLS[county] === 'undefined') {
		alert('Invalid county');
		return;
	}

	chrome.storage.local.get(['activePatient', 'settings'], ({ activePatient = null, settings = {} }) => {
		if (!activePatient) {
			alert('No patient selected. Select a patient in the [Patient Details] section, or enter new patient details to get started.');
			return;
		}

		if (settings.pauseAutomation) {
			alert('Automation is disabled.');
			return;
		}

		chrome.tabs.create({ url: PAGE_URLS[county] });
	});
};
