import {configDotenv} from "dotenv";

export function Throw(txt: string = "Something missing"): never {
	if (txt.split(" ").length === 1) txt = `${txt} required`;
	throw(txt);
}

export function prefixLog(prefix: string, keys = ['error','log','warn','info'] as const) {
	const copy = {...console};
	for (let key of keys) {
		const origin = copy[key];
		copy[key] = (...args: any[]) => {
			origin(prefix.toUpperCase(), ...args);
		}
	}
	return copy;
}


export function getEnv(
	...keys: [...names: string[], required: true]
): string;
export function getEnv(
	...keys: string[]
): string | undefined;
export function getEnv(
	...keys: (string | boolean)[]
): string | undefined {
	configDotenv({
		debug: false,
		quiet: true
	})
	const lastArg = keys[keys.length - 1];
	const isRequired = lastArg === true;

	const actualKeys = isRequired ? keys.slice(0, -1): keys;

	for (const key of actualKeys) {
		if (typeof key === 'string') {
			const value = process.env[key];
			if (value !== undefined) {
				return value;
			}
		}
	}

	if (isRequired) {
		throw(`Missing required environment variable. One of "${actualKeys.join('", "')}" must be set.`);
	}

	return undefined;
}

export function generateRandomRange(min: number, max: number,round = true): number {
	if (min === max) return min;
	if (min > max) {
		throw new Error("Min value cannot be greater than max value");
	}
	const n = Math.random() * (max - min) + min;
	return round ? Math.round(n):n;
}

export function generateRandomCharacter(length: number, chars = "abcdefghijklmnopqrstuvwxyz123456789") {
	let R = "";
	for (let i = 0; i < length; i++) {
		R += chars[generateRandomRange(0,chars.length)] || chars.at(-1);
	}
	return R;
}

export async function forceTry<T extends (n: number)=>any = (n: number)=>undefined>(func: T,_sleep = 1000,maxTry = 5,_try = 0): Promise<Awaited<ReturnType<T>>> {
	try {
		return await func(_try);
	} catch (e) {
		if (_try >= maxTry) throw(e);
		await sleep(_sleep * (_try + 1));
		return forceTry(func,_sleep,maxTry, _try + 1)
	}
}

export function stringToId(str: string,max = 15) {
	let hash = 5381;
	for (let i = 0; i < str.length; i++) {
		hash = ((hash << 5) + hash) + str.charCodeAt(i);
		hash = hash & hash;
	}

	hash = Math.abs(hash);

	const idStr = hash.toString();
	return idStr.substring(0, Math.min(idStr.length, max));
}

export async function sleep(ms: number) {
	if (isNaN(ms)) ms = 1;
	ms = Math.max(0,ms);
	return new Promise(r=>setTimeout(r, ms)).catch(console.error);
}

export async function waitForNumberChange(
	func: ()=>Promise<number>,
	percent: number,
	maxTries = 10,
	intervalMs = 5000
) {
	let init = await func();
	console.log("INIT NUM",init,`${percent}% should be changes`);
	let n = 0;
	do {
		await sleep(intervalMs);
		const newValue = await func().catch(()=>init);
		if (newValue === init) {
			n++;
			continue;
		}

		const diff = newValue - init;

		const diffPercent = (diff / init) * 100;
		const finalDiffPercent = diffPercent < 0 ? -diffPercent : diffPercent;

		if (finalDiffPercent >= percent) {
			return newValue;
		}

		n++;
	} while (n < maxTries)
	return init;
}


export function singleFlightFunc<T extends (this: any, ...args: any[]) => Promise<any>>(asyncFunction: T, wait = 0, name = asyncFunction.name): T {
	let currentExecution = Promise.resolve();
	let n = 0;
	return function (this: any, ...args: Parameters<T>) {
		n++;
		const handle = async () => {
			n--;
			if (n > 20) console.warn(`[SingleFlightFunc:${name || "UnknownFunction"}] Too many concurrent executions ${n}, this may cause performance issues.`);
			if (wait) await sleep(wait);
			return asyncFunction.apply(this, args);
		}
		currentExecution = currentExecution
			.then(handle)
			.catch(handle)
		return currentExecution;
	} as T;
}

const R = timeoutFunc(
	async ()=>("test" as const),
	3000
)

export function timeoutFunc<T,T2 = never>(
	promiseFactory: () => Promise<T>,
	timeoutMs = 10000,
	onTimeout: string | (()=>T2) = `${promiseFactory.name || "UnknownFunc"} TIMEOUT`
): Promise<T | Awaited<T2>> {
	return new Promise((resolve, reject) => {
		const t = setTimeout(typeof onTimeout === 'string' ? () => {
			reject(`[timeoutFunc:${(timeoutMs/1000).toFixed(2)}s] ${onTimeout}`)
		}:async ()=>{
			try {
				const R = await onTimeout();
				resolve(R);
			} catch (e) {
				reject(e);
			}
		}, timeoutMs);
		const promise = promiseFactory();

		promise
			.then(resolve)
			.catch(reject)
			.finally(() => {
				clearTimeout(t);
			})
	})
}


type SingleThread =  {
	thread_id: ReturnType<typeof setInterval>,
	function: (this: HelperClass)=>Promise<any>,
	this: HelperClass
}
declare global {
	var GLOBAL_THREADS: Record<string,SingleThread>
}
global.GLOBAL_THREADS ||= {};
class HelperClass {
	loading = false;
	name: string;
	params: Record<string, any> = {};
	constructor(name: string) {
		this.name = name;
	}

	log(...args: any[]) {
		console.log(`[Thread/${this.name}]`,...args);
	}

	getInfo() {
		return global.GLOBAL_THREADS[this.name] || Throw(`Thread ${this.name} no longer exists`);
	}

	stop() {
		clearInterval(this.getInfo().thread_id);
	}
}
export function thread(name: string, func: SingleThread['function'],ms: number, singleFlight = true, singleFlightMs?: number) {
	if (global.GLOBAL_THREADS[name]) return false;

	const _this = new HelperClass(name);
	async function TheThread(this: typeof _this) {
		if (!singleFlight && this.loading) return;
		this.loading = true;

		try {
			await func.bind(_this)();
		} catch (e) {
			console.error(e);
			_this.log("ERROR!",e)
		}
		this.loading = false;
	}
	const bind = TheThread.bind(_this);
	const ticker = singleFlight ? singleFlightFunc(bind,singleFlightMs, `thread-${name}`):bind;
	ticker().catch(console.error);
	const thread_id = setInterval(ticker, ms);
	global.GLOBAL_THREADS[name] = {
		thread_id,
		function: ticker,
		this: _this
	};
	_this.log(`Thread started`);
	return true;
}

export async function thread_hit(name: string) {
	const thread = global.GLOBAL_THREADS[name];
	if (!thread) throw(`${name} doesn't exists as thread`);
	return (thread as any).function();
}

export function thread_stop(name: string) {
	const thread =  global.GLOBAL_THREADS[name]
	const id = thread?.thread_id;
	if (!id) {
		console.warn(`Thread ${name} doesn't exists to stop!`);
		return;
	}
	clearInterval(id)
	thread.this.log("Thread Terminated!");
	delete global.GLOBAL_THREADS[name];
}

export function makeEnum<T extends string>(...values: T[]) {
	return values;
}
export function checkEnum<T extends string>(value: string, ...values: T[]) {
	for (const v of values) {
		if (value === v) return v;
	}

	throw `Invalid Type '${value}' (${values.join(", ")})`;
}

declare global {
	var RUN_ONCE: string[]
}
global.RUN_ONCE ||= [];
export function runOnce(key: string, func: Function) {
	if (global.RUN_ONCE.includes(key)) return;
	try {
		func()?.catch?.(console.error);
	} catch (e) {
		console.error("RUN ONCE", key, e)
	}
}