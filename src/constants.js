export const EVENTS = {
	OPEN_SITE_APPOINTMENT_PAGE: 'open_site_appointment_page',
	FOUND_APPOINTMENTS: 'found_appointments'
};

export const COUNTIES = {
	SAN_DIEGO: 'san_diego'
};

export const PAGE_URLS = {
	[COUNTIES.SAN_DIEGO]: 'https://www.sandiegocounty.gov/content/sdc/hhsa/programs/phs/community_epidemiology/dc/2019-nCoV/vaccines/COVID-19-VaxEvents.html'
};

export const SITE_SELECTORS = {
	[COUNTIES.SAN_DIEGO]: {
		SHARP_GROSSMONT_HOSPITAL: '#grossmontAppointment',
		SHARP_CORONADO_HOSPITAL: '#coronado',
		SHARP_SOUTH_BAY_SUPER_STATION: '#southbay'
	}
};
