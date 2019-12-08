import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './displayexercise.scss';
/* Display all daily exercises in main app screen, not the same component
as used for enetering current workout */
export default class DisplayExercise extends Component {
    render() {
        const { exercise } = this.props;
        const reps = [];
        for (let i = 0; i < exercise.sets; i++) {
            reps[i] = <div key={i}>{i + 1} x {exercise.reps[i]}</div>;
        }

        return (
            <div className="exercise-component">
                <div>
                    {exercise.exec_id} - Weight: {(exercise.weight !== 0) ? ` ${exercise.weight} kg` : ' bodyweight'}<br />
                    {reps}
                </div>
            </div>
        );
    }
}

DisplayExercise.propTypes = {
    exercise: PropTypes.object.isRequired,
};
