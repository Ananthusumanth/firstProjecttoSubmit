import React, { useEffect, useState } from 'react'
import {ThreeDots} from "react-loader-spinner"
import Pagination from '../Pagination'
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
    const [editid, setid] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [postPerPage] = useState(5)
    
    const getapiData = async () => {
        const response = await fetch("https://login-50kc.onrender.com/notes")
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

    const lastPostIndex = currentPage * postPerPage
    const firstPostIndex = lastPostIndex - postPerPage
    let currentPosts
    if (response.apiData !== undefined && response.apiData !== null) {
        currentPosts = response.apiData.slice(firstPostIndex, lastPostIndex)
    }

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
        const url = `https://login-50kc.onrender.com/notes/${id}`
        const options = {
            method: "DELETE"
        }
        const response = await fetch(url, options)
        await response.json()
        window.location.reload();
    }

    const onSave = async () => {
        const url = `https://login-50kc.onrender.com/notes/${editid}`
        const details = {title, content, category}
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
        const url = "https://login-50kc.onrender.com/notes"
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
        <table>
            <tr className='data-table'>
                <th className='id'>ID</th>
                <th className='other'>TITLE</th>
                <th className='extra'>CONTENT</th>
                <th className='other'>CATEGORY</th>
                <th className='extra'>CREATED_AT</th>
                <th className='extra'>UPDATED_AT</th>
                <th className='button'></th>
                <th className='button'></th>
            </tr>
            { response.apiData.length === 0 ? <div className='empty'>Empty..........</div> :
                currentPosts.map((each) => {
                    const editedIDinprogress = each.id === editid ? "data-edit-table" : 'data-table'
                    return (
                        <tr className={editedIDinprogress} key={each.id}>
                            <td className='id'>{each.id}</td>
                            <td className='other'>{each.title}</td>
                            <td className='extra'>{each.content}</td>
                            <td className='other'>{each.category}</td>
                            <td className='extra'>{each.created_at}</td>
                            <td className='extra'>{each.updated_at}</td>
                            <td className='button'><button type='button' className='Edit-button' onClick={() => onEdit(each.id)}>Edit</button></td>
                            <td className='button'><button type='buttton' className='delete-button' onClick={() => onDelete(each.id)}>Delete</button></td>
                        </tr>
                    )
                })
            }
        </table>
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

    const totalpostsLength = () => {
        if (
          response.apiData === null ||
          response.apiData === undefined ||
          response.apiData.length === 0
        ) {
          return 1
        }
        return Math.ceil(response.apiData.length/postPerPage)
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
                        {onEditbutton ? <button type="button" className="save-button" onClick={onSave}>
                        Save
                        </button> : <button type="button" className="Add-button" onClick={add}>
                        Add
                        </button>}
                    </div>
                </div>
                <div className='table'>
                    {renderResponse()}
                </div>
                <Pagination 
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    totalpages={totalpostsLength()}
                />
            </div>
      </div>
    )
}
export default Home
