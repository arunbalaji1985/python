import React, { useState, useEffect } from "react"
import HostCard from "./HostCard"
import loadExternalScript from "../util/loadExternalScript"

const Home = () => {
    const [loadAutobahn, setLoadAutobahn] = useState(false);
    const [hostData, setHostData] = useState([]);

    const loadLib = () => {
        loadExternalScript({
            url: "https://cdnjs.cloudflare.com/ajax/libs/autobahn/22.10.1/autobahn.min.js",
            integrity: "sha512-NV3SvHAZNmkfgYNYbooVfXPHOXSxozk0TJALPt9J2xk1cVwp0YnTw5k3W6IClirda/A9DspvjeBqxmgPvdus+w=="
        })
    }

    useEffect(() => {
        if (typeof autobahn === 'undefined') {
            console.log("Loading autobahn")
            loadLib();
        }

        setLoadAutobahn(true);
    }, [])

    useEffect(() => {
        if (loadAutobahn) {
            window.addEventListener("load", () => {
                /* Connection configuration to our WAMP router */
                // eslint-disable-line
                // eslint-disable no-undef
                console.log("onload", autobahn)
                const conn = new autobahn.Connection({
                    url: 'ws://127.0.0.1:8080/ws',
                    realm: 'realm1'
                })
                console.log(conn)
                console.log("before open")
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
        console.log("Received event", args)
        const stat = args[0]
        setHostData(prevHostData => {
            return [...prevHostData.filter(prevStat => prevStat.ip !== stat.ip), stat]
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