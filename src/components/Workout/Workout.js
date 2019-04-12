import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import { Exercise } from '../../components';
import './workout.scss';

export default class Workout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day_id: 0,
        };
    }

    setDay(value) {
        this.setState({
            day_id: value,
        });
    }

    render() {
        const { day, setWorkout } = this.props;
        const { day_id } = this.state;

        return (
            <div>
                <SwipeableViews hysteresis={0.2} onChangeIndex={index => this.setDay(index)}>
                    {day.map((workoutDay, index) => (
                        <div key={index}>
                            {workoutDay.map((exercise, i) => <Exercise key={i} exercise={exercise} />)}
                        </div>
                    ))}
                </SwipeableViews>
                <Link to="/daily-workout" value={day_id} onClick={() => setWorkout(day[day_id])}>Start Workout</Link>
            </div>
        );
    }
}

Workout.propTypes = {
    day: PropTypes.array.isRequired,
};
