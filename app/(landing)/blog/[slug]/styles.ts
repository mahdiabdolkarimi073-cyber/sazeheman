export const defaultBlogContentStyles = {
    "h1": {
        fontSize: "2.5rem",
        fontWeight: "700",
        lineHeight: "1.2",
        marginBottom: "1.5rem",
        marginTop: "2rem",
        color: "var(--text-color)"
    },
    "h2": {
        fontSize: "2rem",
        fontWeight: "600",
        lineHeight: "1.3",
        marginBottom: "1.25rem",
        marginTop: "1.75rem",
        color: "var(--text-color)"
    },
    "h3": {
        fontSize: "1.5rem",
        fontWeight: "600",
        lineHeight: "1.4",
        marginBottom: "1rem",
        marginTop: "1.5rem",
        color: "var(--text-color)"
    },
    "h4": {
        fontSize: "1.25rem",
        fontWeight: "600",
        lineHeight: "1.4",
        marginBottom: "0.875rem",
        marginTop: "1.25rem",
        color: "var(--text-color)"
    },
    "p": {
        fontSize: "1rem",
        lineHeight: "1.75",
        marginBottom: "1.25rem",
        color: "rgb(from var(--text-color) r g b / 0.8)"
    },
    "strong, b": {
        fontWeight: "600",
        color: "var(--text-color)"
    },
    "a": {
        color: "var(--primary)",
        textDecoration: "underline",
        transition: "color 0.2s",
        cursor: "pointer"
    },
    "a:hover": {
        color: "rgb(from var(--primary) r g b / 0.8)"
    },
    "u": {
        textDecoration: "underline",
        textUnderlineOffset: "2px"
    },
    "ul": {
        listStyleType: "disc",
        paddingLeft: "1.5rem",
        marginBottom: "1.25rem"
    },
    "ol": {
        listStyleType: "decimal",
        paddingLeft: "1.5rem",
        marginBottom: "1.25rem"
    },
    "li": {
        marginBottom: "0.5rem",
        lineHeight: "1.75"
    },
    "blockquote": {
        borderLeft: "4px solid rgb(from var(--text-color) r g b / 0.2)",
        paddingLeft: "1rem",
        marginLeft: "0",
        marginBottom: "1.25rem",
        fontStyle: "italic",
        color: "rgb(from var(--text-color) r g b / 0.6)"
    },
    "code": {
        backgroundColor: "rgb(from var(--text-color) r g b / 0.1)",
        padding: "0.125rem 0.375rem",
        borderRadius: "0.25rem",
        fontSize: "0.875em",
        fontFamily: "monospace"
    },
    "table": {
        width: "100%",
        overflow: "hidden"
    },
    "thead": {
        backgroundColor: "rgb(from var(--background) r g b / 0.5)"
    },
    "tbody": {
        backgroundColor: "rgb(from var(--container) r g b / 0.8)"
    },
    "th": {
        padding: "0.5rem 1rem",
        textAlign: "right",
        fontWeight: "600",
        fontSize: "0.875rem",
        color: "var(--text-color)",
        borderBottom: "2px solid rgb(from var(--text-color) r g b / 0.15)",
        border: "1px solid rgb(from var(--text-color) r g b / 0.15)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        backgroundColor: "var(--container)"
    },
    "td": {
        padding: "0.75rem 1rem",
        border: "1px solid rgb(from var(--text-color) r g b / 0.15)",
        color: "rgb(from var(--text-color) r g b / 0.7)",
        fontSize: "0.9375rem"
    },
    "tr": {
        transition: "background-color 0.15s"
    },
    "tbody tr:hover": {
        backgroundColor: "rgb(from var(--background) r g b / 0.5)"
    },
    "tbody tr:last-child td": {
        borderBottom: "1px solid rgb(from var(--text-color) r g b / 0.15)"
    },
    "img:not(.custom)": {
        objectFit: "contain",
        maxWidth: "500px",
        margin: "0 auto",
        borderRadius: "10px"
    }
}