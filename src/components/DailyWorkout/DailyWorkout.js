import React, { Component } from 'react';
import Exercise from './../Exercise/Exercise';
import { isEmpty, getCurrentDay, saveTempLog, getTempLog } from '../../services/services';

export default class DailyWorkout extends Component {
    constructor(props) {
        super(props);
        const { dayWorkout, nextWorkout } = this.props;
        this.state = {
            workout: dayWorkout,
            nextWorkout,
        };
        this.changeRep = this.changeRep.bind(this);
    }

    componentDidMount() {
        const { dayWorkout } = this.props;
        if (isEmpty(dayWorkout)) {
            getCurrentDay().then((dbDayResult) => {
                dbDayResult[0].shift();
                this.setState({ workout: dbDayResult[0] });
                /* let daySets = [];
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
                }*/
            });
        }/* else {
            const dayLog = dayWorkout.map((exercise) => {
                const result = exercise;
                const log = [];
                for (let i = exercise.sets - 1; i >= 0; i--) {
                    log[i] = 0;
                }
                result.sets = log;
                return exercise;
            });
            console.log('workout', dayWorkout, dayLog);
            this.setState({ dayLog });
        } */
    }

    // this needs to be fixed now, the whole logic will need to be recoded - 8.12.
    // there should be an update on a dayLog db that will hold the current progress, and updates state
    // every exercise has it's own index and each in turn has the index of the set
    // make a copy of the workout with empty reps, update database/state, set starting number of reps from daily workout data
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
        const { nextWorkout, workout, dayLog } = this.state;
        let exercises = '';
        if (workout && workout.length > 0) {
            exercises = workout.map((exercise, index) =>
                (
                    <div key={index}>
                        {/* <Exercise key={index} log={dayLog[index]} identifier={index} repHandler={this.changeRep} exercise={exercise} /> */}
                        <Exercise key={index} identifier={index} repHandler={this.changeRep} exercise={exercise} />
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
