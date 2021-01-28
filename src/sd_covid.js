import { COUNTIES, EVENTS, SITE_SELECTORS } from './constants';
const { SAN_DIEGO } = COUNTIES;
const { OPEN_SITE_APPOINTMENT_PAGE } = EVENTS;
const SITES = SITE_SELECTORS[SAN_DIEGO];

chrome.storage.local.get(['activePatient', 'settings'], ({ activePatient = null, settings = {} }) => {
	if (!activePatient) {
		alert('No patient selected. Select a patient in the [Patient Details] section, or enter new patient details to get started.');
		return;
	}

	if (settings.pauseAutomation) {
		alert('Automation is disabled.');
		return;
	}

	handleCheckAppointments();
});

const handleCheckAppointments = () => {
	const urls = Object.keys(SITES).reduce((urls, site) => {
		$(SITES[site]).parents('.parbase.section')
			.next()
			.find('table a')
			.each((i, e) => {
				urls[site] = urls[site] || [];
				urls[site].push(e.getAttribute('href'));
			});

		return urls;
	}, {});

	chrome.runtime.sendMessage({
		event: OPEN_SITE_APPOINTMENT_PAGE,
		urls
	});
};
