import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { setOfflineDefault, setActiveWorkout, checkActiveWorkout } from './services/services';
import { isEmpty, getCurrentDay, saveTempLog, getTempLog } from './services/services';


import { DailyWorkout, Workout } from './components';

import './App.scss';

const NotFoundComponent = () => <div>404</div>;

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
            Promise.all(promiseFromApi).then(result => this.setState({ allDays: result }));
        });
        // is there an active workout? if yes, transfer it to state
        checkActiveWorkout().then((res) => {
            if (res) {
                this.setState({ workoutActive: true }, () => this.setState({ workoutActive: false }));
            }
        });
    }

    /* save Workout in db if you want to have an easier life
    currently not working, setDayWorkout works, but i need to have a pull from db on finished db insert, tož
    refresh component, or use the code below to set State from incoming values in dayWorkout
    */
    setDayWorkout(dayWorkout, day_id) {
        console.log(dayWorkout, day_id);
        setActiveWorkout(day_id).then(() => {
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
        });
    }

    render() {
        const { dayWorkout, allDays, workoutActive } = this.state;
        return (
            <div>
                <Router>
                    <div>
                        <Switch>
                            {workoutActive && <Redirect to="/daily-workout" />}
                            { allDays
                            && <Route exact path="/" render={props => <Workout {...props} day={allDays} setWorkout={this.setDayWorkout} />} />
                            }
                            <Route
                                path="/daily-workout"
                                render={props => <DailyWorkout {...props} workout={dayWorkout} />}
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
