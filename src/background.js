import { EVENTS } from './constants';

const activeCovidPage = {};
const settings = {};

chrome.storage.local.remove(['activeCovidPage']);

chrome.runtime.onMessage.addListener((message, sender) => {
	if (typeof message !== 'object') {
		return;
	}

	switch (message.event) {
		case EVENTS.OPENED:
			handleOpenedEvent(message, sender);
			break;
		case EVENTS.CHECK_APPOINTMENTS:
			handleCheckAppointments(message);
			break;
		case EVENTS.OPEN_SITE_APPOINTMENT_PAGE:
			handleOpenSiteAppointmentPage(message);
			break;
		case EVENTS.STORAGE_UPDATED:
			handleStorageUpdated(message);
			break;
	}
});

chrome.tabs.onRemoved.addListener(tabId => {
	if (tabId === activeCovidPage.tabId) {
		delete activeCovidPage.page;
		delete activeCovidPage.tabId;
		delete activeCovidPage.siteTabIds;
		chrome.storage.local.remove(['activeCovidPage']);
		chrome.runtime.sendMessage({
			event: EVENTS.STORAGE_UPDATED,
			key: 'activeCovidPage'
		});
	}
});

chrome.tabs.onUpdated.addListener(tabId => {
	if (
		!settings.pauseAutomation
		&& activeCovidPage.siteTabIds
		&& activeCovidPage.siteTabIds.includes(tabId)
	) {
		chrome.tabs.sendMessage(tabId, { event: EVENTS.BEGIN_APPOINTMENT_FORM });
	}
});

const handleOpenedEvent = (message, sender) => {
	if (typeof activeCovidPage.tabId !== 'undefined') {
		chrome.tabs.remove(activeCovidPage.tabId);
	}
	activeCovidPage.page = message.page;
	activeCovidPage.tabId = sender.tab.id;
	activeCovidPage.siteTabIds = [];

	chrome.storage.local.set({ activeCovidPage });
};

const handleCheckAppointments = message => {
	if (typeof activeCovidPage.page === 'undefined') {
		return;
	}

	chrome.tabs.sendMessage(activeCovidPage.tabId, message);
};

const handleOpenSiteAppointmentPage = message => {
	if (typeof message.urls === 'undefined') {
		return;
	}

	message.urls.forEach(url => {
		chrome.tabs.create({
			active: false,
			url
		}, tab => {
			activeCovidPage.siteTabIds = activeCovidPage.siteTabIds || [];
			activeCovidPage.siteTabIds.push(tab.id);
		});
	});
};

const handleStorageUpdated = message => {
	if (message.key === 'settings') {
		loadSettings();
	}
};

const loadSettings = () => {
	const defaultSettings = {
		pauseAutomation: false
	};

	chrome.storage.local.get(['settings'], ({ settings: storedSettings = {} }) => {
		Object.assign(settings, defaultSettings, storedSettings);
	});
};

loadSettings();
