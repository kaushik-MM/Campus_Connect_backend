const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: [
        "Technical",
        "Cultural",
        "Sports",
        "Workshop",
        "Seminar",
        "Other"
      ]
    },

    eventType: {
      type: String,
      enum: ["College", "Department", "Club"]
    },

  eventDate: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}-\d{2}$/
    },

    startTime: {
      type: String
    },

    endTime: {
      type: String
    },

    venue: {
      type: String
    },

    organizer: {
      type: String
    },

    image: {
      type: String
    },

    registrationRequired: {
      type: Boolean,
      default: true
    },
      
    registrationDeadline: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}-\d{2}$/
    }
,

    maxParticipants: {
      type: Number
    },

    status: {
      type: String,
      enum: [
        "upcoming",
        "ongoing",
        "completed",
        "cancelled"
      ],
      default: "upcoming"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Event", eventSchema);