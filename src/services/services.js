import db from '../db';

import { exercises } from '../constants/workout';

export function isEmpty(obj) {
    return (Object.keys(obj).length === 0);
}
export function saveTempLog(dayLog) {
    db.tempLog.clear().then(db.tempLog.put(dayLog));
}

export function getTempLog() {
    return db.tempLog.toArray().then(result => result);
}

export function getCurrentDay() {
    return db.day.toArray().then(res => res);
}

export function updateLog() {
    console.log('saved');
}

export async function setActiveWorkout(day_id) {
    await db.day.clear().then(db.workouts.get({ id: day_id }, (result) => {
        const day = result.map(res => db.exercise.get({ id: res }).then(rest => rest));
        Promise.all(day).then(resultingDay => db.day.put(resultingDay));
    }));
}

export function checkActiveWorkout() {
    return db.day.count();
}

export function setOfflineDefault() {
    db.open().catch(e => console.error(`Can't open db ${e}`));
    db.user.get({ name: 'Sinisa' }, (user) => {
        if (!user) {
            db.user.add({
                name: 'Sinisa',
                email: 'sinisa.steblaj@gmail.com',
                weight: '120.6',
                workoutDays: {},
                lastday: '0',
            });
        }
    });
    db.exercise.get({ exec_id: 'squats' }, (exercise) => {
        if (!exercise) {
            db.exercise.bulkPut(exercises).then(() => {
                db.workouts.count((count) => {
                    if (count === 0) {
                        db.exercise.toArray((e) => {
                            const days = [
                                [
                                    e[0].id, e[1].id, e[2].id,
                                ],
                                [
                                    e[3].id, e[4].id, e[5].id,
                                ],
                                [
                                    e[6].id, e[7].id, e[8].id,
                                ],
                            ];
                            db.workouts.bulkPut([days[0], days[1], days[2]]).then(
                                db.user.update(1, { workoutDays: [1, 2, 3] }),
                            );
                        });
                    }
                });
            });
        }
    });
    return db.user.get(1, async (user) => {
        const workout = user.workoutDays.map(workouts => db.workouts.get(workouts, (result => result)));
        const res = await Promise.all(workout);
        const resmap = res.map(days => days.map(ex => db.exercise.get(ex)));
        return resmap.map(promise => Promise.all(promise));
    });
}
