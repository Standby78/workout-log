import React, { Component } from 'react';
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
        const { day } = this.props;
        const { day_id } = this.state;
        console.log(day_id);
        return (
            <div>
                <SwipeableViews hysteresis={0.2} onChangeIndex={index => this.setDay(index)}>
                    {day.workoutDays.map((workoutDay, index) => (
                        <div key={index}>
                            {workoutDay.map((exercise, i) => <Exercise key={i} exercise={exercise} />)}
                        </div>
                    ))}
                </SwipeableViews>
                <button type="button" value={day_id}>Start Workout</button>
            </div>
        );
    }
}

Workout.propTypes = {
    day: PropTypes.object.isRequired,
};
