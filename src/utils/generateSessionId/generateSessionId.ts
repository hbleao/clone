/**
 * Generates a unique session ID using the current timestamp and a random number.
 * @param orgid - The organization ID to include in the session ID.
 * @returns A unique session ID string.
 */
export const generateSessionId = (orgid: string): string => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	const date = now.getDate();
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const seconds = now.getSeconds();
	const milliseconds = now.getUTCMilliseconds();
	const randomPart = Math.ceil(Math.random() * 1e6);

	const sessionId = `${orgid}-${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}-${randomPart}`;

	return sessionId;
};
