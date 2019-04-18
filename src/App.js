import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { setOfflineDefault, setActiveWorkout, checkActiveWorkout } from './services/services';

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
        setOfflineDefault().then((promiseFromApi) => {
            Promise.all(promiseFromApi).then(result => this.setState({ allDays: result }));
        });
        checkActiveWorkout().then((res) => {
            if (res) this.setState({ workoutActive: true }, () => this.setState({ workoutActive: false }));
        });
    }

    setDayWorkout(dayWorkout, day_id) {
        this.setState({
            dayWorkout,
        });
        setActiveWorkout(day_id);
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
