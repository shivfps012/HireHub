import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {withCredentials:true});
                console.log(res.data);
                if(res.data.success){
                    dispatch(setAllAppliedJobs(res.data.data));
                } else {
                    // No applications found, set empty array
                    dispatch(setAllAppliedJobs([]));
                }
            } catch (error) {
                console.log(error);
                // On error, set empty array to avoid undefined state
                dispatch(setAllAppliedJobs([]));
            }
        }
        fetchAppliedJobs();
    },[])
};
export default useGetAppliedJobs;