export const setDate = (date: Date) => ({
    type: 'SET_DATE',
    date
});
export const setLocation = (location: string) => ({
    type: 'SET_LOCATION',
    location
})
export const setSearchFilter = (search: string) => ({
    type: 'SET_SEARCH',
    search
})