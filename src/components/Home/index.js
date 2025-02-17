import React, { useEffect, useState } from 'react'
import {ThreeDots} from "react-loader-spinner"
import "./index.css"

const apiResponseContent = {
    initally: "INITIAL",
    inProgress: "INPROGRESS",
    success: "SUCCESS",
    isFailed: "ISFAILED"
}

const Home = () => {
    const [response, setResponse] = useState({
        apiData: null,
        status: apiResponseContent.initally
    })
    const [title, settitle] = useState('')
    const [content, setcontent] = useState('')
    const [category, setcategory] = useState('')
    const [onEditbutton, setonEditButton] = useState(false)
    const [id, setid] = useState('')
    
    const getapiData = async () => {
        const response = await fetch("https://login-50kc.onrender.com/note")
        const data = await response.json()
        if (response.ok){
            setResponse({apiData: data, status: apiResponseContent.success})
        }else {
            setResponse({status: apiResponseContent.isFailed})
        }
    }

    useEffect(() => {
        setResponse({status: apiResponseContent.inProgress})
        getapiData()
    }, [])

    const onChangetitle = (event) => {
        settitle(event.target.value)
    }

    const onChangetextArea = (event) => {
        setcontent(event.target.value)
    }

    const onChangeselect = (event) => {
        setcategory(event.target.value)
    }

    const onEdit = (id) => {
        setonEditButton(true)
        setid(id)
    }

    const onDelete = async (id) => {
        const url = "https://login-50kc.onrender.com/note/delete"
        const details = {id}
        const options = {
            method: "DELETE",
            body: JSON.stringify(details)
        }
        const response = await fetch(url, options)
        await response.json()
        window.location.reload();
    }

    const onSave = async () => {
        const url = "https://login-50kc.onrender.com/save"
        const details = {id, title, content, category}
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(details)
        }
        const response = await fetch(url, options)
        await response.json()
        window.location.reload();
        setonEditButton(false)
    }

    const add = async () => {
        const url = "https://login-50kc.onrender.com/add"
        const details = {title, content, category}
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(details)
        }
        const response = await fetch(url, options)
        await response.json()
        window.location.reload();
    }

    const loadingview = () => (
        <div className='loader' data-testid="loader">
            <ThreeDots color="red"/>
        </div>
    )

    const isfailedView = () => {
        <div className='loader' data-testid="loader">
            <p>Failed to load......</p>
        </div>
    }

    const successView = () => (
        <>
        {response.apiData.length === 0 ? 
        <div>Empty</div>
        :
        response.apiData.map((each) => {
            return (
                <div className='data-table' key={each.id}>
                    <div className='data-table-text'>
                        <p className='id'>{each.id}</p>
                        <p className='id'>{each.title}</p>
                        <p className='extra'>{each.content}</p>
                        <p className='id'>{each.category}</p>
                        <p className='extra'>{each.created_at}</p>
                        <p className='extra'>{each.updated_at}</p>
                    </div>
                    <div className='buttonSaveAndDelete'>
                        <button type='button' className='Edit-button' onClick={() => onEdit(each.id)}>Edit</button>
                        <button type='buttton' className='save-button' onClick={() => onDelete(each.id)}>Delete</button>
                    </div>
                </div>
            )
        })
        }
        </>
    )

    const renderResponse = () => {
        const {status} = response
        switch (status) {
            case apiResponseContent.inProgress:
                return loadingview()
            case apiResponseContent.isFailed:
                return isfailedView()
            case apiResponseContent.success:
                return successView()
            default:
                return loadingview()
        }
    }

    return (
        <div className="bg-container">
            <div className="card-container">
                <h1 className="main-heading">Simple Todos</h1>
                <div className="addInput-container">
                    <div className='text-section'>
                        <label>TITTLE</label>
                        <input
                        type="text"
                        className="input"
                        placeholder="Title"
                        value={title}
                        onChange={onChangetitle}
                        required
                        />
                        <label>TEXTAREA</label>
                        <textarea
                        type="text"
                        className="input"
                        placeholder="Enter the text"
                        value={content}
                        onChange={onChangetextArea}
                        rows={5}
                        required
                        />
                    </div>
                    <div className='button-section'>
                        <label>Category</label>
                        <select className='input' value={category} onChange={onChangeselect}>
                            <option>Personal</option>
                            <option>Work</option>
                            <option>Study</option>
                            <option>others</option>
                        </select>
                        {onEditbutton ? <button type="button" className="Add-button" onClick={onSave}>
                        Save
                        </button> : <button type="button" className="Add-button" onClick={add}>
                        Add
                        </button>}
                    </div>
                </div>
                {renderResponse()}
            </div>
      </div>
    )
}
export default Home
