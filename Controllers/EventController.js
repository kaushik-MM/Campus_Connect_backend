const EventModel = require("../Models/EventModel");
const EventRegistrationModel = require("../Models/EventRegistrationModel");

exports.createEvent = async (req, res) => {
    try {
        const body = req.body;

        if (
            !body.title ||
            !body.description ||
            !body.eventDate ||
            !body.startTime ||
            !body.endTime ||
            !body.venue ||
            !body.organizer ||
            !req.file ||
            !body.registrationDeadline ||
            !body.maxParticipants
        ) {
            return res.json({
                message: "All Fields Are Required"
            });
        }

        const isValidDate = (value) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
                return false;
            }

            const date = new Date(`${value}T00:00:00Z`);

            return !Number.isNaN(date.getTime()) &&
                date.toISOString().slice(0, 10) === value;
        };
        if (
            !isValidDate(body.eventDate) ||
            !isValidDate(body.registrationDeadline)
        ) {
            return res.status(400).json({
                message: "Please enter valid dates in YYYY-MM-DD format"
            });
        }


        await EventModel.create({
            title: body.title,
            description: body.description,
            category: body.category,
            eventType: body.eventType,
            eventDate: body.eventDate,
            startTime: body.startTime,
            endTime: body.endTime,
            venue: body.venue,
            organizer: body.organizer,
            image: req.file.filename,
            registrationDeadline: body.registrationDeadline,
            maxParticipants: body.maxParticipants,
            createdBy: body.createdBy
        });

        return res.json({
            message: "Event Created"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error creating event",
            error: error.message
        });
    }
};

exports.allEvent = async (req, res) => {

    const events = await EventModel.find().populate('createdBy')
    return res.json(events);

}

exports.deleteEvent=async (req,res)=>{
    const id=req.params.id
    const event=await EventModel.findById(id)
    if(event.status!='completed' && event.status!='ongoing' && event.status!='cancelled'){
        await EventModel.findByIdAndDelete(id);
        return res.json({'message':'Event Deleted'})
    }else{
        return res.json({'message':'Unable to Delete'})
    }
}


exports.registerEvent = async (req, res) => {
        const eventid=req.body.eventid
        const userid=req.body.userid
          
        const event=await EventModel.findById(eventid)
        const maxParticipants=event.maxParticipants
        const totalRegister=await EventRegistrationModel.find({eventid:eventid})
        if(totalRegister.length==maxParticipants){
            return res.json({'message':'Total Seat Fillup'})
        }else{
            const isregister=await EventRegistrationModel.findOne({eventid,userid})
            if(isregister){
                return res.json({'message':'You Are AllReady Register For The Event'})
            }else{
                const reg=await EventRegistrationModel.create({eventid:eventid,userid:userid})
                return res.json({'message':'You Are Succesfully Register For The Event'})
            }
        }

    
};


exports.getEventRegistration = async (req, res) => {
    const eventid = req.params.eventid;

    const registrations = await EventRegistrationModel
        .find({ eventid: eventid })
        .populate("userid", "name email");

    return res.json(registrations);
};