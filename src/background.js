import { COUNTIES, EVENTS, PAGE_URLS } from './constants';

const activeCovidSites = {};
let notificationId = null;

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
		case EVENTS.CLOSE_TAB:
			handleCloseTab(message, sender);
			break;
		case EVENTS.SETTINGS_CHANGED:
			handleSettingsChanged(message);
			break;
	}
});

chrome.tabs.onRemoved.addListener(tabId => {
	delete activeCovidSites[tabId];
});

chrome.alarms.onAlarm.addListener(() => {
	chrome.storage.local.get(['settings'], ({ settings = {} }) => {
		if (settings.pauseAutomation) {
			return;
		}

		chrome.tabs.create({
			active: false,
			url: PAGE_URLS[COUNTIES.SAN_DIEGO]
		});
	});
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

	const sitesWithAppointments = {};
	Object.values(activeCovidSites).forEach(({ site, appointments }) => {
		if (!appointments) {
			return;
		}

		sitesWithAppointments[site] = sitesWithAppointments[site] || 0;
		sitesWithAppointments[site] += appointments.length;
	});

	const notificationItems = Object.keys(sitesWithAppointments).map(site => ({
		title: site,
		message: `${sitesWithAppointments[site]} appointments available!`
	}));

	if (notificationItems.length) {
		const args = [{
			iconUrl: 'images/syringe.png',
			items: notificationItems,
			message: 'Found appointments!',
			requireInteraction: true,
			title: 'Covid Vaccine Finder',
			type: 'list'
		}, id => { notificationId = id }];
		if (notificationId) {
			args.unshift(notificationId);
		}
		chrome.notifications.create.apply(chrome.notifications, args);
		chrome.storage.local.get(['settings'], ({ settings }) => {
			settings.interval = 0;
			chrome.storage.local.set({ settings });
			chrome.runtime.sendMessage({
				event: EVENTS.SETTINGS_CHANGED,
				key: 'interval'
			});
			chrome.alarms.clear();
		});
	}
};

const handleCloseTab = (message, sender) => {
	chrome.tabs.remove(sender.tab.id);
};

const handleSettingsChanged = message => {
	if (typeof message.key === 'undefined') {
		return;
	}

	if (message.key === 'interval') {
		chrome.storage.local.get(['settings'], ({ settings = {} }) => {
			const interval = parseInt(settings.interval || 0);

			if (interval) {
				chrome.alarms.create({ periodInMinutes: interval });
			} else {
				chrome.alarms.clear();
			}
		});
	}
};
