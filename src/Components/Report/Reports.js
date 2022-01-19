import { useEffect, useState, useContext, useRef } from "react"
import useFetch from "use-http"
import APIRoot from "../API"
import Context from "../Identity/Context"
import {Card, Container, Button, Row, Col, Table, Form, FormControl, Spinner, ButtonGroup} from 'react-bootstrap'
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { BigSpinner } from "../Utils"
import moment from "moment"

export const Reports = () => {
    return <div>
        <h1>Affected projects</h1>
        <AffectedProjects/>
        <Link to={`/reports/owned`}>
            <Button variant="info">Owned Projects</Button>
        </Link>
    </div>
}

export const AffectedProjects = () => {
    
    const [date, setDate] = useState(moment())
    const {context} = useContext(Context)

    const {loading, data, error} = useFetch(APIRoot + `/Report?employeeId=${context.id}&reportMonth=${date.toISOString()}`, {}, [date])

    const changeMonth = (direction) => {
        if (direction > 0){
            const nxt = moment(date).add(1, 'months')
            const nxtCheck = nxt.toDate()
            const today = new Date()
            if (nxtCheck.getMonth() <= today.getMonth() || nxtCheck.getFullYear() < today.getFullYear())
                setDate(nxt)
            return
        }

        const prv = moment(date).add(-1, 'months')
        setDate(prv)
    }

    if (!loading)
        return <Container style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
            {date.toDate().toLocaleString("eng", {month:'long'})} - {date.toDate().getFullYear()}
            <ButtonGroup>
                <Button  style={{margin : "0.5rem"}} onClick={() => changeMonth(-1)}variant='success'>Previous</Button>
                <Button  style={{margin : "0.5rem"}} onClick={() => changeMonth(1)} variant='success'>Next</Button>
                <Link to={'/reports/freeze'}>
                    <Button style={{margin : "0.5rem"}} variant='info'>Freeze month</Button>
                </Link>
            </ButtonGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Active</th>
                        <th>Contribution</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.projects.map(proj => <AffectedProject key={proj.id} props={{
                        contribution : data.contributions[proj.id], 
                        project : proj, 
                        month : date}}
                    />)}
                </tbody>    
            </Table>
        </Container>
    else 
        return <BigSpinner/>
}
export const AffectedProject = ({props}) => {

    const {contribution, project, month} = props
    return <tr>
            <td>{project.name}</td>
            <td>{project.active ? "true" : "false"}</td>
            <td>{contribution}</td>
            <td>
                <Link to={`/reports/project/contribution/${project.id}/${month.toISOString()}`}>
                    <Button style={{width: "12rem"}}>Inspect</Button>
                </Link>
            </td>
    </tr>
}


export const OwnedProjects = () => {
    const {get, data, error, loading} = useFetch(APIRoot + '/Report')
    const {context} = useContext(Context)

    useEffect(() => {
        fetchOwned()
    }, [])

    const fetchOwned = async () => {
        await get(`/owned_projects/?employeeId=${context.id}`)   
    }

    if (data != undefined)
        return <Container style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
            <h1>Owned Projects</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Active</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(proj => <Project project={proj} key={proj.id}/>)}
                </tbody>
            </Table>            
        </Container>
    else
        return <BigSpinner/>
}

const Project = ({project}) => {

    const {id, ownerID, name, timeBudget, active, description} = project
    const context = useContext(Context)

    return  <tr>
        <td>{name}</td>
        <td>{active ? "true" : "false"}</td>
        <td>{description}</td>
        <td>
            <Link to={`/reports/contribution/${id}`}>
                <Button variant='info'>Inspect</Button>
            </Link>
        </td>
    </tr>
}

export const ProjectSummary = () => {

    const {projectId} = useParams()
    const [data, setData] = useState(undefined)
    const navigate = useNavigate()
    const [_color, setColor] = useState("white")
    const [usedBudget, setUsedBudget] = useState(0)
    const [projectBudget, setProjectBudget] = useState(0)

    useEffect(async () => {
        const response = await axios.get(APIRoot + `/Report/project_activities?projectId=${projectId}`)
        setData(response.data)
        const diff = response.data.project.timeBudget > response.data.usedBudget ? "green" : "red"
        setUsedBudget(response.data.usedBudget)
        setProjectBudget(response.data.project.timeBudget)
        setColor(diff)        
    }, [])

    useEffect(() => {
        const diff = projectBudget > usedBudget ? "green" : "red"
        setColor(diff)    
    }, [usedBudget])

    if (data != undefined)
        return <Container>
            <h1>{data.project.name}</h1>
                <div>
                    <h2 style={{display : "inline-block"}}>Remaining Budget : </h2> &nbsp;
                    <h2 style={{display : "inline-block", color : _color}}>{data.project.timeBudget - usedBudget}/{data.project.timeBudget}</h2>
                </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Employee</th>
                        <th>Description</th>
                        <th>Duration</th>
                        <th>Accepted Duration</th>
                        <th>Difference</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.records.map(act => <ActivityRecord key={act.id} _activity={act} setUsedBudget={setUsedBudget} usedBudget={usedBudget}/>)}
                </tbody>
            </Table>
            <Button onClick={() => navigate(-1)} variant='info'>Back</Button>
        </Container> 
    else 
        return <BigSpinner/>
}



const ActivityRecord = ({_activity, setUsedBudget, usedBudget}) => {

    const [activity, setActivity] = useState(_activity)
    const {context} = useContext(Context)

    const [employee, setEmployee] = useState("")
    const [acceptedTime, setAcceptedTime] = useState(_activity.acceptedTime)
    const inputRef = useRef()

    useEffect(() => {
        fetchEmployees()
    }, [])

    const fetchEmployees = async () => {
        const employees = await axios.get(APIRoot + "/Identity")
        setEmployee(employees.data.find(emp => emp.id == activity.employeeID))
    }

    const postUpdate = async () => {
        await axios.put(APIRoot + `/Report/accept_record?activityId=${activity.id}&newValue=${inputRef.current.value}`)
    }

    const acceptTime = () => {
        postUpdate()
        const diff = acceptedTime - inputRef.current.value
        setAcceptedTime(inputRef.current.value)
        setUsedBudget(usedBudget - diff)
        inputRef.current.value = ''
    }

    const _color = acceptedTime >= activity.durationMinutes ? "green" : "red"
return <tr>
        <td>{activity.name}</td>
        <td>{activity.employeeID == context.id ? "me" : `${employee.name} ${employee.surname}`}</td>
        <td>{activity.description}</td>
        <td>{activity.durationMinutes}</td>
        <td>
            {activity.frozen && <Form>
                <FormControl type="number" ref={inputRef} placeholder={acceptedTime}>
                </FormControl>      
            </Form>}
            {!activity.frozen && acceptedTime}
        </td>
        {acceptedTime != null && <td style={{color : _color }}>{acceptedTime - activity.durationMinutes}</td>}
        {acceptedTime == null && <div></div>}
        <td>
            {activity.frozen && <Button onClick={() => acceptTime()}variant='info'>Change</Button>}
            {!activity.frozen && activity.employeeID == context.id && <Link to={"/reports/freeze"}>
                <Button variant="primary">Freeze</Button>
            </Link>} 
        </td>
    </tr>
}

export const FreezeMonth = () => {
    
    const {context} = useContext(Context)
    const {loading, error, data} = useFetch(APIRoot + `/Report/reports?employeeId=${context.id}`, {}, [])

    if (data != undefined)
        return <Container style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
            <h1>Freeze</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Frozen</th>
                        <th>Month</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(rep => <Report key={rep.id} report={rep}/>)}
                </tbody>
            </Table>
        </Container>
    else
        return <BigSpinner/>
}

const Report = ({report}) => { 
    
    const {put, loading, data} = useFetch(APIRoot + `/Report/freeze?reportId=${report.id}`)

    const [frozen, setFrozen] = useState(report.frozen)
    
    const FreezeAction = async () => {
        await put("")
        setFrozen(true)
    }

    const date = new Date(report.month)
    
    return <tr>
        <td>{frozen ? "true" : "false"}</td>
        <td>{date.toLocaleString("eng", {month:'long'})} - {date.getFullYear()}</td>
        <td>
            <Button style={{marginRight : "0.5rem"}} onClick={() => FreezeAction()}>Freeze</Button>
            <Link to={`/reports/inspect/${report.id}`}>
                <Button style={{marginRight : "0.5rem"}}>Inspect</Button>
            </Link>
        </td>

    </tr>
}

export const EmployeeProjectSummary = () => {

    const {projectId, month} = useParams()
    const {context} = useContext(Context)
    console.log(new Date().toISOString())
    console.log(month)
    const {data, loading, error} = useFetch(APIRoot + `/Report/month_activities_project?employeeId=${context.id}&month=${month}&projectId=${projectId}`, {}, [])
        
    if (data != undefined)
        return <Container style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
            <Table striped hover bordered>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Description</td>
                        <td>Duration</td>
                        <td>Accepted Duration</td>
                        <td>Difference</td>
                    </tr>
                </thead>
                <tbody>
                    {data.map(act => 
                        <tr key={act.id}>
                            <td>{act.name}</td>
                            <td>{act.description}</td>
                            <td>{act.durationMinutes}</td>
                            <td>{act.acceptedTime}</td>
                            <td style={{color : act.acceptedTime ? (act.acceptedTime >= act.durationMinutes ? "green" : "red") : "white" }}>{act.acceptedTime ? act.acceptedTime - act.durationMinutes:  "none"}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    else 
        return <BigSpinner/>
}


export const ReportInspect = () => {
    const {id} = useParams()
    const {context} = useContext(Context)
    const {data, loading, error} = useFetch(APIRoot + `/Report/month_activities?employeeId=${context.id}&reportId=${id}`, {}, [])
    
    const {put, loadingPut, dataPut} = useFetch(APIRoot + `/Report/freeze?reportId=${id}`)
    
    const FreezeAction = async () => {
        await put("")
    }
    
    if (data != undefined)
        return <Container style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
            <Table striped hover bordered>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Description</td>
                        <td>Duration</td>
                        <td>Accepted Duration</td>
                        <td>Difference</td>
                    </tr>
                </thead>
                <tbody>
                    {data.map(act => 
                        <tr key={act.id}>
                            <td>{act.name}</td>
                            <td>{act.description}</td>
                            <td>{act.durationMinutes}</td>
                            <td>{act.acceptedTime}</td>
                            <td style={{color : act.acceptedTime ? (act.acceptedTime >= act.durationMinutes ? "green" : "red") : "white" }}>{act.acceptedTime ? act.acceptedTime - act.durationMinutes:  "none"}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Button onClick={() => FreezeAction()}>Freeze</Button>
        </Container>
    else 
        return <BigSpinner/>
}