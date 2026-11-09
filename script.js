const form = document.querySelector('#flight-search');
const origin = document.querySelector('#origin');
const destination = document.querySelector('#destination');
const depart = document.querySelector('#depart-date');
const returning = document.querySelector('#return-date');
const message = document.querySelector('#form-message');
const tripRadios = document.querySelectorAll('input[name="trip"]');

const today = new Date();
const dateString = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const weekLater = new Date(today);
weekLater.setDate(today.getDate() + 8);
depart.min = dateString(today);
depart.value = dateString(tomorrow);
returning.min = dateString(tomorrow);
returning.value = dateString(weekLater);

depart.addEventListener('change', () => {
  returning.min = depart.value;
  if (returning.value && returning.value < depart.value) returning.value = depart.value;
});

document.querySelector('#swap-cities').addEventListener('click', () => {
  const previousOrigin = origin.value;
  origin.value = destination.value;
  destination.value = previousOrigin;
  destination.focus();
});

tripRadios.forEach((radio) => radio.addEventListener('change', () => {
  const isOneWay = radio.value === 'oneway' && radio.checked;
  returning.disabled = isOneWay;
  returning.closest('.field').classList.toggle('field-disabled', isOneWay);
  if (radio.value === 'roundtrip' && radio.checked && returning.value === '') {
    const nextWeek = new Date(`${depart.value}T12:00:00`);
    nextWeek.setDate(nextWeek.getDate() + 7);
    returning.value = dateString(nextWeek);
  }
}));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const from = origin.value.trim();
  const to = destination.value.trim();
  if (!from || !to) {
    message.textContent = 'Add a city or airport for both your starting point and destination.';
    return;
  }
  if (from.toLowerCase() === to.toLowerCase()) {
    message.textContent = 'Your destination and starting point look the same—try another city.';
    destination.focus();
    return;
  }
  const trip = document.querySelector('input[name="trip"]:checked').value;
  const date = new Date(`${depart.value}T12:00:00`);
  const formattedDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
  const passengers = document.querySelector('#travelers').value;
  const nonstop = document.querySelector('#nonstop').checked ? ' · nonstop only' : '';
  message.textContent = `You're ready to compare flights from ${from} to ${to} on ${formattedDate} · ${passengers} traveler${passengers === '1' ? '' : 's'}${nonstop}. Live booking isn't connected yet.`;
});

document.querySelectorAll('.deal-card').forEach((card) => card.addEventListener('click', () => {
  destination.value = card.dataset.destination;
}));

document.querySelector('#year').textContent = new Date().getFullYear();
