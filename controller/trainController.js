
const axios = require('axios');
const DataFormatHelper = require('../Helper/dataFormateHelper');



exports.getTrainInfo = async (req, res) => {
    const envUrl = process.env.GET_TRAIN_INFO;
    const trainNumber = req.params.number;
    const baseUrl = envUrl.replace('{trainNumber}', trainNumber);

    try {
        const response = await axios.get(baseUrl);
        const trainData = response.data;
        const formattedData = DataFormatHelper.getTrainInfo(trainData);
        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching train information:', error);
        res.status(500).json({ error: 'Failed to retrieve train information' });
    }
};

exports.getTrainRoutInfo = async (req, res) => {
    const trainNumber = req.params.number;
    const envUrl = process.env.GET_TRAIN_INFO;
    const baseUrl = envUrl.replace('{trainNumber}', trainNumber);

    try {
        const response = await axios.get(baseUrl);
        const trainData = response.data;
        const formattedData = DataFormatHelper.getTrainInfo(trainData);
        if (formattedData.status === 404) {
            return res.status(404).json({ message: "Train not found" });
        }
        else {
            const envurl = process.env.GET_TRAIN_ROUTE_INFO;
            const URL_Train = envurl.replace('{trainId}', formattedData.trainId);
            const response = await axios.get(URL_Train);
            const routeData = response.data;
            const array = DataFormatHelper.getTrainRoutInfo(routeData);
            formattedData.routeData = array;
            res.json(formattedData);
        }
    } catch (error) {
        console.error('Error fetching train information:', error);
        res.status(500).json({ error: 'Failed to retrieve train information' });
    }
};

exports.getTrainCurrentLocation = async (req, res) => {
    const trainNumber = req.body.trainNumber;
    const envurl = process.env.GET_TRAIN_INFO;
    const baseUrlTrain = envurl.replace('{trainNumber}', trainNumber);
    try {
        const response = await axios.get(baseUrlTrain);
        const trainData = response.data;
        const formattedData = DataFormatHelper.getTrainInfo(trainData);
        if (formattedData.status === 404) {
            return res.status(404).json({ message: "Train not found" });
        }
        else {
            const date = req.body.date;
            const envurl = process.env.GET_TRAIN_CURRENT_LOCATION;
            const baseUrl = envurl.replace('{trainNumber}', trainNumber).replace('{date}', date);
            try {
                const response = await axios.get(baseUrl);
                const locationData = response.data;

                formattedData.trainStatus = DataFormatHelper.currentTrainStatus(locationData);
                res.json(formattedData);

            } catch (error) {
                console.error('Error fetching train information:', error);
                res.status(500).json({ error: 'Failed to retrieve train information' });
            }
        }
    } catch (error) {
        console.error('Error fetching train information:', error);
        res.status(500).json({ error: 'Failed to retrieve train information' });
    }
};

exports.getPNRInfo = async (req, res) => {
    const pnrNumber = req.body.pnrNumber;
    const envurl = process.env.GET_PNR_INFO;
    try {
        const baseUrl = envurl.replace('{pnrNumber}', pnrNumber);
        const requestBody = {
            proPlanName: "CP8",
            emailId: "",
            tempToken: ""
        };

        const response = await axios.post(baseUrl, requestBody);
        const pnrData = response.data;

        const formattedData = DataFormatHelper.getPNRInfo(pnrData);

        res.json(formattedData);
    } catch (error) {
        console.error("Error fetching PNR data:", error.message);
        res.status(500).json({ error: "Failed to fetch PNR info" });
    }
}

exports.getBetweenTrain = async (req, res) => {
    const fromStation = req.body.fromStation;
    const toStation = req.body.toStation;
    const baseUrlTrain = process.env.GET_BETWEEN_TRAIN
        .replace('{fromStation}', fromStation)
        .replace('{toStation}', toStation);
    try {
        const response = await axios.get(baseUrlTrain);
        const trainData = DataFormatHelper.getBetweenTrain(response.data);
        res.json(trainData);
    } catch (error) {
        console.error('Error fetching train information:', error);
        res.status(500).json({ error: 'Failed to retrieve train information' });
    }
}