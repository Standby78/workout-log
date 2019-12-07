import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import moment from 'moment';

import { setOfflineDefault, setActiveWorkout, checkActiveWorkout } from './services/services';
import { isEmpty, getCurrentDay, saveTempLog, getTempLog, setWorkoutInState } from './services/services';


import { DailyWorkout, Workout } from './components';

import './App.scss';

const NotFoundComponent = () => <div>404</div>;

// get nexWorkout object from log, modify weight to smaller or to starting - depending on time passed
const setDaily = (nextWorkout) => {
    // calculate time difference between workouts
    const today = moment(new Date());
    const lastWorkoutDay = moment(nextWorkout[0].date);
    const timeBetween = today.diff(lastWorkoutDay, 'days');
    // correct weight if time betweens sets bigger then 2 weeks, lower by 2.5kg more (it's added later)
    if (timeBetween > 14) {
        nextWorkout.forEach((item, index) => {
            if (index) {
                const newWeight = item.weight * 0.9 - ((item.weight * 0.9) % 2.5) - 2.5;
                item.weight = newWeight;
            }
        });
    }
    // increase weight by usual 2.5kg step
    nextWorkout.forEach((item, index) => {
        if (index) {
            item.weight += 2.5;
        }
    });

    console.log('modified', nextWorkout);
    // to-do - reset weight to starting
    if (timeBetween > 50) {
        console.log('Time to reset workout to zero');
    }

    return nextWorkout;
};

class App extends Component {
    constructor() {
        super();
        this.state = {
            dayWorkout: {},
            allDays: [],
            workoutActive: 0,
        };
        this.setDayWorkout = this.setDayWorkout.bind(this);
    }

    componentDidMount() {
        // set template user, workout regime
        setOfflineDefault().then((promiseFromApi) => {
            Promise.all(promiseFromApi).then((result) => {
                // MF ugly, cleanup the [1]s after code cleanup!!
                console.log('componentdidmount result ', result);
                // const newWorkout = result[1][result[1].length - 3];
                // const workoutLog = setDaily(newWorkout);
                const workoutLog = result[1];
                this.setState({ allDays: result[0], log: result[1], workoutLog });
            });
        });
        // is there an active workout? if yes, transfer it to state
        checkActiveWorkout().then((res) => {
            if (res) {
                this.setState({ workoutActive: true }, () => this.setState({ workoutActive: false }));
            }
        });
    }


    /* saves selected workout in db, and sets state to this same workout */
    setDayWorkout(dayWorkout, day_id) {
        let date = new Date();
        date = moment(date).format('YYYY-MM-DD');
        const dateObj = { date };
        this.setState({ dayWorkout });
        dayWorkout.unshift(dateObj);
        setActiveWorkout(dayWorkout);
            /* setActiveWorkout(dayWorkout,day_id).then(() => {
            console.log('get new db');
            getCurrentDay().then((dbDayResult) => {
                console.log(dbDayResult);
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
                        this.setState({ dayWorkout: result });
                    });
                }
            });
        });*/
    }

    render() {
        const { dayWorkout, allDays, workoutActive, workoutLog } = this.state;

        const dailyWorkouts = workoutLog ? workoutLog.filter(element => element[0].date === '00000000') : [];
        dailyWorkouts.forEach(exercise => exercise.shift());

        return (
            <div>
                <Router>
                    <div>
                        <Switch>
                            {workoutActive && <Redirect to="/daily-workout" />}
                            { allDays
                            && (
                                <Route
                                    exact
                                    path="/"
                                    render={props =>
                                        (<Workout {...props} workouts={dailyWorkouts} day={allDays} setWorkout={this.setDayWorkout} />)
                                    }
                                />
                            )}
                            <Route
                                path="/daily-workout"
                                render={props => <DailyWorkout {...props} dayWorkout={dayWorkout} />}
                            />
                            <Route component={NotFoundComponent} />
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
