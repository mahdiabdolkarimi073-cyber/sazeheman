const org = Date.prototype.toLocaleString;
Date.prototype.toLocaleString = function (...args: any[]) {
    const R = org.bind(this)(...args);
    return R?.split(",").reverse().join(" ") || R;
}

const org2 = Number.prototype.toLocaleString;
Number.prototype.toLocaleString = function (...args: any[]) {

    const R = org2.bind(this)(...args);
    return R?.replaceAll("٫",".") || R;
}
