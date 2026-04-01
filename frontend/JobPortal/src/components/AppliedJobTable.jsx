import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setAllAppliedJobs } from '@/redux/jobSlice'

const AppliedJobTable = () => {
    const dispatch = useDispatch();
    const {allAppliedJobs} = useSelector(store=>store.job);

    const withdrawApplicationHandler = async (applicationId) => {
        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
                { status: 'withdrawn' },
                { withCredentials: true }
            );

            if (res.data.success) {
                const updatedApplications = allAppliedJobs.map((job) =>
                    job._id === applicationId ? { ...job, status: 'withdrawn' } : job
                );
                dispatch(setAllAppliedJobs(updatedApplications));
                toast.success('Application withdrawn successfully');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to withdraw application');
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !allAppliedJobs || allAppliedJobs.length === 0 ? <span>You haven't applied any job yet.</span> : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right">
                                    {
                                        appliedJob?.status === "withdrawn" ? (
                                            <Badge className="bg-amber-500">Withdrawn by Candidate</Badge>
                                        ) : (
                                            <Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob?.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>
                                                {appliedJob?.status?.toUpperCase()}
                                            </Badge>
                                        )
                                    }
                                </TableCell>
                                <TableCell className="text-right">
                                    {
                                        appliedJob?.status === 'pending' ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => withdrawApplicationHandler(appliedJob?._id)}
                                            >
                                                Withdraw
                                            </Button>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )
                                    }
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable