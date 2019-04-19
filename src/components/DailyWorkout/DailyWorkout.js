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
        this.changeRep = this.changeRep.bind(this);
    }

    componentDidMount() {
        const { workout } = this.props;
        if (isEmpty(workout)) {
            getCurrentDay().then((res) => {
                this.setState({ workout: res[0] });
                const daySets = res[0].map((exercise) => {
                    const log = [];
                    for (let i = exercise.sets - 1; i >= 0; i--) {
                        log[i] = 0;
                    }
                    return log;
                });
                const dayLog = [];
                res[0].forEach((exercise, index) => {
                    const exerciseLog = {};
                    exerciseLog.id = exercise.id;
                    exerciseLog.sets = daySets[index];
                    exerciseLog.weight = exercise.weight;
                    exerciseLog.day = new Date().toISOString().split('T')[0]; // eslint-disable-line
                    dayLog.push(exerciseLog);
                });
                this.setState({ dayLog });
            });
        }
    }

    changeRep(workoutIndex, setIndex) {
        const { dayLog } = this.state;
        // console.log(workoutIndex, setIndex);
        dayLog[workoutIndex].sets[setIndex] = (dayLog[workoutIndex].sets[setIndex] === 0) ? 5 : --dayLog[workoutIndex].sets[setIndex];
        console.log(dayLog);
        this.setState({ dayLog });
    }

    saveWorkout() {
        console.log('saved!');
    }

    render() {
        const { workout, dayLog } = this.state;
        let exercises = '';
        if (workout !== undefined && workout.length > 0) {
            exercises = workout.map((exercise, index) =>
                (
                    <div key={index}>
                        <Exercise key={index} log={dayLog} identifier={index} repHandler={this.changeRep} exercise={exercise} />
                    </div>
                ));
        } else {
            exercises = 'Workout loading...';
        }

        // console.log(dayLog);
        return (
            <div>
                {exercises}
                <br /><a href="/">Back</a>
                <button type="button" style={{ float: 'right' }} onClick={() => this.saveWorkout()}>Save Workout</button>
            </div>
        );
    }
}
