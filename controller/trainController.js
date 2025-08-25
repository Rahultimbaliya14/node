const axios = require('axios');
const DataFormatHelper = require('../Helper/dataFormateHelper');



exports.getTrainInfo = async (req, res) => {
    const trainNumber = req.params.number;
    const baseUrl = `https://erail.in/rail/getTrains.aspx?TrainNo=${trainNumber}&DataSource=0&Language=0&Cache=true`;
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
    const baseUrl = `https://erail.in/rail/getTrains.aspx?TrainNo=${trainNumber}&DataSource=0&Language=0&Cache=true`;
    try {
        const response = await axios.get(baseUrl);
        const trainData = response.data;
        const formattedData = DataFormatHelper.getTrainInfo(trainData);
        if (formattedData.status === 404) {
            return res.status(404).json({ message: "Train not found" });
        }
        else {
            const URL_Train = `https://erail.in/data.aspx?Action=TRAINROUTE&Password=2012&Data1=${formattedData.trainId}&Data2=0&Cache=true`;
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
