chrome.storage.local.get(['patients'], ({ patients }) => {
	if (patients) {
		showPatients(patients);
	}
});

const patientsContainer = document.getElementById('patients_container');
const addPatientDetailsButton = document.getElementById('add_patient_details_button');
const newPatientDetailsForm = document.getElementById('new_patient_details_form');
const newPatientDetailsFormCancelButton = document.getElementById('new_patient_details_form_cancel_button')

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

			Object.keys(patient).forEach(key => {
				if (key === 'key' || key === 'email_confirmation') {
					return;
				}

				if (newPatientDetailsForm.elements[key]) {
					if (Array.isArray(patient[key])) {
						newPatientDetailsForm.elements[key].forEach(element => {
							element.checked = patient[key].includes(element.value);
						});
					} else {
						newPatientDetailsForm.elements[key].value = patient[key];
					}
				}
			});
		} else if (e.target.matches('button.patient_remove_button')) {
			delete patients[e.target.dataset.key];
			chrome.storage.local.set({ patients });
			if (activePatient?.key === patient.key) {
				chrome.storage.local.remove(['activePatient']);
			}
			document.querySelectorAll(`button[data-key=${patient.key}]`)
				.forEach(element => element.remove());
		}
	});
});

addPatientDetailsButton.addEventListener('click', () => toggleNewPatientDetailsForm(true));

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
		'vaccine_ids[]': vaccine_ids,
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
		['vaccine_ids[]']: Array.from(vaccine_ids).reduce((ids, element) => {
			if (element.checked) {
				ids.push(element.value);
			}
			return ids;
		}, []),
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

newPatientDetailsFormCancelButton.addEventListener('click', () => toggleNewPatientDetailsForm(false));

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

	chrome.storage.local.get(['activePatient'], ({ activePatient }) => {
		if (activePatient && activePatient.key) {
			const patientButton = document.querySelector(`button.patient_details_button[data-key=${activePatient.key}]`);
			if (patientButton) {
				patientButton.classList.add('active');
			}
		}
	});
};

const clearForm = () => {
	Array.from(newPatientDetailsForm.elements).forEach(element => {
		if (element.type === 'radio' || element.type === 'checkbox') {
			element.checked = false;
		} else if (element.hasAttribute('required')) {
			element.value = '';
		}
	});
};

const toggleNewPatientDetailsForm = toShow => {
	clearForm();

	const section = document.getElementById('patient_details_section');
	section.classList[toShow ? 'add' : 'remove']('form_active');
};
