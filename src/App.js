import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { DailyWorkout, Workout } from './components';

import './App.scss';

const workouts = {
    day_id: 0,
    user_id: 0,
    active: true,
    workoutDays: [
        [
            {
                exec_id: 'squats',
                sets: 5,
                reps: 5,
                weight: 95,
            },
            {
                exec_id: 'romanian deadlift',
                sets: 5,
                reps: 5,
                weight: 80,
            },
            {
                exec_id: 'close grip pull up',
                sets: 5,
                reps: 5,
                weight: 0,
            },
        ],
        [
            {
                exec_id: 'bench press',
                sets: 5,
                reps: 5,
                weight: 100,
            },
            {
                exec_id: 'bent over rows',
                sets: 5,
                reps: 5,
                weight: 90,
            },
            {
                exec_id: 'dips',
                sets: 5,
                reps: 5,
                weight: 0,
            },
        ],
        [
            {
                exec_id: 'deadlift',
                sets: 5,
                reps: 5,
                weight: 130,
            },
            {
                exec_id: 'overhead press',
                sets: 5,
                reps: 5,
                weight: 60,
            },
            {
                exec_id: 'wide grip pull ups',
                sets: 5,
                reps: 5,
                weight: 0,
            },
        ],
    ],
};

const NotFoundComponent = () => <div>404</div>;

class App extends Component {
    constructor() {
        super();
        this.state = {
            dayWorkout: {},
        };
        this.setDayWorkout = this.setDayWorkout.bind(this);
    }

    setDayWorkout(dayWorkout) {
        this.setState({
            dayWorkout,
        });
    }

    render() {
        const { dayWorkout } = this.state;
        return (
            <div>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/" render={props => <Workout {...props} day={workouts} setWorkout={this.setDayWorkout} />} />
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
