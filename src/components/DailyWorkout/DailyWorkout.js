import React, { Component } from 'react';
import Exercise from './../Exercise/Exercise';
import { isEmpty, getCurrentDay } from '../../services/services';

export default class DailyWorkout extends Component {
    constructor(props) {
        super(props);
        const { workout } = this.props;
        this.state = {
            workout,
        };
    }

    componentDidMount() {
        const { workout } = this.props;
        if (isEmpty(workout)) {
            getCurrentDay().then((res) => {
                this.setState({ workout: res[0] });
            });
        }
    }

    saveWorkout() {
        console.log('saved!', this.props);
    }

    render() {
        const { workout } = this.state;
        let exercises = '';
        if (workout !== undefined && workout.length > 0) {
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
                <button type="button" style={{ float: 'right' }} onClick={() => this.saveWorkout()}>Save Workout</button>
            </div>
        );
    }
}
