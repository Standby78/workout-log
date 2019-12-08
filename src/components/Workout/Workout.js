import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import { DisplayExercise } from '../../components';
import './workout.scss';

export default class Workout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day_id: 1,
        };
    }

    setDay(value) {
        this.setState({
            day_id: value,
        });
    }

    render() {
        const { day, setWorkout, workouts } = this.props;
        const { day_id } = this.state;
        let displayExercise = [];
        displayExercise = workouts.map((workoutDay, index) => {
            const onlyExercises = workoutDay.slice(1);
            return (
                <div key={index}>
                    {onlyExercises.map((exercise, i) => <DisplayExercise key={i} exercise={exercise} />)}
                </div>
            );
        });
        return (
            <div>
                <SwipeableViews hysteresis={0.2} onChangeIndex={index => this.setDay(index + 1)}>
                    {displayExercise}
                </SwipeableViews>
                <Link to="/daily-workout" value={day_id} onClick={() => setWorkout(workouts[day_id - 1], day_id)}>Start Workout</Link>
            </div>
        );
    }
}

Workout.propTypes = {
    day: PropTypes.array.isRequired,
};
