export default (state: {} = {date: new Date()} as any, action: any) => {
    let { date, location, search, type } = action;
    switch (type) {
        case 'SET_DATE':
            return {
                ...state,
                date
            }
        case 'SET_LOCATION':
            return {
                ...state,
                location
            }
        case 'SET_SEARCH':
            return {
                ...state,
                search
            }
        default:
            return state;
    }
}