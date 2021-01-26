import { EVENTS, PAGES, PAGE_URLS, SITES } from './constants';
const { CHECK_APPOINTMENTS, STORAGE_UPDATED } = EVENTS;
const { SD_COVID } = PAGES;
const SD_COVID_SITES = SITES[SD_COVID];

chrome.storage.local.get(['patients', 'activePatient', 'activeCovidPage'], ({ patients, activePatient, activeCovidPage }) => {
	if (patients) {
		showPatients(patients);
	}
	if (activePatient) {
		const patientButton = document.querySelector(`button.patient_details_button[data-key=${activePatient.key}]`);
		if (patientButton) {
			patientButton.classList.add('active');
		}
	}
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

const goToVaccinePageButton = document.getElementById('go_to_button');
goToVaccinePageButton.addEventListener('click', () => chrome.tabs.create({ url: PAGE_URLS[SD_COVID] }));

const patientsContainer = document.getElementById('patients_container');
patientsContainer.addEventListener('click', e => {
	if (!e.target) {
		return;
	}
	chrome.storage.local.get(['patients', 'activePatient'], ({ patients, activePatient }) => {
		const patient = patients[e.target.dataset.key];

		if (e.target.matches('button.patient_details_button')) {
			document.querySelectorAll('button.patient_details_button')
				.forEach(element => element.classList.remove('active'));
			if (patient) {
				e.target.classList.add('active');
				chrome.storage.local.set({ activePatient: patient });
			} else {
				chrome.storage.local.remove(['activePatient']);
			}
		} else if (e.target.matches('button.patient_edit_button')) {
			toggleNewPatientDetailsForm(true);
			const form = document.getElementById('new_patient_details_form');
			Object.keys(patient).forEach(key => {
				if (key === 'key' || key === 'email_confirmation') {
					return;
				}

				if (form.elements[key]) {
					form.elements[key].value = patient[key];
				}
			});
		} else if (e.target.matches('button.patient_remove_button')) {
			delete patients[e.target.dataset.key];
			chrome.storage.local.set({ patients });
			if (activePatient.key === patient.key) {
				chrome.storage.local.remove(['activePatient']);
			}
			document.querySelectorAll(`button[data-key=${patient.key}]`)
				.forEach(element => element.remove());
		}
	});
});

const addPatientDetailsButton = document.getElementById('add_patient_details_button');
addPatientDetailsButton.addEventListener('click', () => toggleNewPatientDetailsForm(true));

const newPatientDetailsForm = document.getElementById('new_patient_details_form');
newPatientDetailsForm.addEventListener('submit', e => {
	e.preventDefault();

	const {
		address,
		city,
		county_id,
		covid_vaccine_number,
		"date_of_birth(1i)": dob1,
		"date_of_birth(2i)": dob2,
		"date_of_birth(3i)": dob3,
		email,
		ethnicity,
		first_name,
		insurance_type,
		last_name,
		mothers_maiden_name,
		occupation,
		phone_number,
		race,
		sex,
		state,
		zip_code
	} = e.currentTarget.elements;

	const patient = {
		address: address.value,
		city: city.value,
		county_id: county_id.value,
		covid_vaccine_number: covid_vaccine_number.value,
		['date_of_birth(1i)']: dob1.value,
		['date_of_birth(2i)']: dob2.value,
		['date_of_birth(3i)']: dob3.value,
		email: email.value,
		email_confirmation: email.value,
		ethnicity: ethnicity.value,
		first_name: first_name.value,
		insurance_type: insurance_type.value,
		last_name: last_name.value,
		mothers_maiden_name: mothers_maiden_name.value,
		occupation: occupation.value,
		phone_number: phone_number.value,
		race: race.value,
		sex: sex.value,
		state: state.value,
		zip_code: zip_code.value
	};

	chrome.storage.local.get(['patients'], ({ patients = {} }) => {
		const key = `${patient.first_name.replaceAll(' ', '_').toLowerCase()}_${patient.last_name.replaceAll(' ', '_').toLowerCase()}`;
		patient.key = key;
		patients[key] = patient;
		showPatients(patients);
		chrome.storage.local.set({ patients });
	});

	toggleNewPatientDetailsForm(false);
});

const newPatientDetailsFormCancelButton = document.getElementById('new_patient_details_form_cancel_button')
newPatientDetailsFormCancelButton.addEventListener('click', () => {
	Array.from(newPatientDetailsForm.elements).forEach(element => {
		if (element.hasAttribute('required')) {
			element.value = '';
		}
	});
	toggleNewPatientDetailsForm(false);
});

const sitesSection = document.getElementById('sites_section');
sitesSection.addEventListener('click', e => {
	if (e.target && e.target.matches('button.find_appointments_button')) {
		chrome.runtime.sendMessage({ page: e.target.dataset.page, event: CHECK_APPOINTMENTS, site: e.target.dataset.site });
	}
});

const toggleNewPatientDetailsForm = toShow => {
	const section = document.getElementById('patient_details_section');
	section.classList[toShow ? 'add' : 'remove']('form_active');
};

const showPatients = patients => {
	patientsContainer.innerHTML = '';
	Object.values(patients).forEach(patient => {
		const div = document.createElement('div');

		const patientButton = document.createElement('button');
		patientButton.classList.add('patient_details_button');
		patientButton.dataset.key = patient.key;
		patientButton.innerText = `${patient.first_name} ${patient.last_name}`;
		div.appendChild(patientButton);

		const editButton = document.createElement('button');
		editButton.classList.add('patient_edit_button');
		editButton.dataset.key = patient.key;
		editButton.innerText = 'Edit';
		div.appendChild(editButton);

		const removeButton = document.createElement('button');
		removeButton.classList.add('patient_remove_button');
		removeButton.dataset.key = patient.key;
		removeButton.innerText = 'Remove';
		div.appendChild(removeButton);

		patientsContainer.appendChild(div);
	});
};

const handleShowSites = page => {
	const sitesSection = document.getElementById('sites_section');

	if (page === SD_COVID) {
		Object.values(SD_COVID_SITES).forEach(site => {
			const button = document.createElement('button');
			button.dataset.page = SD_COVID;
			button.dataset.site = site;
			button.classList.add('find_appointments_button');
			button.innerText = `Find Appointments: ${site.replaceAll('_', ' ')}`;
			sitesSection.appendChild(button);
		});
	} else {
		sitesSection.html = '';
	}
};
