import Dexie from 'dexie';

const db = new Dexie('Fitness');
db.version(1).stores({
    user: '++id, name, email, weight, workoutDays, lastday',
    day: '++id, user_id, workout',
    workouts: '++id, author, exercises',
    exercise: '++id, exec_id, sets, reps, weight',
});

export default db;
