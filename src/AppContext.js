import React from 'react';

const AppContext = React.createContext({
    dayWorkout: {},
    setDayWorkout: () => {},
});

export default AppContext;
