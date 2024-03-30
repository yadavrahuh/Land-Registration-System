require('dotenv').config()
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL).then(() => {
	console.log('Database connected')
});
const { walletAddress, contract } = require('./utils/contract.cjs')
const express = require('express');
const cors = require('cors')
const app = express();
const fs = require('fs')
app.use(express.json());
app.use(cors());


app.listen(5000, () => {
	console.log('app is listening at http://localhost:5000');
})

function updateWalletAddress(newAddress) {
	const configFilePath = '../backend/config.json'
	try {
		const configData = fs.readFileSync(configFilePath);
		const config = JSON.parse(configData);
		config.walletAddress = newAddress;
		fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
		console.log('Wallet address updated successfully.');
		return true
	} catch (error) {
		console.error('Error updating contract address:', error);
	}
}
app.post('/send-address', async (req, resp) => {
	try {
		const { addr } = req.body;
		if (walletAddress == undefined) {
			if (updateWalletAddress(await addr)) {
				resp.status(201).send({ success: true, message: 'address set successfully' });
			}
		}
	}
	catch (e) {
		console.log(e);
	}
});

app.post('/check-login', async (req, resp) => {
	try {
		if (walletAddress != '') {
			const tx = await contract.methods.getUser(walletAddress).call();
			if (tx && tx.isloggedin) {
				resp.status(200).send({ success: true, messsage: "successful" })
			}
			else {
				resp.status(400).send({ success: false, message: 'not logged in' })
			}
		}
	}
	catch (e) {
		resp.status(500).send({ success: false, message: "internal server error" })
	}
})

app.get('/', (req, res) => {
	res.send('Hello World!')
})
app.use('/', require('./routes/user.route.cjs'))
app.use('/', require('./routes/land.route.cjs'))

