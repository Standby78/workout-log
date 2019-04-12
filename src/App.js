import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { setOfflineDefault } from './services/services';

import { DailyWorkout, Workout } from './components';

import './App.scss';

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
        setOfflineDefault().then((res) => {
            this.setState({ allDays: res[0] });
        });
    }

    setDayWorkout(dayWorkout) {
        this.setState({
            dayWorkout,
        });
        // write a function to set the active day in indexedDB so on refresh the app is still able to determine the current workout
        // current way of logging the workouts per day, and in general a cycle is not well thoutght - back to the drawing board
    }

    render() {
        const { dayWorkout, allDays } = this.state;
        return (
            <div>
                <Router>
                    <div>
                        <Switch>
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
