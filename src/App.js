import React, { Component } from 'react';
import Dexie from 'dexie';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { DailyWorkout, Workout } from './components';

import './App.scss';

const exercises = [
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
];

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
                exec_id: 'wide grip pull ups',
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
                exec_id: 'close grip pull up',
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
            allDays: [],
        };
        this.setDayWorkout = this.setDayWorkout.bind(this);
    }

    componentDidMount() {
        const db = new Dexie('Fitness');
        db.version(1).stores({
            user: '++id, name, email, weight',
            day: '++id, user_id, workout',
            workout: '++id, author, exercises',
            exercise: '++id, exec_id, sets, reps, weight',
        });
        db.open().catch(e => console.error(`Can't open db ${e}`));
        db.user.get({ name: 'Sinisa' }, (user) => {
            if (!user) {
                db.user.add({
                    name: 'Sinisa',
                    email: 'sinisa.steblaj@gmail.com',
                    weight: '120.6',
                });
            } else {
                console.log('user exists');
            }
        });
        db.exercise.get({ exec_id: 'squats' }, (exercise) => {
            if (!exercise) {
                db.exercise.bulkPut(exercises).then(() => {
                    db.workout.count((count) => {
                        if (count === 0) {
                            db.exercise.toArray((e) => {
                                const days = [
                                    [
                                        e[0], e[1], e[2],
                                    ],
                                    [
                                        e[3], e[4], e[5],
                                    ],
                                    [
                                        e[6], e[7], e[8],
                                    ],
                                ];
                                db.workout.bulkPut([days[0], days[1], days[2]]).then(
                                    db.workout.toArray((res) => {
                                        db.day.put(res);
                                    }),
                                );
                            });
                        }
                    });
                });
            }
        });
        db.day.toArray((res) => {
            this.setState({ allDays: res[0] });
        });
    }

    setDayWorkout(dayWorkout) {
        this.setState({
            dayWorkout,
        });
    }

    render() {
        const { dayWorkout, allDays } = this.state;
        return (
            <div>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/" render={props => <Workout {...props} day={allDays} setWorkout={this.setDayWorkout} />} />
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
