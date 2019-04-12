import db from '../db';

import { exercises } from '../constants/workout';


export function isEmpty(obj) {
    return (Object.keys(obj).length === 0);
}

export function getCurrentDay() {
    return db.day.toArray();
}

export function setOfflineDefault() {
    db.open().catch(e => console.error(`Can't open db ${e}`));
    db.user.get({ name: 'Sinisa' }, (user) => {
        if (!user) {
            db.user.add({
                name: 'Sinisa',
                email: 'sinisa.steblaj@gmail.com',
                weight: '120.6',
            });
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
    return getCurrentDay();
}
