const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB on line');
    } catch (error) {
        console.log(error);
        throw new Error('error al conectar');
    }


}

module.exports = {
    dbConnection
};
