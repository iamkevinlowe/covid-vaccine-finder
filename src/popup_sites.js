import { EVENTS, PAGES, SITES } from './constants';
const { CHECK_APPOINTMENTS, STORAGE_UPDATED } = EVENTS;
const { SD_COVID } = PAGES;
const SD_COVID_SITES = SITES[SD_COVID];

chrome.storage.local.get(['activeCovidPage'], ({ activeCovidPage }) => {
	if (activeCovidPage) {
		handleShowSites(activeCovidPage.page);
	}
});

chrome.runtime.onMessage.addListener(message => {
	if (typeof message !== 'object') {
		return;
	}

	if (message.event === STORAGE_UPDATED) {
		chrome.storage.local.get([message.key], result => {
			if (message.key === 'activeCovidPage') {
				const activeCovidPage = result[message.key] || {};
				handleShowSites(activeCovidPage.page);
			}
		});
	}
});

const sitesSection = document.getElementById('sites_section');
sitesSection.addEventListener('click', e => {
	if (e.target && e.target.matches('button.find_appointments_button')) {
		chrome.runtime.sendMessage({
			event: CHECK_APPOINTMENTS,
			page: e.target.dataset.page,
			site: e.target.dataset.site
		});
	}
});

const handleShowSites = page => {
	const sitesSection = document.getElementById('sites_section');
	let sites = [];

	if (page === SD_COVID) {
		sites = Object.values(SD_COVID_SITES);
	}

	if (sites.length) {
		sites.forEach(site => {
			const button = document.createElement('button');
			button.dataset.page = page;
			button.dataset.site = site;
			button.classList.add('find_appointments_button');
			button.innerText = `Find Appointments: ${site.replaceAll('_', ' ')}`;
			sitesSection.appendChild(button);
		});
		sitesSection.classList.add('has_sites');
	} else {
		sitesSection.html = '';
		sitesSection.classList.remove('has_sites');
	}
};
