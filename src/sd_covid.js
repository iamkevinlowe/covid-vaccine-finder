import { COUNTIES, EVENTS, SITE_SELECTORS } from './constants';
const { SAN_DIEGO } = COUNTIES;
const { OPEN_SITE_APPOINTMENT_PAGE } = EVENTS;
const SITES = SITE_SELECTORS[SAN_DIEGO];

chrome.storage.local.get(['activePatient', 'settings'], ({ activePatient = null, settings = {} }) => {
	if (
		!activePatient
		|| settings.pauseAutomation
	) {
		return;
	}

	handleCheckAppointments();
});

const handleCheckAppointments = () => {
	const urls = Object.keys(SITES).reduce((urls, site) => {
		$(SITES[site]).parents('.parbase.section')
			.nextAll('.table.parbase.section')
			.first()
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

	close();
};
