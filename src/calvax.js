import { EVENTS } from './constants';
const { BEGIN_APPOINTMENT_FORM } = EVENTS;

chrome.runtime.onMessage.addListener(message => {
	if (typeof message !== 'object') {
		return;
	}

	if (message.event === BEGIN_APPOINTMENT_FORM) {
		handleBeginAppointmentForm();
	}
});

const handleBeginAppointmentForm = () => {
	chrome.storage.local.get(['activePatient'], ({ activePatient }) => {
		if (!activePatient) {
			alert('No active patient found!');
			close();
			return;
		}

		Object.keys(activePatient).forEach(key => {
			if (key === 'key') {
				return;
			}
			const element = document.querySelector(`[name="patient[${key}]"]`);
			if (!element) {
				return
			}

			if (element.type === 'radio') {
				const radio = document.querySelector(`[name="patient[${key}]"][value="${activePatient[key]}"]`);
				if (radio) {
					radio.setAttribute('checked', true);
				}
			} else {
				element.value = activePatient[key];
			}
		});

		const url = new URL(location.href);
		if (url.searchParams.get('next_step') === 'health_questions') {
			Array.from(document.querySelectorAll('input[value="no"]'))
				.forEach(element => element.setAttribute('checked', true));
		} else if (url.searchParams.get('next_step') === 'consent_for_services') {
			const fullNameAnchor = Array.from(document.querySelectorAll('a')).find(element => element.innerText.toLowerCase() === 'type my full name');
			if (!fullNameAnchor) {
				return;
			}
			fullNameAnchor.click();
			document.querySelector('[name="patient[signatory_first_name]"]').value = activePatient.first_name;
			document.querySelector('[name="patient[signatory_last_name]"]').value = activePatient.last_name;
			document.querySelector('[name="patient[relation_to_patient_for_insurance]"]').value = 'self';
		}
	});
};
