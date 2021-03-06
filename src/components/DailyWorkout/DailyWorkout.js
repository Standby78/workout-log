import React, { Component } from 'react';
import Exercise from './../Exercise/Exercise';
import { isEmpty, getCurrentDay, saveTempLog, getTempLog } from '../../services/services';

export default class DailyWorkout extends Component {
    constructor(props) {
        super(props);
        const { nextWorkout } = this.props;
        this.state = {
            workout: [],
            nextWorkout,
        };
        this.changeRep = this.changeRep.bind(this);
    }

    componentDidMount() {
        console.log('get day workout from db');
        const activeDay = getCurrentDay();
        activeDay.day.then((res) => {
            console.log('resolved', res);
            res[0].shift();
            console.log(res[0]);
            const day = res[0];
            activeDay.reps.then((result) => {
                console.log('resolved 2', result);
                const reps = result[0];
                this.setState({ workout: day, reps: reps });
            });
        });
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
        const { workout, reps } = this.state;
        let exercises = [];
        if (!isEmpty(workout)) {
            exercises = workout.map((exercise, index) =>
                (
                    <div key={index}>
                        <Exercise key={index} identifier={index} repHandler={this.changeRep} exercise={exercise} reps={reps[index]} />
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
