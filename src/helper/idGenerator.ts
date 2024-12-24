export function idGenerator(): string {
	return Math.floor(Math.random() * 100000000000000000000).toString(16);
}
