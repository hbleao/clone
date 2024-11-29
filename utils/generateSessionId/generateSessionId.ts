export const generateSessionId = (orgid: string) => {
	const year = new Date().getFullYear();
	const month = new Date().getMonth();
	const date = new Date().getDate();
	const hours = new Date().getHours();
	const minutes = new Date().getMinutes();
	const miniseconds = new Date().getSeconds();
	const miliseconds = new Date().getUTCMilliseconds();
	let sessionId =
		// biome-ignore lint/style/useTemplate: <explanation>
		'' +
		year +
		month +
		date +
		hours +
		minutes +
		miniseconds +
		miliseconds +
		Math.ceil(Math.random() * 1000000);

	// biome-ignore lint/style/useTemplate: <explanation>
	sessionId += '-' + orgid.toUpperCase();

	return sessionId;
};
