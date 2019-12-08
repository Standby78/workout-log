import db from '../db';

import { exercises, workouts } from '../constants/workout';

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
    const day = db.day.toArray().then(res => res);
    const reps = db.tempReps.toArray().then(res => res);
    return ({ day, reps });
}

export function updateLog() {
    console.log('saved');
}

export async function setActiveWorkout(dayWorkout) {
    await db.day.clear().then(db.day.put(dayWorkout));
    const reps = [];
    dayWorkout.forEach((res, index) => {
        if (index !== 0) {
            reps.push(Array(res.reps.length).fill(0));
        }
    });
    console.log(reps);
    await db.tempReps.clear().then(db.tempReps.put(reps));
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
    db.workoutLog.count((result) => {
        if (result === 0) {
            // add here code to custimise weights depending on strength
            // this part adds all exercises done to a workoutLog indexeDB
            db.workoutLog.bulkPut(workouts.workoutDays);
        }
    });
    // all until here should be enough for a simple harcoded app
    // the rest is lagacy from first work done
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
    return (db.user.get(1, async (user) => {
        const workout = user.workoutDays.map(workoutstemp => db.workouts.get(workoutstemp, (result => result)));
        const res = await Promise.all(workout);
        const resmap = res.map(days => days.map(ex => db.exercise.get(ex)));
        // here I get all I need, my workout log
        const log = db.workoutLog.toArray();
        return ([resmap.map(promise => Promise.all(promise)), log]);
    }));
}
