class DataFormatHelper {
    getTrainInfo(trainData) {
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
            trainId: data2[12] ?? null,
            trainNumber: filterData[1].replace("^", ""),
            trainName: filterData[2],
            fromStation: `${filterData[3]} - ${filterData[4]}`,
            toStation: `${filterData[5]} - ${filterData[6]}`,
            departureTime: `${departureRaw.replace(".", ":")} - ${departureDayLabel}`,
            arrivalTime: `${arrivalRaw.replace(".", ":")} - ${arrivalDayLabel}`,
            duration: durationRaw.replace(".", ":"),
            travelingKMS: data2[18] ?? null,
            runOn: activeDays
        };
        return responseData;
    }

    getTrainRoutInfo(trainData) {
        let data = trainData.split("#^");
        let data1 = [];
        if (data.length > 1) {
            data1 = data[1].split("~^");
        }
        else {
            data1 = data[0].split("~^");
        }

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
                zone: data2[9]
            });
        }
        return array;
    }

    currentTrainStatus(trainData) {
        const data = {}
        if (trainData.trainCurrentPosition) {
            data.currentTrainStation = trainData.trainCurrentPosition["Last Station/Location"];
            data.currentTrainStationSTA = trainData.trainCurrentPosition["Last Station/Location Scheduled Time"];
            data.currentTrainStationATA = trainData.trainCurrentPosition["Last Station/Location Actual Time"];
            data.currentTrainStationDelay = trainData.trainCurrentPosition["Last Station/Location Delay"];
            data.trainStatus = trainData.trainCurrentPosition["Train Status/Last Location"];


            const arr = []
            if (trainData.etaTable) {
                trainData.etaTable.forEach((eta) => {
                    arr.push({
                        station: eta["Station Name"] + " - " + eta["Station"],
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
    }
    getPNRInfo(pnrData) {
        if (pnrData.data && pnrData.data.pnrResponse) {
            let data = {
                pnr: pnrData.data.pnrResponse.pnr,
                trainNumber: pnrData.data.pnrResponse.trainNo,
                trainName: pnrData.data.pnrResponse.trainName,
                dateOfJourney: pnrData.data.pnrResponse.doj,
                from: `${pnrData.data.pnrResponse.boardingStationName} - ${pnrData.data.pnrResponse.from}`,
                to: `${pnrData.data.pnrResponse.reservationUptoName} - ${pnrData.data.pnrResponse.to}`,
                boardingPoint: `${pnrData.data.pnrResponse.boardingStationName} - ${pnrData.data.pnrResponse.boardingPoint}`,
                departureTime: pnrData.data.pnrResponse.departureTime,
                arrivalTime: pnrData.data.pnrResponse.arrivalTime,
                duration: pnrData.data.pnrResponse.duration,
                boardingPointPlatformNumber: pnrData.data.pnrResponse.expectedPlatformNo,
                coachPosition: pnrData.data.pnrResponse.coachPosition,
               
            };
            if (pnrData.data.pnrResponse.passengerStatus) {
                let array = [];
                pnrData.data.pnrResponse.passengerStatus.forEach((passenger) => {
                    array.push({
                        number: passenger.number,
                        Status: passenger.confirmTktStatus,
                        coach: passenger.coach,
                        berth: passenger.berth,
                        bookingStatus: passenger.bookingStatus,
                        bookingStatusCurrent: passenger.bookingStatusNew,
                        bookingBerthNo: passenger.bookingBerthNo,
                        bookingCoachId: passenger.bookingCoachId,
                        bookingBerthCode: passenger.bookingBerthCode,
                        currentBerthNo: passenger.currentBerthNo,
                        currentCoachId: passenger.currentCoachId,
                        currentStatus: passenger.currentStatus,
                        currentBerthCode: passenger.currentBerthCode,
                        currentStatusCurrent: passenger.currentStatusNew

                    });
                });
                data.passengerStatus = array;
            }
            let obj = {
                    bookingDate: pnrData.data.pnrResponse.bookingDate,
                    bookingFare: pnrData.data.pnrResponse.bookingFare,
                    ticketFare: pnrData.data.pnrResponse.ticketFare,
                    bookingQuota: pnrData.data.pnrResponse.quota,
                    bookingClass: pnrData.data.pnrResponse.class
                }
            data.bookingDetails = obj;
            return data;
        }
        return {};
    }

    getBetweenTrain(trainData) {

        const data = trainData.split("~^");
        if(data.length === 1){
            return { message: "No trains found" };
        }
        const basicdata = data[0].split("~");
        const obj = {
            fromStation: basicdata[1] + " - " + basicdata[2],
            toStation: basicdata[3] + " - " + basicdata[4],
        };

        const formattedData = data.slice(1).map((train) => {
            const trainDetails = train.split("~");
            return {
                trainNumber: trainDetails[0],
                trainName: trainDetails[1],
                from: trainDetails[2] + " - " + trainDetails[3],
                to: trainDetails[4] + " - " + trainDetails[5],
                arrivedStation: trainDetails[6] + " - " + trainDetails[7],
                destinationStation: trainDetails[8] + " - " + trainDetails[9],
                arrived: trainDetails[10].replace(".", ":"),
                reached: trainDetails[11].replace(".", ":"),
                duration: trainDetails[12].replace(".", ":"),
            };
        });
        obj.data = formattedData;
       return obj;
    }
};



module.exports = new DataFormatHelper();