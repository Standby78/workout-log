import React, { Component } from 'react';
import Exercise from './../Exercise/Exercise';

function isEmpty(obj) {
    return (Object.keys(obj).length === 0);
}

export default class DailyWorkout extends Component {
    render() {
        const { workout } = this.props;
        console.log(workout, Object.keys(workout).legth);
        let exercises = '';
        if (!isEmpty(workout)) {
            exercises = workout.map((exercise, index) =>
                (
                    <div key={index}>
                        <Exercise exercise={exercise} />
                    </div>
                ));
        } else {
            exercises = 'no workout';
        }
        return (
            <div>
                {exercises}
                <br /><a href="/">Back</a>
            </div>
        );
    }
}
