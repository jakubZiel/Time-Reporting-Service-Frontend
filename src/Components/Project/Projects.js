import { useFetch } from 'use-http'
import APIRoot from '../API'
import { Card, Button, Form, FormGroup, FormLabel, FormControl, ButtonGroup, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import {useContext} from 'react'
import Context from '../Identity/Context'
import { BigSpinner } from '../Utils'


export const Projects = () => {

    const {context, setContext} = useContext(Context)
    const {loading, data, error} = useFetch(APIRoot + "/Project", {}, [])
    
    useEffect(() => {
        setContext({...context, projects : data})
    }, [data])
    
   
   if (loading)
        return <BigSpinner/>
    else 
        return <Container style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
            <h1>Projects</h1> 
            {data.map(project => <Project key={project.id} project={project}/>)}
            <Link to={"/projects/create"}>
                <Button variant='success'>New Project</Button>
            </Link>
        </Container>
}

const Project = ({project}) => {

    const {id, ownerID, name, timeBudget, active, description} = project
    const context = useContext(Context)

    return <Card style={{width: "35rem", margin: "1rem"}}>
                <Form style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"column", textAlign:"center"}}>
            <FormGroup>
                <FormLabel >Name</FormLabel>
                <FormControl value={name} disabled></FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel >Description</FormLabel>
                <FormControl value={description} disabled></FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel >Budget</FormLabel>
                <FormControl value={timeBudget} disabled></FormControl>
            </FormGroup>
        </Form>
        
        <ButtonGroup style={{display : "flex", alignItems : "center", justifyContent : "center", flexDirection:"row", textAlign:"center"}}>
            {active && context.context.id == ownerID && <Link to={`/projects/edit/${id}`}>
                <Button style={{margin:"0.5rem"}} variant="success">Edit</Button>
            </Link>}
            {active && <Link to={`/activities/create/${id}`}>
                <Button style={{margin:"0.5rem"}} variant='info'>Add</Button>
            </Link>}
            <Link to={`/projects/inspect/${id}`}>
                <Button style={{margin:"0.5rem"}} variant='warning'>Inspect</Button>
            </Link>
        </ButtonGroup>
    </Card>
}