import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './displayexercise.scss';
/* Display all daily exercises in main app screen, not the same component
as used for enetering current workout */
export default class DisplayExercise extends Component {
    render() {
        const { exercise } = this.props;
        const reps = [];

        for (let i = 0; i < exercise.reps; i++) {
            reps[i] = <span className="reps" key={i}>{exercise.reps}</span>;
        }

        return (
            <div className="exercise-component">
                <div>
                    {exercise.exec_id} - Weight: {(exercise.weight !== 0) ? ` ${exercise.weight} kg` : ' bodyweight'}<br />
                    {exercise.sets} x {exercise.reps}
                </div>
            </div>
        );
    }
}

DisplayExercise.propTypes = {
    exercise: PropTypes.object.isRequired,
};
