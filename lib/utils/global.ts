import {UserType} from "@/lib/hooks/useUser";

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function isMobileUserAgent(userAgent: string) {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(userAgent);
}

class CFormData extends FormData {
    toJson() {
        const clean = Object.fromEntries(Array.from(this.entries()).map(([key, _value]) => {
            let value = _value as any;
            const str = value + "";
            if (str === "(JSON)") {
                value = window.formJson?.[key] || {};
            } else if (str.startsWith("number:")) {
                value = str.split(":")?.at(-1) || value;
                value = +(value + "").replaceAll(",", "");
            }

            return [key, value];
        }));

        return dotNotationToNested(clean);
    }
}

export function optimizeForm(param: any) {
    try {
        param?.preventDefault?.();
    } catch {}

    let form: CFormData;
    if (param instanceof HTMLFormElement) {
        form = new CFormData(param);
    } else if ('target' in param) {
        form = new CFormData(param.target);
    } else if (param instanceof FormData) {
        form = new CFormData();
        for (const [k,v] of param.entries()) {
            form.set(k,v);
        }
    } else {
        form = new CFormData(param);
    }

    const keys = Array.from(form.keys());
    for (const _k of keys) {
        const value = form.get(_k);
        const [k, type] = _k.split("!");
        if (!type) {
            if (!value) {
                form.delete(k);
                continue;
            }
            if (typeof value === 'string' && !value) form.delete(k);
            if (typeof value !== 'string' && !value?.size) form.delete(k);
        } else {
            form.delete(_k);
            if (type === "boolean") form.set(k, (value === 'on' || value === 'true') + "");
            else if (type === 'number') form.set(k, `number:${value}`)
            else if (type === 'json') form.set(k, '(JSON)');
        }
    }
    return form;
}

function dotNotationToNested(flat: Record<string, any>): any {
    const result: any = {};

    // Sort keys by length to ensure parent paths are processed first
    const sortedKeys = Object.keys(flat).sort((a, b) => a.length - b.length);

    for (const key of sortedKeys) {
        const keys = key.split('.');
        let current = result;

        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const isLast = i === keys.length - 1;

            if (isLast) {
                current[k] = flat[key];
            } else {
                // Only create new object if it doesn't exist or isn't an object
                if (typeof current[k] !== 'object' || current[k] === null) {
                    current[k] = {};
                }
                current = current[k];
            }
        }
    }

    return result;
}

export function echoTimeDiff(date: Date | string, includeTime = false, noDiff = false) {
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();

    const diffMs = now.getTime() - targetDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMinutes >= 1440 || noDiff) {
        return includeTime ? targetDate.toLocaleString("fa-IR", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }) : targetDate.toLocaleDateString('fa-IR');
    }

    if (diffMinutes < 1) {
        return 'الان';
    }

    if (diffHours < 1) {
        return `${diffMinutes} دقیقه پیش`;
    }

    const remainingMinutes = diffMinutes % 60;

    if (remainingMinutes === 0) {
        return `${diffHours} ساعت`;
    }

    return `${diffHours} ساعت پیش`;
}

export function echoDate(date: string | Date | undefined) {
    if (!date) return undefined;
    date = new Date(date);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

export function getUserPlanDays(_user?: UserType) {
    const user = _user ? _user:typeof window !== 'undefined' ? window.user:undefined;
    if (!user) return "0";

    function daysDiff(date: Date) {
        const now = Date.now();
        const time = date.getTime();
        const diff = time - now;
        return Math.ceil(diff / 1000 / 60 / 60 / 24).toLocaleString('fa');
    }

    const days = user.plan_expire_at ? daysDiff(new Date(user.plan_expire_at)):null;

    return days ?? "∞";
}


export function Throw(arg: string): never {
    throw(new Error(arg.split(" ").length === 1 ? `${arg} required`:arg))
}

export function toPersianNumber(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  return String(input).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}
