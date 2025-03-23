const keys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>;

const entries = <T extends object>(obj: T) => Object.entries(obj) as Array<[
	keyof T,
	Exclude<T[keyof T], undefined>
]>;

const filter = <T extends object>(obj: T, predicate: (value: T[keyof T], key: keyof T) => any) => {
	const filteredEntries = entries(obj).filter(([key, value]) => predicate(value, key));
	return Object.fromEntries(filteredEntries) as Partial<T>;
};

export {
	keys,
	entries,
	filter,
};
