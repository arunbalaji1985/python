import React, { useState, useEffect } from "react"
import HostCard from "./HostCard"
import loadExternalScript from "../util/loadExternalScript"
import axios from 'axios'

const CROSSBAR_HOST = process.env.CROSSBAR_HOST || '127.0.0.1'
const BACKEND_HOST = process.env.BACKEND_HOST || '127.0.0.1'

const Home = () => {
    const [loadAutobahn, setLoadAutobahn] = useState(false);
    const [hostData, setHostData] = useState([]);

    const loadLib = () => {
        loadExternalScript({
            url: "https://cdnjs.cloudflare.com/ajax/libs/autobahn/22.10.1/autobahn.min.js",
            integrity: "sha512-NV3SvHAZNmkfgYNYbooVfXPHOXSxozk0TJALPt9J2xk1cVwp0YnTw5k3W6IClirda/A9DspvjeBqxmgPvdus+w=="
        })
    }

    const fetchHostData = () => {
        axios.get(`http://${BACKEND_HOST}:8000/api/v1/host/`)
            .then(res => setHostData(res.data))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        if (typeof autobahn === 'undefined') {
            console.log("Loading autobahn")
            loadLib();
        }

        setLoadAutobahn(true);
    }, [])

    // Fetch initial snapshot
    useEffect(() => {
        fetchHostData()
    }, [])

    // Subscribe to real-time updates
    useEffect(() => {
        if (loadAutobahn) {
            window.addEventListener("load", () => {
                /* Connection configuration to our WAMP router */
                // eslint-disable-line
                // eslint-disable no-undef
                const conn = new autobahn.Connection({
                    url: `ws://${CROSSBAR_HOST}:8082/ws`,
                    realm: 'realm1'
                })
                conn.onopen = (session) => {
                    console.log("connected!");
                    /* When we receive the 'host_data' event, run this function */
                    session.subscribe('host_data', onHostDataEvent);
                }
                conn.open()
            });
        }
    }, [loadAutobahn])

    const onHostDataEvent = (args) => {
        const stat = args[0]
        setHostData(prevHostData => {
            const newHostData = [...prevHostData.filter(prevStat => prevStat.ip !== stat.ip), stat]
            newHostData.sort((x, y) => (x.name.toLowerCase() > y.name.toLowerCase()) ? 1 :
                (x.name.toLowerCase() < y.name.toLowerCase()) ? -1 : 0)
            return newHostData
        })
    }

    return (
        <>
            {
                hostData.map(stat =>
                    <HostCard
                        key={stat.ip}
                        stat={stat}
                    />
                )
            }
        </>
    )
}

export default Home