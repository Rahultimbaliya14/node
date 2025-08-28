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

exports.getTrainCurrentLocation = async (req, res) => {
    const trainNumber = req.body.trainNumber;
    const baseUrlTrain = `https://erail.in/rail/getTrains.aspx?TrainNo=${trainNumber}&DataSource=0&Language=0&Cache=true`;
    try {
        const response = await axios.get(baseUrlTrain);
        const trainData = response.data;
        const formattedData = DataFormatHelper.getTrainInfo(trainData);
        if (formattedData.status === 404) {
            return res.status(404).json({ message: "Train not found" });
        }
        else {
            const date = formatDate(new Date(req.body.date));
            const baseUrl = `https://railjournal.in/RailRadar/train-profile.php?trainNo=${trainNumber}&start_date=${date}`;
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


function formatDate(date) {
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit"
    }).replace(/ /g, "-");
}