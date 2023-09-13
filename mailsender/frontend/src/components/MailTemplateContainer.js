import React, {useEffect, useState, useContext} from "react"
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from "../hooks/useFetch";
import MailDetail from "./MailDetail";
import axios from 'axios'
import AppContext from "../AppContext";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const MailTemplateContainer = ({isNew, onRefresh}) => {
    const navigate = useNavigate();
    const {id} = useParams()
    const [data, setData] = useState({})
    // const [currentId, setCurrentId] = useState("")
    const {currentId, setCurrentId} = useContext(AppContext)

    useEffect(() => {
        if (id) {
            const url = `http://127.0.0.1:8000/api/mails/${id}`
            fetch(url)
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    } else if (res.status == 404) {
                        setData({})
                        return;
                    }
                    throw new Error(res)
                })
                .then(data => setData(data))
                .catch(error => {
                    console.log("%o", error)
                    toast.error("Something went wrong!")
                })
            setCurrentId(id)
        }
    }, [id])

    useEffect(() => {
        if (isNew) {
            setData({subject: "", body: "", recipients: ""})
        }
    }, [isNew])

    const onChange = (e) => {
        setData(prevData => ( {...prevData, [e.target.name]: e.target.value}))
    }

    const onSave = () => {
        const url = 'http://127.0.0.1:8000/api/mails/' + (`${data.id}/` || '')
        const formData = new FormData()
        formData.append('subject', data.subject)
        formData.append('body', data.body)
        formData.append('recipients', data.recipients)
        formData.append('name', data.name)
        axios({
            method: data.id ? 'patch' : 'post',
            url: url,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(res => {
            if (res.status === 201 || res.status === 200) {
                toast.success("Template saved successfully!")
                onRefresh()
                if (!data.id) {
                    navigate(`/detail/${res.data.id}`);
                }
            }
        }).catch(error => {
            console.log(error)
            if (error.response.status === 400) {
                const {non_field_errors} = error.response.data
                if (non_field_errors) {
                    toast.error(non_field_errors.join("; "))
                }
            }
        })
    }

    const onSend = () => {
        const formData = new FormData()
        formData.append('subject', data.subject)
        formData.append('body', data.body)
        formData.append('recipients', data.recipients)
        axios({
            method: 'post',
            url: `http://127.0.0.1:8000/api/sendmail`,
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(res => {
            console.log(res)
            if (res.status === 200) {
                toast.success("Mail sent successfully!")
            } else {
                toast.error("Something went wrong!")
            }
        })
          .catch(error => console.log(error))
    }

    return (
        <>
            {data ? <MailDetail
                data={data}
                onChange={onChange}
                onSend={onSend}
                onSave={onSave}
                /> :
                <h2>Mail does not exist</h2>
            }
        </>
    )
}

export default MailTemplateContainer