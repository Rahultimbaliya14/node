class DataFormatHelper {
    getTrainInfo(trainData){
        let data = trainData.split("~~~~~~~~");
        var splitDate = data[0].split("~");
        if (splitDate.find(num => num === "Train not found")) {
            return { status: 404, message: "Train not found" };
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

        const departureRaw = filterData[11];
        const arrivalRaw = filterData[12];
        const durationRaw = filterData[13];

        const durationMinutes = timeToMinutes(durationRaw);

        const departureDayLabel = "Day 1";
        const arrivalDayLabel = minutesToDayLabel(durationMinutes);
     
        var data2 = data[1].split("~").filter(item => item.trim() !== "");  
       

        const responseData = {
            trainId :  data2[12] ?? null,
            trainNumber: filterData[1].replace("^", ""),
            trainName: filterData[2],
            fromStation: `${filterData[3]} - ${filterData[4]}`,
            toStation: `${filterData[5]} - ${filterData[6]}`,
            departureTime: `${departureRaw.replace(".",":")} - ${departureDayLabel}`,
            arrivalTime: `${arrivalRaw.replace(".",":")} - ${arrivalDayLabel}`,
            duration: durationRaw.replace(".",":"),
            travelingKMS: data2[18] ?? null,
            runOn: activeDays
        };
        return  responseData;
    }

    getTrainRoutInfo(trainData){
        let data = trainData.split("#^");
            let data1 = data[1].split("~^");
            let array = [];
            for (let i = 0; i < data1.length; i++) {
                let data2 = data1[i].split("~");
                data2 = data2.filter((el) => {
                    return el != "";
                });
                array.push({
                    no: i + 1,
                    stationName: data2[2],
                    stationCode: data2[1],
                    arrival: data2[3].replace(".", ":"),
                    departure: data2[4].replace(".", ":"),
                    distance: data2[6],
                    day: data2[7],
                    zone : data2[9]
                });
            }
            return array;
    }

    currentTrainStatus(trainData){
        const data = {}
        data.currentTrainStation = trainData.trainCurrentPosition["Last Station/Location"];
        data.currentTrainStationSTA = trainData.trainCurrentPosition["Last Station/Location Scheduled Time"];
        data.currentTrainStationATA = trainData.trainCurrentPosition["Last Station/Location Actual Time"];
        data.currentTrainStationDelay = trainData.trainCurrentPosition["Last Station/Location Delay"];
        data.trainStatus = trainData.trainCurrentPosition["Train Status/Last Location"];

        const arr = []
        trainData.etaTable.forEach((eta) => {
            arr.push({
                station: eta["Station Name"] +" - "+ eta["Station"],
                distance: eta["Distance"],
                sta: eta["STA"],
                eta: eta["ETA"],
                std: eta["STD"],
                etd: eta["ETD"],
                platformNumber: eta["PF"],
                arrived: eta["Has Arrived ?"],
                delay: eta["Delay"]
            });
        });
        data.station = arr;
        return data;
    }
}   

module.exports = new DataFormatHelper();