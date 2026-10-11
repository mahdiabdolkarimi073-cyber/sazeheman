export async function handlePaymentResponse(RD: {
    method: string
    url: string
    data?: Record<string, string>
}) {
    if (RD.method.toUpperCase() === 'GET') {
        window.location.href = RD.url;
    } else {
        const form = document.createElement("form");
        form.action = RD.url;
        form.method = RD.method;
        for (let [key, value] of Object.entries(RD.data || {})) {
            const input = document.createElement("input");
            input.name = key;
            input.value = value;
            input.hidden = true;
            form.append(input);
        }
        document.body.append(form);
        form.submit();
        return;
    }
}