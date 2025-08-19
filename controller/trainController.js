const axios = require('axios');

exports.getTrainInfo = async (req, res) => {
    const trainNumber = req.params.number;
    const baseUrl = `https://erail.in/rail/getTrains.aspx?TrainNo=${trainNumber}&DataSource=0&Language=0&Cache=true`;
    try {
        const response = await axios.get(baseUrl);
        const trainData = response.data;
        let data = trainData.split("~~~~~~~~");
        var splitDate = data[0].split("~");
        if (splitDate.find(num => num === "Train not found")) {
            return res.status(404).json({ message: "Train not found" });
        }
        var filterData = splitDate.filter(item => item.trim() !== "");
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const activeDays = [];
        for (let i = 0; i < filterData[14].length; i++) {
            if (filterData[14][i] === '1') {
                activeDays.push(daysOfWeek[i]);
            }
        }
        const timeToMinutes = (time) => {
            const [h, m] = time.split('.').map(Number);
            return h * 60 + m;
        };

        const minutesToDayLabel = (minutes) => {
            return "Day " + (Math.floor(minutes / (24 * 60)) + 1);
        };

        // Extract times and calculate day labels
        const departureRaw = filterData[11];
        const arrivalRaw = filterData[12];
        const durationRaw = filterData[13];

        const durationMinutes = timeToMinutes(durationRaw);

        const departureDayLabel = "Day 1";
        const arrivalDayLabel = minutesToDayLabel(durationMinutes);

        // Final response object
        const responseData = {
            trainNumber: filterData[1].replace("^", ""),
            trainName: filterData[2],
            fromStation: `${filterData[3]} - ${filterData[4]}`,
            toStation: `${filterData[5]} - ${filterData[6]}`,
            departureTime: `${departureRaw.replace(".",":")} - ${departureDayLabel}`,
            arrivalTime: `${arrivalRaw.replace(".",":")} - ${arrivalDayLabel}`,
            duration: durationRaw,
            runOn: activeDays
        };
        res.json(responseData);
    } catch (error) {
        console.error('Error fetching train information:', error);
        res.status(500).json({ error: 'Failed to retrieve train information' });
    }
};

