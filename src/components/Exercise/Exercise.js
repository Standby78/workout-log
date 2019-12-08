import React from 'react';
import PropTypes from 'prop-types';

import './exercise.scss';

// done with reps sending, handle onclick, while saving result in daily workout
const Exercise = ({ exercise, identifier, repHandler, log, reps }) => {
    console.log(exercise, reps);
    const sets = [];
    if (exercise.reps) {
        for (let i = 0; i < exercise.reps.length; i++) {
            sets[i] = <span className="reps" key={i} onClick={() => repHandler(identifier, i)}>{ reps && (reps[i] === 0) ? '' : reps[i]}</span>;
        };    
    }

    return (
        <div className="exercise-component">
            <div>
                {exercise.exec_id}<br />
                Weight: {(exercise.weight !== 0) ? ` ${exercise.weight} kg` : ' bodyweight'}
            </div>
            <div>
                {sets}
            </div>
        </div>
    );
}

export default Exercise;

Exercise.propTypes = {
    exercise: PropTypes.object.isRequired,
};
