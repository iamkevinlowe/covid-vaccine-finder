import { PAGES, PAGE_URLS } from './constants';
const { SD_COVID } = PAGES;

const goToVaccinePageButton = document.getElementById('go_to_button');
goToVaccinePageButton.addEventListener('click', () => chrome.tabs.create({ url: PAGE_URLS[SD_COVID] }));
