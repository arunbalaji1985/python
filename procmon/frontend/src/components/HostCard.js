import React from "react"

const HostCard = (props) => {
    const {ip, cpu, mem, name, disk, ts} = props.stat
    return (
        <>
            <section key={ip}>
                <h3>
                    {name + " (" + ip + ") " + "--"} <small><i>{ts}</i></small>
                </h3>
                <dl>
                    <dt>CPU</dt>
                    <dd>{cpu}</dd>
                    <dt>Disk</dt>
                    <dd>{disk}</dd>
                    <dt>Mem</dt>
                    <dd>{mem}</dd>
                </dl>
            </section>
        </>
    )
}

export default HostCard