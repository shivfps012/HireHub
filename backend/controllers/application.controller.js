import Application from "../models/application.model.js";
import { Job } from "../models/job.model.js";
export const applyJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;
       if(!jobId){
        return res.status(400).json({
            message: "Job ID is required",
            success: false
        })
       };
    //    check if job has already been applied by the user
         const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
            });
        if(existingApplication){
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            })
        };
        // check if the job exists
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        };
        // cerate a new application
        const newapplication = await Application.create({
            job: jobId,
            applicant: userId,
        });
        // add the application to the job's applications array
        job.applications.push(newapplication._id);
        await job.save();
        return res.status(201).json({
            message: "Job application submitted successfully",
            success: true,
            data: newapplication
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const getAppliedJobs= async(req,res)=>{
    try {
        const userId=req.id;
        const applications=await Application.find({applicant:userId}).sort({
            createdAt:-1
        }).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}}
            }
        });
        if(!applications || applications.length===0){
            return res.status(404).json({
                message:"No applied jobs found",
                success:false
            })
        };         
        return res.status(200).json({
            message:"Applied jobs retrieved successfully",
            success:true,
            data:applications
        })   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const getApplicants= async(req,res)=>{
    try {
        const jobId=req.params.id;
        const job=await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            })
        };

        // Always read from Application collection so deleted applications do not linger.
        const applications = await Application.find({ job: jobId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'applicant',
            });

        const jobWithApplicants = {
            ...job.toObject(),
            applications,
        };

        return res.status(200).json({
            message:"Applicants retrieved successfully",
            job: jobWithApplicants,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const updateStatus= async(req,res)=>{
    try {
        const applicationId=req.params.id;
        const {status}=req.body;
        if(!status){
            return res.status(400).json({
                message:"Status is required",
                success:false
            })
        }

        const normalizedStatus = status.toLowerCase();
        const allowedStatuses = ["pending", "accepted", "rejected", "withdrawn"];
        if(!allowedStatuses.includes(normalizedStatus)){
            return res.status(400).json({
                message:"Invalid status provided",
                success:false
            })
        }

        const application=await Application.findOne({_id:applicationId}).populate("job");
        if(!application){
            return res.status(404).json({
                message:"Application not found",
                success:false
            })
        };

        // Candidate can withdraw only their own application.
        if(normalizedStatus === "withdrawn" && application.applicant.toString() !== req.id){
            return res.status(403).json({
                message:"You are not allowed to withdraw this application",
                success:false
            })
        }

        // Recruiter can shortlist only for jobs they created.
        if(
            (normalizedStatus === "accepted" || normalizedStatus === "rejected") &&
            application.job?.created_by?.toString() !== req.id
        ){
            return res.status(403).json({
                message:"You are not allowed to update this application",
                success:false
            })
        }

        // Once withdrawn, recruiter cannot change the status.
        if(application.status === "withdrawn" && normalizedStatus !== "withdrawn"){
            return res.status(400).json({
                message:"Withdrawn applications cannot be shortlisted",
                success:false
            })
        }

        application.status=normalizedStatus;
        await application.save();
        return res.status(200).json({
            message:"Application status updated successfully",
            success:true,
            data:application
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
