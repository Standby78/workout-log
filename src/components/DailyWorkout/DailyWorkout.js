import React, { Component } from 'react';
import Exercise from './../Exercise/Exercise';
import { isEmpty, getCurrentDay, saveTempLog, getTempLog } from '../../services/services';

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
        console.log('see workout', workout);
        if (isEmpty(workout)) {
            getCurrentDay().then((dbDayResult) => {
                this.setState({ workout: dbDayResult[0] });
                let daySets = [];
                if (dbDayResult.length > 0) {
                    daySets = dbDayResult[0].map((exercise) => {
                        const log = [];
                        for (let i = exercise.sets - 1; i >= 0; i--) {
                            log[i] = 0;
                        }
                        return log;
                    });
                    getTempLog().then((result) => {
                        if (result[0] === undefined) {
                            dbDayResult[0].forEach((exercise, index) => {
                                const exerciseLog = {};
                                exerciseLog.id = exercise.id;
                                exerciseLog.sets = daySets[index];
                                exerciseLog.weight = exercise.weight;
                                exerciseLog.day = new Date().toISOString().split('T')[0]; // eslint-disable-line
                                result.push(exerciseLog);
                            });
                        }
                        console.log('result', result);
                        this.setState({ dayLog: result });
                    });
                }
            });
        } else {
            const dayLog = workout.map((exercise) => {
                const result = exercise;
                const log = [];
                for (let i = exercise.sets - 1; i >= 0; i--) {
                    log[i] = 0;
                }
                result.sets = log;
                return exercise;
            });
            console.log('workout', workout, dayLog);
            this.setState({ dayLog });
        }
    }

    changeRep(workoutIndex, setIndex) {
        const { dayLog, workout } = this.state;
        if (typeof dayLog !== 'undefined' && dayLog.length > 0) {
            dayLog[workoutIndex].sets[setIndex] = (dayLog[workoutIndex].sets[setIndex] === 0)
                ? workout[workoutIndex].reps : --dayLog[workoutIndex].sets[setIndex];
            this.setState({ dayLog });
            saveTempLog(dayLog);
        }
    }

    saveWorkout() {
        console.log('saved!');
    }

    render() {
        const { workout, dayLog } = this.state;
        console.log('state', workout, dayLog);
        let exercises = '';
        if (dayLog !== undefined && workout !== undefined && workout.length > 0) {
            exercises = workout.map((exercise, index) =>
                (
                    <div key={index}>
                        <Exercise key={index} log={dayLog[index]} identifier={index} repHandler={this.changeRep} exercise={exercise} />
                    </div>
                ));
        } else {
            exercises = 'Workout loading...';
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
