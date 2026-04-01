import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Badge } from '../ui/badge';
import { setAllApplicants } from '@/redux/applicationSlice';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                const updatedApplications = applicants?.applications?.map((item) =>
                    item._id === id ? { ...item, status: status.toLowerCase() } : item
                ) || [];
                dispatch(setAllApplicants({ ...applicants, applications: updatedApplications }));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update application status");
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell >
                                    {
                                        item.applicant?.profile?.resume ? <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.createdAt?.split("T")[0] || "NA"}</TableCell>
                                <TableCell>
                                    {
                                        item?.status === "withdrawn" ? (
                                            <Badge className="bg-amber-500">Withdrawn by Candidate</Badge>
                                        ) : (
                                            <Badge className={`${item?.status === "rejected" ? 'bg-red-400' : item?.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>
                                                {item?.status?.toUpperCase()}
                                            </Badge>
                                        )
                                    }
                                </TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    {
                                        item?.status === "withdrawn" ? (
                                            <span className="text-gray-400 cursor-not-allowed">No actions</span>
                                        ) : (
                                            <Popover>
                                                <PopoverTrigger>
                                                    <MoreHorizontal />
                                                </PopoverTrigger>
                                                <PopoverContent className="w-32">
                                                    {
                                                        shortlistingStatus.map((status, index) => {
                                                            return (
                                                                <div onClick={() => statusHandler(status, item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer'>
                                                                    <span>{status}</span>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                </TableCell>

                            </tr>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable