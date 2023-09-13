import React, { useEffect, useState, useContext } from "react"
import Sidebar from "./Sidebar"
import {Outlet, useNavigate} from "react-router-dom"
import AppContext from "../AppContext"
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const SidebarContainer = ({cnt, onRefresh}) => {
    const SERVER = '127.0.0.1:8000'
    const {currentId, setCurrentId} = useContext(AppContext)
    const [data, setData] = useState([])
        const navigate = useNavigate()

    const fetchData = () => {
        fetch(`http://${SERVER}/api/mails/`)
        .then(res => res.json())
        .then(data => setData(data))
    }

    useEffect(() => {
        fetchData();
    }, [cnt])

    const onDelete = (e, id) => {
        e.stopPropagation()
        e.preventDefault()
        fetch(`http://${SERVER}/api/mails/${id}`, {method: "DELETE"})
            .then(res => {
                toast.info("Template deleted successfully")
                if (id === currentId) {
                    navigate("/")
                }

                onRefresh()
            })
    }

    return (
        <>
            <Sidebar data={data} onDelete={onDelete} onSelect={(id) => setCurrentId(id)} />
            <Outlet />
        </>
    )
}

export default SidebarContainer