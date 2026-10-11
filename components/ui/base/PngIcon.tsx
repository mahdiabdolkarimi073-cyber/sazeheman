const replacement = {
    "ERC20": "USDT",
    "BEP20": "USDT",
    "TRC20": "USDT",
    "BSC": "BNB"
} as Record<string, string>;

function PngIcon(props: {
    name: string,
    size?: number,
    src?: string
}) {
    const size = (props.size || 20);
    return (
        <div
            key={props.name}
            style={{
                width: size+"px",
                height: size+"px", 
                background: `url('${props.src || `/icons/${(replacement[props.name] || props.name).toUpperCase()}.png`}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        />
    )
}

export default PngIcon;