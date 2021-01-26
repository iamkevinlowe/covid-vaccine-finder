import { EVENTS, PAGES, SITES } from './constants';
const { OPENED, CHECK_APPOINTMENTS, OPEN_SITE_APPOINTMENT_PAGE } = EVENTS;
const { SD_COVID } = PAGES;
const SD_COVID_SITES = SITES[SD_COVID];

chrome.runtime.sendMessage({ page: SD_COVID, event: OPENED });

chrome.runtime.onMessage.addListener(message => {
	if (message.page !== SD_COVID) {
		return;
	}

	if (message.event === CHECK_APPOINTMENTS) {
		chrome.storage.local.get(['activePatient'], ({ activePatient }) => {
			if (!activePatient) {
				alert('There is no active patient selected. Please choose one, or add patient details.');
				return;
			}
			handleCheckAppointments(message);
		});
	}
});

const handleCheckAppointments = message => {
	let $appointmentsTable;

	switch (message.site) {
		case SD_COVID_SITES.SHARP_SOUTH_BAY_SUPER_STATION:
			$appointmentsTable = $('#southbay').parents('.parbase.section')
				.next()
				.find('table');
			break;
		case SD_COVID_SITES.SHARP_CORONADO_HOSPITAL:
			$appointmentsTable = $('#coronado').parents('.parbase.section')
				.next()
				.find('table');
			break;
		case SD_COVID_SITES.SHARP_GROSSMONT_HOSPITAL:
			$appointmentsTable = $('#grossmontAppointment').parents('.parbase.section')
				.next()
				.find('table');
			break;
	}

	if (!$appointmentsTable.length) {
		alert('No appointments found');
		return;
	}

	const urls = $appointmentsTable.find('a').map((i, e) => e.getAttribute('href')).toArray();
	chrome.runtime.sendMessage({
		event: OPEN_SITE_APPOINTMENT_PAGE,
		urls
	});
};
