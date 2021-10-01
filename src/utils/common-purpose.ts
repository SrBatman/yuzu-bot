export function isInvite(str: string): boolean {
	return /(https:\/\/)?.*(discord.*\.?g.*g.*|invite\/*)\/?.+/igm.test(str);
}
export function isURL(str: string): boolean {
	return /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/.test(str);
}
export function isEmpty(str: string): boolean {
	return !/^(\w+\S+)$/.test(str);
}
export function isMention(str: string): boolean {
	return /(<a?:.+:.[0-9]+>)|.*(<(#|@)*(!|&)?[0-9]+>)/.test(str);
}
