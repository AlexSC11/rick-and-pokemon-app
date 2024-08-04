import { useEffect, useState } from "react";
import axiosInstance from "../../../axiosConfig";

const AllUsers = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        getAllUsers();
    },[]);

    const getAllUsers = async() => {
        try {
            const response = await axiosInstance.get('/users');
            setData(response.data.usersData);
        } catch (error) {
            
        }
    }

    return (
        <>
            <h1>All Users</h1>
            <hr/>
            {
                data && <table style={{ width: '100%'}}>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Profile photo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td><img src={item.profilephoto} alt={item.name} style={{ width: '50px', height: '50px'}}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            
        </>
    )
}

export default AllUsers;