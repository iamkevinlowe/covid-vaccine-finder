import { EVENTS } from './constants';

const activeCovidSites = {};

chrome.runtime.onMessage.addListener((message, sender) => {
	if (typeof message !== 'object') {
		return;
	}

	switch (message.event) {
		case EVENTS.OPEN_SITE_APPOINTMENT_PAGE:
			handleOpenSiteAppointmentPage(message);
			break;
		case EVENTS.FOUND_APPOINTMENTS:
			handleFoundAppointments(message, sender);
			break;
	}
});

chrome.tabs.onRemoved.addListener(tabId => {
	delete activeCovidSites[tabId];
});

const handleOpenSiteAppointmentPage = message => {
	if (typeof message.urls === 'undefined') {
		return;
	}

	Object.keys(message.urls).forEach(site => {
		message.urls[site].forEach(url => {
			chrome.tabs.create({
				active: false,
				url
			}, tab => {
				activeCovidSites[tab.id] = { site };
			});
		});
	});
};

const handleFoundAppointments = (message, sender) => {
	if (
		typeof message.appointments === 'undefined'
		|| typeof activeCovidSites[sender.tab.id] === 'undefined'
	) {
		return;
	}

	activeCovidSites[sender.tab.id].appointments = message.appointments;
};
