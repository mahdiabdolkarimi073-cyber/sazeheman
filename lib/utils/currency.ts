const _replacement = {
    "litecoin": "ltc",
    "bitcoin": "btc",
    "ethereum": "eth",
    "ripple": "xrp",
    "cardano": "ada",
    "polkadot": "dot",
    "chainlink": "link",
    "stellar": "xlm",
    "dogecoin": "doge",
    "binance coin": "bnb",
    "solana": "sol",
    "polygon": "matic",
    "avalanche": "avax",
    "uniswap": "uni",
    "cosmos": "atom",
    "monero": "xmr",
    "ethereum classic": "etc",
    "tezos": "xtz",
    "algorand": "algo",
    "vechain": "vet",
    "filecoin": "fil",
    "aave": "aave",
    "compound": "comp",
    "synthetix": "snx",
    "maker": "mkr",
    "dash": "dash",
    "zcash": "zec",
    "eos": "eos",
    "tron": "trx",
    "neo": "neo",
    "iran": "IRT",
    "iranian rial": "IRT",
    "ریال": "IRT",
    "تومان": "IRT",
    "دلار": "USD",
    "یورو": "EUR",
    "پوند بریتانیا": "GBP",
    "japanese yen": "JPY",
    "swiss franc": "CHF",
    "دلار کانادا": "CAD",
    "دلار استرالیا": "AUD",
    "chinese yuan": "CNY",
    "indian rupee": "INR",
    "russian ruble": "RUB",
    "brazilian real": "BRL",
    "mexican peso": "MXN",
    "south korean won": "KRW",
    "singapore dollar": "SGD",
    "hong kong dollar": "HKD",
    "new zealand dollar": "NZD",
    "swedish krona": "SEK",
    "norwegian krone": "NOK",
    "danish krone": "DKK",
    "south african rand": "ZAR",
    "turkish lira": "TRY",
    "saudi riyal": "SAR",
    "uae dirham": "AED",
    "thai baht": "THB",
    "malaysian ringgit": "MYR",
    "indonesian rupiah": "IDR",
    "philippine peso": "PHP",
    "vietnamese dong": "VND",
    "polish zloty": "PLN",
    "hungarian forint": "HUF",
    "czech koruna": "CZK",
    "israeli new shekel": "ILS",
    "egyptian pound": "EGP",
    "nigerian naira": "NGN",
    "kenyan shilling": "KES",
    "tether": "usdt",
    "توییچ": "twitch",
    "کیک": "kick",
    "پلی‌استیشن": "playstation"
} as Record<string, string>;
const replacement = Object.fromEntries(Object.entries(_replacement).map(o => [o[0].toLowerCase(), o[1].toLowerCase()]));
const reverse = Object.fromEntries(Object.entries(replacement).map(o => o.reverse())) as Record<string, string>;

export function getCurrencyCode(str: string) {
    return (replacement[str.toLowerCase()] || str).toUpperCase();
}

export function getCurrencyName(code: string) {
    return Capatize(reverse[code.toLowerCase()] || code);
}

function Capatize(str: string) {
    return str.split(" ")
        .map(o => `${o.slice(0, 1).toUpperCase()}${o.slice(1).toLowerCase()}`)
        .join(" ")
}