import React, {useState, useEffect} from "react"

const useFetch = (url) => {
    const [data, setData] = useState([])

    useEffect(() => {
        console.log(url)
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setData(data)
            })
    }, [url])

    console.log(data)
    return data
}

export default useFetch