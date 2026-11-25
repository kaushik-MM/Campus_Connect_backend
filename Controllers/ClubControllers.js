
const Club = require('../Models/ClubModel');
const ReportModel=require('../Models/ReportModel')
const mongoose=require('mongoose')


exports.createClub = async (req, res) => {
    try {
        const {
            clubName,
            description,
            category,
            rules,
            createdBy,
            studentId
        } = req.body;

        if (!clubName || !description || !category || !createdBy || !studentId) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const existingClub = await Club.findOne({
            clubName: {
                $regex: `^${clubName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
                $options: "i"
            },
            status: "active"
        });

        if (existingClub) {
            return res.status(409).json({
                message: "Club already exists"
            });
        }

        const club = await Club.create({
            clubName: clubName.trim(),
            description,
            category,
            rules: rules || "",
            image: req.file ? `/clubs/${req.file.filename}` : "",
            createdBy,
            members: [studentId]
        });

        return res.status(201).json({
            success: true,
            message: "Club created successfully",
            club
        });

    } catch (error) {
        console.log("Create Club Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAllClubs = async (req, res) => {
    try {
        const clubs = await Club.find({
            status: "active"
        })
        .populate("createdBy", "name email")
        .populate("members", "name email")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Clubs fetched successfully",
            clubs
        });

    } catch (error) {
        console.error("Get clubs error:", error);

        return res.status(500).json({
            message: "Unable to fetch clubs"
        });
    }
};

exports.getClubById = async (req, res) => {
    try {
        const clubId = req.params.id;
        const studentId = req.query.studentId;

        if (!mongoose.isValidObjectId(clubId)) {
            return res.status(400).json({
                message: "Invalid club ID"
            });
        }

        const club = await Club.findOne({
            _id: clubId,
            status: "active"
        })
        .populate("createdBy", "name email")
        .populate("members", "name email department year");

        if (!club) {
            return res.status(404).json({
                message: "Club not found"
            });
        }

        let hasReported = false;

        if (studentId && mongoose.isValidObjectId(studentId)) {
            const existingReport = await ReportModel.findOne({
                clubId: clubId,
                studentId: studentId
            });

            hasReported = !!existingReport;
        }

        return res.status(200).json({
            club,
            hasReported
        });

    } catch (error) {
        console.log("Get club error:", error);

        return res.status(500).json({
            message: "Unable to fetch club details"
        });
    }
};

exports.joinClub = async (req, res) => {
    try {

        // Get IDs from URL parameters
        const studentId = req.params.studentId;
        const clubId = req.params.clubId;

        // Validate IDs
        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        if (!mongoose.isValidObjectId(clubId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid club ID"
            });
        }

        // Check whether club exists and is active
        const existingClub = await Club.findOne({
            _id: clubId,
            status: "active"
        });

        if (!existingClub) {
            return res.status(404).json({
                success: false,
                message: "Club not found or inactive"
            });
        }

        // Check whether student already joined
        if (
            existingClub.members.some(
                member => member.toString() === studentId
            )
        ) {
            return res.status(409).json({
                success: false,
                message: "You have already joined this club"
            });
        }

        // Add student to club
        const club = await Club.findByIdAndUpdate(
            clubId,
            {
                $addToSet: {
                    members: studentId
                }
            },
            {
                new: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "You joined the club successfully",
            club
        });

    } catch (error) {

        console.error("Join club error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to join club",
            error: error.message
        });
    }
};

exports.leaveClub = async (req, res) => {
    try {

        // Get IDs from URL parameters
        const studentId = req.params.studentId;
        const clubId = req.params.clubId;

        // Validate student ID
        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        // Validate club ID
        if (!mongoose.isValidObjectId(clubId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid club ID"
            });
        }

        // Check whether club exists and is active
        const existingClub = await Club.findOne({
            _id: clubId,
            status: "active"
        });

        if (!existingClub) {
            return res.status(404).json({
                success: false,
                message: "Club not found or inactive"
            });
        }

        // Check whether student is a member
        if (
            !existingClub.members.some(
                member => member.toString() === studentId
            )
        ) {
            return res.status(409).json({
                success: false,
                message: "You are not a member of this club"
            });
        }

        // Prevent club owner from leaving their own club
        if (existingClub.createdBy.toString() === studentId) {
            return res.status(403).json({
                success: false,
                message: "Club owner cannot leave their own club"
            });
        }

        // Remove student from club
        const club = await Club.findByIdAndUpdate(
            clubId,
            {
                $pull: {
                    members: studentId
                }
            },
            {
                new: true
            }
        )
        .populate("createdBy", "name email")
        .populate("members", "name email department year");

        return res.status(200).json({
            success: true,
            message: "You left the club successfully",
            club
        });

    } catch (error) {

        console.error("Leave club error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to leave club",
            error: error.message
        });
    }
};

exports.deleteClub = async (req, res) => {
  try {
    const reason = req.body.reason;
    const clubId = req.params.clubId;
    const deletedBy=req.body.deletedBy;
    
    if (!mongoose.isValidObjectId(clubId)) {
      return res.status(400).json({
        message: "Invalid club ID"
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        message: "Please provide a reason for deletion"
      });
    }

    const club = await Club.findOneAndUpdate(
      {
        _id: clubId,
        status: "active"
      },
      {
        $set: {
          status: "deleted",
          deletedBy: deletedBy,
          deletionReason: reason.trim(),
          deletedAt: new Date()
        }
      },
      {
        new: true
      }
    );

    if (!club) {
      return res.status(404).json({
        message: "Active club not found"
      });
    }

    return res.status(200).json({
      message: "Club deleted successfully",
      club
    });

  } catch (error) {
    console.error("Delete club error:", error);

    return res.status(500).json({
      message: "Unable to delete club"
    });
  }
};


exports.reportClub = async (req, res) => {
    try {
        const { clubId, studentId, reason } = req.body;

        if (!mongoose.isValidObjectId(clubId)) {
            return res.status(400).json({
                message: "Invalid club ID"
            });
        }

        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        if (!reason || !reason.trim()) {
            return res.status(400).json({
                message: "Please provide a report reason"
            });
        }

        const club = await Club.findOne({
            _id: clubId,
            status: "active"
        });

        if (!club) {
            return res.status(404).json({
                message: "Club not found"
            });
        }

        // Only club members can report
        const isMember = club.members.some(
            member => member.toString() === studentId
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Only club members can report this club"
            });
        }

        // Check existing report
        const existingReport = await ReportModel.findOne({
            clubId: clubId,
            studentId: studentId
        });

        if (existingReport) {
            return res.status(409).json({
                message: "You have already reported this club"
            });
        }

        // Create report
        await ReportModel.create({
            clubId: clubId,
            studentId: studentId,
            ReportMessage: reason.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Club reported successfully"
        });

    } catch (error) {
        // Handles duplicate reports at database level
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already reported this club"
            });
        }

        console.log("Report club error:", error);

        return res.status(500).json({
            message: "Unable to report club"
        });
    }
};

exports.fetchAllClubs = async (req, res) => {
    try {
        const clubs = await Club.find({
            status: "active"
        })
        .populate("createdBy", "name email")
        .populate("members", "name email")
        .sort({ createdAt: -1 })
        .lean();

        // Fetch report counts club-wise
        const reportCounts = await ReportModel.aggregate([
            {
                $group: {
                    _id: "$clubId",
                    totalReports: { $sum: 1 }
                }
            }
        ]);

        const reportMap = {};
        reportCounts.forEach((report) => {
            reportMap[report._id.toString()] = report.totalReports;
        });

        // Attach report count to each club
        const clubsWithReports = clubs.map((club) => ({
            ...club,
            totalReports: reportMap[club._id.toString()] || 0
        }));

        return res.status(200).json({
            message: "Clubs fetched successfully",
            clubs: clubsWithReports
        });

    } catch (error) {
        console.error("Get clubs error:", error);

        return res.status(500).json({
            message: "Unable to fetch clubs"
        });
    }
};