import './App.css';
import {Navigation} from './Components/Navbar.js'
import {Login} from './Components/Identity/Login.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {Activities} from './Components/Activity/Activities'
import {Projects} from './Components/Project/Projects'
import {AffectedProjects, FreezeMonth, OwnedProjects, ProjectSummary, ReportInspect, Reports, EmployeeProjectSummary} from './Components/Report/Reports'
import {Logout} from './Components/Identity/Logout'
import Context from './Components/Identity/Context'
import { useState } from 'react'
import { ActivityEdit } from './Components/Activity/ActivityEdit'
import { ActivityDelete } from './Components/Activity/ActivityDelete'
import { ActivityCreate } from './Components/Activity/ActivityCreate'
import { ProjectEdit } from './Components/Project/ProjectsEdit'
import { ProjectCreate} from './Components/Project/ProjectCreate'
import { ProjectInspect } from './Components/Project/ProjectInspect';


function App() {
  
  const [context, setContext] = useState(null)

  return (
    <div className="App">
      <Context.Provider value={{context, setContext}}>
        <Router>
          <Navigation/>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/projects/inspect/:id" element={<ProjectInspect/>}/>
            <Route path="/projects/edit/:id" element={<ProjectEdit/>}/>
            <Route path="/projects/create" element={<ProjectCreate/>}/>
            <Route path="/projects" element={<Projects/>}/>
            <Route path="/activities/edit/:id" element={<ActivityEdit/>}/>
            <Route path="/activities/delete/:id" element={<ActivityDelete/>}/>
            <Route path="/activities/create/:projectId" element={<ActivityCreate/>}/>
            <Route path="/activities" element={<Activities/>}/>
            <Route path="/reports/owned" element={<OwnedProjects/>}/>
            <Route path="/reports/contribution/:projectId" element={<ProjectSummary/>}/>
            <Route path="/reports/project/contribution/:projectId/:month" element={<EmployeeProjectSummary/>}/>
            <Route path="/reports/freeze" element={<FreezeMonth/>}/>
            <Route path="/reports/inspect/:id" element={<ReportInspect/>}/>
            <Route path="/reports" element={<Reports/>}/>
          </Routes>
        </Router>
      </Context.Provider>
    </div>  
  );
}

export default App;
