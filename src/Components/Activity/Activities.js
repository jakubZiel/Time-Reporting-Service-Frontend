import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Button, Container, Card, FormGroup, FormControl, Form, FormLabel, ButtonGroup } from "react-bootstrap"
import { Link } from "react-router-dom"
import useFetch from "use-http"
import APIRoot from "../API"
import Context from "../Identity/Context"
import { BigSpinner } from "../Utils"
import '../../index.css'
import moment from "moment"

export const Activities = () => {
    const [date, setDate] = useState(moment())
    const {context, setContext} = useContext(Context)
    
    const {get, post, response, loading, error} = useFetch(APIRoot + "/Activity")

    useEffect( () => fetchTodays({
        date: date,
        id: context.id
    }), [date])

    const fetchTodays = async (data) =>{
        await post("/day", data)
        const todayActivities = response.data
        setContext({...context, todayActivities})
    }  

    const changeDay = (direction) => {
        if (direction > 0){
            const nxt = moment(date).add(1, 'days')
            if (nxt <= moment())
                setDate(nxt)
            return
        }
        const prv = moment(date).add(-1, 'days')
        setDate(prv)
    }
    if (response.data == undefined)
        return <BigSpinner/>
    else
        return <div>
            <h1>Activities</h1> 
            <h2>{date.toDate().toLocaleDateString()}</h2>
            
            <Button style={{margin : "0.5rem"}} onClick={() => changeDay(-1, date)}>Previous</Button>
            <Button style={{margin : "0.5rem"}} onClick={() => changeDay(1, date)}>Next</Button>
            <Button style={{margin : "0.5rem"}} onClick={() => setDate(moment())}>Today</Button>
            <ActivityList activities={response.data}/>
        </div>
}

const ActivityList = ({activities}) => {
    return <Container style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
        {activities.map(act => <Activity key={act.id} activity={act}/>)}
    </Container>
}

const Activity = ({activity}) => {
    const {id, name, description, durationMinutes, frozen, tag} = activity

    return <Card style={{width: "35rem", margin: "1rem", padding: "1rem"}}>
        <Form style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
            <FormGroup>
                <FormLabel >Name</FormLabel>
                <FormControl value={name} disabled></FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel >Description</FormLabel>
                <FormControl as="textarea" value={description} disabled></FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel >Time</FormLabel>
                <FormControl value={durationMinutes} disabled></FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel >Category</FormLabel>
                <FormControl value={tag} disabled></FormControl>
            </FormGroup>
        </Form>
        <ButtonGroup style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"row", textAlign:"center"}}>
        {frozen && <Button style={{margin:"0.5rem"}} variant="info">Frozen</Button>}
        {!frozen && <Link to={`/activities/edit/${id}`}>
            <Button style={{margin:"0.5rem"}} variant="success">Edit</Button>
            </Link>}
        {!frozen && <Link to={`/activities/delete/${id}`}>
            <Button style={{margin:"0.5rem"}} variant="danger">Delete</Button>
            </Link>}
        </ButtonGroup>

    </Card>
}