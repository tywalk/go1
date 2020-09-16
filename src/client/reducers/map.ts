import _ from 'lodash';

export default (state: [] = [] as any, action: any) => {
    let { id, name, icon } = action;
    switch (action.type) {
        case 'ADD_MAP':
            if (state.some(t => t === name)) return state;
            return [
                ...state,
                { id, name, icon }
            ];
        case 'REMOVE_MAP':
            _.remove(state, t => t === name);
            return [...state];
        default:
            return state;
    }
}