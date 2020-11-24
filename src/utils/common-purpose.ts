export const isInvite = (str: string) => /(https:\/\/)?.*(discord.*\.?g.*g.*|invite\/*)\/?.+/igm.test(str);
export const isURL = (str: string) => /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/.test(str);
export const isEmpty = (str: string) => !/^(\w+\S+)$/.test(str);
export const isMention = (str: string) => /(<a?:.+:.[0-9]+>)|.*(<(#|@)*(!|&)?[0-9]+>)/.test(str);