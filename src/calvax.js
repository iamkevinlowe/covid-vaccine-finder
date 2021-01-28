import { EVENTS } from './constants';
const { FOUND_APPOINTMENTS } = EVENTS;

chrome.storage.local.get(['activePatient', 'settings'], ({ activePatient = null, settings = {} }) => {
	if (!activePatient) {
		alert('No patient selected. Select a patient in the [Patient Details] section, or enter new patient details to get started.');
		return;
	}

	if (settings.pauseAutomation) {
		alert('Automation is disabled.');
		return;
	}

	handleBeginAppointmentForm(activePatient);
});

const handleBeginAppointmentForm = patient => {
	try {
		const url = new URL(location.href);
		switch (url.searchParams.get('next_step')) {
			case null: // Step 1: Personal Information
				handlePersonalInformation(patient);
				break;
			case 'health_insurance': // Step 2: Health Insurance
				handleHealthInsurance(patient);
				break;
			case 'health_questions': // Step 3: Health Questions
				handleHealthQuestions(patient);
				break;
			case 'consent_for_services': // Step 5: Consent For Services
				handleConsentForServices(patient);
				break;
			case 'review': // Step 6: Review
				handleReview();
				break;
			case 'appointment': // Step 7: Appointment
				handleAppointment();
				break;
			default:
				throw new Error('Could not detect what to do here');
		}
	} catch (e) {
		alert(`Encountered an error: ${e.message}`);
	}
};

const handlePersonalInformation = patient => {
	const fields = [
		'address',
		'city',
		'county_id',
		'date_of_birth(1i)',
		'date_of_birth(2i)',
		'date_of_birth(3i)',
		'email',
		'email_confirmation',
		'ethnicity',
		'first_name',
		'last_name',
		'mothers_maiden_name',
		'occupation',
		'phone_number',
		'race',
		'sex',
		'state',
		'zip_code'
	];

	fields.forEach(field => {
		document.querySelector(`[name="patient[${field}]"]`)
			.value = patient[field];
	});

	document.querySelector('input[type="submit"][name="commit"]')
		.click();
};

const handleHealthInsurance = patient => {
	document.querySelector('[name="patient[insurance_type]"]')
		.value = patient.insurance_type;

	document.querySelector('input[type="submit"][name="commit"]')
		.click();
};

const handleHealthQuestions = patient => {
	Array.from(document.querySelectorAll('input[value="no"]'))
		.forEach(element => element.setAttribute('checked', true));

	document.querySelector(`[name="patient[covid_vaccine_number]"][value="${patient.covid_vaccine_number}"]`)
		.setAttribute('checked', true);

	document.querySelector('button[type="submit"][name="next_step"]')
		.click();
};

const handleConsentForServices = patient => {
	const element = document.querySelector(`[name="patient[vaccination_ids][]"][value="20"]`);
	if (!element) {
		throw new Error('Selected vaccine unable');
	}
	element.setAttribute('checked', true);

	try {
		Array.from(document.querySelectorAll('a'))
			.find(element => element.innerText.toLowerCase() === 'type my full name')
			.click();
		document.querySelector('[name="patient[signatory_first_name]"]')
			.value = patient.first_name;
		document.querySelector('[name="patient[signatory_last_name]"]')
			.value = patient.last_name;
	} catch (e) {
		throw new Error(`Unable to sign consent form. ${e.message}`);
	}

	document.querySelector('[name="patient[relation_to_patient_for_insurance]"]')
		.value = 'self';
	document.querySelector('[name="patient[signer_first_name]"]')
		.value = patient.first_name;
	document.querySelector('[name="patient[signer_last_name]"]')
		.value = patient.last_name;
	document.querySelector('input[type="submit"][name="commit"]')
		.click();
};

const handleReview = () => {
	document.querySelector('button[type="submit"][name="next_step"]')
		.click();
};

const handleAppointment = () => {
	const appointments = [];

	document.querySelectorAll('input[name="appointment[appointment_at]"]')
		.forEach(element => {
			if (!element.hasAttribute('disabled')) {
				appointments.push(element.value);
			}
		});

	if (!appointments.length) {
		close();
		return;
	}

	chrome.runtime.sendMessage({
		event: FOUND_APPOINTMENTS,
		appointments
	});
	alert(`Found ${appointments.length} available appointments!`);
};