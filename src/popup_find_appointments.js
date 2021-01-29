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

	chrome.tabs.create({
		active: false,
		url: PAGE_URLS[county]
	});
};
