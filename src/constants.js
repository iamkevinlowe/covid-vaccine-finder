export const EVENTS = {
	OPEN_SITE_APPOINTMENT_PAGE: 'open_site_appointment_page',
	FOUND_APPOINTMENTS: 'found_appointments',
	CLOSE_TAB: 'close_tab',
	SETTINGS_CHANGED: 'settings_changed'
};

export const COUNTIES = {
	SAN_DIEGO: 'san_diego'
};

export const PAGE_URLS = {
	[COUNTIES.SAN_DIEGO]: 'https://www.sandiegocounty.gov/content/sdc/hhsa/programs/phs/community_epidemiology/dc/2019-nCoV/vaccines/vax-schedule-appointment.html'
};

export const SITE_SELECTORS = {
	[COUNTIES.SAN_DIEGO]: {
		SHARP_GROSSMONT_HOSPITAL: '#grossmontAppointment',
		SHARP_CORONADO_HOSPITAL: '#coronado',
		SHARP_SOUTH_BAY_SUPER_STATION: '#southbay'
	}
};
