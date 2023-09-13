import React from "react"

const MailDetail = ({data, onChange, onSend, onSave}) => {
    return (
        <div className="mailTemplateContainer">
            {data.id ? <h3>{data.name}</h3> :
                <>Name: <input type="text" name="name" value={data.name} onChange={(e) => onChange(e)}/></>
            }
            Subject: <input type="text" name="subject" value={data.subject} onChange={(e) => onChange(e)}/>
            Recipients: <input type="text" name="recipients" value={data.recipients} onChange={(e) => onChange(e)}/>
            Body: <textarea name="body" value={data.body} onChange={(e) => onChange(e)}/>
            <button name="send" onClick={() => onSend()}>Send</button>
            <button name="save" onClick={() => onSave()}>Save</button>
        </div>
    )
}

export default MailDetail