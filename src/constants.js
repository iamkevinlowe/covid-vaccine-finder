export const EVENTS = {
	OPENED: 'opened',
	CHECK_APPOINTMENTS: 'check_appointments',
	OPEN_SITE_APPOINTMENT_PAGE: 'open_site_appointment_page',
	STORAGE_UPDATED: 'storage_updated',
	BEGIN_APPOINTMENT_FORM: 'begin_appointment_form'
};

export const PAGES = {
	SD_COVID: 'sd_covid'
};

export const PAGE_URLS = {
	[PAGES.SD_COVID]: 'https://www.sandiegocounty.gov/content/sdc/hhsa/programs/phs/community_epidemiology/dc/2019-nCoV/vaccines/COVID-19-VaxEvents.html'
};

export const SITES = {
	[PAGES.SD_COVID]: {
		SHARP_GROSSMONT_HOSPITAL: 'sharp_grossmont_hospital',
		SHARP_CORONADO_HOSPITAL: 'sharp_coronado_hospital',
		SHARP_SOUTH_BAY_SUPER_STATION: 'sharp_south_bay_super_station'
	}
};
