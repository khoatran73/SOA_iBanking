import { connect } from 'mongoose';

export const connectDatabase = (dbUrl: string | undefined) => {
    if (!dbUrl) {
        console.log('connection string was undefined!!');
        return;
    } else {
        connect(dbUrl)
            .then(() => console.log('connect to MongoDB successfully'))
            .catch(err => console.log('connection to MongoDB failed: ', err));
    }
};

module.exports = { connectDatabase };
