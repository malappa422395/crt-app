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