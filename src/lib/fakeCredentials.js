function getRandomIssuer() {
	const issuers = ['Didroom', 'Forkbomb BV', 'Italian Government', 'Random Authority A', 'Random Authority B'];
	return issuers[Math.floor(Math.random() * issuers.length)];
}

function getRandomExpirationDate() {
	const currentDate = new Date();
	const futureDate = new Date(
		currentDate.getFullYear() + Math.floor(Math.random() * 5),
		Math.floor(Math.random() * 12),
		Math.floor(Math.random() * 28) + 1
	);

	const year = futureDate.getFullYear();
	const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
	const day = futureDate.getDate().toString().padStart(2, '0');

	return `${year}-${day}-${month}`;
}

const credentialsInfo = [
	{ name: 'Over 13', description: 'This credential proves that you are over 13 years old' },
	{ name: 'Over 18', description: 'This credential proves that you are over 18 years old' },
	{ name: 'Age range 18-65', description: 'This credential proves that you are in a specific age range (18-65)' },
	{ name: 'Residency proof', description: 'This credential proves your residency status' },
	{ name: 'Address proof', description: 'This credential serves as proof of your address' },
	{ name: 'Email proof', description: 'This credential proves the validity of your email address' },
	{ name: 'Diploma', description: 'This credential proves that you have earned a diploma' },
	{ name: 'Driving license', description: 'This credential serves as proof of your driving license' },
	{ name: 'Vaccination', description: 'This credential proves that you have been vaccinated' },
	{ name: 'Proof of employment', description: 'This credential proves your employment status' },
	{ name: 'Proof of humanity', description: 'This credential proves that you are alive' }
];

const fakeCredentials = credentialsInfo.map((credential) => ({
	...credential,
	issuer: getRandomIssuer(),
	expirationDate: getRandomExpirationDate(),
	verified: Boolean(Math.random() < 0.6) // 80% chance of being verified
}));

export default fakeCredentials;
