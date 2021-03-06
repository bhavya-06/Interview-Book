const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = () => {
	try {
        // await mongoose.connect(db);
		mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});

		console.log('MongoDB Connected...');
	} catch (err) {
		console.error("database connection error" + err);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
