const mongoose = require("mongoose");
require("dotenv").config()


// Indexes left over from earlier schema field names (e.g. task_ID/user_ID
// before the rename to task_id/user_id). Mongoose never drops old indexes
// on its own, and a stale unique index causes every insert after the first
// to fail with a duplicate-key error on {null, null}. Clean these up once
// on every startup so a fresh clone of the database can't hit this again.
const STALE_INDEXES = [
    { collection: "taskassignments", index: "task_ID_1_user_ID_1" },
];

const cleanupStaleIndexes = async () => {
    for (const { collection, index } of STALE_INDEXES) {
        try {
            await mongoose.connection.db.collection(collection).dropIndex(index);
            console.log(`🧹 Dropped stale index "${index}" on "${collection}"`);
        } catch (error) {
            // Fine if it's already gone (code 27 = IndexNotFound) or the
            // collection doesn't exist yet on a brand-new database.
            if (error.codeName !== "IndexNotFound" && error.code !== 26) {
                console.log(`Index cleanup skipped for "${collection}.${index}":`, error.message);
            }
        }
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        // await mongoose.connect(process.env.MONGO_URL_ATLAS);


        console.log("✅ MongoDB Connected Successfully");

        await cleanupStaleIndexes();
    } catch (error) {
        console.log("❌ Database Connection Failed");
        console.log(error);
        // console.log(process.env.MONGO_URL_ATLAS);
        process.exit(1);
    }
};
connectDB()
module.exports = connectDB;