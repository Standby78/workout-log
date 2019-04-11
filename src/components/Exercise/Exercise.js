import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './exercise.scss';

export default class Exercise extends Component {
    render() {
        const { exercise } = this.props;
        const reps = [];

        for (let i = 0; i < exercise.reps; i++) {
            reps[i] = <span className="reps" key={i}>{exercise.reps}</span>;
        }

        return (
            <div className="exercise-component">
                <div>
                    {exercise.exec_id}<br />
                    Weight: {(exercise.weight !== 0) ? ` ${exercise.weight} kg` : ' bodyweight'} {exercise.sets} x {exercise.reps}
                </div>
                <div>
                    {reps}
                </div>
            </div>
        );
    }
}

Exercise.propTypes = {
    exercise: PropTypes.object.isRequired,
};
