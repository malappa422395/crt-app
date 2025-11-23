export const getUrlParameters = () => {
    const queryString = location.search.substring(1);
    const params: any = {};
    const queryStringParts = queryString.split("&");
    for (var i = 0; i < queryStringParts.length; i++) {
        const pieces: any = queryStringParts[i].split("=");
        params[pieces[0]?.toLowerCase()] = pieces.length === 1 ? null : decodeURIComponent(pieces[1]);
    }

    return params;
}

export const getIframeQueryParams = () => {
    // If inside iframe → use window.frameElement
    const frame = window.frameElement as HTMLIFrameElement | null;

    // Get the src attribute from iframe
    const iframeSrc =
        frame?.getAttribute("src") ||
        frame?.src || null; // fallback if allowed (same-domain)
    // "?data=%7b%22cId%22%3a%22%7b269E5EA0-D7C7-F011-B917-000D3A1C0DFD%7d%22%2c%22cssId%22%3a%22Riley%2c%20Julie%22%2c%22pId%22%3a%22689681%22%2c%22ClientBaseUrl%22%3a%22https%3a%2f%2fsearchqa.rjf.com%22%2c%22ProspectBaseUrl%22%3a%22https%3a%2f%2fapiqa.rjf.com%22%2c%22globalContextUrl%22%3a%22http%3a%2f%2fcrmdevbox%3a5555%2fCERT%22%7d"
    if (!iframeSrc) {
        return new URLSearchParams();
    }

    // Build URL to parse search params
    const url = new URL(iframeSrc, window.location.origin);
    return url.searchParams;
};
